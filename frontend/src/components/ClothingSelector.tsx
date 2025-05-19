import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { clothingService } from '../services/api';
import { ClothingItem, ClothingCategory } from '../types';

const categories: { id: ClothingCategory; label: string }[] = [
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'hijabs', label: 'Hijabs' },
  { id: 'scarves', label: 'Scarves' },
];

const ClothingSelector: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<ClothingCategory>('tops');
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Load clothing items when category changes
  useEffect(() => {
    const fetchClothingItems = async () => {
      setIsLoading(true);
      setError('');
      try {
        const items = await clothingService.getClothingByCategory(activeCategory);
        setClothingItems(items);
      } catch (err) {
        setError('Failed to load clothing items');
        console.error('Error fetching clothing items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClothingItems();
    dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: activeCategory });
  }, [activeCategory, dispatch]);

  // Handle trying on a clothing item
  const handleTryOn = (item: ClothingItem) => {
    dispatch({
      type: 'SET_CLOTHING_ITEM',
      payload: { category: item.category, item },
    });
  };

  // Handle adding an item to favorites
  const handleAddToFavorites = (itemId: string) => {
    dispatch({
      type: 'ADD_TO_FAVORITES',
      payload: { itemId, addedAt: new Date().toISOString() },
    });
  };

  // Handle adding an item to cart
  const handleAddToCart = (item: ClothingItem) => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const color = selectedColor || item.colors[0];

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        itemId: item.id,
        quantity: 1,
        size: selectedSize as any,
        color,
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Category tabs */}
      <div className="flex overflow-x-auto p-2 bg-gray-50 border-b">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 mr-2 rounded-md whitespace-nowrap text-sm transition-colors ${
              activeCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Clothing items grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : clothingItems.length === 0 ? (
          <div className="text-center text-gray-500 p-4">No items found in this category</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clothingItems.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                  <button
                    onClick={() => handleAddToFavorites(item.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors"
                    aria-label="Add to favorites"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.brandName}</p>
                  <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>

                  {/* Size selection */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Size:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-2 py-1 text-xs rounded border ${
                            selectedSize === size
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color selection */}
                  {item.colors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Color:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-6 h-6 rounded-full border-2 ${
                              selectedColor === color ? 'border-primary' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={`Select ${color} color`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => handleTryOn(item)}
                      className="flex-1 btn btn-primary text-sm"
                    >
                      Try On
                    </button>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 btn btn-secondary text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothingSelector; 