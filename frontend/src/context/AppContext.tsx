import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Avatar, ClothingItem, Cart, Favorites, CartItem, FavoriteItem } from '../types';

// Define the app state interface
interface AppState {
  avatar: Avatar | null;
  selectedClothing: Record<string, ClothingItem>; // Key is category
  cart: Cart;
  favorites: Favorites;
  isProcessingAvatar: boolean;
  activeCategory: string | null;
}

// Define action types
type AppAction =
  | { type: 'SET_AVATAR'; payload: Avatar }
  | { type: 'SET_CLOTHING_ITEM'; payload: { category: string; item: ClothingItem } }
  | { type: 'REMOVE_CLOTHING_ITEM'; payload: string } // category
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string } // itemId
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_FAVORITES'; payload: FavoriteItem }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string } // itemId
  | { type: 'SET_PROCESSING_AVATAR'; payload: boolean }
  | { type: 'SET_ACTIVE_CATEGORY'; payload: string | null };

// Define the initial state
const initialState: AppState = {
  avatar: null,
  selectedClothing: {},
  cart: { items: [], total: 0 },
  favorites: { items: [] },
  isProcessingAvatar: false,
  activeCategory: null,
};

// Create the context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_AVATAR':
      return { ...state, avatar: action.payload };
    case 'SET_CLOTHING_ITEM':
      return {
        ...state,
        selectedClothing: {
          ...state.selectedClothing,
          [action.payload.category]: action.payload.item,
        },
      };
    case 'REMOVE_CLOTHING_ITEM': {
      const newSelectedClothing = { ...state.selectedClothing };
      delete newSelectedClothing[action.payload];
      return { ...state, selectedClothing: newSelectedClothing };
    }
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cart.items.findIndex(
        (item) => item.itemId === action.payload.itemId
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...state.cart.items];
        newItems[existingItemIndex] = action.payload;
      } else {
        newItems = [...state.cart.items, action.payload];
      }

      // Calculate total (assuming we have the price in a lookup somewhere)
      // For simplicity, we're not calculating the total here
      return {
        ...state,
        cart: {
          items: newItems,
          total: state.cart.total,
        },
      };
    }
    case 'REMOVE_FROM_CART': {
      const newItems = state.cart.items.filter((item) => item.itemId !== action.payload);
      return {
        ...state,
        cart: {
          items: newItems,
          total: state.cart.total,
        },
      };
    }
    case 'CLEAR_CART':
      return { ...state, cart: { items: [], total: 0 } };
    case 'ADD_TO_FAVORITES': {
      const existingItem = state.favorites.items.find(
        (item) => item.itemId === action.payload.itemId
      );
      if (existingItem) return state;
      return {
        ...state,
        favorites: {
          items: [...state.favorites.items, action.payload],
        },
      };
    }
    case 'REMOVE_FROM_FAVORITES': {
      const newItems = state.favorites.items.filter((item) => item.itemId !== action.payload);
      return {
        ...state,
        favorites: {
          items: newItems,
        },
      };
    }
    case 'SET_PROCESSING_AVATAR':
      return { ...state, isProcessingAvatar: action.payload };
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.payload };
    default:
      return state;
  }
};

// Create provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useAppContext = () => useContext(AppContext);

export default AppContext; 