import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { chatService } from '../services/api';
import { ChatMessage, ClothingItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

const Chatbot: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      text: 'Hello! I can help you find the perfect outfit. What are you looking for today?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Handle sending a message
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Get the current items the user has selected
    const currentItems = Object.values(state.selectedClothing).map((item) => item.id);
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: uuidv4(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    try {
      // Send message to AI
      const botResponse = await chatService.sendMessage(inputText, currentItems);
      setMessages((prev) => [...prev, botResponse]);
      
      // If the AI suggested items, enable trying them on
      if (botResponse.suggestions && botResponse.suggestions.length > 0) {
        // The suggestions will be available in the message
      }
    } catch (err) {
      console.error('Error sending message to chatbot:', err);
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: 'Sorry, I encountered an error. Please try again later.',
          sender: 'bot',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle trying on a suggested item
  const handleTrySuggestion = (item: ClothingItem) => {
    dispatch({
      type: 'SET_CLOTHING_ITEM',
      payload: { category: item.category, item },
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-10">
      {/* Chat bubble button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'
        } rounded-full p-4 text-white shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-96">
          {/* Chat header */}
          <div className="bg-primary text-white p-3 flex justify-between items-center">
            <h3 className="font-medium">Style Assistant</h3>
            <div className="text-xs">Powered by Gemini AI</div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${
                  message.sender === 'user' ? 'ml-auto bg-primary text-white' : 'mr-auto bg-gray-200 text-gray-800'
                } rounded-lg p-2 max-w-[80%]`}
              >
                <p className="text-sm">{message.text}</p>
                
                {/* Suggestions from bot */}
                {message.sender === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs font-medium">Suggestions:</p>
                    {message.suggestions.map((item) => (
                      <div key={item.id} className="bg-white rounded p-2 text-gray-800 text-xs">
                        <div className="flex items-center space-x-2">
                          <img src={item.thumbnailUrl} alt={item.name} className="w-10 h-10 object-cover rounded" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-500">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleTrySuggestion(item)}
                          className="mt-1 w-full bg-primary text-white text-xs py-1 rounded hover:bg-primary-dark transition-colors"
                        >
                          Try On
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="bg-gray-200 text-gray-800 rounded-lg p-2 max-w-[80%] mr-auto">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="border-t p-2 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask me anything about fashion..."
              className="flex-1 border rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className={`ml-2 p-2 rounded-full ${
                !inputText.trim() || isTyping ? 'bg-gray-300 text-gray-500' : 'bg-primary text-white hover:bg-primary-dark'
              } transition-colors`}
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot; 