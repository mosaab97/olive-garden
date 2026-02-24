const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/apiError');

exports.uploadImage = async (file) => {
  if (!file) throw new ApiError(400, 'No file provided');

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'olive-store/products' },
      (error, result) => {
        if (error) reject(new ApiError(500, 'Image upload failed'));
        else resolve(result);
      }
    );
    stream.end(file.buffer);
  });

  return {
    url:       result.secure_url,
    public_id: result.public_id,
  };
};
