// Test script to check Gallery API endpoints
const testGalleryAPI = async () => {
  const API_BASE_URL = 'http://localhost:3002/api';
  
  console.log('Testing Gallery API endpoints...');
  
  try {
    // Test 1: Check past events
    console.log('\n1. Testing GET /events/past');
    const pastEventsResponse = await fetch(`${API_BASE_URL}/events/past`);
    const pastEventsData = await pastEventsResponse.json();
    console.log('Past events response:', pastEventsData);
    
    // Test 2: Check gallery endpoint for multiple events
    console.log('\n2. Testing POST /upload/gallery/multiple');
    const galleryResponse = await fetch(`${API_BASE_URL}/upload/gallery/multiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventNames: ['test_event_1', 'test_event_2']
      })
    });
    const galleryData = await galleryResponse.json();
    console.log('Gallery response:', galleryData);
    
  } catch (error) {
    console.error('API Test Error:', error);
  }
};

testGalleryAPI();
