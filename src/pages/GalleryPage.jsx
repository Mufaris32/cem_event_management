import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Search, ChevronDown, ChevronUp, Image, RefreshCw, Calendar } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import LazyImage from '../components/LazyImage';
import EventGalleryManager from '../components/EventGalleryManager';
import { getPastEvents } from '../services/eventServiceClient';
import { getEventGalleryImages, getMultipleEventGalleryCounts } from '../services/eventGalleryService';
import { isAuthenticated } from '../utils/auth';

const GalleryPage = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [eventGalleries, setEventGalleries] = useState({});
  const [eventGalleryCounts, setEventGalleryCounts] = useState({}); // New state for counts
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingGalleries, setLoadingGalleries] = useState(new Set());
  const [loadingCounts, setLoadingCounts] = useState(false); // New loading state for counts
  // Removed isAdmin and showUploadModal - Gallery is read-only

  useEffect(() => {
    loadPastEvents();
    // Removed admin check - Gallery is read-only for everyone
  }, []);

  // Load gallery counts for all events after events are loaded
  useEffect(() => {
    if (pastEvents.length > 0) {
      loadGalleryCounts();
    }
  }, [pastEvents]);

  const loadGalleryCounts = async () => {
    try {
      setLoadingCounts(true);
      
      // Get all event IDs
      const eventIds = pastEvents.map(event => event.id);
      
      // Load gallery counts efficiently in batches
      const counts = await getMultipleEventGalleryCounts(eventIds);
      
      setEventGalleryCounts(counts);
    } catch (error) {
      console.error('Error loading gallery counts:', error);
      // Fallback to individual loading if batch fails
      const fallbackCounts = {};
      pastEvents.forEach(event => {
        fallbackCounts[event.id] = 0;
      });
      setEventGalleryCounts(fallbackCounts);
    } finally {
      setLoadingCounts(false);
    }
  };

  const loadPastEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get past events only
      const events = await getPastEvents();
      
      // Ensure we have an array and add proper ID fields
      const processedEvents = Array.isArray(events) ? events.map(event => ({
        ...event,
        id: event._id || event.id
      })) : [];
      
      setPastEvents(processedEvents);
      setFilteredEvents(processedEvents);

    } catch (err) {
      console.error('Error loading past events:', err);
      setError('Failed to load past events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load gallery images only when event is expanded (lazy loading)
  const loadEventGallery = useCallback(async (eventId) => {
    // Skip if already loading or already loaded
    if (loadingGalleries.has(eventId) || eventGalleries[eventId]) {
      return;
    }

    try {
      setLoadingGalleries(prev => new Set(prev).add(eventId));
      
      const images = await getEventGalleryImages(eventId);
      
      setEventGalleries(prev => ({
        ...prev,
        [eventId]: images
      }));
    } catch (error) {
      console.warn(`Could not load gallery for event ${eventId}:`, error);
      setEventGalleries(prev => ({
        ...prev,
        [eventId]: []
      }));
    } finally {
      setLoadingGalleries(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  }, [eventGalleries, loadingGalleries]);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredEvents(pastEvents);
      return;
    }

    const filtered = pastEvents.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredEvents(filtered);
  };

  const toggleEventExpansion = useCallback((eventId) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
      // Load gallery images when expanding event
      loadEventGallery(eventId);
    }
    setExpandedEvents(newExpanded);
  }, [expandedEvents, loadEventGallery]);

  const openImageModal = (image, eventTitle) => {
    setSelectedImage({ ...image, eventTitle });
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Cultural: 'bg-purple-100 text-purple-800 border-purple-200',
      Sports: 'bg-blue-100 text-blue-800 border-blue-200',
      Workshop: 'bg-green-100 text-green-800 border-green-200',
      Seminar: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Conference: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Competition: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-college-accent/30 via-white to-college-accent/20 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading gallery..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-college-accent/30 via-white to-college-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Gallery</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadPastEvents}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-college-accent/30 via-white to-college-accent/20">
      <div className="container section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-college-primary to-college-primary/80 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Camera className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="heading-1 text-college-primary mb-0 font-serif">Event Gallery</h1>
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                // Clear galleries and reload
                setEventGalleries({});
                setEventGalleryCounts({}); // Clear counts too
                setExpandedEvents(new Set());
                loadPastEvents();
              }}
              className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group"
              title="Refresh Gallery"
            >
              <RefreshCw className="w-5 h-5 text-college-primary group-hover:rotate-180 transition-transform duration-500" />
            </motion.button>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Relive the amazing moments from our past events. Browse through photos organized by each event 
            and explore the memories we've created together.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mb-8 p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-5 h-5 text-college-primary" />
            <span className="font-semibold text-gray-700">Search Past Events</span>
          </div>
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search by event name, description, or category..."
          />
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEvents.length} past events
            {!loadingCounts && Object.keys(eventGalleryCounts).length > 0 && (
              <span className="ml-2">
                • {Object.values(eventGalleryCounts).filter(count => count > 0).length} with photos
                • {Object.values(eventGalleryCounts).reduce((sum, count) => sum + count, 0)} total photos
              </span>
            )}
          </div>
        </motion.div>

        {/* Events Gallery */}
        <AnimatePresence mode="wait">
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-600 mb-4 font-serif">No past events found</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We couldn't find any past events matching your search. Try a different search term.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {filteredEvents.map((event, index) => {
                const images = eventGalleries[event.id] || [];
                const photoCount = eventGalleryCounts[event.id] ?? '...'; // Show count from state
                const isExpanded = expandedEvents.has(event.id);
                const isLoadingGallery = loadingGalleries.has(event.id);

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {/* Event Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(event.category)}`}>
                              {event.category}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h3>
                          <p className="text-gray-600 text-sm">
                            {event.shortDescription || event.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Image className="w-4 h-4" />
                                <span>
                                  {loadingCounts ? (
                                    <span className="inline-flex items-center gap-1">
                                      <div className="w-3 h-3 border-2 border-gray-300 border-t-college-primary rounded-full animate-spin"></div>
                                      Loading...
                                    </span>
                                  ) : photoCount === 0 ? (
                                    <span className="text-gray-400">No photos yet</span>
                                  ) : (
                                    <span className="font-medium text-college-primary">
                                      {photoCount} photo{photoCount !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                </span>
                              </div>
                              {event.location && typeof event.location === 'object' && (
                                <span>📍 {event.location.address}, {event.location.city}</span>
                              )}
                              {event.location && typeof event.location === 'string' && (
                                <span>📍 {event.location}</span>
                              )}
                            </div>
                            
                            {/* Admin Quick Add Photos Button - REMOVED */}
                            {/* Gallery page should be read-only */}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleEventExpansion(event.id)}
                          className={`ml-4 p-3 rounded-xl transition-colors ${
                            photoCount > 0 
                              ? 'bg-college-primary/10 hover:bg-college-primary/20' 
                              : 'bg-gray-100 hover:bg-gray-200 cursor-default'
                          }`}
                          disabled={photoCount === 0 && !loadingCounts}
                          title={photoCount === 0 ? 'No photos to display' : `${isExpanded ? 'Hide' : 'Show'} gallery`}
                        >
                          {photoCount === 0 && !loadingCounts ? (
                            <Camera className="w-5 h-5 text-gray-400" />
                          ) : isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-college-primary" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-college-primary" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Event Gallery */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {isLoadingGallery ? (
                            <div className="p-6 text-center">
                              <LoadingSpinner size="medium" />
                              <p className="text-gray-500 mt-2">Loading photos...</p>
                            </div>
                          ) : (
                            <div className="p-6">
                              <EventGalleryManager 
                                eventId={event.id} 
                                eventTitle={event.title}
                                isAdmin={false}
                              />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>



      {/* Image Modal */}
      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={`${selectedImage.eventTitle} - Photo`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
                <h4 className="font-semibold">{selectedImage.eventTitle}</h4>
                {selectedImage.caption && (
                  <p className="text-sm opacity-90">{selectedImage.caption}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;

