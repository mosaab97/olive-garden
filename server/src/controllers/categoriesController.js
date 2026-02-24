const asyncHandler = require('../utils/asyncHandler');
const categoriesService = require('../services/categoriesService');

exports.getAll = asyncHandler(async (req, res) => {
  const categories = await categoriesService.getAll();
  res.json(categories);
});

exports.create = asyncHandler(async (req, res) => {
  const category = await categoriesService.create(req.body);
  res.status(201).json(category);
});

exports.update = asyncHandler(async (req, res) => {
  const category = await categoriesService.update(req.params.id, req.body);
  res.json(category);
});
