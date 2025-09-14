import mongoose from 'mongoose';
import Event from './src/models/Event.js';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/college_event_calendar";

async function checkDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find all events
    const events = await Event.find({}).select('_id title date galleryImages');
    console.log(`📊 Found ${events.length} events in database`);
    
    if (events.length > 0) {
      console.log('\n📋 Events:');
      events.forEach((event, index) => {
        console.log(`${index + 1}. ${event.title}`);
        console.log(`   ID: ${event._id}`);
        console.log(`   Date: ${event.date}`);
        console.log(`   Gallery Images: ${event.galleryImages?.length || 0}`);
        console.log('');
      });
      
      // Test the gallery endpoint for the first event
      const firstEvent = events[0];
      console.log(`🔍 Testing gallery for: ${firstEvent.title}`);
      console.log(`   Event ID: ${firstEvent._id}`);
      
      // Manually check if ObjectId is valid
      console.log(`   ObjectId valid: ${mongoose.Types.ObjectId.isValid(firstEvent._id)}`);
    } else {
      console.log('❌ No events found in database');
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
    await mongoose.disconnect();
  }
}

checkDatabase();
