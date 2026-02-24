const asyncHandler = require('../utils/asyncHandler');
const productsService = require('../services/productsService');

exports.getAll = asyncHandler(async (req, res) => {
  const products = await productsService.getAll(req.query);
  res.json(products);
});

exports.getBySlug = asyncHandler(async (req, res) => {
  const product = await productsService.getBySlug(req.params.slug);
  res.json(product);
});

exports.create = asyncHandler(async (req, res) => {
  const product = await productsService.create(req.body);
  res.status(201).json(product);
});

exports.update = asyncHandler(async (req, res) => {
  const product = await productsService.update(req.params.id, req.body);
  res.json(product);
});

exports.remove = asyncHandler(async (req, res) => {
  await productsService.remove(req.params.id);
  res.status(204).send();
});
