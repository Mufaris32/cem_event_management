import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, Filter, Users, MapPin, Clock, ChevronRight, Camera, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import LazyImage from '../components/LazyImage';
import { getAllEvents } from '../services/eventServiceClient';
import { useEventGallery } from '../hooks/useEventGallery';
import { isEventPast } from '../utils/eventUtils';

const EventsPage = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'past', 'upcoming'
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Use the optimized gallery hook
  const { eventGalleries, loadingGalleries, loadGalleriesForEvents, resetGalleries } = useEventGallery();

  const categories = ['all', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Conference', 'Competition'];

  useEffect(() => {
    loadEvents();
  }, []);

  // Load gallery images for past events when filtered events change
  useEffect(() => {
    if (filteredEvents.length > 0) {
      const pastEvents = filteredEvents.filter(event => isEventPast(event));
      if (pastEvents.length > 0) {
        loadGalleriesForEvents(pastEvents, 10);
      }
    }
  }, [filteredEvents, loadGalleriesForEvents]);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await getAllEvents();
      
      // Ensure we have an array and add proper ID fields
      const processedEvents = Array.isArray(events) ? events.map(event => ({
        ...event,
        id: event._id || event.id
      })) : [];
      
      // Sort events by date (newest first)
      const sortedEvents = processedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllEvents(sortedEvents);
      setFilteredEvents(sortedEvents);
      
      // Reset gallery data when events are reloaded
      resetGalleries();
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [resetGalleries]);

  const applyFilters = useCallback((query, timeFilter, category) => {
    let filtered = [...allEvents];

    // Apply time filter
    if (timeFilter === 'past') {
      filtered = filtered.filter(event => isEventPast(event));
    } else if (timeFilter === 'upcoming') {
      filtered = filtered.filter(event => !isEventPast(event));
    }

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(event => event.category === category);
    }

    // Apply search query
    if (query) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.shortDescription?.toLowerCase().includes(query.toLowerCase()) ||
        event.venue?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [allEvents]);

  const handleSearch = useCallback((query) => {
    applyFilters(query, selectedFilter, selectedCategory);
  }, [applyFilters, selectedFilter, selectedCategory]);

  const handleFilterChange = useCallback((filter) => {
    setSelectedFilter(filter);
    applyFilters('', filter, selectedCategory);
  }, [applyFilters, selectedCategory]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    applyFilters('', selectedFilter, category);
  }, [applyFilters, selectedFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isUpcoming = (eventDate) => {
    return new Date(eventDate) >= new Date();
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
        <LoadingSpinner size="large" text="Loading events..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-college-accent/30 via-white to-college-accent/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Events</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadEvents}
            className="px-6 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors"
          >
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
              <Calendar className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="heading-1 text-college-primary mb-0 font-serif">All Events</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Discover all the amazing events happening at our college. From cultural festivals to academic workshops, 
            there's always something exciting happening here.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mb-8 p-6"
        >
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search events by title, description, or venue..."
            />
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Time Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Time</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Events' },
                  { key: 'upcoming', label: 'Upcoming' },
                  { key: 'past', label: 'Past Events' }
                ].map(({ key, label }) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFilterChange(key)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedFilter === key
                        ? 'bg-college-primary text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-college-secondary text-gray-800 shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
            Showing {filteredEvents.length} of {allEvents.length} events
          </div>
        </motion.div>

        {/* Events List */}
        <AnimatePresence mode="wait">
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Calendar className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-600 mb-4 font-serif">No events found</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We couldn't find any events matching your criteria. Try adjusting your search or filters.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {filteredEvents.map((event, index) => {
                const isPastEvent = !isUpcoming(event.date);
                const galleryImages = eventGalleries[event.id] || [];
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex flex-col gap-4">
                        {/* Event Image - Show main image for upcoming, first gallery image as cover for past */}
                        <div className="w-full">
                          {isPastEvent && galleryImages.length > 0 ? (
                            /* Past Event - Show first gallery image as main cover */
                            <div className="relative group cursor-pointer">
                              <LazyImage
                                src={galleryImages[0].url}
                                alt={`${event.title} - Event Photo`}
                                className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                              />
                              {/* Gallery indicator overlay */}
                              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2 group-hover:bg-black/80 transition-colors">
                                <Camera className="w-4 h-4 text-white" />
                                <span className="text-sm font-medium text-white">{galleryImages.length}</span>
                              </div>
                              {/* Gallery badge */}
                              <div className="absolute bottom-3 left-3 bg-purple-600/90 backdrop-blur-sm rounded-lg px-3 py-1.5 group-hover:bg-purple-600 transition-colors">
                                <div className="flex items-center gap-2">
                                  <Image className="w-3 h-3 text-white" />
                                  <span className="text-xs font-medium text-white">Event Gallery</span>
                                </div>
                              </div>
                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-colors duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                                  <Image className="w-8 h-8 mx-auto mb-2" />
                                  <span className="text-sm font-medium">Click to view all photos</span>
                                </div>
                              </div>
                            </div>
                          ) : event.images && event.images.length > 0 ? (
                            /* Regular Event Image */
                            <img
                              src={event.images[0]?.url || event.images[0]}
                              alt={event.title}
                              className="w-full h-48 object-cover rounded-xl"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/800x400/1B4D3E/FFFFFF?text=No+Image';
                              }}
                            />
                          ) : (
                            /* Placeholder for events without images */
                            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                              <div className="text-center">
                                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">No images available</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="w-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(event.category)}`}>
                                  {event.category}
                                </span>
                                {isUpcoming(event.date) ? (
                                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold border border-green-200">
                                    Upcoming
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold border border-gray-200">
                                    Past Event
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {event.shortDescription || event.description}
                              </p>
                            </div>
                          </div>

                          {/* Event Meta Information */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-college-primary" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            {event.time && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4 text-college-primary" />
                                <span>{formatTime(event.time)}</span>
                              </div>
                            )}
                            {event.location && typeof event.location === 'object' && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-college-primary" />
                                <span>{event.location.address}, {event.location.city}</span>
                              </div>
                            )}
                            {event.location && typeof event.location === 'string' && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-college-primary" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.maxParticipants && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="w-4 h-4 text-college-primary" />
                                <span>Max {event.maxParticipants} participants</span>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              {isPastEvent && galleryImages.length > 0 && (
                                <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                                  <Image className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm font-medium text-purple-600">
                                    {galleryImages.length} Photo{galleryImages.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              )}
                            </div>
                            <Link
                              to={`/events/${event._id || event.id}`}
                              className="inline-flex items-center gap-2 px-6 py-2 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium"
                            >
                              {isPastEvent && galleryImages.length > 0 ? 'View Gallery' : 'View Details'}
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Indicator */}
        {filteredEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center gap-4 text-sm text-gray-500">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="font-medium">You've reached the end</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent via-gray-300 to-transparent"></div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
