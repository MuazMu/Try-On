export interface Avatar {
  id: string;
  meshUrl: string;
  textureUrl: string;
  createdAt: string;
  measurements?: UserMeasurements;
}

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

export interface ChatResponse {
  id: string;
  text: string;
  sender: 'bot';
  timestamp: string;
  suggestions?: ClothingItem[];
} 