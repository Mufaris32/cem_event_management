const http = require('http');

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, raw: true });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function testGalleryEndpoint() {
  try {
    console.log('🔍 Testing Gallery API Endpoint...\n');
    
    // Test the specific event ID from our created events
    const eventId = '68b9f299fd1f809406089d25'; // Annual Tech Conference 2024
    
    console.log(`📋 Testing event ID: ${eventId}`);
    console.log(`🌐 URL: http://localhost:5000/api/events/${eventId}/gallery\n`);
    
    const galleryOptions = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${eventId}/gallery`,
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    const response = await makeRequest(galleryOptions);
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📄 Response Data:`, JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      console.log('\n✅ Gallery endpoint is working correctly!');
      if (response.data.galleryImages) {
        console.log(`📸 Gallery has ${response.data.galleryImages.length} images`);
      }
    } else {
      console.log('\n❌ Gallery endpoint returned an error');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('📋 Full error:', error);
  }
}

testGalleryEndpoint();
