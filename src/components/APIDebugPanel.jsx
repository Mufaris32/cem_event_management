import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const APIDebugPanel = () => {
  const [stats, setStats] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.apiMonitor) {
        setStats(window.apiMonitor.getStats());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (import.meta.env.PROD) return null;

  return (
    <>

      {/* Debug Panel */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-16 right-4 z-50 bg-white border-2 border-red-500 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-y-auto"
          style={{ fontSize: '12px' }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-red-600">API Monitor</h3>
            <button
              onClick={() => window.apiMonitor?.reset()}
              className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
            >
              Reset
            </button>
          </div>
          
          {Object.keys(stats).length === 0 ? (
            <p className="text-gray-500">No API calls detected</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(stats).map(([endpoint, data]) => (
                <div key={endpoint} className="border-b pb-2">
                  <div className="font-semibold text-gray-700">{endpoint}</div>
                  <div className="text-xs text-gray-500">
                    Total: {data.totalCalls} | Recent: {data.recentCalls} | Last: {data.lastCall}
                  </div>
                  {data.recentCalls > 3 && (
                    <div className="text-xs text-red-500 font-bold">⚠️ High frequency</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default APIDebugPanel;
