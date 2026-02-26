const cloudinary = require('../config/cloudinary');
const ApiError   = require('../utils/apiError');

exports.uploadImage = async (file, folder = 'olive-store/products') => {
  if (!file) throw new ApiError(400, 'No file provided');

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' }, // cap max size
          { quality: 'auto', fetch_format: 'auto' },    // auto WebP/AVIF
        ],
      },
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

exports.deleteImage = async (publicId) => {
  if (!publicId) return; // no-op for images without a public_id (e.g. placeholder URLs)
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // Log but don't throw — a failed Cloudinary delete shouldn't block the DB delete
    console.error('Cloudinary delete failed:', err.message);
  }
};
