const asyncHandler = require('../utils/asyncHandler');
const uploadService = require('../services/uploadService');

exports.uploadImage = asyncHandler(async (req, res) => {
  const result = await uploadService.uploadImage(req.file);
  res.status(201).json(result);
});
