const db = require('../config/db');
const ApiError = require('../utils/apiError');
const loadQuery = require('../utils/loadQuery');
const variantsService = require('./variantsService');

const createOrder       = loadQuery('orders', 'createOrder');
const createOrderItem   = loadQuery('orders', 'createOrderItem');
const getOrderById      = loadQuery('orders', 'getOrderById');
const getOrdersByUser   = loadQuery('orders', 'getOrdersByUser');
const getAllOrders       = loadQuery('orders', 'getAllOrders');
const updateOrderStatus = loadQuery('orders', 'updateOrderStatus');
const cancelOrder       = loadQuery('orders', 'cancelOrder');
const addTracking       = loadQuery('orders', 'addTracking');

exports.create = async (userId, { items, shipping, payment_intent_id }) => {
  if (!items?.length) throw new ApiError(400, 'Order must have at least one item');

  const subtotal      = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const shipping_cost = shipping.cost ?? 0;
  const tax           = parseFloat(((subtotal + shipping_cost) * 0.1).toFixed(2));
  const total         = parseFloat((subtotal + shipping_cost + tax).toFixed(2));

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    for (const item of items) {
      await variantsService.decrementStock(client, item.variant_id, item.quantity);
    }

    const { rows: orderRows } = await client.query(createOrder, [
      userId,
      shipping.name, shipping.street, shipping.city, shipping.state, shipping.zip,
      subtotal, shipping_cost, tax, total,
      payment_intent_id ?? null,
    ]);
    const order = orderRows[0];

    for (const item of items) {
      const line_total = parseFloat((item.unit_price * item.quantity).toFixed(2));
      await client.query(createOrderItem, [
        order.id, item.variant_id,
        item.product_name, item.variant_label,
        item.unit_price, item.quantity, line_total,
      ]);
    }

    await client.query('COMMIT');
    return exports.getById(order.id, { id: userId, role: 'customer' });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.getById = async (id, user) => {
  const { rows } = await db.query(getOrderById, [id]);
  if (!rows[0]) throw new ApiError(404, 'Order not found');
  if (user.role !== 'admin' && rows[0].user_id !== user.id) {
    throw new ApiError(403, 'Forbidden');
  }
  return rows[0];
};

exports.getByUser = async (userId) => {
  const { rows } = await db.query(getOrdersByUser, [userId]);
  return rows;
};

exports.getAll = async ({ status, limit = 50, offset = 0 } = {}) => {
  const { rows } = await db.query(getAllOrders, [status ?? null, limit, offset]);
  return rows;
};

exports.updateStatus = async (id, status) => {
  const valid = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];
  if (!valid.includes(status)) throw new ApiError(400, `Invalid status: ${status}`);
  const { rows } = await db.query(updateOrderStatus, [status, id]);
  if (!rows[0]) throw new ApiError(404, 'Order not found');
  return rows[0];
};

exports.cancel = async (userId, orderId) => {
  // SQL only cancels if status = 'pending' AND belongs to this user
  const { rows } = await db.query(cancelOrder, [orderId, userId]);
  if (!rows[0]) {
    // Figure out why — does order exist? wrong user? wrong status?
    const { rows: check } = await db.query('SELECT status, user_id FROM orders WHERE id = $1', [orderId]);
    if (!check[0]) throw new ApiError(404, 'Order not found');
    if (check[0].user_id !== userId) throw new ApiError(403, 'Forbidden');
    throw new ApiError(400, `Cannot cancel an order with status "${check[0].status}"`);
  }

  // Restore stock for each item
  const { rows: items } = await db.query(
    'SELECT variant_id, quantity FROM order_items WHERE order_id = $1', [orderId]
  );
  for (const item of items) {
    await db.query(
      'UPDATE product_variants SET stock_qty = stock_qty + $1 WHERE id = $2',
      [item.quantity, item.variant_id]
    );
  }

  return rows[0];
};

exports.addTracking = async (orderId, trackingNumber) => {
  if (!trackingNumber?.trim()) throw new ApiError(400, 'Tracking number is required');
  const { rows } = await db.query(addTracking, [trackingNumber.trim(), orderId]);
  if (!rows[0]) throw new ApiError(404, 'Order not found');
  return rows[0];
};
