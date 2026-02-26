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

// ─── Image management ─────────────────────────────────────────────────────────
const uploadService = require('../services/uploadService');

exports.getImages = asyncHandler(async (req, res) => {
  const images = await productsService.getImages(req.params.id);
  res.json(images);
});

exports.uploadImage = asyncHandler(async (req, res) => {
  // 1. Upload file to Cloudinary
  const { url, public_id } = await uploadService.uploadImage(req.file);
  // 2. Save record to DB
  const image = await productsService.addImage(req.params.id, {
    url,
    public_id,
    alt_text: req.body.alt_text || '',
  });
  res.status(201).json(image);
});

exports.setPrimaryImage = asyncHandler(async (req, res) => {
  const image = await productsService.setPrimary(req.params.id, req.params.imageId);
  res.json(image);
});

exports.deleteImage = asyncHandler(async (req, res) => {
  const deleted = await productsService.deleteImage(req.params.id, req.params.imageId);
  // Delete from Cloudinary after DB delete succeeds
  await uploadService.deleteImage(deleted.public_id);
  res.status(204).send();
});
