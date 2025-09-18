import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test server working!' });
});

// Simple gallery test route
app.get('/api/events/:id/gallery', (req, res) => {
  res.json({ 
    success: true,
    message: 'Gallery endpoint working',
    eventId: req.params.id,
    galleryImages: []
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
