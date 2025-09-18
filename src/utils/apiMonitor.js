/**
 * Simple API call monitoring utility for debugging
 */
class APIMonitor {
  constructor() {
    this.calls = new Map();
    this.enabled = import.meta.env.DEV; // Only enable in development
  }

  logCall(endpoint, method = 'GET') {
    if (!this.enabled) return;

    const key = `${method} ${endpoint}`;
    const now = Date.now();
    
    if (!this.calls.has(key)) {
      this.calls.set(key, []);
    }
    
    const calls = this.calls.get(key);
    calls.push(now);
    
    // Keep only calls from the last 10 seconds
    const recent = calls.filter(time => now - time < 10000);
    this.calls.set(key, recent);
    
    // Warn if too many calls in short time
    if (recent.length > 5) {
      console.warn(`🚨 Possible API loop detected: ${key} called ${recent.length} times in 10 seconds`);
      console.warn('Recent calls:', recent.map(time => new Date(time).toLocaleTimeString()));
    } else if (recent.length > 2) {
      console.info(`⚠️ Multiple API calls: ${key} called ${recent.length} times in 10 seconds`);
    }
  }

  getStats() {
    if (!this.enabled) return {};
    
    const stats = {};
    for (const [endpoint, calls] of this.calls.entries()) {
      const now = Date.now();
      const recent = calls.filter(time => now - time < 60000); // Last minute
      stats[endpoint] = {
        totalCalls: calls.length,
        recentCalls: recent.length,
        lastCall: calls.length > 0 ? new Date(calls[calls.length - 1]).toLocaleTimeString() : null
      };
    }
    return stats;
  }

  reset() {
    this.calls.clear();
  }
}

// Global instance
const apiMonitor = new APIMonitor();

// Make it available in dev tools console
if (import.meta.env.DEV) {
  window.apiMonitor = apiMonitor;
}

export default apiMonitor;
