import React from 'react';
import { Bot, User, Clock } from 'lucide-react';
import { Message } from '../types/ollama';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'assistant';
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const formatProcessingTime = (ms: number) => {
    return `${(ms / 1000).toFixed(2)}s`;
  };
  
  return (
    <div className={`flex gap-3 ${isBot ? 'bg-gray-50' : ''} p-4 transition-colors duration-200`}>
      <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
        isBot ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
      }`}>
        {isBot ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
          {message.processingTime && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              {formatProcessingTime(message.processingTime)}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
}