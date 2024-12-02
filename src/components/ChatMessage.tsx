import React from 'react';
import { MessageActions } from './MessageActions';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: {
    content: string;
    role: 'user' | 'assistant' | 'error';
  };
  onRegenerate?: () => void;
}

export function ChatMessage({ message, onRegenerate }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  const isError = message.role === 'error';

  // Formatiert den Text für bessere Lesbarkeit
  const formatContent = (content: string) => {
    // Ersetze nummerierte Listen mit korrekter Markdown-Formatierung
    return content.replace(/(\d+)\.\s/g, '\n$1. ');
  };

  return (
    <div className={`p-4 ${isAssistant ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="container mx-auto max-w-4xl">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            {isAssistant ? (
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Bot className="text-white" size={20} />
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <div className={`prose max-w-none ${isError ? 'text-red-500' : ''}`}>
              <ReactMarkdown
                className="formatted-content"
                components={{
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-4 space-y-2 my-4">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="pl-2">{children}</li>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4">{children}</p>
                  )
                }}
              >
                {formatContent(message.content)}
              </ReactMarkdown>
            </div>
            <MessageActions 
              content={message.content}
              onRegenerate={onRegenerate}
              isAssistant={isAssistant}
            />
          </div>
        </div>
      </div>
    </div>
  );
}