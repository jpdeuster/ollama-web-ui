import React, { useEffect, useState } from 'react';
import { Info, AlertCircle, CheckCircle, Loader, List } from 'lucide-react';

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
            prompt: "Identifiziere dich: Welches KI-Sprachmodell bist du (Name/Version)? Antworte in einem kurzen Satz.",
            stream: false
          })
        });

        if (!response.ok) {
          throw new Error('Modell nicht erreichbar');
        }

        const data = await response.json();
        setModelInfo({ 
          status: 'ready', 
          message: data.response
        });
      } catch (error) {
        console.error('Fehler beim Abrufen der Modellinformationen:', error);
        setModelInfo({ 
          status: 'error', 
          message: 'Modell nicht verfügbar oder Fehler bei der Verbindung' 
        });
      }
    };

    if (currentModel) {
      checkModel();
    }
  }, [currentModel]);

  // Bestimme die Fähigkeiten basierend auf dem Modellnamen
  const getCapabilities = (modelName: string) => {
    const capabilities = [
      'Code Generation',
      'Technical Q&A',
      'Text Generation',
      'Analysis'
    ];

    // Spezifische Fähigkeiten je nach Modell
    if (modelName.toLowerCase().includes('coder')) {
      capabilities.push('Code Review', 'Documentation');
    }
    if (modelName.toLowerCase().includes('stable')) {
      capabilities.push('Stable Responses', 'General Knowledge');
    }
    
    return capabilities;
  };

  return (
    <div className={`mt-4 p-3 rounded-lg border ${
      modelInfo.status === 'ready' ? 'bg-green-100 border-green-200' : 
      modelInfo.status === 'error' ? 'bg-red-100 border-red-200' : 
      'bg-gray-100 border-gray-200'
    }`}>
      <div className="flex items-center gap-2">
        {modelInfo.status === 'ready' ? <CheckCircle size={16} className="text-green-500" /> :
         modelInfo.status === 'error' ? <AlertCircle size={16} className="text-red-500" /> :
         <Loader size={16} className="animate-spin text-gray-500" />}
        
        <div className="flex-1">
          <div className="font-medium">{currentModel}</div>
          <div className="text-sm mt-2 space-y-2">
            <div className="flex items-start gap-1">
              <Info size={14} className="mt-1 flex-shrink-0" />
              <span className="text-gray-700">{modelInfo.message}</span>
            </div>
          </div>

          {modelInfo.status === 'ready' && (
            <div className="mt-3">
              <div className="flex items-center gap-1 text-gray-600">
                <List size={14} />
                <span className="font-semibold">Typische Anwendungen:</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                {getCapabilities(currentModel).map((capability, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 