import { Request, Response } from 'express';
import { avatarService } from '../services/avatarService';
import path from 'path';
import fs from 'fs';

/**
 * Controller for avatar-related routes
 */
export const avatarController = {
  /**
   * Generate a 3D avatar from an uploaded photo
   * @route POST /api/avatar/generate
   */
  generateAvatar: async (req: Request, res: Response) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'No photo uploaded' 
        });
      }
      
      // Get file path from multer
      const photoPath = req.file.path;
      
      // Generate avatar using the avatar service
      const avatar = await avatarService.generateAvatar(photoPath);
      
      // Return the generated avatar data
      return res.status(201).json(avatar);
    } catch (error: any) {
      console.error('Error generating avatar:', error);
      
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate avatar',
        error: error.message
      });
    }
  },
  
  /**
   * Get avatar by ID
   * @route GET /api/avatar/:id
   */
  getAvatar: async (req: Request, res: Response) => {
    try {
      const avatarId = req.params.id;
      
      // Get avatar from service
      const avatar = await avatarService.getAvatar(avatarId);
      
      if (!avatar) {
        return res.status(404).json({ 
          success: false, 
          message: 'Avatar not found' 
        });
      }
      
      // Return the avatar data
      return res.status(200).json(avatar);
    } catch (error: any) {
      console.error('Error fetching avatar:', error);
      
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch avatar',
        error: error.message
      });
    }
  },
  
  /**
   * Serve avatar mesh file
   * @route GET /uploads/:filename
   * Note: This is usually handled by static file middleware,
   * but included here for completeness
   */
  serveAvatarFile: (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream'; // Default
    
    if (ext === '.glb') {
      contentType = 'model/gltf-binary';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    }
    
    // Set content type and send file
    res.setHeader('Content-Type', contentType);
    res.sendFile(filePath);
  },
};

export default avatarController; 