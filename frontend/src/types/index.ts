// Avatar types
export interface Avatar {
  id: string;
  meshUrl: string;
  textureUrl: string;
  createdAt: string;
}

// Clothing types
export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  description: string;
  price: number;
  sizes: Size[];
  colors: string[];
  meshUrl: string;
  textureUrl: string;
  thumbnailUrl: string;
  brandName: string;
  affiliateLink: string;
}

export type ClothingCategory = 
  | 'tops' 
  | 'bottoms' 
  | 'dresses' 
  | 'outerwear' 
  | 'footwear' 
  | 'accessories' 
  | 'hijabs' 
  | 'scarves';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

// Cart and Favorites
export interface CartItem {
  itemId: string;
  quantity: number;
  size: Size;
  color: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface FavoriteItem {
  itemId: string;
  addedAt: string;
}

export interface Favorites {
  items: FavoriteItem[];
}

// Chatbot
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  suggestions?: ClothingItem[];
}

// Size Estimation
export interface UserMeasurements {
  height?: number; // in cm
  weight?: number; // in kg
  bust?: number; // in cm
  waist?: number; // in cm
  hips?: number; // in cm
  inseam?: number; // in cm
  shoulderWidth?: number; // in cm
}

export interface SizeRecommendation {
  category: ClothingCategory;
  recommendedSize: Size;
  confidence: number; // 0-1
}

// 3D Avatar
export interface AvatarCustomization {
  pose: string;
  skinTone?: string;
  hairStyle?: string;
} 