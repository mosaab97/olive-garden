const db = require('../config/db');
const ApiError = require('../utils/apiError');
const loadQuery = require('../utils/loadQuery');

const getVariantsByProduct = loadQuery('variants', 'getVariantsByProduct');
const getVariantById       = loadQuery('variants', 'getVariantById');
const createVariant        = loadQuery('variants', 'createVariant');
const updateVariant        = loadQuery('variants', 'updateVariant');
const deactivateVariant    = loadQuery('variants', 'deactivateVariant');
const decrementStock       = loadQuery('variants', 'decrementStock');

exports.getByProduct = async (productId) => {
  if (!productId) throw new ApiError(400, 'product_id is required');
  const { rows } = await db.query(getVariantsByProduct, [productId]);
  return rows;
};

exports.getById = async (id) => {
  const { rows } = await db.query(getVariantById, [id]);
  if (!rows[0]) throw new ApiError(404, 'Variant not found');
  return rows[0];
};

exports.create = async ({ product_id, sku, filling, size_oz, label, price, stock_qty, weight_lbs }) => {
  const { rows } = await db.query(createVariant, [product_id, sku, filling, size_oz, label, price, stock_qty ?? 0, weight_lbs]);
  return rows[0];
};

exports.update = async (id, { sku, filling, size_oz, label, price, stock_qty, weight_lbs, is_active }) => {
  const { rows } = await db.query(updateVariant, [sku, filling, size_oz, label, price, stock_qty, weight_lbs, is_active, id]);
  if (!rows[0]) throw new ApiError(404, 'Variant not found');
  return rows[0];
};

exports.remove = async (id) => {
  const { rowCount } = await db.query(deactivateVariant, [id]);
  if (!rowCount) throw new ApiError(404, 'Variant not found');
};

// Used internally by ordersService inside a transaction
exports.decrementStock = async (client, variantId, quantity) => {
  const { rows } = await client.query(decrementStock, [quantity, variantId]);
  if (!rows[0]) throw new ApiError(404, 'Variant not found');
  if (rows[0].stock_qty < 0) throw new ApiError(400, `Insufficient stock for variant ${variantId}`);
  return rows[0];
};
