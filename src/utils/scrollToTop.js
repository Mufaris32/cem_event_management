/**
 * Scroll to top utility functions
 */

/**
 * Scroll to the top of the page smoothly
 * @param {Object} options - Scroll options
 */
export const scrollToTop = (options = {}) => {
  const { 
    behavior = 'smooth',
    top = 0,
    left = 0 
  } = options;

  window.scrollTo({
    top,
    left,
    behavior
  });
};

/**
 * Scroll to top instantly (no animation)
 */
export const scrollToTopInstant = () => {
  scrollToTop({ behavior: 'auto' });
};

/**
 * Scroll to a specific element
 * @param {string|HTMLElement} element - Element selector or element
 * @param {Object} options - Scroll options
 */
export const scrollToElement = (element, options = {}) => {
  const targetElement = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;

  if (targetElement) {
    const { 
      behavior = 'smooth',
      block = 'start',
      inline = 'nearest'
    } = options;

    targetElement.scrollIntoView({
      behavior,
      block,
      inline
    });
  }
};

/**
 * Check if user is at the bottom of the page
 * @returns {boolean}
 */
export const isAtBottom = () => {
  return window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
};

/**
 * Check if user is at the top of the page
 * @returns {boolean}
 */
export const isAtTop = () => {
  return window.scrollY <= 100;
};

/**
 * Get current scroll position
 * @returns {Object} - { x, y }
 */
export const getScrollPosition = () => {
  return {
    x: window.scrollX || window.pageXOffset,
    y: window.scrollY || window.pageYOffset
  };
};
