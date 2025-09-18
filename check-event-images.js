import mongoose from 'mongoose';
import Event from './src/models/Event.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cem_events';

async function checkEventImages() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // First check if events exist at all
    const totalEvents = await Event.countDocuments();
    console.log(`📊 Total events in database: ${totalEvents}`);

    // Try to find events without selection first
    const allEvents = await Event.find({});
    console.log(`📊 Found ${allEvents.length} events with full query\n`);

    if (allEvents.length > 0) {
      console.log('📋 Events with image details:');
      allEvents.forEach((event, index) => {
        console.log(`${index + 1}. ${event.title}`);
        console.log(`   ID: ${event._id}`);
        console.log(`   Date: ${event.date}`);
        console.log(`   Main Images: ${event.images ? event.images.length : 0}`);
        if (event.images && event.images.length > 0) {
          event.images.forEach((img, imgIndex) => {
            console.log(`     - Image ${imgIndex + 1}: ${img.url || img}`);
            if (img.publicId) console.log(`       Public ID: ${img.publicId}`);
          });
        }
        console.log(`   Gallery Images: ${event.galleryImages ? event.galleryImages.length : 0}`);
        if (event.galleryImages && event.galleryImages.length > 0) {
          event.galleryImages.forEach((img, imgIndex) => {
            console.log(`     - Gallery ${imgIndex + 1}: ${img.url}`);
          });
        }
        console.log('   Full event object keys:', Object.keys(event.toObject()));
        console.log('');
      });
    } else {
      // Try direct collection access
      console.log('🔍 Trying direct collection access...');
      const db = mongoose.connection.db;
      const eventsCollection = db.collection('events');
      const rawEvents = await eventsCollection.find({}).toArray();
      console.log(`📊 Raw collection found ${rawEvents.length} events`);
      
      if (rawEvents.length > 0) {
        console.log('First event raw data:', JSON.stringify(rawEvents[0], null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

checkEventImages();