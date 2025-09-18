import React, { useState } from 'react';
import { uploadEventGalleryImages, getEventGalleryImages } from '../services/eventGalleryService';

const GalleryTestUpload = ({ eventId }) => {
  const [testResult, setTestResult] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleTestUpload = async () => {
    try {
      setUploading(true);
      setTestResult('Starting test upload...');

      // Create a test image (1x1 pixel PNG)
      const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      
      // Convert data URL to File object
      const response = await fetch(testImageData);
      const blob = await response.blob();
      const file = new File([blob], 'test-image.png', { type: 'image/png' });

      console.log('🧪 Test file created:', file);
      setTestResult(prev => prev + '\n✅ Test file created');

      // Upload the test image
      const result = await uploadEventGalleryImages(eventId, [file], ['Test image caption']);
      console.log('🧪 Upload result:', result);
      setTestResult(prev => prev + `\n✅ Upload completed: ${result.length} images`);

      // Verify by fetching gallery
      const galleryImages = await getEventGalleryImages(eventId);
      console.log('🧪 Gallery verification:', galleryImages);
      setTestResult(prev => prev + `\n✅ Gallery verification: ${galleryImages.length} total images`);

    } catch (error) {
      console.error('🧪 Test upload failed:', error);
      setTestResult(prev => prev + `\n❌ Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (!import.meta.env.DEV) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h4 className="font-bold text-yellow-800 mb-2">🧪 Gallery Upload Test (Dev Only)</h4>
      <button
        onClick={handleTestUpload}
        disabled={uploading}
        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
      >
        {uploading ? 'Testing...' : 'Test Upload'}
      </button>
      {testResult && (
        <pre className="mt-2 text-xs bg-white p-2 rounded border whitespace-pre-wrap">
          {testResult}
        </pre>
      )}
    </div>
  );
};

export default GalleryTestUpload;
