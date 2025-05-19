import axios from 'axios';
import { ClothingItem, Avatar, SizeRecommendation, ChatMessage } from '../types';

// Base URL for the API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Avatar API calls
export const avatarService = {
  // Generate avatar from photo
  generateAvatar: async (photoFile: File): Promise<Avatar> => {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await api.post<Avatar>('/avatar/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get avatar by ID
  getAvatar: async (avatarId: string): Promise<Avatar> => {
    const response = await api.get<Avatar>(`/avatar/${avatarId}`);
    return response.data;
  },
};

// Clothing API calls
export const clothingService = {
  // Get all clothing items
  getAllClothing: async (): Promise<ClothingItem[]> => {
    const response = await api.get<ClothingItem[]>('/clothing');
    return response.data;
  },

  // Get clothing items by category
  getClothingByCategory: async (category: string): Promise<ClothingItem[]> => {
    const response = await api.get<ClothingItem[]>(`/clothing/category/${category}`);
    return response.data;
  },

  // Get a single clothing item by ID
  getClothingItem: async (itemId: string): Promise<ClothingItem> => {
    const response = await api.get<ClothingItem>(`/clothing/${itemId}`);
    return response.data;
  },
};

// Size estimation API calls
export const sizeService = {
  // Get size recommendations based on avatar
  getSizeRecommendations: async (avatarId: string): Promise<SizeRecommendation[]> => {
    const response = await api.get<SizeRecommendation[]>(`/size/recommendations/${avatarId}`);
    return response.data;
  },
};

// Chatbot API calls
export const chatService = {
  // Send a message to the chatbot
  sendMessage: async (message: string, currentItems?: string[]): Promise<ChatMessage> => {
    const response = await api.post<ChatMessage>('/chat', {
      message,
      currentItems,
    });
    return response.data;
  },
};

export default {
  avatarService,
  clothingService,
  sizeService,
  chatService,
}; 