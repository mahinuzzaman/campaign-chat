import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { Message, ChatContainerProps } from '../types';
import ApiService from '../services/api';
import MessageBubble from './MessageBubble';

const ChatContainer: React.FC<ChatContainerProps> = ({ connectedSources }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message on component mount
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'system',
        content: 'Hello! I\'m your campaign assistant. Connect your data sources and tell me what kind of campaign you\'d like to create.',
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'system',
      content: 'Analyzing your request and generating campaign recommendations...',
      timestamp: new Date().toISOString(),
      isLoading: true,
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await ApiService.sendMessage({
        message: inputMessage,
        context: {
          connected_sources: connectedSources,
        },
      });

      // Remove loading message and add actual response
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => !msg.isLoading);
        const systemResponse: Message = {
          id: (Date.now() + 2).toString(),
          type: 'system',
          content: response.response,
          timestamp: new Date().toISOString(),
          campaigns: response.campaigns,
        };
        return [...filteredMessages, systemResponse];
      });
    } catch (error) {
      console.error('Error sending message:', error);

      // Remove loading message and add error response
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => !msg.isLoading);
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'system',
          content: 'Sorry, I encountered an error while processing your request. Please make sure the backend is running and try again.',
          timestamp: new Date().toISOString(),
        };
        return [...filteredMessages, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-800">Campaign Assistant</h1>
        </div>
        <div className="text-sm text-gray-500">
          {connectedSources.length} data source{connectedSources.length !== 1 ? 's' : ''} connected
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                connectedSources.length > 0
                  ? "Type your campaign request here..."
                  : "Connect data sources first, then describe your campaign needs..."
              }
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {connectedSources.length === 0 && (
          <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
            💡 Connect at least one data source to start creating campaigns
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;