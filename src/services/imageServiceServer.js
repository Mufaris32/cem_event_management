import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary (Server-side)
 * @param {string} fileData - Base64 image data
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} - Upload result with URL and public_id
 */
export const uploadImage = async (fileData, folder = 'events') => {
  try {
    const uploadResult = await cloudinary.uploader.upload(fileData, {
      folder: folder,
      resource_type: 'auto',
      quality: 'auto:good',
      fetch_format: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'fill', quality: 'auto:good' },
        { flags: 'progressive' }
      ]
    });

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload multiple images to Cloudinary (Server-side)
 * @param {string[]} fileDataArray - Array of base64 image data
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object[]>} - Array of upload results
 */
export const uploadMultipleImages = async (fileDataArray, folder = 'events') => {
  try {
    console.log(`📸 Starting upload of ${fileDataArray.length} images to folder: ${folder}`);
    
    const uploadPromises = fileDataArray.map(async (fileData, index) => {
      try {
        console.log(`🔄 Uploading image ${index + 1}/${fileDataArray.length}...`);
        const result = await uploadImage(fileData, folder);
        console.log(`✅ Image ${index + 1} uploaded successfully: ${result.url}`);
        return result;
      } catch (error) {
        console.error(`❌ Failed to upload image ${index + 1}:`, error.message);
        throw error;
      }
    });
    
    const results = await Promise.all(uploadPromises);
    console.log(`🎉 All ${results.length} images uploaded successfully!`);
    return results;
  } catch (error) {
    console.error('❌ Error uploading multiple images:', error);
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary (Server-side)
 * @param {string} publicId - Cloudinary public_id of the image
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
};

/**
 * Get images from a specific Cloudinary folder (Server-side)
 * @param {string} folderPath - Cloudinary folder path
 * @param {number} maxResults - Maximum number of images to fetch
 * @returns {Promise<Object[]>} - Array of image objects
 */
export const getImagesFromFolder = async (folderPath, maxResults = 100) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPath,
      max_results: maxResults,
      resource_type: 'image',
      // Add caching headers and optimize the request
      context: true,
      tags: true,
      sort_by: [['created_at', 'desc']] // Sort by newest first
    });

    return result.resources.map(image => ({
      url: image.secure_url,
      publicId: image.public_id,
      width: image.width,
      height: image.height,
      format: image.format,
      created_at: image.created_at,
      // Add optimized thumbnail URL
      thumbnailUrl: image.secure_url.replace('/upload/', '/upload/w_300,h_300,c_fill,q_auto/')
    }));
  } catch (error) {
    console.error('Error fetching images from folder:', error);
    throw new Error('Failed to fetch images from folder');
  }
};

/**
 * Get all folders in a Cloudinary directory (Server-side)
 * @param {string} parentPath - Parent directory path
 * @returns {Promise<string[]>} - Array of folder names
 */
export const getFoldersInDirectory = async (parentPath = '') => {
  try {
    const result = await cloudinary.api.sub_folders(parentPath);
    return result.folders.map(folder => folder.name);
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw new Error('Failed to fetch folders');
  }
};
