import React from 'react';
import { User, Bot, Loader2, Clock } from 'lucide-react';
import { MessageBubbleProps } from '../types';
import CampaignDisplay from './CampaignDisplay';

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`flex max-w-[85%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        } items-start space-x-3`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Message Bubble */}
          <div
            className={`relative px-4 py-3 rounded-lg shadow-sm ${
              isUser
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            } ${message.isLoading ? 'animate-pulse' : ''}`}
          >
            {/* Loading indicator */}
            {message.isLoading && (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{message.content}</span>
              </div>
            )}

            {/* Regular message */}
            {!message.isLoading && (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}

            {/* Message tail */}
            <div
              className={`absolute top-3 w-3 h-3 transform rotate-45 ${
                isUser
                  ? 'right-[-6px] bg-blue-600'
                  : 'left-[-6px] bg-gray-100'
              }`}
            />
          </div>

          {/* Timestamp */}
          <div
            className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${
              isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{formattedTime}</span>
          </div>

          {/* Campaign Display */}
          {message.campaigns && message.campaigns.length > 0 && (
            <div className="mt-4 w-full">
              {message.campaigns.map((campaign) => (
                <CampaignDisplay key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;