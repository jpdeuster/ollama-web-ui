export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  processingTime?: number; // in Millisekunden
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}