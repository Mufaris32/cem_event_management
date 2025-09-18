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
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test basic events endpoint
    console.log('\n1. Testing /api/events...');
    const eventsOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/events',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    
    const eventsResponse = await makeRequest(eventsOptions);
    console.log('Events API Status:', eventsResponse.status);
    console.log('Events found:', eventsResponse.data?.data?.length || 0);
    
    if (eventsResponse.data?.data && eventsResponse.data.data.length > 0) {
      const firstEvent = eventsResponse.data.data[0];
      console.log('First event ID:', firstEvent._id);
      console.log('First event title:', firstEvent.title);
      
      // Test gallery endpoint for first event
      console.log('\n2. Testing gallery endpoint for first event...');
      const galleryOptions = {
        hostname: 'localhost',
        port: 5000,
        path: `/api/events/${firstEvent._id}/gallery`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      };
      
      const galleryResponse = await makeRequest(galleryOptions);
      console.log('Gallery API Status:', galleryResponse.status);
      console.log('Gallery Response:', JSON.stringify(galleryResponse.data, null, 2));
    } else {
      console.log('No events found to test gallery endpoint');
      console.log('Full events response:', JSON.stringify(eventsResponse.data, null, 2));
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testAPI();
