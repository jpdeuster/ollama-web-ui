import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface SystemRequirement {
  name: string;
  status: 'checking' | 'success' | 'error' | 'warning';
  message: string;
  debug: string;
}

export function SystemCheck() {
  const [requirements, setRequirements] = useState<SystemRequirement[]>([
    { name: 'Ollama Server', status: 'checking', message: 'Prüfe Ollama-Verbindung...', debug: '' },
    { name: 'PDF Server', status: 'checking', message: 'Prüfe PDF-Server...', debug: '' },
    { name: 'Sprachausgabe', status: 'checking', message: 'Prüfe Sprachunterstützung...', debug: '' },
    { name: 'Browser APIs', status: 'checking', message: 'Prüfe Browser-Kompatibilität...', debug: '' }
  ]);

  const updateRequirement = (index: number, status: SystemRequirement['status'], message: string, debug: string) => {
    setRequirements(prev => prev.map((req, i) => 
      i === index ? { ...req, status, message, debug } : req
    ));
  };

  useEffect(() => {
    const checkSystem = async () => {
      console.log('[SystemCheck] Starting system check...');

      // Ollama Server Check mit Timeout
      console.log('[SystemCheck] Checking Ollama server...');
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 Sekunden Timeout

        const startTime = new Date();
        
        const ollamaResponse = await fetch('/api/tags', {
          signal: controller.signal
        });
        
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        const seconds = Math.floor(duration / 1000);
        const milliseconds = duration % 1000;
        const responseTime = `${seconds}s ${milliseconds}ms`;
        
        clearTimeout(timeoutId);
        
        console.log('[SystemCheck] Ollama server response:', ollamaResponse.status);
        if (ollamaResponse.ok) {
          const data = await ollamaResponse.json();
          const models = Array.isArray(data.models) ? data.models : [];
          const modelNames = models.map(model => model.name || 'Unbenannt');
          
          updateRequirement(
            0, 
            'success', 
            `Ollama-Server erreichbar (${modelNames.length} Modelle)`,
            `Server antwortet mit Status ${ollamaResponse.status} nach ${responseTime},
             Verfügbare Modelle: ${modelNames.join(', ') || 'keine'}`
          );
        } else {
          updateRequirement(
            0, 
            'error', 
            'Ollama-Server nicht erreichbar',
            `Server antwortet mit Fehler ${ollamaResponse.status} nach ${responseTime}`
          );
        }
      } catch (error) {
        console.log('[SystemCheck] Ollama server error:', error);
        if (error.name === 'AbortError') {
          updateRequirement(0, 'error', 'Zeitüberschreitung bei der Ollama-Verbindung', `Fehler: ${error.message}`);
        } else {
          updateRequirement(
            0, 
            'error', 
            'Keine Verbindung zum Ollama-Server möglich',
            `Fehler nach 5s Timeout: ${error.message}`
          );
        }
      }

      // PDF Server Check
      console.log('[SystemCheck] Checking PDF server...');
      try {
        const pdfResponse = await fetch('/health');
        console.log('[SystemCheck] PDF server response:', pdfResponse.status);
        if (pdfResponse.ok) {
          updateRequirement(1, 'success', 'PDF-Server läuft', '');
        } else {
          updateRequirement(1, 'warning', 'PDF-Server nicht erreichbar (optional)', '');
        }
      } catch (error) {
        console.log('[SystemCheck] PDF server error:', error);
        updateRequirement(1, 'warning', 'PDF-Server nicht gestartet (optional)', '');
      }

      // Sprachausgabe Check
      console.log('[SystemCheck] Checking speech synthesis...');
      const checkSpeechSupport = () => {
        if ('speechSynthesis' in window) {
          const voices = window.speechSynthesis.getVoices();
          console.log('[SystemCheck] Available voices:', voices.length);
          if (voices.length > 0) {
            const germanVoices = voices.filter(voice => voice.lang.includes('de'));
            console.log('[SystemCheck] German voices:', germanVoices.length);
            if (germanVoices.length > 0) {
              updateRequirement(2, 'success', `Sprachausgabe verfügbar (${germanVoices.length} deutsche Stimmen)`, '');
            } else {
              updateRequirement(2, 'warning', 'Keine deutschen Stimmen verfügbar', '');
            }
          } else {
            console.log('[SystemCheck] No voices found, waiting for voiceschanged event...');
          }
        } else {
          console.log('[SystemCheck] Speech synthesis not supported');
          updateRequirement(2, 'error', 'Sprachausgabe nicht unterstützt', '');
        }
      };

      // Initial speech check
      checkSpeechSupport();
      window.speechSynthesis.addEventListener('voiceschanged', checkSpeechSupport);

      // Browser APIs Check
      console.log('[SystemCheck] Checking browser APIs...');
      try {
        const requiredAPIs = [
          { name: 'Clipboard', check: () => 'clipboard' in navigator },
          { name: 'localStorage', check: () => 'localStorage' in window },
          { name: 'FileReader', check: () => 'FileReader' in window }
        ];

        const results = requiredAPIs.map(api => ({
          name: api.name,
          available: api.check()
        }));
        
        console.log('[SystemCheck] API check results:', results);

        const missingAPIs = results.filter(result => !result.available);

        if (missingAPIs.length === 0) {
          updateRequirement(3, 'success', 'Alle benötigten Browser-APIs verfügbar', '');
        } else {
          const missingNames = missingAPIs.map(api => api.name).join(', ');
          updateRequirement(3, 'error', `Fehlende APIs: ${missingNames}`, '');
        }
      } catch (error) {
        console.error('[SystemCheck] Browser API check error:', error);
        updateRequirement(3, 'error', 'Fehler bei der API-Prüfung', '');
      }
    };

    checkSystem();

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', () => {
        console.log('[SystemCheck] Cleanup: removed voiceschanged listener');
      });
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">System-Check</h2>
      <div className="space-y-3">
        {requirements.map((req, index) => (
          <div key={index} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {req.status === 'success' && <CheckCircle2 className="text-green-500" size={20} />}
              {req.status === 'error' && <XCircle className="text-red-500" size={20} />}
              {req.status === 'warning' && <AlertCircle className="text-yellow-500" size={20} />}
              {req.status === 'checking' && (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              )}
              <div>
                <div className="font-medium">{req.name}</div>
                <div className="text-sm text-gray-600">{req.message}</div>
              </div>
            </div>
            {req.debug && (
              <div className="ml-8 text-xs bg-gray-100 p-2 rounded text-gray-600 font-mono">
                {req.debug}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 