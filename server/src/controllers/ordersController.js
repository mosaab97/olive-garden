const asyncHandler = require('../utils/asyncHandler');
const ordersService = require('../services/ordersService');

exports.create = asyncHandler(async (req, res) => {
  const order = await ordersService.create(req.user.id, req.body);
  res.status(201).json(order);
});

exports.getById = asyncHandler(async (req, res) => {
  const order = await ordersService.getById(req.params.id, req.user);
  res.json(order);
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await ordersService.getByUser(req.user.id);
  res.json(orders);
});

exports.getAll = asyncHandler(async (req, res) => {
  const orders = await ordersService.getAll(req.query);
  res.json(orders);
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const order = await ordersService.updateStatus(req.params.id, req.body.status);
  res.json(order);
});
