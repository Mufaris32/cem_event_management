import fetch from 'node-fetch';

async function testAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/events');
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response Success:', data.success);
    console.log('Number of events:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\nEvents with images:');
      data.data.forEach((event, index) => {
        console.log(`${index + 1}. ${event.title}`);
        console.log(`   ID: ${event._id || event.id}`);
        console.log(`   Images count: ${event.images ? event.images.length : 0}`);
        if (event.images && event.images.length > 0) {
          event.images.forEach((img, imgIndex) => {
            console.log(`     - Image ${imgIndex + 1}: ${img.url || img}`);
          });
        }
        console.log('');
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();