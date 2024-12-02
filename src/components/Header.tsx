import React, { useState } from 'react';
import { Bot, Code2, Activity } from 'lucide-react';
import { ModelSelector } from './ModelSelector';
import { SystemCheck } from './SystemCheck';

interface HeaderProps {
  availableModels: string[];
  currentModel: string;
  isLoading: boolean;
  onModelChange: (model: string) => void;
}

export function Header({ availableModels, currentModel, isLoading, onModelChange }: HeaderProps) {
  const [showSystemCheck, setShowSystemCheck] = useState(false);

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          {/* Linke Seite - Titel und Beschreibung */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Bot size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Ollama Web UI
              </h1>
            </div>
            
            <div className="ml-1 space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400">
                <Code2 size={16} />
                <span className="font-semibold">Aktives Modell:</span>
                <span className="text-white">{currentModel}</span>
              </div>
            </div>
          </div>

          {/* Mittlerer Bereich - System-Check Button */}
          <div className="flex items-center mx-4">
            <button
              onClick={() => setShowSystemCheck(!showSystemCheck)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Activity size={16} />
              <span>System-Status</span>
            </button>
          </div>

          {/* Rechte Seite - Modellauswahl */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <ModelSelector
              availableModels={availableModels}
              currentModel={currentModel}
              isLoading={isLoading}
              onModelChange={onModelChange}
            />
            <span className="text-xs text-gray-400">
              {availableModels.length} Modelle verfügbar
            </span>
          </div>
        </div>

        {/* System-Check Dropdown */}
        {showSystemCheck && (
          <div className="mt-4 bg-gray-700 rounded-lg p-4 shadow-lg">
            <SystemCheck />
          </div>
        )}
      </div>
    </header>
  );
}