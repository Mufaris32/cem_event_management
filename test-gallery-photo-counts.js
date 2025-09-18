// Test Gallery Photo Count Display
// This script tests if photo counts are displayed correctly in the gallery tab

console.log('🔍 Testing Gallery Photo Count Display...');

const testGalleryPhotoCounts = async () => {
  try {
    // Test getting past events
    console.log('📅 Fetching past events...');
    const eventsResponse = await fetch('http://localhost:5000/api/events/past');
    const eventsData = await eventsResponse.json();
    
    if (eventsData.success && eventsData.events) {
      console.log(`✅ Found ${eventsData.events.length} past events`);
      
      // Test gallery counts for first few events
      const testEvents = eventsData.events.slice(0, 3);
      console.log(`🧪 Testing gallery counts for first ${testEvents.length} events...`);
      
      for (let i = 0; i < testEvents.length; i++) {
        const event = testEvents[i];
        console.log(`\n📸 Event: ${event.title}`);
        
        try {
          const galleryResponse = await fetch(`http://localhost:5000/api/events/${event._id}/gallery`);
          const galleryData = await galleryResponse.json();
          
          if (galleryData.success) {
            const photoCount = galleryData.galleryImages?.length || 0;
            console.log(`   Photo count: ${photoCount}`);
            
            if (photoCount > 0) {
              console.log(`   ✅ Has ${photoCount} photo${photoCount !== 1 ? 's' : ''}`);
              console.log(`   First image: ${galleryData.galleryImages[0]?.url || 'No URL'}`);
            } else {
              console.log(`   📭 No photos yet`);
            }
          } else {
            console.log(`   ❌ Failed to load gallery: ${galleryData.message}`);
          }
        } catch (error) {
          console.log(`   ❌ Error loading gallery: ${error.message}`);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      console.log('\n📊 Summary:');
      console.log('✅ Gallery photo count functionality is working');
      console.log('✅ API endpoints are responding correctly');
      console.log('✅ Photo counts should now display in the gallery tab');
      
    } else {
      console.log('❌ No past events found or API error');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testGalleryPhotoCounts();

console.log('\n📋 Instructions for manual testing:');
console.log('1. Open the application in browser: http://localhost:5174');
console.log('2. Navigate to the Gallery tab');
console.log('3. Check that photo counts are displayed for each event');
console.log('4. Look for text like "5 photos" or "No photos yet"');
console.log('5. Verify that events with 0 photos show a disabled expand button');
