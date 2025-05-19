import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { avatarService } from '../services/api';

const PhotoUploader: React.FC = () => {
  const { dispatch } = useAppContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB.');
      return;
    }

    setError('');
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle file upload and avatar generation
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    setIsUploading(true);
    setError('');
    dispatch({ type: 'SET_PROCESSING_AVATAR', payload: true });

    try {
      const avatar = await avatarService.generateAvatar(selectedFile);
      dispatch({ type: 'SET_AVATAR', payload: avatar });
    } catch (err) {
      setError('Failed to generate avatar. Please try again.');
      console.error('Avatar generation error:', err);
    } finally {
      setIsUploading(false);
      dispatch({ type: 'SET_PROCESSING_AVATAR', payload: false });
    }
  };

  // Handle capture from camera (mobile)
  const handleCaptureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Your 3D Avatar</h2>
      
      <div className="mb-4">
        <p className="text-gray-600 text-sm mb-2">
          Upload a full-body photo with good lighting for best results
        </p>
        
        <div className="flex flex-col items-center space-y-4">
          {/* Preview section */}
          {preview ? (
            <div className="relative w-full max-w-sm overflow-hidden rounded-lg">
              <img src={preview} alt="Preview" className="w-full h-auto object-cover" />
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreview('');
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                aria-label="Remove photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <div 
              onClick={handleCaptureClick}
              className="w-full max-w-sm h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Click to upload or capture a photo</p>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
            aria-label="Upload photo"
          />
          
          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`w-full max-w-sm btn ${
              !selectedFile || isUploading ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary'
            }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Avatar...
              </div>
            ) : (
              'Generate 3D Avatar'
            )}
          </button>
          
          {/* Error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default PhotoUploader; 