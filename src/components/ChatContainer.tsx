import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { PdfUploader } from './PdfUploader';
import { WebSearch } from './WebSearch';
import { ChatInput } from './ChatInput';

interface ChatContainerProps {
  messages: Array<{ content: string; role: 'user' | 'assistant' | 'error'; timestamp: string; duration?: string }>;
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onRegenerate: (index: number) => void;
}

export function ChatContainer({ messages, isLoading, onSendMessage, onRegenerate }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleContent = (content: string, source: 'PDF' | 'Web') => {
    const sourceText = source === 'PDF' ? 'meiner PDF-Datei' : 'der Webseite';
    onSendMessage(`Bitte analysiere folgenden Text aus ${sourceText}:\n\n${content}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border min-h-[600px] flex flex-col">
      <div className="grid grid-cols-2 gap-4 p-4">
        <PdfUploader onPdfContent={(content) => handleContent(content, 'PDF')} />
        <WebSearch onSearchResult={(content) => handleContent(content, 'Web')} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Start a conversation with Ollama</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-3/4 bg-white rounded-lg p-4 shadow">
                  <div className="text-xs text-gray-500 mb-1 flex justify-between">
                    <span>{message.timestamp}</span>
                    {message.duration && (
                      <span className="ml-2">Generierungszeit: {message.duration}</span>
                    )}
                  </div>
                  <div className="prose">
                    {message.content}
                  </div>
                </div>
              </div>
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