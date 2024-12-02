import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { ConnectionStatus } from './components/ConnectionStatus';
import { ModelStatus } from './components/ModelStatus';
import { useChat } from './hooks/useChat';
import { fetchAvailableModels } from './api/ollama';
import { Footer } from './components/Footer';

function App() {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const { messages, isLoading, sendMessage } = useChat(currentModel);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoadingModels(true);
        const models = await fetchAvailableModels();
        setAvailableModels(models);
        // Setze das erste verfügbare Modell als Standard
        if (models.length > 0 && !currentModel) {
          setCurrentModel(models[0]);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Modelle:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };

    loadModels();
  }, []);

  const handleModelChange = (model: string) => {
    setCurrentModel(model);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        availableModels={availableModels}
        currentModel={currentModel}
        isLoading={isLoadingModels}
        onModelChange={handleModelChange}
      />
      <main className="flex-1 container mx-auto max-w-4xl p-4 space-y-4">
        <ConnectionStatus />
        {currentModel && <ModelStatus currentModel={currentModel} />}
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;