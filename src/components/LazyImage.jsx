import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageView from './ImageView';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  onClick = null
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showImageView, setShowImageView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const handleImageClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowImageView(true);
    }
  };

  const imageSrc = hasError ? null : (isInView ? src : null);

  return (
    <>
      <div 
        ref={imgRef} 
        className={`relative overflow-hidden ${className}`}
        onClick={handleImageClick}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-cover cursor-pointer transition-all duration-300 hover:scale-105"
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        )}
        
        {!isLoaded && isInView && !hasError && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
            <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Failed to load</span>
          </div>
        )}
      </div>

      <ImageView 
        image={src}
        isOpen={showImageView}
        onClose={() => setShowImageView(false)}
      />
    </>
  );
};

export default LazyImage;
