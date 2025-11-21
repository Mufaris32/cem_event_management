/**
 * Generate a placeholder image as a data URL
 * This creates an SVG placeholder that works offline without external dependencies
 */

export const generatePlaceholderImage = (width = 800, height = 400, text = 'No Image', bgColor = '1B4D3E', textColor = 'FFFFFF') => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="${Math.max(16, Math.min(width, height) / 20)}" 
        fill="#${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Predefined placeholder URLs for common use cases
export const placeholders = {
  eventImage: generatePlaceholderImage(800, 400, 'Event Image', '1B4D3E', 'FFFFFF'),
  noImage: generatePlaceholderImage(800, 400, 'No Image', '1B4D3E', 'FFFFFF'),
  galleryImage: generatePlaceholderImage(400, 400, 'Image Not Found', 'e5e7eb', '9ca3af'),
  loading: generatePlaceholderImage(300, 300, 'Loading...', 'e5e5e5', '999999'),
  thumbnail: generatePlaceholderImage(64, 64, 'No Image', 'e5e7eb', '9ca3af'),
};

export default placeholders;
