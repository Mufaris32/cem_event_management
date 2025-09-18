import mongoose from 'mongoose';
import Event from './src/models/Event.js';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/college_event_calendar";

async function createTestEvents() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create past events for testing gallery
    const pastEvents = [
      {
        title: "Annual Tech Conference 2024",
        description: "A comprehensive tech conference featuring the latest in AI, machine learning, and web development. Speakers from top tech companies shared insights and innovations.",
        shortDescription: "Leading tech conference with AI and ML focus",
        date: new Date('2024-08-15'),
        time: "09:00 AM",
        location: {
          address: "Main Auditorium, Engineering Building",
          city: "Campus City",
          state: "State",
          zipCode: "12345"
        },
        category: "Technical",
        organizer: {
          name: "Tech Club",
          email: "tech@college.edu",
          phone: "+1234567890"
        },
        images: [{
          url: "https://via.placeholder.com/800x400/1B4D3E/FFFFFF?text=Tech+Conference",
          publicId: "tech_conference_main",
          caption: "Main conference banner"
        }],
        status: "completed",
        capacity: 500,
        registeredCount: 450,
        price: 0,
        featured: true,
        tags: ["tech", "conference", "AI", "ML"]
      },
      {
        title: "Cultural Night 2024",
        description: "A vibrant evening of cultural performances, music, and dance celebrating the diverse heritage of our student community.",
        shortDescription: "Cultural performances and celebrations",
        date: new Date('2024-07-20'),
        time: "06:00 PM",
        location: {
          address: "Campus Amphitheater",
          city: "Campus City",
          state: "State",
          zipCode: "12345"
        },
        category: "Cultural",
        organizer: {
          name: "Cultural Committee",
          email: "culture@college.edu",
          phone: "+1234567891"
        },
        images: [{
          url: "https://via.placeholder.com/800x400/8B4513/FFFFFF?text=Cultural+Night",
          publicId: "cultural_night_main",
          caption: "Cultural night poster"
        }],
        status: "completed",
        capacity: 800,
        registeredCount: 750,
        price: 0,
        featured: true,
        tags: ["culture", "performance", "music", "dance"]
      },
      {
        title: "Sports Festival 2024",
        description: "Inter-departmental sports competition featuring cricket, football, basketball, and various indoor games.",
        shortDescription: "Inter-departmental sports competition",
        date: new Date('2024-06-10'),
        time: "08:00 AM",
        location: {
          address: "Sports Complex",
          city: "Campus City",
          state: "State",
          zipCode: "12345"
        },
        category: "Sports",
        organizer: {
          name: "Sports Committee",
          email: "sports@college.edu",
          phone: "+1234567892"
        },
        images: [{
          url: "https://via.placeholder.com/800x400/006400/FFFFFF?text=Sports+Festival",
          publicId: "sports_festival_main",
          caption: "Sports festival banner"
        }],
        status: "completed",
        capacity: 1000,
        registeredCount: 900,
        price: 0,
        featured: false,
        tags: ["sports", "competition", "cricket", "football"]
      }
    ];

    // Future event for testing (should not show gallery options)
    const futureEvent = {
      title: "Upcoming Workshop 2025",
      description: "Advanced JavaScript and React workshop for final year students.",
      shortDescription: "Advanced JS/React workshop",
      date: new Date('2025-12-15'),
      time: "10:00 AM",
      location: {
        address: "Computer Lab 1",
        city: "Campus City",
        state: "State",
        zipCode: "12345"
      },
      category: "Workshop",
      organizer: {
        name: "CS Department",
        email: "cs@college.edu",
        phone: "+1234567893"
      },
      images: [{
        url: "https://via.placeholder.com/800x400/4B0082/FFFFFF?text=JS+Workshop",
        publicId: "js_workshop_main",
        caption: "JavaScript workshop"
      }],
      status: "published",
      capacity: 50,
      registeredCount: 15,
      price: 0,
      featured: false,
      tags: ["workshop", "javascript", "react", "programming"]
    };

    // Insert events
    const allEvents = [...pastEvents, futureEvent];
    const createdEvents = await Event.insertMany(allEvents);
    
    console.log(`✅ Created ${createdEvents.length} test events:`);
    createdEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event._id})`);
      console.log(`   Date: ${event.date.toDateString()}`);
      console.log(`   Status: ${event.status}`);
      console.log('');
    });
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Failed to create test events:', error);
    await mongoose.disconnect();
  }
}

createTestEvents();
