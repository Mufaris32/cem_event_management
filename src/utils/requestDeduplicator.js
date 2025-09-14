/**
 * Request deduplication utility to prevent duplicate API calls
 */
class RequestDeduplicator {
  constructor() {
    this.pendingRequests = new Map();
  }

  /**
   * Deduplicate a request by caching pending promises
   * @param {string} key - Unique key for the request
   * @param {Function} requestFn - Function that returns a promise
   * @returns {Promise} - The deduplicated promise
   */
  async deduplicate(key, requestFn) {
    // If there's already a pending request for this key, return it
    if (this.pendingRequests.has(key)) {
      console.log(`🔄 Deduplicating request: ${key}`);
      return this.pendingRequests.get(key);
    }

    // Create a new request
    const promise = requestFn()
      .finally(() => {
        // Remove from pending requests when done
        this.pendingRequests.delete(key);
      });

    // Store the pending request
    this.pendingRequests.set(key, promise);

    return promise;
  }

  /**
   * Clear specific cache entries by key pattern
   * @param {string} pattern - Pattern to match keys (supports partial matching)
   */
  clearCache(pattern) {
    if (pattern) {
      // Clear specific entries matching pattern
      for (const key of this.pendingRequests.keys()) {
        if (key.includes(pattern)) {
          this.pendingRequests.delete(key);
        }
      }
    } else {
      // Clear all
      this.pendingRequests.clear();
    }
  }

  /**
   * Get the number of pending requests
   */
  getPendingCount() {
    return this.pendingRequests.size;
  }

  /**
   * Get all pending request keys
   */
  getPendingKeys() {
    return Array.from(this.pendingRequests.keys());
  }
}

// Global instance
const requestDeduplicator = new RequestDeduplicator();

export default requestDeduplicator;
