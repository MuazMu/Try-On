import axios from 'axios'; 
import { v4 as uuidv4 } from 'uuid';
import { ChatResponse, ClothingItem } from '../types';
import { clothingService } from './clothingService';

// Load environment variables for API keys and endpoints
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'demo_key'; // Replace with actual key in production
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Gemini model ID on OpenRouter
const MODEL_ID = 'google/gemini-pro-2.5-experimental';

/**
 * Service for handling chatbot interactions using Gemini AI via OpenRouter
 */
export const chatService = {
  /**
   * Send a message to the chatbot and get a response
   * @param message User's message
   * @param currentItems IDs of clothing items the user has selected (for context)
   * @returns ChatResponse with text and possibly item suggestions
   */
  sendMessage: async (message: string, currentItems: string[] = []): Promise<ChatResponse> => {
    try {
      // Get details of current items for context
      let currentItemsContext = '';
      if (currentItems.length > 0) {
        const itemDetails = await Promise.all(
          currentItems.map(async (itemId) => {
            try {
              const item = await clothingService.getClothingItem(itemId);
              return `- ${item.name} (${item.category}, color: ${item.colors[0]})`;
            } catch (err) {
              return null;
            }
          })
        );
        
        const validItemDetails = itemDetails.filter(Boolean);
        if (validItemDetails.length > 0) {
          currentItemsContext = `\nCurrently selected items:\n${validItemDetails.join('\n')}`;
        }
      }
      
      // Create the system prompt with fashion expertise context
      const systemPrompt = `You are a helpful fashion assistant for a virtual try-on platform. 
Your goal is to provide helpful fashion advice, suggest matching items, and answer questions about style.
${currentItemsContext}

When suggesting items, please respond in the following format:
1. Provide your helpful response to the user's query
2. If you're suggesting specific items, format them clearly using the keywords "ITEM_SUGGESTION:" before each item, followed by the category and a brief description.

Example:
"That's a great question! Based on your black pants, I'd recommend a few options:
ITEM_SUGGESTION: tops, A white cotton button-down shirt
ITEM_SUGGESTION: tops, A light blue slim-fit t-shirt
ITEM_SUGGESTION: accessories, A silver chain necklace"

Always be polite, helpful, and considerate. Focus on clothing recommendations and style advice.`;

      // Send request to OpenRouter API
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: MODEL_ID,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': `${process.env.API_URL || 'http://localhost:5000'}`,
            'X-Title': 'Virtual Try-On Platform',
          },
        }
      );
      
      // Parse response
      const aiResponse = response.data.choices[0].message.content;
      
      // Extract item suggestions
      const suggestions = await parseItemSuggestions(aiResponse);
      
      // Create and return chat response
      const chatResponse: ChatResponse = {
        id: uuidv4(),
        text: cleanResponseText(aiResponse),
        sender: 'bot',
        timestamp: new Date().toISOString(),
        suggestions: suggestions,
      };
      
      return chatResponse;
    } catch (error) {
      console.error('Error in chat service:', error);
      throw new Error('Failed to get response from chatbot');
    }
  },
};
/**
 * Parse item suggestions from AI response
 * @param responseText The full text response from the AI
 * @returns Array of clothing items suggested
 */
async function parseItemSuggestions(responseText: string): Promise<ClothingItem[]> {
  try {
    const suggestions: ClothingItem[] = [];
    const suggestionRegex = /ITEM_SUGGESTION:\s*([\w]+),\s*(.+)/g;
    let match;
    
    // Find all suggestions in the response
    while ((match = suggestionRegex.exec(responseText)) !== null) {
      const category = match[1].trim();
      const description = match[2].trim();
      
      // Search the catalog for matching items
      // In a real app, this would use more sophisticated matching
      const matchingItems = await clothingService.searchClothing(category, description);
      
      if (matchingItems.length > 0) {
        // Add the first matching item (or more sophisticated selection in a real app)
        suggestions.push(matchingItems[0]);
      }
    }
    
    return suggestions;
  } catch (error) {
    console.error('Error parsing item suggestions:', error);
    return [];
  }
}

/**
 * Clean the response text by removing the ITEM_SUGGESTION markers
 * @param responseText The full text response from the AI
 * @returns Cleaned response text
 */
function cleanResponseText(responseText: string): string {
  // Remove the ITEM_SUGGESTION lines
  return responseText.replace(/ITEM_SUGGESTION:.+(\n|$)/g, '').trim();
}

export default chatService; 