import api from '../utils/api.js';
import requestDeduplicator from '../utils/requestDeduplicator.js';

/**
 * Client-side service for managing event gallery images
 */

/**
 * Get gallery images for a specific event
 * @param {string} eventId - Event ID
 * @returns {Promise<Array>} - Array of gallery images
 */
export const getEventGalleryImages = async (eventId) => {
  const cacheKey = `getEventGalleryImages_${eventId}`;
  
  return requestDeduplicator.deduplicate(cacheKey, async () => {
    try {
      const response = await api.get(`/events/${eventId}/gallery`);
      return response.data.success ? response.data.galleryImages : [];
    } catch (error) {
      console.error('Error fetching event gallery images:', error);
      throw new Error('Failed to fetch gallery images');
    }
  });
};

/**
 * Upload images to event gallery
 * @param {string} eventId - Event ID
 * @param {File[]} files - Array of image files
 * @param {string[]} captions - Array of captions for images (optional)
 * @returns {Promise<Array>} - Array of uploaded image objects
 */
export const uploadEventGalleryImages = async (eventId, files, captions = []) => {
  const cacheKey = `uploadEventGalleryImages_${eventId}_${Date.now()}`;
  
  return requestDeduplicator.deduplicate(cacheKey, async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });
      
      // Add captions if provided
      captions.forEach((caption, index) => {
        if (caption && caption.trim()) {
          formData.append(`caption_${index}`, caption.trim());
        }
      });

      const response = await api.post(`/events/${eventId}/gallery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Clear the cache for this event's gallery to ensure fresh data on next fetch
      requestDeduplicator.clearCache(`getEventGalleryImages_${eventId}`);
      
      return response.data.success ? response.data.galleryImages : [];
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      throw new Error('Failed to upload gallery images');
    }
  });
};

/**
 * Delete a gallery image from an event
 * @param {string} eventId - Event ID
 * @param {string} imageId - Gallery image ID or public ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteEventGalleryImage = async (eventId, imageId) => {
  try {
    const response = await api.delete(`/events/${eventId}/gallery/${imageId}`);
    return response.data.success || true;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw new Error('Failed to delete gallery image');
  }
};

/**
 * Update gallery image caption
 * @param {string} eventId - Event ID
 * @param {string} imageId - Gallery image ID or public ID
 * @param {string} caption - New caption
 * @returns {Promise<Object>} - Updated image object
 */
export const updateEventGalleryImageCaption = async (eventId, imageId, caption) => {
  try {
    const response = await api.patch(`/events/${eventId}/gallery/${imageId}`, {
      caption: caption.trim()
    });
    return response.data.success ? response.data.image : null;
  } catch (error) {
    console.error('Error updating gallery image caption:', error);
    throw new Error('Failed to update image caption');
  }
};

/**
 * Get gallery image count for a specific event (without loading full images)
 * @param {string} eventId - Event ID
 * @returns {Promise<number>} - Number of gallery images
 */
export const getEventGalleryImageCount = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/gallery`);
    return response.data.success ? response.data.galleryImages.length : 0;
  } catch (error) {
    console.error('Error fetching event gallery count:', error);
    return 0;
  }
};

/**
 * Get gallery image counts for multiple events
 * @param {string[]} eventIds - Array of event IDs
 * @returns {Promise<Object>} - Object with eventId as key and count as value
 */
export const getMultipleEventGalleryCounts = async (eventIds) => {
  try {
    const counts = {};
    
    // Process in batches to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < eventIds.length; i += batchSize) {
      const batch = eventIds.slice(i, i + batchSize);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (eventId) => {
          const count = await getEventGalleryImageCount(eventId);
          return { eventId, count };
        })
      );
      
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          counts[result.value.eventId] = result.value.count;
        }
      });
      
      // Small delay between batches
      if (i + batchSize < eventIds.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return counts;
  } catch (error) {
    console.error('Error fetching multiple gallery counts:', error);
    return {};
  }
};
