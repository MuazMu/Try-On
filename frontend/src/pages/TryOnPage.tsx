import React from 'react';
import AvatarViewer from '../components/AvatarViewer';
import ClothingSelector from '../components/ClothingSelector';
import PhotoUploader from '../components/PhotoUploader';
import SizeEstimation from '../components/SizeEstimation';
import Chatbot from '../components/Chatbot';
import { useAppContext } from '../context/AppContext';

const TryOnPage: React.FC = () => {
  const { state } = useAppContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Virtual Try-On</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Photo upload and size estimation */}
        <div className="lg:col-span-1 space-y-6">
          {!state.avatar && <PhotoUploader />}
          
          {state.avatar && <SizeEstimation />}
          
          {state.isProcessingAvatar && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <svg className="animate-spin h-10 w-10 mx-auto text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-700">Generating your 3D avatar...</p>
              <p className="text-gray-500 text-sm mt-2">This may take up to 30 seconds</p>
            </div>
          )}
        </div>
        
        {/* Middle column - 3D avatar viewer */}
        <div className="lg:col-span-1 h-[600px]">
          <AvatarViewer />
        </div>
        
        {/* Right column - Clothing selector */}
        <div className="lg:col-span-1 h-[600px]">
          <ClothingSelector />
        </div>
      </div>
      
      {/* Chatbot floating button */}
      <Chatbot />
    </div>
  );
};

export default TryOnPage; 