const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload an image (base64 data URI, file path, or remote URL) to Cloudinary
 * @param {string} imageSource - Base64 data URI or image URL
 * @param {string} folder - Target folder on Cloudinary
 * @returns {Promise<string>} - Returns permanent HTTPS Cloudinary URL
 */
const uploadToCloudinary = async (imageSource, folder = 'rentease/properties') => {
  if (!imageSource || typeof imageSource !== 'string') {
    return null;
  }

  // If it's already an uploaded Cloudinary / external HTTPS URL, return as is
  if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
    return imageSource;
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(imageSource, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }, // Automatic compression & modern format delivery (WebP/AVIF)
      ],
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.error('[Cloudinary] Upload failed:', error.message);
    // If Cloudinary upload fails, return original so data is not lost
    return imageSource;
  }
};

/**
 * Upload multiple images to Cloudinary in parallel
 * @param {string[]} imagesArray - Array of base64 data URIs or URLs
 * @param {string} folder - Target folder on Cloudinary
 * @returns {Promise<string[]>} - Array of secure Cloudinary URLs
 */
const uploadMultipleToCloudinary = async (imagesArray, folder = 'rentease/properties') => {
  if (!Array.isArray(imagesArray) || imagesArray.length === 0) {
    return [];
  }

  const uploadPromises = imagesArray.map((img) => uploadToCloudinary(img, folder));
  const uploadedUrls = await Promise.all(uploadPromises);
  return uploadedUrls.filter(Boolean);
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
};
