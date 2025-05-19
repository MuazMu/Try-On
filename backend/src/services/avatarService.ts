import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Avatar, UserMeasurements } from '../types';

// Load environment variables for API keys and endpoints
const RODIN_API_KEY = process.env.RODIN_API_KEY || 'demo_key'; // Replace with actual key in production
const RODIN_API_ENDPOINT = process.env.RODIN_API_ENDPOINT || 'https://api.rodin.ai/v1/avatar/generate';

/**
 * Service for handling 3D avatar generation using Rodin AI
 */
export const avatarService = {
  /**
   * Generate a 3D avatar from a user photo
   * @param photoPath Path to the uploaded photo file
   * @returns Generated avatar with mesh and texture URLs
   */
  generateAvatar: async (photoPath: string): Promise<Avatar> => {
    try {
      // Read the photo file
      const photoBuffer = fs.readFileSync(photoPath);
      
      // Create form data for API request
      const formData = new FormData();
      formData.append('image', new Blob([photoBuffer]), 'user_photo.jpg');
      formData.append('model_type', 'full_body');
      formData.append('include_measurements', 'true');
      
      // Send request to Rodin AI API
      const response = await axios.post(RODIN_API_ENDPOINT, formData, {
        headers: {
          'Authorization': `Bearer ${RODIN_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Handle response data
      const { mesh_url, texture_url, measurements } = response.data;
      
      // Download mesh and texture files to serve locally
      const avatarId = uuidv4();
      const meshFilePath = path.join(__dirname, '../../uploads', `${avatarId}_mesh.glb`);
      const textureFilePath = path.join(__dirname, '../../uploads', `${avatarId}_texture.jpg`);
      
      // Download mesh file
      const meshResponse = await axios.get(mesh_url, { responseType: 'arraybuffer' });
      fs.writeFileSync(meshFilePath, Buffer.from(meshResponse.data));
      
      // Download texture file
      const textureResponse = await axios.get(texture_url, { responseType: 'arraybuffer' });
      fs.writeFileSync(textureFilePath, Buffer.from(textureResponse.data));
      
      // Create avatar object with local file paths
      const avatar: Avatar = {
        id: avatarId,
        meshUrl: `/uploads/${avatarId}_mesh.glb`,
        textureUrl: `/uploads/${avatarId}_texture.jpg`,
        createdAt: new Date().toISOString(),
        measurements: parseMeasurements(measurements),
      };
      
      // Clean up the uploaded photo file
      fs.unlinkSync(photoPath);
      
      return avatar;
    } catch (error) {
      console.error('Error in avatar generation:', error);
      throw new Error('Failed to generate 3D avatar');
    }
  },
  
  /**
   * Get avatar by ID
   * @param avatarId The avatar ID
   * @returns Avatar object if found
   */
  getAvatar: async (avatarId: string): Promise<Avatar | null> => {
    try {
      // In a real app, this would fetch from a database
      // For demo, we check if the files exist in the uploads directory
      const meshFilePath = path.join(__dirname, '../../uploads', `${avatarId}_mesh.glb`);
      const textureFilePath = path.join(__dirname, '../../uploads', `${avatarId}_texture.jpg`);
      
      if (!fs.existsSync(meshFilePath) || !fs.existsSync(textureFilePath)) {
        return null;
      }
      
      // Create avatar object with local file paths
      const avatar: Avatar = {
        id: avatarId,
        meshUrl: `/uploads/${avatarId}_mesh.glb`,
        textureUrl: `/uploads/${avatarId}_texture.jpg`,
        createdAt: new Date().toISOString(), // This would come from DB in a real app
      };
      
      return avatar;
    } catch (error) {
      console.error('Error fetching avatar:', error);
      return null;
    }
  },
};

/**
 * Parse measurements data from the API response
 * @param measurementsData Raw measurements data from API
 * @returns Structured user measurements object
 */
function parseMeasurements(measurementsData: any): UserMeasurements {
  // In a real implementation, this would properly parse the measurements
  // from Rodin AI's response format
  const measurements: UserMeasurements = {};
  
  if (measurementsData) {
    if (measurementsData.height) measurements.height = measurementsData.height;
    if (measurementsData.bust) measurements.bust = measurementsData.bust;
    if (measurementsData.waist) measurements.waist = measurementsData.waist;
    if (measurementsData.hips) measurements.hips = measurementsData.hips;
    if (measurementsData.shoulder_width) measurements.shoulderWidth = measurementsData.shoulder_width;
    if (measurementsData.inseam) measurements.inseam = measurementsData.inseam;
  }
  
  return measurements;
}

export default avatarService; 