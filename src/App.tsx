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
import { SystemCheck } from './components/SystemCheck';

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
      const startTime = new Date();
      const startTimeStr = startTime.toLocaleTimeString('de-DE');
      
      // Benutzer-Nachricht zum Chat hinzufügen
      setMessages(prev => [...prev, { 
        content: message, 
        role: 'user',
        timestamp: startTimeStr
      }]);

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

      const endTime = new Date();
      const endTimeStr = endTime.toLocaleTimeString('de-DE');
      const duration = endTime.getTime() - startTime.getTime();
      const seconds = Math.floor(duration / 1000);
      const milliseconds = duration % 1000;
      const responseTime = `${seconds}s ${milliseconds}ms`;

      if (!response.ok) {
        throw new Error('Fehler bei der Kommunikation mit Ollama');
      }

      const data = await response.json();
      
      // Ollama-Antwort zum Chat hinzufügen
      setMessages(prev => [...prev, { 
        content: data.response, 
        role: 'assistant',
        timestamp: endTimeStr,
        duration: responseTime
      }]);
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      setMessages(prev => [...prev, { 
        content: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.', 
        role: 'error',
        timestamp: new Date().toLocaleTimeString('de-DE')
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateResponse = async (messageIndex: number) => {
    try {
      // Finde die letzte Benutzernachricht vor diesem Index
      let userMessageIndex = messageIndex - 1;
      while (userMessageIndex >= 0 && messages[userMessageIndex].role !== 'user') {
        userMessageIndex--;
      }

      if (userMessageIndex >= 0) {
        const userMessage = messages[userMessageIndex].content;
        // Entferne alle Nachrichten nach der Benutzernachricht
        setMessages(prev => prev.slice(0, messageIndex));
        // Generiere neue Antwort
        await handleSendMessage(userMessage);
      }
    } catch (error) {
      console.error('Fehler beim Regenerieren der Antwort:', error);
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
                onRegenerate={regenerateResponse}
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