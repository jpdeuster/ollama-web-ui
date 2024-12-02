import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Terminal } from 'lucide-react';
import { checkOllamaConnection } from '../utils/checkConnection';

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkOllamaConnection();
      setIsConnected(connected);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
      isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    }`}>
      {isConnected ? (
        <>
          <CheckCircle2 size={20} className="text-green-500" />
          <span>Ollama is running and connected</span>
        </>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <span>
              Cannot connect to Ollama. Please ensure:
            </span>
          </div>
          <div className="pl-7 space-y-1 text-sm">
            <p>1. Ollama is running</p>
            <p>2. It's accessible on port 11434</p>
            <div className="mt-2 flex items-center gap-2">
              <Terminal size={16} />
              <code className="bg-red-100 px-2 py-1 rounded">
                OLLAMA_ORIGINS=* ollama serve
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}