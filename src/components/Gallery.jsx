import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

const Gallery = ({ 
  images = [], 
  columns = 4, 
  gap = 4, 
  showImageCount = true,
  className = '',
  enableLightbox = true,
  onImageClick = null
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') setIsModalOpen(false);
      if (e.key === 'ArrowLeft') setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
      if (e.key === 'ArrowRight') setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, images.length]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const openModal = (index) => {
    if (!enableLightbox) return;
    setSelectedImageIndex(index);
    setIsModalOpen(true);
    if (onImageClick) onImageClick(images[index], index);
  };


  // Grid classes
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  const gapClass = `gap-${gap}`;

  if (!images || images.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <ZoomIn className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Available</h3>
        <p className="text-gray-500">There are no images to display in this gallery.</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Image Count */}
      {showImageCount && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 font-medium">
            {images.length} {images.length === 1 ? 'photo' : 'photos'}
          </p>
        </div>
      )}

      {/* Image Grid */}
      <div className={`grid ${gridCols} ${gapClass}`}>
        {images.map((image, index) => {
          const imageUrl = typeof image === 'string' ? image : image.url;
          const imageAlt = typeof image === 'string' ? `Gallery image ${index + 1}` : 
                          (image.alt || image.caption || `Gallery image ${index + 1}`);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 z-10 flex items-center justify-center">
                <button
                  className="opacity-0 group-hover:opacity-100 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                  onClick={() => openModal(index)}
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Image */}
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
                onClick={() => openModal(index)}
                loading="lazy"
              />

              {/* Caption overlay */}
              {typeof image === 'object' && image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm font-medium line-clamp-2">
                    {image.caption}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Image */}
              <img
                src={typeof images[selectedImageIndex] === 'string' ? 
                     images[selectedImageIndex] : 
                     images[selectedImageIndex].url}
                alt={`Gallery image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Caption */}
              {typeof images[selectedImageIndex] === 'object' && images[selectedImageIndex].caption && (
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg max-w-md">
                  <p className="text-sm">{images[selectedImageIndex].caption}</p>
                </div>
              )}

              {/* Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;