import { Request, Response } from 'express';
import { sizeService } from '../services/sizeService';

/**
 * Controller for size recommendation routes
 */
export const sizeController = {
  /**
   * Get size recommendations based on avatar
   * @route GET /api/size/recommendations/:avatarId
   */
  getSizeRecommendations: async (req: Request, res: Response) => {
    try {
      const avatarId = req.params.avatarId;
      
      if (!avatarId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Avatar ID is required' 
        });
      }
      
      const recommendations = await sizeService.getSizeRecommendations(avatarId);
      
      return res.status(200).json(recommendations);
    } catch (error: any) {
      console.error('Error getting size recommendations:', error);
      
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get size recommendations',
        error: error.message
      });
    }
  },
};

export default sizeController; 