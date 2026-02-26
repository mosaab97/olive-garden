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

exports.changePassword = asyncHandler(async (req, res) => {
  await usersService.changePassword(req.user.id, req.body);
  res.json({ message: 'Password updated successfully' });
});

exports.getAddresses = asyncHandler(async (req, res) => {
  const addresses = await usersService.getAddresses(req.user.id);
  res.json(addresses);
});

exports.createAddress = asyncHandler(async (req, res) => {
  const address = await usersService.createAddress(req.user.id, req.body);
  res.status(201).json(address);
});

exports.updateAddress = asyncHandler(async (req, res) => {
  const address = await usersService.updateAddress(req.user.id, req.params.id, req.body);
  res.json(address);
});

exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await usersService.setDefaultAddress(req.user.id, req.params.id);
  res.json(address);
});

exports.deleteAddress = asyncHandler(async (req, res) => {
  await usersService.deleteAddress(req.user.id, req.params.id);
  res.status(204).send();
});
