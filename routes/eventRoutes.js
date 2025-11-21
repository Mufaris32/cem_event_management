import express from 'express';
import multer from 'multer';
import { generatePlaceholderImage } from '../src/utils/placeholderImage.js';
import {
  createEvent,
  getAllEvents,
  getUpcomingEvents,
  getPastEvents,
  getFeaturedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByCategory,
  searchEvents,
  getEventStatistics
} from '../src/services/eventService.js';
import { uploadMultipleImages, deleteImage } from '../src/services/imageServiceServer.js';
import Event from '../src/models/Event.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

/**
 * Get all events with filtering and pagination
 * GET /api/events
 */
router.get('/', async (req, res) => {
  try {
    const result = await getAllEvents(req.query);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get upcoming events
 * GET /api/events/upcoming
 */
router.get('/upcoming', async (req, res) => {
  try {
    const events = await getUpcomingEvents(req.query);
    console.log('Upcoming events found:', events.length);
    if (events.length > 0) {
      console.log('First event ID:', events[0]._id);
      console.log('First event ID type:', typeof events[0]._id);
    }
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get past events
 * GET /api/events/past
 */
router.get('/past', async (req, res) => {
  try {
    const events = await getPastEvents(req.query);
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get past events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get featured events
 * GET /api/events/featured
 */
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const events = await getFeaturedEvents(limit);
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Search events
 * GET /api/events/search
 */
router.get('/search', async (req, res) => {
  try {
    const { q: searchTerm } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const events = await searchEvents(searchTerm, req.query);
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get event statistics
 * GET /api/events/statistics
 */
router.get('/statistics', async (req, res) => {
  try {
    const stats = await getEventStatistics();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get single event by ID
 * GET /api/events/:id
 */
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching event with ID:', req.params.id);
    console.log('ID type:', typeof req.params.id);
    console.log('ID length:', req.params.id?.length);
    
    const event = await getEventById(req.params.id);
    console.log('Event found:', event ? 'Yes' : 'No');
    if (event) {
      console.log('Event title:', event.title);
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    console.error('Error message:', error.message);
    res.status(error.message === 'Event not found' ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Create new event
 * POST /api/events
 */
router.post('/', async (req, res) => {
  try {
    const { images, ...eventData } = req.body;
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'category', 'organizer'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Process the event data
    const processedEventData = {
      ...eventData,
      date: new Date(eventData.date),
      images: images || []
    };

    const event = await createEvent(processedEventData);
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Update event
 * PUT /api/events/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { newImages, imagesToDelete, ...eventData } = req.body;
    
    // Process the event data
    const processedEventData = {
      ...eventData
    };

    if (eventData.date) {
      processedEventData.date = new Date(eventData.date);
    }

    const event = await updateEvent(
      req.params.id,
      processedEventData,
      [], // newImageFiles - handled separately in frontend
      imagesToDelete || []
    );

    // Add new images if provided
    if (newImages && newImages.length > 0) {
      // Remove any placeholder images before adding real images
      const filteredImages = (event.images || []).filter(img => 
        !img.publicId.startsWith('placeholder_')
      );
      event.images = [...filteredImages, ...newImages];
      await event.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(error.message === 'Event not found' ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Delete event
 * DELETE /api/events/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await deleteEvent(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(error.message === 'Event not found' ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get event gallery images
 * GET /api/events/:id/gallery
 */
router.get('/:id/gallery', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).select('galleryImages title');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery images retrieved successfully',
      galleryImages: event.galleryImages || [],
      eventTitle: event.title
    });
  } catch (error) {
    console.error('Get gallery images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
      error: error.message
    });
  }
});

/**
 * Upload images to event gallery
 * POST /api/events/:id/gallery
 */
router.post('/:id/gallery', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    try {
      // Debug: Check Cloudinary configuration
      console.log('🔍 Cloudinary config check:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
        api_key: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
        api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing'
      });

      // Convert multer files to base64 for Cloudinary
      const imagePromises = req.files.map(async (file, index) => {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const caption = req.body[`caption_${index}`] || '';
        
        console.log(`📸 Uploading image ${index + 1}/${req.files.length} to Cloudinary...`);
        
        // Upload to Cloudinary with event-specific folder
        const uploadResult = await uploadMultipleImages([base64], `events/${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_${event._id}/gallery`);
        
        console.log(`✅ Image ${index + 1} uploaded successfully:`, uploadResult[0].url);
        
        return {
          url: uploadResult[0].url,
          publicId: uploadResult[0].publicId,
          caption: caption,
          uploadedAt: new Date(),
          uploadedBy: 'admin'
        };
      });

      const galleryImages = await Promise.all(imagePromises);

      // Add gallery images to event
      event.galleryImages = [...(event.galleryImages || []), ...galleryImages];
      await event.save();

      res.status(200).json({
        success: true,
        message: 'Gallery images uploaded successfully',
        galleryImages: galleryImages
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError);
      
      // Fallback to mock images if Cloudinary fails
      const mockResults = req.files.map((file, index) => ({
        url: generatePlaceholderImage(800, 600, `Gallery Image ${index + 1}`, '1B4D3E', 'FFFFFF'),
        publicId: `mock_gallery_${Date.now()}_${index}`,
        caption: req.body[`caption_${index}`] || '',
        uploadedAt: new Date(),
        uploadedBy: 'admin'
      }));

      // Add mock gallery images to event
      event.galleryImages = [...(event.galleryImages || []), ...mockResults];
      await event.save();

      res.status(200).json({
        success: true,
        message: 'Gallery images uploaded using fallback service (Cloudinary failed)',
        galleryImages: mockResults,
        warning: 'Cloudinary upload failed, using placeholder images'
      });
    }
  } catch (error) {
    console.error('Upload gallery images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload gallery images',
      error: error.message
    });
  }
});

/**
 * Delete gallery image
 * DELETE /api/events/:id/gallery/:imageId
 */
router.delete('/:id/gallery/:imageId', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const imageIndex = event.galleryImages.findIndex(
      img => img._id.toString() === req.params.imageId || img.publicId === req.params.imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    const imageToDelete = event.galleryImages[imageIndex];

    try {
      // Delete from Cloudinary if not a mock image
      if (!imageToDelete.publicId.startsWith('mock_')) {
        await deleteImage(imageToDelete.publicId);
      }
    } catch (cloudinaryError) {
      console.warn('Failed to delete from Cloudinary:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Remove from event
    event.galleryImages.splice(imageIndex, 1);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery image',
      error: error.message
    });
  }
});

/**
 * Update gallery image caption
 * PATCH /api/events/:id/gallery/:imageId
 */
router.patch('/:id/gallery/:imageId', async (req, res) => {
  try {
    const { caption } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const imageIndex = event.galleryImages.findIndex(
      img => img._id.toString() === req.params.imageId || img.publicId === req.params.imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    // Update caption
    event.galleryImages[imageIndex].caption = caption || '';
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Gallery image caption updated successfully',
      image: event.galleryImages[imageIndex]
    });
  } catch (error) {
    console.error('Update gallery image caption error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update image caption',
      error: error.message
    });
  }
});

/**
 * Get gallery images for multiple events
 * POST /api/events/galleries/multiple
 */
router.post('/galleries/multiple', async (req, res) => {
  try {
    const { eventIds } = req.body;
    
    if (!eventIds || !Array.isArray(eventIds)) {
      return res.status(400).json({
        success: false,
        message: 'Event IDs array is required'
      });
    }

    const events = await Event.find({ 
      _id: { $in: eventIds } 
    }).select('_id title galleryImages');

    const eventGalleries = {};
    events.forEach(event => {
      eventGalleries[event._id.toString()] = {
        title: event.title,
        galleryImages: event.galleryImages || []
      };
    });

    res.status(200).json({
      success: true,
      message: 'Event galleries retrieved successfully',
      eventGalleries
    });
  } catch (error) {
    console.error('Get multiple event galleries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event galleries',
      error: error.message
    });
  }
});

export default router;
