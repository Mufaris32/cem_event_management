import mongoose from 'mongoose';
import Event from '../src/models/Event.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to remove placeholder images from events that have real images
 */
async function removePlaceholderImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all events
    const events = await Event.find({});
    console.log(`📊 Found ${events.length} events`);

    let updatedCount = 0;

    for (const event of events) {
      if (!event.images || event.images.length === 0) {
        console.log(`⚠️  Event "${event.title}" has no images`);
        continue;
      }

      console.log(`\n🔍 Checking event: ${event.title}`);
      console.log(`   Images count: ${event.images.length}`);
      
      // Log each image
      event.images.forEach((img, index) => {
        console.log(`   Image ${index + 1}: ${img.publicId} (${img.url.substring(0, 50)}...)`);
      });

      // Check if event has both placeholder and real images
      const hasPlaceholder = event.images.some(img => 
        img.publicId && img.publicId.startsWith('placeholder_')
      );
      const hasRealImages = event.images.some(img => 
        img.publicId && !img.publicId.startsWith('placeholder_')
      );

      console.log(`   Has placeholder: ${hasPlaceholder}`);
      console.log(`   Has real images: ${hasRealImages}`);

      if (hasPlaceholder && hasRealImages) {
        // Remove placeholder images, keep only real images
        const originalCount = event.images.length;
        const filteredImages = event.images.filter(img => 
          !img.publicId.startsWith('placeholder_')
        );

        event.images = filteredImages;
        await event.save();
        
        updatedCount++;
        console.log(`✅ Updated event: ${event.title} (removed ${originalCount - filteredImages.length} placeholders, kept ${filteredImages.length} real images)`);
      } else if (hasPlaceholder && !hasRealImages) {
        console.log(`ℹ️  Event "${event.title}" only has placeholder images (keeping them)`);
      }
    }

    console.log(`\n🎉 Cleanup complete!`);
    console.log(`   - Total events checked: ${events.length}`);
    console.log(`   - Events updated: ${updatedCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
removePlaceholderImages();
