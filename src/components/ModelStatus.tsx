import React, { useEffect, useState } from 'react';
import { Info, AlertCircle, CheckCircle, Loader, List, HardDrive, Calendar, Cpu } from 'lucide-react';
import { MODEL_CONFIG } from '../config/models';

interface ModelDetails {
  status: 'checking' | 'ready' | 'error';
  message: string;
  details?: {
    model: string;
    digest?: string;
    size?: number;
    modified_at?: string;
    // Weitere mögliche Felder
  };
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
        // Hole zuerst die Modellinformationen
        console.log('Hole Modellinformationen für:', currentModel);
        const tagsResponse = await fetch('/api/tags');
        const tagsData = await tagsResponse.json();
        console.log('Verfügbare Modelle:', tagsData);

        // Finde das aktuelle Modell in den Tags
        const modelDetails = tagsData.models?.find(
          (m: any) => m.name === currentModel
        );
        console.log('Gefundene Modeldetails:', modelDetails);

        // Teste das Modell
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: currentModel,
            prompt: "Bitte antworte kurz: Welches Modell bist du?",
            stream: false
          })
        });

        if (!response.ok) {
          throw new Error('Modell nicht erreichbar');
        }

        const data = await response.json();
        setModelInfo({ 
          status: 'ready', 
          message: `Aktiv: ${data.response.slice(0, 100)}`,
          details: modelDetails
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

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Keine Angabe';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Keine Angabe';
    try {
      return new Date(dateString).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Datum unbekannt';
    }
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
          <div className="text-sm mt-1 flex items-center gap-1">
            <Info size={14} />
            <span>{modelInfo.message}</span>
          </div>

          {modelInfo.status === 'ready' && (
            <>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <HardDrive size={14} />
                  <span>Größe: {formatSize(modelInfo.details?.size)}</span>
                </div>
                {modelInfo.details?.modified_at && (
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Zuletzt aktualisiert: {formatDate(modelInfo.details.modified_at)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Cpu size={14} />
                  <span>Modelltyp: {MODEL_CONFIG.version}</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-1 text-gray-600">
                  <List size={14} />
                  <span className="font-semibold">Hauptfähigkeiten:</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {MODEL_CONFIG.capabilities.map((capability, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 