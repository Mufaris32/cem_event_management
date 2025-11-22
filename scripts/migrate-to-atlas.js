import mongoose from 'mongoose';
import Event from '../src/models/Event.js';
import Carousel from '../src/models/Carousel.js';
import dotenv from 'dotenv';

dotenv.config();

// Source: Local MongoDB
const LOCAL_URI = 'mongodb://localhost:27017/cem_events';

// Target: Atlas (you'll need to update this)
const ATLAS_URI = process.env.MONGODB_URI;

console.log('🔄 MongoDB Migration Script');
console.log('============================\n');

async function migrateData() {
  try {
    // Connect to LOCAL database
    console.log('📡 Connecting to LOCAL MongoDB...');
    const localConnection = await mongoose.createConnection(LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to LOCAL MongoDB\n');

    // Get models from local connection
    const LocalEvent = localConnection.model('Event', Event.schema);
    const LocalCarousel = localConnection.model('Carousel', Carousel.schema);

    // Fetch all data
    console.log('📦 Fetching data from LOCAL database...');
    const events = await LocalEvent.find({});
    const carousels = await LocalCarousel.find({});
    
    console.log(`   Found ${events.length} events`);
    console.log(`   Found ${carousels.length} carousel items\n`);

    // Show the data
    console.log('📊 Data Summary:');
    console.log('================\n');
    
    console.log('Events:');
    events.forEach((event, i) => {
      console.log(`  ${i + 1}. ${event.title} (${event.images?.length || 0} images)`);
    });
    
    console.log('\nCarousels:');
    carousels.forEach((carousel, i) => {
      console.log(`  ${i + 1}. ${carousel.title}`);
    });

    console.log('\n============================');
    console.log('💾 Data exported successfully!');
    console.log('\nTo import to Atlas:');
    console.log('1. Fix your Atlas connection string');
    console.log('2. Run this script with MIGRATE=true flag');
    
    await localConnection.close();
    
    // If MIGRATE flag is set, connect to Atlas and import
    if (process.env.MIGRATE === 'true') {
      console.log('\n📤 Connecting to Atlas...');
      const atlasConnection = await mongoose.createConnection(ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to Atlas\n');

      const AtlasEvent = atlasConnection.model('Event', Event.schema);
      const AtlasCarousel = atlasConnection.model('Carousel', Carousel.schema);

      console.log('📥 Importing data to Atlas...');
      
      // Clear existing data (optional)
      await AtlasEvent.deleteMany({});
      await AtlasCarousel.deleteMany({});
      
      // Insert new data
      if (events.length > 0) {
        await AtlasEvent.insertMany(events);
        console.log(`✅ Imported ${events.length} events`);
      }
      
      if (carousels.length > 0) {
        await AtlasCarousel.insertMany(carousels);
        console.log(`✅ Imported ${carousels.length} carousel items`);
      }

      await atlasConnection.close();
      console.log('\n🎉 Migration completed successfully!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.log('\n💡 Tips:');
      console.log('   - Check your Atlas connection string');
      console.log('   - Verify your cluster URL is correct');
      console.log('   - Make sure your IP is whitelisted in Atlas');
      console.log('   - Try connecting in MongoDB Compass first');
    }
  } finally {
    process.exit(0);
  }
}

migrateData();
