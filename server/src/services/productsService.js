const db = require('../config/db');
const ApiError = require('../utils/apiError');
const loadQuery = require('../utils/loadQuery');

const getAllProducts    = loadQuery('products', 'getAllProducts');
const getProductBySlug = loadQuery('products', 'getProductBySlug');
const getProductById   = loadQuery('products', 'getProductById');
const createProduct    = loadQuery('products', 'createProduct');
const updateProduct    = loadQuery('products', 'updateProduct');
const deactivateProduct = loadQuery('products', 'deactivateProduct');

exports.getAll = async ({ category_id, active = true } = {}) => {
  const params = [active];
  let query = getAllProducts;

  // category filter is handled inside the SQL via optional param
  params.push(category_id ?? null);

  const { rows } = await db.query(query, params);
  return rows;
};

exports.getBySlug = async (slug) => {
  const { rows } = await db.query(getProductBySlug, [slug]);
  if (!rows[0]) throw new ApiError(404, 'Product not found');
  return rows[0];
};

exports.getById = async (id) => {
  const { rows } = await db.query(getProductById, [id]);
  if (!rows[0]) throw new ApiError(404, 'Product not found');
  return rows[0];
};

exports.create = async ({ category_id, name, slug, description, ingredients }) => {
  const { rows } = await db.query(createProduct, [category_id, name, slug, description, ingredients]);
  return rows[0];
};

exports.update = async (id, { category_id, name, slug, description, ingredients, is_active }) => {
  const { rows } = await db.query(updateProduct, [category_id, name, slug, description, ingredients, is_active, id]);
  if (!rows[0]) throw new ApiError(404, 'Product not found');
  return rows[0];
};

exports.remove = async (id) => {
  const { rowCount } = await db.query(deactivateProduct, [id]);
  if (!rowCount) throw new ApiError(404, 'Product not found');
};

// ─── Product Image Management ─────────────────────────────────────────────────
const getProductImages  = loadQuery('products', 'getProductImages');
const addProductImage   = loadQuery('products', 'addProductImage');
const setPrimaryImage   = loadQuery('products', 'setPrimaryImage');
const deleteProductImage = loadQuery('products', 'deleteProductImage');

exports.getImages = async (productId) => {
  const { rows } = await db.query(getProductImages, [productId]);
  return rows;
};

exports.addImage = async (productId, { url, public_id, alt_text }) => {
  // First image added becomes primary automatically
  const { rows: existing } = await db.query(getProductImages, [productId]);
  const isPrimary  = existing.length === 0;
  const sortOrder  = existing.length;

  const { rows } = await db.query(addProductImage, [
    productId, url, alt_text || '', isPrimary, sortOrder, public_id,
  ]);
  return rows[0];
};

exports.setPrimary = async (productId, imageId) => {
  const { rows } = await db.query(setPrimaryImage, [productId, imageId]);
  if (!rows[0]) throw new ApiError(404, 'Image not found');
  return rows[0];
};

exports.deleteImage = async (productId, imageId) => {
  const { rows } = await db.query(deleteProductImage, [imageId, productId]);
  if (!rows[0]) throw new ApiError(404, 'Image not found');

  // If the deleted image was primary, promote the next image
  if (rows[0].is_primary) {
    await db.query(
      `UPDATE product_images
       SET is_primary = TRUE
       WHERE product_id = $1
       ORDER BY sort_order ASC, id ASC
       LIMIT 1`,
      [productId]
    );
  }

  return rows[0]; // caller uses public_id to delete from Cloudinary
};
