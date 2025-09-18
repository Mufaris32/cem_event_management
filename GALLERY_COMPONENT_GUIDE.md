# Gallery Component Documentation

A reusable React Gallery component for displaying images in a responsive grid with full-screen lightbox functionality. Perfect for event galleries, photo collections, and image showcases.

## Features

- 📱 **Responsive Grid Layout** - Adapts from 1-6 columns based on screen size
- 🖼️ **Full-Screen Lightbox** - Modal with navigation, zoom, and keyboard controls
- ⌨️ **Keyboard Navigation** - Arrow keys for navigation, ESC to close
- 🖱️ **Mouse Controls** - Click outside modal or close button to exit
- 🔄 **Lazy Loading** - Integrated with existing LazyImage component
- 🎨 **Tailwind CSS** - Consistent styling with your design system
- ♿ **Accessibility** - Proper alt text, keyboard navigation, focus management
- 📊 **Image Counter** - Shows photo count and current position
- 💬 **Caption Support** - Display captions with images
- 🎭 **Smooth Animations** - Framer Motion powered transitions

## Installation & Dependencies

The Gallery component uses existing dependencies in your project:
- `react` - Core React library
- `framer-motion` - For smooth animations
- `lucide-react` - For icons (ChevronLeft, ChevronRight, X, ZoomIn)
- `tailwindcss` - For styling

## Basic Usage

### Simple Image URLs

```jsx
import Gallery from './components/Gallery';

const MyComponent = () => {
  const images = [
    'https://res.cloudinary.com/demo/image/upload/sample1.jpg',
    'https://res.cloudinary.com/demo/image/upload/sample2.jpg',
    'https://res.cloudinary.com/demo/image/upload/sample3.jpg'
  ];

  return <Gallery images={images} />;
};
```

### Images with Captions

```jsx
const imagesWithCaptions = [
  {
    url: 'https://res.cloudinary.com/demo/image/upload/sample1.jpg',
    caption: 'Beautiful sunset at the cultural event',
    alt: 'Sunset photo from cultural event'
  },
  {
    url: 'https://res.cloudinary.com/demo/image/upload/sample2.jpg',
    caption: 'Students participating in sports day',
    alt: 'Sports day activities'
  }
];

return (
  <Gallery 
    images={imagesWithCaptions} 
    columns={3}
    onImageClick={(image, index) => console.log('Clicked:', image)}
  />
);
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `Array<string \| object>` | `[]` | Array of image URLs or objects with url/caption |
| `columns` | `number` | `4` | Number of grid columns (1-6) |
| `gap` | `number` | `4` | Gap size between images (1-8) |
| `showImageCount` | `boolean` | `true` | Show photo count above gallery |
| `enableLightbox` | `boolean` | `true` | Enable full-screen modal |
| `onImageClick` | `function` | `null` | Callback when image is clicked |
| `className` | `string` | `''` | Additional CSS classes for container |
| `imageClassName` | `string` | `''` | Additional CSS classes for images |

### Image Object Format

When using objects instead of strings:

```javascript
{
  url: 'https://cloudinary.com/image.jpg',     // Required
  caption: 'Photo description',                // Optional
  alt: 'Alternative text for accessibility'   // Optional
}
```

## Layout Examples

### Event Details Page (3 columns)
```jsx
<Gallery 
  images={eventImages} 
  columns={3}
  gap={6}
  className="mt-8"
/>
```

### Main Gallery Page (4 columns)
```jsx
<Gallery 
  images={allImages} 
  columns={4}
  gap={4}
  showImageCount={true}
/>
```

### Mobile-Optimized (2 columns)
```jsx
<Gallery 
  images={mobileImages} 
  columns={2}
  gap={3}
/>
```

### Featured Images (1 column)
```jsx
<Gallery 
  images={featuredImages} 
  columns={1}
  gap={8}
/>
```

## Integration with Existing Components

### Replace EventGalleryManager (Read-only)

```jsx
// Before: EventGalleryManager with complex state management
<EventGalleryManager eventId={eventId} isAdmin={false} />

