import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import placeholders from '../utils/placeholderImage';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  onClick = null,
  placeholder = placeholders.loading
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
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
        rootMargin: '50px 0px', // Start loading 50px before coming into view
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

  const imageSrc = hasError 
    ? placeholders.loading
    : (isInView ? src : placeholder);

  return (
    <div 
      ref={imgRef} 
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover transition-all duration-300"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          filter: !isLoaded && isInView ? 'blur(5px)' : 'none',
          transform: !isLoaded && isInView ? 'scale(1.1)' : 'scale(1)',
        }}
      />
      
      {!isLoaded && isInView && (
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2 }}
          className="absolute inset-0 bg-gray-200 flex items-center justify-center"
        >
          <div className="w-8 h-8 border-4 border-gray-300 border-t-college-primary rounded-full animate-spin"></div>
        </motion.div>
      )}
    </div>
  );
};

export default LazyImage;
