
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

const Gallery = ({ 
  images = [], 
  title = "Gallery",
  columns = 4, 
  gap = 4, 
  showImageCount = true,
  showTitle = false,
  className = '',
  enableLightbox = true,
  onImageClick = null,
  gridCols = null // Allow custom grid classes
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Normalize images array to handle different data structures
  const normalizedImages = images.map((image, index) => {
    if (typeof image === 'string') {
      return {
        id: index,
        url: image,
        alt: `Gallery image ${index + 1}`,
        caption: ''
      };
    }
    return {
      id: image.id || index,
      url: image.url || image.src || image,
      alt: image.alt || image.caption || `Gallery image ${index + 1}`,
      caption: image.caption || ''
    };
  });

  // Handle keyboard navigation
  const handleKeyPress = useCallback((event) => {
    if (!isModalOpen) return;

    switch (event.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'ArrowRight':
        goToNext();
        break;
      default:
        break;
    }
  }, [isModalOpen]);

  // Effect for keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Effect to lock/unlock body scroll
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const openModal = (index) => {
    if (!enableLightbox) return;
    setSelectedImageIndex(index);
    setIsModalOpen(true);
    setIsImageLoading(true);
    if (onImageClick) onImageClick(normalizedImages[index], index);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(0);
    setIsImageLoading(true);
  };

  const goToNext = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === normalizedImages.length - 1 ? 0 : prevIndex + 1
    );
    setIsImageLoading(true);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === 0 ? normalizedImages.length - 1 : prevIndex - 1
    );
    setIsImageLoading(true);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Grid classes - use custom gridCols prop if provided
  const defaultGridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  const finalGridCols = gridCols || defaultGridCols;
  const gapClass = `gap-${gap}`;

  // Don't render if no images
  if (!normalizedImages.length) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Available</h3>
        <p className="text-gray-500">There are no images to display in this gallery.</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Gallery Header */}
      {(showTitle || showImageCount) && (
        <div className="mb-6">
          {showTitle && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {showImageCount && (
            <p className="text-sm text-gray-600 font-medium">
              {normalizedImages.length} {normalizedImages.length === 1 ? 'photo' : 'photos'}
            </p>
          )}
        </div>
      )}

      {/* Image Grid */}
      <div className={`grid ${finalGridCols} ${gapClass}`}>
        {normalizedImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => openModal(index)}
          >
            <div className="aspect-square relative">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400/e5e7eb/9ca3af?text=Image+Not+Found';
                }}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center">
                  <ZoomIn className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">View Image</p>
                </div>
              </div>

              {/* Image Number Badge */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                {index + 1}
              </div>
            </div>

            {/* Caption (if exists) */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-sm font-medium line-clamp-2">
                  {image.caption}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleBackdropClick}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            {/* Modal Content */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
                aria-label="Close gallery"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                {selectedImageIndex + 1} / {normalizedImages.length}
              </div>

              {/* Previous Button */}
              {normalizedImages.length > 1 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {normalizedImages.length > 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Main Image Container */}
              <div className="relative max-w-[90vw] max-h-[90vh] overflow-auto">
                {/* Loading Spinner */}
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                )}

                {/* Modal Image */}
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={normalizedImages[selectedImageIndex]?.url}
                  alt={normalizedImages[selectedImageIndex]?.alt}
                  className="max-w-full max-h-full object-contain"
                  onLoad={handleImageLoad}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600/e5e7eb/9ca3af?text=Image+Not+Found';
                    setIsImageLoading(false);
                  }}
                />

                {/* Image Caption in Modal */}
                {normalizedImages[selectedImageIndex]?.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white text-center font-medium">
                      {normalizedImages[selectedImageIndex].caption}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Hints */}
              {normalizedImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                  Use ← → keys or click buttons to navigate
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

