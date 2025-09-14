import { useState, useCallback, useRef } from 'react';
import { getEventGalleryImages } from '../services/eventGalleryService';

/**
 * Custom hook for managing event gallery loading with optimization
 */
export const useEventGallery = () => {
  const [eventGalleries, setEventGalleries] = useState({});
  const [loadingGalleries, setLoadingGalleries] = useState(new Set());
  const galleryLoadedEvents = useRef(new Set());
  const galleryRequestQueue = useRef(new Map());

  const loadEventGallery = useCallback(async (eventId) => {
    // Skip if already loaded, loading, or queued
    if (galleryLoadedEvents.current.has(eventId) || 
        loadingGalleries.has(eventId) || 
        galleryRequestQueue.current.has(eventId)) {
      return;
    }

    try {
      // Mark as being loaded
      galleryLoadedEvents.current.add(eventId);
      setLoadingGalleries(prev => new Set(prev).add(eventId));
      
      const galleryImages = await getEventGalleryImages(eventId);
      
      if (galleryImages && galleryImages.length > 0) {
        setEventGalleries(prev => ({
          ...prev,
          [eventId]: galleryImages.slice(0, 3) // Show first 3 images
        }));
      }
    } catch (error) {
      console.warn(`Could not load gallery for event ${eventId}:`, error);
      // Remove from loaded set if failed so it can be retried
      galleryLoadedEvents.current.delete(eventId);
    } finally {
      setLoadingGalleries(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      galleryRequestQueue.current.delete(eventId);
    }
  }, [loadingGalleries]);

  const loadGalleriesForEvents = useCallback(async (events, maxEvents = 10) => {
    // Filter for past events and limit
    const eventsToLoad = events
      .slice(0, maxEvents)
      .filter(event => !galleryLoadedEvents.current.has(event.id) && 
                      !loadingGalleries.has(event.id));

    // Batch load galleries (but limit concurrent requests)
    const batchSize = 3;
    for (let i = 0; i < eventsToLoad.length; i += batchSize) {
      const batch = eventsToLoad.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map(event => loadEventGallery(event.id))
      );
      
      // Small delay between batches to prevent overwhelming the server
      if (i + batchSize < eventsToLoad.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }, [loadEventGallery, loadingGalleries]);

  const resetGalleries = useCallback(() => {
    setEventGalleries({});
    setLoadingGalleries(new Set());
    galleryLoadedEvents.current.clear();
    galleryRequestQueue.current.clear();
  }, []);

  return {
    eventGalleries,
    loadingGalleries,
    loadGalleriesForEvents,
    resetGalleries,
    isGalleryLoaded: (eventId) => galleryLoadedEvents.current.has(eventId),
    isGalleryLoading: (eventId) => loadingGalleries.has(eventId)
  };
};
