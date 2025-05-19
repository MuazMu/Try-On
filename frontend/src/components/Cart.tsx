import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { clothingService } from '../services/api';
import { ClothingItem } from '../types';

const Cart: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [cartItems, setCartItems] = useState<(ClothingItem & { quantity: number; size: string; color: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Load full item details when cart items change
  useEffect(() => {
    const fetchCartItems = async () => {
      if (state.cart.items.length === 0) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        // Fetch full details for each item in cart
        const itemPromises = state.cart.items.map(async (cartItem) => {
          const item = await clothingService.getClothingItem(cartItem.itemId);
          return {
            ...item,
            quantity: cartItem.quantity,
            size: cartItem.size,
            color: cartItem.color,
          };
        });

        const items = await Promise.all(itemPromises);
        setCartItems(items);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError('Failed to load cart items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [state.cart.items]);

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Remove item from cart
  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  // Clear entire cart
  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Handle checkout (redirect to retailer)
  const handleCheckout = () => {
    // In a real app, we would redirect to checkout or affiliate links
    alert('This would redirect to retailer checkout pages with affiliate tracking');
  };

  return (
    <div className="relative">
      {/* Cart button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Shopping cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {state.cart.items.length > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-primary text-white">
            {state.cart.items.length}
          </span>
        )}
      </button>

      {/* Cart dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10 overflow-hidden">
          <div className="p-3 border-b bg-gray-50">
            <h3 className="font-medium">Your Cart ({state.cart.items.length})</h3>
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
            ) : cartItems.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Your cart is empty</div>
            ) : (
              <div>
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="p-3 border-b flex">
                    <img src={item.thumbnailUrl} alt={item.name} className="w-16 h-16 rounded object-cover" />
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-500">
                          Size: {item.size} | Color:{' '}
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color, verticalAlign: 'middle' }}
                          />
                        </p>
                        <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
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

          <div className="p-3 border-t bg-gray-50">
            <div className="flex justify-between mb-3">
              <span className="font-medium">Total:</span>
              <span className="font-medium">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleClearCart}
                className="btn btn-secondary flex-1 py-1 text-sm"
                disabled={cartItems.length === 0}
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="btn btn-primary flex-1 py-1 text-sm"
                disabled={cartItems.length === 0}
              >
                Checkout
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Items and cart data will be lost when you leave the site
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 