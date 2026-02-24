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
