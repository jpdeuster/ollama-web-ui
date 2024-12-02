import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { Footer } from './components/Footer';
import { Datenschutz } from './components/legal/Datenschutz';
import { Impressum } from './components/legal/Impressum';
import { Nutzungsbedingungen } from './components/legal/Nutzungsbedingungen';
import { LegalHeader } from './components/legal/LegalHeader';
import { fetchAvailableModels } from './api/ollama';
import { ModelStatus } from './components/ModelStatus';

function App() {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await fetchAvailableModels();
        setAvailableModels(models);
        if (models.length > 0) {
          setCurrentModel(models[0]);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Modelle:', error);
      }
    };
    loadModels();
  }, []);

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      // Benutzer-Nachricht zum Chat hinzufügen
      setMessages(prev => [...prev, { content: message, role: 'user' }]);

      // Nachricht an Ollama senden
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: currentModel,
          prompt: message,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Kommunikation mit Ollama');
      }

      const data = await response.json();
      
      // Ollama-Antwort zum Chat hinzufügen
      setMessages(prev => [...prev, { content: data.response, role: 'assistant' }]);
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      setMessages(prev => [...prev, { 
        content: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.', 
        role: 'error' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="flex flex-col min-h-screen">
            <Header 
              availableModels={availableModels}
              currentModel={currentModel}
              isLoading={isLoading}
              onModelChange={setCurrentModel}
            />
            <div className="container mx-auto px-4 py-4">
              <ModelStatus currentModel={currentModel} />
            </div>
            <main className="flex-grow">
              <ChatContainer 
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
              />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/datenschutz" element={
          <div className="flex flex-col min-h-screen">
            <LegalHeader />
            <main className="flex-grow">
              <Datenschutz />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/impressum" element={
          <div className="flex flex-col min-h-screen">
            <LegalHeader />
            <main className="flex-grow">
              <Impressum />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/nutzungsbedingungen" element={
          <div className="flex flex-col min-h-screen">
            <LegalHeader />
            <main className="flex-grow">
              <Nutzungsbedingungen />
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;