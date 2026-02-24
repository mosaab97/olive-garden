const asyncHandler = require('../utils/asyncHandler');
const usersService = require('../services/usersService');

exports.getMe = asyncHandler(async (req, res) => {
  const user = await usersService.getById(req.user.id);
  res.json(user);
});

exports.updateMe = asyncHandler(async (req, res) => {
  const user = await usersService.update(req.user.id, req.body);
  res.json(user);
});

exports.getAddresses = asyncHandler(async (req, res) => {
  const addresses = await usersService.getAddresses(req.user.id);
  res.json(addresses);
});

exports.createAddress = asyncHandler(async (req, res) => {
  const address = await usersService.createAddress(req.user.id, req.body);
  res.status(201).json(address);
});

exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await usersService.setDefaultAddress(req.user.id, req.params.id);
  res.json(address);
});
