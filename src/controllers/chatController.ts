import { Request, Response } from 'express';
import { chatService } from '../services/chatService';

/**
 * Controller for chat-related routes
 */
export const chatController = {
  /**
   * Send a message to the chatbot
   * @route POST /api/chat
   */
  sendMessage: async (req: Request, res: Response) => {
    try {
      const { message, currentItems } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          success: false, 
          message: 'Message is required' 
        });
      }
      
      const chatResponse = await chatService.sendMessage(message, currentItems || []);
      
      return res.status(200).json(chatResponse);
    } catch (error: any) {
      console.error('Error sending message to chatbot:', error);
      
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to process message',
        error: error.message
      });
    }
  },
};

export default chatController; 