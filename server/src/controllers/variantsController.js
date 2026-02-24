const asyncHandler = require('../utils/asyncHandler');
const variantsService = require('../services/variantsService');

exports.getByProduct = asyncHandler(async (req, res) => {
  const variants = await variantsService.getByProduct(req.query.product_id);
  res.json(variants);
});

exports.create = asyncHandler(async (req, res) => {
  const variant = await variantsService.create(req.body);
  res.status(201).json(variant);
});

exports.update = asyncHandler(async (req, res) => {
  const variant = await variantsService.update(req.params.id, req.body);
  res.json(variant);
});

exports.remove = asyncHandler(async (req, res) => {
  await variantsService.remove(req.params.id);
  res.status(204).send();
});
