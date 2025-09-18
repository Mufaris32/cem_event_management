import mongoose from 'mongoose';
import Event from './src/models/Event.js';
import dotenv from 'dotenv';

// Configure environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cem_events');

async function checkGalleryImages() {
  try {
    console.log('🔍 Checking events with gallery images...\n');
    
    const eventsWithGallery = await Event.find({ 
      galleryImages: { $exists: true, $ne: [] } 
    }).select('title galleryImages');
    
    if (eventsWithGallery.length === 0) {
      console.log('❌ No events found with gallery images');
      
      // Check all events to see their structure
      const allEvents = await Event.find({}).select('title galleryImages');
      console.log(`\n📋 Found ${allEvents.length} total events:`);
      allEvents.forEach((event, index) => {
        console.log(`${index + 1}. "${event.title}" - Gallery images: ${event.galleryImages ? event.galleryImages.length : 'undefined'}`);
      });
    } else {
      console.log(`✅ Found ${eventsWithGallery.length} events with gallery images:\n`);
      
      eventsWithGallery.forEach((event, index) => {
        console.log(`${index + 1}. Event: "${event.title}"`);
        console.log(`   ID: ${event._id}`);
        console.log(`   Gallery Images: ${event.galleryImages.length}`);
        
        event.galleryImages.forEach((img, imgIndex) => {
          console.log(`   Image ${imgIndex + 1}:`);
          console.log(`     URL: ${img.url}`);
          console.log(`     Public ID: ${img.publicId}`);
          console.log(`     Caption: ${img.caption || 'No caption'}`);
          console.log(`     Uploaded: ${img.uploadedAt}`);
        });
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Error checking gallery images:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkGalleryImages();
