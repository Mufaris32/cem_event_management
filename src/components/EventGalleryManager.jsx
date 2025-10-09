import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Plus,
  Save,
  Camera,
  Grid,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import LazyImage from './LazyImage';
import { 
  getEventGalleryImages, 
  uploadEventGalleryImages, 
  deleteEventGalleryImage,
  updateEventGalleryImageCaption
} from '../services/eventGalleryService';

export default function EventGalleryManager({ eventId, eventTitle, isAdmin = false }) {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [editingCaption, setEditingCaption] = useState(null);
  const [tempCaption, setTempCaption] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const loadGalleryImages = useCallback(async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      const images = await getEventGalleryImages(eventId);
      setGalleryImages(images);
    } catch (err) {
      console.error('Error loading gallery images:', err);
      setError('Failed to load gallery images');
      setGalleryImages([]);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadGalleryImages();
  }, [loadGalleryImages]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      setError('Some files were not images and have been filtered out');
    }
    
    if (validFiles.length > 10) {
      setError('Maximum 10 images can be uploaded at once');
      return;
    }

    setSelectedFiles(validFiles);
    setCaptions(new Array(validFiles.length).fill(''));
    setError(null);
  };

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) {
      setError('Please select images to upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const uploadedImages = await uploadEventGalleryImages(eventId, selectedFiles, captions);
      
      setShowUploadModal(false);
      setSelectedFiles([]);
      setCaptions([]);
      
      // Reload gallery images after successful upload
      await loadGalleryImages();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [eventId, selectedFiles, captions, loadGalleryImages]);

  const handleDeleteImage = useCallback(async (imageId) => {
    try {
      await deleteEventGalleryImage(eventId, imageId);
      setDeleteConfirm(null);
      // Reload gallery images after successful deletion
      await loadGalleryImages();
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image. Please try again.');
    }
  }, [eventId, loadGalleryImages]);

  const handleUpdateCaption = useCallback(async (imageId, newCaption) => {
    try {
      await updateEventGalleryImageCaption(eventId, imageId, newCaption);
      setEditingCaption(null);
      setTempCaption('');
      // Reload gallery images after successful update
      await loadGalleryImages();
    } catch (err) {
      console.error('Error updating caption:', err);
      setError('Failed to update caption');
    }
  }, [eventId, loadGalleryImages]);

  const startEditingCaption = (image) => {
    setEditingCaption(image._id || image.publicId);
    setTempCaption(image.caption || '');
  };

  const cancelEditingCaption = () => {
    setEditingCaption(null);
    setTempCaption('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" text="Loading gallery..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-college-primary/10 rounded-lg flex items-center justify-center">
            <Camera className="w-5 h-5 text-college-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 font-serif">Event Gallery</h3>
            <p className="text-gray-600">
              {galleryImages.length} {galleryImages.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadGalleryImages}
            className="p-2 text-gray-600 hover:text-college-primary transition-colors rounded-lg hover:bg-gray-100"
            title="Refresh gallery"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Photos
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-800 font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Grid */}
      {galleryImages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium mb-2">No photos in gallery yet</p>
          {isAdmin ? (
            <p className="text-gray-400 text-sm mb-4">Upload photos to showcase this event</p>
          ) : (
            <p className="text-gray-400 text-sm">Photos will appear here once they are uploaded</p>
          )}
          {isAdmin && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium"
            >
              <Upload className="w-4 h-4" />
              Upload First Photos
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => {
            // Ensure we have a valid image object
            if (!image || !image.url) {
              console.warn('🚨 Invalid image object at index', index, image);
              return null;
            }
            
            return (
              <motion.div
                key={image._id || image.publicId || `img-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div 
                  className="relative aspect-square cursor-pointer" 
                  onClick={() => setSelectedImage(image.url)}
                >
                  <LazyImage
                    src={image.url}
                    alt={image.caption || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error('🖼️ Image failed to load:', image.url);
                      e.target.src = 'https://via.placeholder.com/400x400/e5e7eb/9ca3af?text=Image+Not+Found';
                    }}
                  />
                  
                  {/* Overlay with actions */}
                  {isAdmin && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingCaption(image);
                        }}
                        className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                        title="Edit caption"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(image);
                        }}
                        className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Caption */}
                <div className="p-4">
                  {editingCaption === (image._id || image.publicId) ? (
                    <div className="space-y-3">
                      <textarea
                        value={tempCaption}
                        onChange={(e) => setTempCaption(e.target.value)}
                        placeholder="Add a caption..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-college-primary focus:border-transparent"
                        rows="2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateCaption(image._id || image.publicId, tempCaption)}
                          className="flex items-center gap-1 px-3 py-1 bg-college-primary text-white rounded-lg hover:bg-college-primary/90 transition-colors text-sm font-medium"
                        >
                          <Save className="w-3 h-3" />
                          Save
                        </button>
                        <button
                          onClick={cancelEditingCaption}
                          className="px-3 py-1 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {image.caption || (isAdmin ? 'Click edit to add caption' : 'No caption')}
                      </p>
                      {image.uploadedAt && (
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(image.uploadedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          }).filter(Boolean)}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Upload Gallery Photos</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">Add photos to the event gallery</p>
              </div>

              <div className="p-6 space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Images (Max 10)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-college-primary transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <label htmlFor="gallery-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-1">Click to select images</p>
                      <p className="text-gray-400 text-sm">JPG, PNG, GIF up to 10MB each</p>
                    </label>
                  </div>
                </div>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Selected Images ({selectedFiles.length})</h4>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <textarea
                              value={captions[index]}
                              onChange={(e) => {
                                const newCaptions = [...captions];
                                newCaptions[index] = e.target.value;
                                setCaptions(newCaptions);
                              }}
                              placeholder="Add caption (optional)"
                              className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-college-primary focus:border-transparent"
                              rows="2"
                            />
                          </div>
                          <button
                            onClick={() => {
                              setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                              setCaptions(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || selectedFiles.length === 0}
                    className="flex-1 px-4 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <LoadingSpinner size="small" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Photos
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Photo</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete this photo? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteImage(deleteConfirm._id || deleteConfirm.publicId)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image View Modal */}
      <ImageView 
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
