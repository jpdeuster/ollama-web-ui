import React from 'react';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { ConnectionStatus } from './components/ConnectionStatus';
import { useChat } from './hooks/useChat';

function App() {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto max-w-4xl p-4 space-y-4">
        <ConnectionStatus />
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
        />
      </main>
    </div>
  );
}

export default App;