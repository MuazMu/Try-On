import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { clothingService } from '../services/api';
import { ClothingItem } from '../types';

const Favorites: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [favoriteItems, setFavoriteItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Load favorite items when they change
  useEffect(() => {
    const fetchFavoriteItems = async () => {
      if (state.favorites.items.length === 0) {
        setFavoriteItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        // Fetch full details for each favorite item
        const itemPromises = state.favorites.items.map(async (favItem) => {
          return await clothingService.getClothingItem(favItem.itemId);
        });

        const items = await Promise.all(itemPromises);
        setFavoriteItems(items);
      } catch (err) {
        console.error('Error fetching favorite items:', err);
        setError('Failed to load favorite items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteItems();
  }, [state.favorites.items]);

  // Remove item from favorites
  const handleRemoveFavorite = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: itemId });
  };

  // Try on a favorite item
  const handleTryOn = (item: ClothingItem) => {
    dispatch({
      type: 'SET_CLOTHING_ITEM',
      payload: { category: item.category, item },
    });
    setIsOpen(false); // Close favorites panel after selecting an item
  };

  return (
    <div className="relative">
      {/* Favorites button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Favorite items"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {state.favorites.items.length > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-red-500 text-white">
            {state.favorites.items.length}
          </span>
        )}
      </button>

      {/* Favorites dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10 overflow-hidden">
          <div className="p-3 border-b bg-gray-50">
            <h3 className="font-medium">Your Favorites ({state.favorites.items.length})</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <svg className="animate-spin h-5 w-5 mx-auto text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : favoriteItems.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No favorite items yet</div>
            ) : (
              <div>
                {favoriteItems.map((item) => (
                  <div key={item.id} className="p-3 border-b flex">
                    <img src={item.thumbnailUrl} alt={item.name} className="w-16 h-16 rounded object-cover" />
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-gray-500">{item.brandName}</p>
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => handleTryOn(item)}
                          className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary-dark transition-colors"
                        >
                          Try On
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(item.id)}
                          className="text-red-500 text-xs hover:text-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-gray-50 text-center">
            <p className="text-xs text-gray-500">
              Favorites will be lost when you leave the site
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites; 