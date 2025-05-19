import { ClothingItem, ClothingCategory } from '../types';
import path from 'path';
import fs from 'fs';

// In a real application, this would come from a database
// For this demo, we use a mock catalog stored in memory
const clothingCatalogPath = path.join(__dirname, '../utils/mockData.json');
let clothingCatalog: ClothingItem[] = [];

// Load mock catalog when the service is initialized
try {
  const mockDataRaw = fs.readFileSync(clothingCatalogPath, 'utf-8');
  clothingCatalog = JSON.parse(mockDataRaw);
} catch (error) {
  console.error('Failed to load mock catalog:', error);
  // Initialize with empty array if file reading fails
  clothingCatalog = [];
}

/**
 * Service for handling clothing catalog operations
 */
export const clothingService = {
  /**
   * Get all clothing items
   * @returns Array of all clothing items
   */
  getAllClothing: async (): Promise<ClothingItem[]> => {
    return clothingCatalog;
  },
  
  /**
   * Get clothing items by category
   * @param category The clothing category to filter by
   * @returns Array of clothing items in the category
   */
  getClothingByCategory: async (category: string): Promise<ClothingItem[]> => {
    // Validate category
    if (!isValidCategory(category as ClothingCategory)) {
      throw new Error(`Invalid category: ${category}`);
    }
    
    return clothingCatalog.filter((item) => item.category === category);
  },
  
  /**
   * Get a single clothing item by ID
   * @param itemId The clothing item ID
   * @returns The clothing item if found
   */
  getClothingItem: async (itemId: string): Promise<ClothingItem> => {
    const item = clothingCatalog.find((item) => item.id === itemId);
    
    if (!item) {
      throw new Error(`Clothing item not found: ${itemId}`);
    }
    
    return item;
  },
  
  /**
   * Search for clothing items by category and description
   * @param category The clothing category
   * @param description Text to search for in the name or description
   * @returns Array of matching clothing items
   */
  searchClothing: async (category: string, description: string): Promise<ClothingItem[]> => {
    let results = clothingCatalog;
    
    // Filter by category if provided and valid
    if (category && isValidCategory(category as ClothingCategory)) {
      results = results.filter((item) => item.category === category);
    }
    
    // Filter by description search terms
    if (description) {
      const searchTerms = description.toLowerCase().split(' ');
      
      results = results.filter((item) => {
        const itemText = `${item.name} ${item.description} ${item.brandName}`.toLowerCase();
        
        // Check if all search terms are present in the item text
        return searchTerms.every((term) => itemText.includes(term));
      });
    }
    
    return results;
  },
};

/**
 * Validate if a string is a valid clothing category
 * @param category The category to validate
 * @returns True if the category is valid
 */
function isValidCategory(category: ClothingCategory): boolean {
  const validCategories: ClothingCategory[] = [
    'tops', 'bottoms', 'dresses', 'outerwear', 
    'footwear', 'accessories', 'hijabs', 'scarves'
  ];
  
  return validCategories.includes(category);
}

export default clothingService; 