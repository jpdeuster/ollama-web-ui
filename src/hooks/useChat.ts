import { useState, useCallback } from 'react';
import { Message, ChatState } from '../types/ollama';
import { generateResponse, OllamaError } from '../api/ollama';
import { CURRENT_MODEL } from '../config/models';

export function useChat(model: string) {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });

  const sendMessage = useCallback(async (content: string) => {
    const startTime = Date.now();
    const userMessage: Message = { 
      role: 'user', 
      content,
      timestamp: new Date()
    };
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const response = await generateResponse(content, model);
      const processingTime = Date.now() - startTime;
      
      const botMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        processingTime
      };

      setChatState(prev => ({
        isLoading: false,
        messages: [...prev.messages, botMessage],
      }));
    } catch (error) {
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error instanceof OllamaError && error.status === 404) {
        errorMessage = `Model not found. Please make sure you have downloaded the ${CURRENT_MODEL} model using 'ollama pull ${CURRENT_MODEL}'`;
      } else if (error instanceof OllamaError) {
        errorMessage = `Error: ${error.message}`;
      }

      setChatState(prev => ({
        ...prev,
        isLoading: false,
        messages: [...prev.messages, {
          role: 'assistant',
          content: errorMessage,
        }],
      }));
    }
  }, [model]);

  return {
    messages: chatState.messages,
    isLoading: chatState.isLoading,
    sendMessage,
  };
}