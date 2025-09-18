import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Gallery from './Gallery';

const GalleryExamples = () => {
  // Example image data - can be strings or objects
  const [exampleImages] = useState([
    {
      url: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_800,h_600,f_auto,q_auto/sample.jpg',
      caption: 'Beautiful landscape photo from our cultural event'
    },
    {
      url: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_800,h_600,f_auto,q_auto/v1571218364/samples/bike.jpg',
      caption: 'Sports day bicycle race competition'
    },
    {
      url: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_800,h_600,f_auto,q_auto/v1571218364/samples/breakfast.jpg',
      caption: 'Community breakfast gathering'
    },
    {
      url: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_800,h_600,f_auto,q_auto/v1571218364/samples/food/dessert.jpg',
      caption: 'Delicious desserts from our culinary workshop'
    },
    {
      url: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_800,h_600,f_auto,q_auto/v1571218364/samples/landscapes/nature-mountains.jpg',
      caption: 'Nature photography workshop results'
    },
    {
      url: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_800,h_600,f_auto,q_auto/v1571218364/samples/people/boy-snow-hoodie.jpg',
      caption: 'Winter sports activities'
    }
  ]);

  // Simple string URLs example
  const [simpleImages] = useState([
    'https://res.cloudinary.com/demo/image/upload/c_fill,w_600,h_400,f_auto,q_auto/v1571218364/samples/animals/kitten-playing.gif',
    'https://res.cloudinary.com/demo/image/upload/c_fill,w_600,h_400,f_auto,q_auto/v1571218364/samples/animals/three-dogs.jpg',
    'https://res.cloudinary.com/demo/image/upload/c_fill,w_600,h_400,f_auto,q_auto/v1571218364/samples/people/jazz.jpg',
    'https://res.cloudinary.com/demo/image/upload/c_fill,w_600,h_400,f_auto,q_auto/v1571218364/samples/cityscape/architecture-signs.jpg'
  ]);

  const handleImageClick = (image, index) => {
    console.log('Image clicked:', { image, index });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gallery Component Examples
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Reusable React Gallery component with Cloudinary integration, 
            responsive grid layouts, and full-screen lightbox modal.
          </p>
        </motion.div>

        {/* Example 1: Full Featured Gallery */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Full Featured Gallery (4 Columns)
            </h2>
            <p className="text-gray-600 mb-8">
              With captions, image counter, and full lightbox functionality
            </p>
            
            <Gallery
              images={exampleImages}
              columns={4}
              gap={4}
              showImageCount={true}
              enableLightbox={true}
              onImageClick={handleImageClick}
              className="mb-4"
            />
          </div>
        </motion.section>

        {/* Example 2: 3 Column Layout */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              3 Column Layout
            </h2>
            <p className="text-gray-600 mb-8">
              Perfect for smaller collections or event detail pages
            </p>
            
            <Gallery
              images={simpleImages}
              columns={3}
              gap={6}
              showImageCount={true}
              enableLightbox={true}
            />
          </div>
        </motion.section>

        {/* Example 3: 2 Column Layout */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              2 Column Layout (No Lightbox)
            </h2>
            <p className="text-gray-600 mb-8">
              Lightbox disabled - images are display only
            </p>
            
            <Gallery
              images={simpleImages.slice(0, 4)}
              columns={2}
              gap={4}
              showImageCount={false}
              enableLightbox={false}
            />
          </div>
        </motion.section>

        {/* Example 4: Single Column (Mobile-first) */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Single Column Layout
            </h2>
            <p className="text-gray-600 mb-8">
              Great for mobile views or featured image displays
            </p>
            
            <Gallery
              images={exampleImages.slice(0, 3)}
              columns={1}
              gap={6}
              showImageCount={true}
              enableLightbox={true}
            />
          </div>
        </motion.section>

        {/* Example 5: Empty State */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Empty State
            </h2>
            <p className="text-gray-600 mb-8">
              How the component looks when no images are provided
            </p>
            
            <Gallery
              images={[]}
              columns={4}
              showImageCount={true}
            />
          </div>
        </motion.section>

        {/* Usage Documentation */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Usage Examples
            </h2>
            
            <div className="space-y-6">
              {/* Basic Usage */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Usage</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`import Gallery from './components/Gallery';

// Simple image URLs
const images = [
  'https://cloudinary.com/image1.jpg',
  'https://cloudinary.com/image2.jpg'
];

<Gallery images={images} />`}
                </pre>
              </div>

              {/* Advanced Usage */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Advanced Usage</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`// Image objects with captions
const images = [
  {
    url: 'https://cloudinary.com/image1.jpg',
    caption: 'Event photo description',
    alt: 'Alternative text'
  }
];

<Gallery
  images={images}
  columns={3}
  gap={6}
  showImageCount={true}
  enableLightbox={true}
  onImageClick={(image, index) => console.log(image)}
  className="custom-class"
/>`}
                </pre>
              </div>

              {/* Props Documentation */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Props</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-900">Prop</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-900">Type</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-900">Default</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-2 font-mono text-indigo-600">images</td>
                        <td className="px-4 py-2 text-gray-600">Array</td>
                        <td className="px-4 py-2 text-gray-600">[]</td>
                        <td className="px-4 py-2 text-gray-600">Array of image URLs or objects</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-indigo-600">columns</td>
                        <td className="px-4 py-2 text-gray-600">Number</td>
                        <td className="px-4 py-2 text-gray-600">4</td>
                        <td className="px-4 py-2 text-gray-600">Number of columns (1-6)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-indigo-600">gap</td>
                        <td className="px-4 py-2 text-gray-600">Number</td>
                        <td className="px-4 py-2 text-gray-600">4</td>
                        <td className="px-4 py-2 text-gray-600">Gap size between images</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-indigo-600">showImageCount</td>
                        <td className="px-4 py-2 text-gray-600">Boolean</td>
                        <td className="px-4 py-2 text-gray-600">true</td>
                        <td className="px-4 py-2 text-gray-600">Show photo count above grid</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-indigo-600">enableLightbox</td>
                        <td className="px-4 py-2 text-gray-600">Boolean</td>
                        <td className="px-4 py-2 text-gray-600">true</td>
                        <td className="px-4 py-2 text-gray-600">Enable full-screen modal</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-indigo-600">onImageClick</td>
                        <td className="px-4 py-2 text-gray-600">Function</td>
                        <td className="px-4 py-2 text-gray-600">null</td>
                        <td className="px-4 py-2 text-gray-600">Callback when image is clicked</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default GalleryExamples;