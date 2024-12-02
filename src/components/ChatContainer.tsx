import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Message } from '../types/ollama';
import { PdfUploader } from './PdfUploader';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatContainer({ messages, isLoading, onSendMessage }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePdfContent = (content: string) => {
    onSendMessage(`Bitte analysiere folgenden Text aus meiner PDF-Datei:\n\n${content}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border min-h-[600px] flex flex-col">
      <PdfUploader onPdfContent={handlePdfContent} />
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Start a conversation with Ollama</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="p-4 text-gray-500 animate-pulse">
                Ollama is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <ChatInput onSend={onSendMessage} disabled={isLoading} />
    </div>
  );
}