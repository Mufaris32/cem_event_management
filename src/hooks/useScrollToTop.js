import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTopInstant } from '../utils/scrollToTop';

/**
 * Custom hook to scroll to top on route change
 * @param {Object} options - Options for scroll behavior
 * @param {boolean} options.smooth - Whether to use smooth scrolling (default: true)
 * @param {boolean} options.instant - Whether to scroll instantly without animation (default: false)
 */
export const useScrollToTop = (options = {}) => {
  const location = useLocation();
  const { smooth = true, instant = false } = options;

  useEffect(() => {
    if (instant) {
      scrollToTopInstant();
    } else if (smooth) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, smooth, instant]);
};