// After: Simple Gallery with service integration
import { getEventGalleryImages } from '../services/eventGalleryService';

const [images, setImages] = useState([]);

useEffect(() => {
  const loadImages = async () => {
    const galleryImages = await getEventGalleryImages(eventId);
    const formatted = galleryImages.map(img => ({
      url: img.url,
      caption: img.caption
    }));
    setImages(formatted);
  };
  loadImages();
}, [eventId]);

return <Gallery images={images} columns={3} />;
```

### EventGalleryViewer Component

Use the provided `EventGalleryViewer` component for easy integration:

```jsx
import EventGalleryViewer from './components/EventGalleryViewer';

<EventGalleryViewer 
  eventId={event.id} 
  eventTitle={event.title}
  className="mt-8"
/>
```

## Responsive Behavior

The Gallery automatically adjusts columns based on screen size:

- **1 column**: Always 1 column
- **2 columns**: 1 on mobile, 2 on small screens+
- **3 columns**: 1 on mobile, 2 on small, 3 on large+
- **4 columns**: 1 on mobile, 2 on small, 3 on large, 4 on xl+
- **5-6 columns**: Similar progressive enhancement

## Keyboard Controls

When lightbox is open:
- `←` **Left Arrow**: Previous image
- `→` **Right Arrow**: Next image  
- `Esc`: Close lightbox
- `Tab`: Navigate to close button

## Accessibility Features

- Proper `alt` attributes for all images
- Keyboard navigation support
- Focus management in modal
- Screen reader friendly
- High contrast close/navigation buttons
- Semantic HTML structure

## Performance Optimizations

- **Lazy Loading**: Uses existing LazyImage component
- **Intersection Observer**: Images load when near viewport
- **Optimized Re-renders**: Memoized callbacks and effects
- **Body Scroll Lock**: Prevents background scrolling in modal
- **Event Cleanup**: Proper event listener cleanup

## Styling Customization

### Custom Container Styles
```jsx
<Gallery 
  className="bg-gray-50 p-6 rounded-xl shadow-lg"
  imageClassName="border-2 border-white"
  images={images}
/>
```

### Override with CSS
```css
.custom-gallery .gallery-item {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.custom-gallery .gallery-item:hover {
  transform: translateY(-2px);
}
```

## Testing

Use the provided test components:

```jsx
// Basic functionality test
import GalleryTest from './components/GalleryTest';

// Integration test with API
import EventGalleryViewer from './components/EventGalleryViewer';
```

## Migration Guide

### From GalleryPage Modal
```jsx
// Old modal implementation
{isModalOpen && selectedImage && (
  <motion.div className="fixed inset-0 bg-black/90 z-50">
    <img src={selectedImage.url} alt="Gallery" />
    <button onClick={closeModal}>×</button>
  </motion.div>
)}

// New: Built into Gallery component
<Gallery images={images} enableLightbox={true} />
```

### From Custom Image Grid
```jsx
// Old custom grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {images.map(img => (
    <img key={img.id} src={img.url} onClick={() => openModal(img)} />
  ))}
</div>

// New: Gallery component
<Gallery images={images} columns={3} gap={4} />
```

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Troubleshooting

### Images Not Loading
- Check Cloudinary URLs are accessible
- Verify network connectivity
- Check browser console for CORS issues

### Modal Not Opening
- Ensure `enableLightbox={true}`
- Check for JavaScript errors
- Verify framer-motion is installed

### Layout Issues  
- Check Tailwind CSS is properly configured
- Verify container has proper width
- Test responsive breakpoints

## Performance Tips

1. **Optimize Images**: Use Cloudinary transformations for appropriate sizes
2. **Limit Grid Size**: Consider pagination for large galleries (50+ images)
3. **Preload Critical Images**: Load above-fold images immediately
4. **Monitor Bundle Size**: Gallery adds ~5KB to your bundle

## Examples in Codebase

- `src/components/GalleryTest.jsx` - Basic testing component
- `src/components/GalleryExamples.jsx` - Comprehensive examples
- `src/components/EventGalleryViewer.jsx` - Integration wrapper
