import React, { useState, useEffect } from 'react';

interface ModelDetails {
  status: 'checking' | 'ready' | 'error';
  message: string;
}

export function ModelStatus({ currentModel }: { currentModel: string }) {
  const [modelInfo, setModelInfo] = useState<ModelDetails>({ 
    status: 'checking', 
    message: 'Prüfe Modell...' 
  });

  useEffect(() => {
    const checkModel = async () => {
      setModelInfo({ status: 'checking', message: 'Prüfe Modell...' });
      
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: currentModel,
            prompt: "Beschreibe in wenigenSätzen, was für ein KI-Modell du bist und was deine Hauptstärken sind. Beginne mit 'Ich bin ein'",
            stream: false
          })
        });

        if (!response.ok) {
          throw new Error('Modell nicht erreichbar');
        }

        const data = await response.json();
        
        const cleanedResponse = data.response
          .replace(/^["']|["']$/g, '')
          .replace(/\.$/, '')
          .trim();

        setModelInfo({ 
          status: 'ready', 
          message: cleanedResponse
        });
      } catch (error) {
        console.error('Fehler beim Abrufen der Modellinformationen:', error);
        setModelInfo({ 
          status: 'error', 
          message: `${currentModel} nicht verfügbar` 
        });
      }
    };

    if (currentModel) {
      checkModel();
    }
  }, [currentModel]);

  return (
    <div className={`p-4 rounded-lg ${
      modelInfo.status === 'ready' 
        ? 'bg-green-50 text-green-700' 
        : modelInfo.status === 'error' 
          ? 'bg-red-50 text-red-700' 
          : 'bg-gray-50 text-gray-700'
    }`}>
      <div className="flex items-start gap-2">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
          modelInfo.status === 'ready' 
            ? 'bg-green-500' 
            : modelInfo.status === 'error' 
              ? 'bg-red-500' 
              : 'bg-gray-500'
        }`} />
        <div className="flex-grow">
          <p className="text-sm leading-relaxed break-words">
            {modelInfo.message}
          </p>
        </div>
      </div>
    </div>
  );
} 