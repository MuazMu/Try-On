import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { sizeService } from '../services/api';
import { SizeRecommendation } from '../types';

const SizeEstimation: React.FC = () => {
  const { state } = useAppContext();
  const [recommendations, setRecommendations] = useState<SizeRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Fetch size recommendations when avatar changes
  useEffect(() => {
    if (!state.avatar || !isOpen) return;

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError('');

      try {
        const sizeRecs = await sizeService.getSizeRecommendations(state.avatar!.id);
        setRecommendations(sizeRecs);
      } catch (err) {
        console.error('Error fetching size recommendations:', err);
        setError('Failed to analyze size. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [state.avatar, isOpen]);

  // Get the confidence level label
  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.5) return 'Medium';
    return 'Low';
  };

  // Get the confidence level color
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!state.avatar) {
    return null; // Don't show size estimation if no avatar
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2 px-4 bg-white border rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex justify-between items-center"
      >
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium">Size Recommendations</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-3">
            Based on your avatar's dimensions, here are your estimated sizes:
          </p>

          {isLoading ? (
            <div className="py-6 flex justify-center">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="py-4 text-center text-red-500">{error}</div>
          ) : recommendations.length === 0 ? (
            <div className="py-4 text-center text-gray-500">No size recommendations available</div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.category} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium capitalize">{rec.category}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-600 mr-2">Confidence:</p>
                      <span className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                        {getConfidenceLabel(rec.confidence)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-primary bg-opacity-10 px-3 py-1 rounded-full">
                    <p className="text-primary font-bold text-lg">{rec.recommendedSize}</p>
                  </div>
                </div>
              ))}

              <div className="pt-2 text-xs text-gray-500">
                <p>
                  <strong>Note:</strong> These are estimated sizes based on your avatar. Actual fit may vary by brand and style.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SizeEstimation; 