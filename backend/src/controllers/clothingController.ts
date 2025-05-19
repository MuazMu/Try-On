import { Request, Response } from 'express';
import { clothingService } from '../services/clothingService';

/**
 * Controller for clothing-related routes
 */
export const clothingController = {
  /**
   * Get all clothing items
   * @route GET /api/clothing
   */
  getAllClothing: async (req: Request, res: Response) => {
    try {
      const clothingItems = await clothingService.getAllClothing();
      
      return res.status(200).json(clothingItems);
    } catch (error: any) {
      console.error('Error fetching clothing items:', error);
      
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch clothing items',
        error: error.message
      });
    }
  },
  
  /**
   * Get clothing items by category
   * @route GET /api/clothing/category/:category
   */
  getClothingByCategory: async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      
      // Validate category
      if (!category) {
        return res.status(400).json({ 
          success: false, 
          message: 'Category is required' 
        });
      }
      
      const clothingItems = await clothingService.getClothingByCategory(category);
      
      return res.status(200).json(clothingItems);
    } catch (error: any) {
      console.error('Error fetching clothing by category:', error);
      
      // Check if it's a validation error
      if (error.message.includes('Invalid category')) {
        return res.status(400).json({ 
          success: false, 
          message: error.message
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch clothing items',
        error: error.message
      });
    }
  },
  
  /**
   * Get a single clothing item by ID
   * @route GET /api/clothing/:id
   */
  getClothingItem: async (req: Request, res: Response) => {
    try {
      const itemId = req.params.id;
      
      if (!itemId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Item ID is required' 
        });
      }
      
      const clothingItem = await clothingService.getClothingItem(itemId);
      
      return res.status(200).json(clothingItem);
    } catch (error: any) {
      console.error('Error fetching clothing item:', error);
      
      // Check if it's a not found error
      if (error.message.includes('not found')) {
        return res.status(404).json({ 
          success: false, 
          message: 'Clothing item not found'
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch clothing item',
        error: error.message
      });
    }
  },
  
  /**
   * Search for clothing items
   * @route GET /api/clothing/search
   */
  searchClothing: async (req: Request, res: Response) => {
    try {
      const { category, query } = req.query;
      
      if (!query && !category) {
        return res.status(400).json({ 
          success: false, 
          message: 'At least one search parameter (category or query) is required' 
        });
      }
      
      const clothingItems = await clothingService.searchClothing(
        category as string, 
        query as string
      );
      
      return res.status(200).json(clothingItems);
    } catch (error: any) {
      console.error('Error searching clothing items:', error);
      
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to search clothing items',
        error: error.message
      });
    }
  },
};

export default clothingController; 