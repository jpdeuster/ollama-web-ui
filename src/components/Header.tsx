import React from 'react';
import { Bot, Code2, Terminal } from 'lucide-react';
import { ModelSelector } from './ModelSelector';

interface HeaderProps {
  availableModels: string[];
  currentModel: string;
  isLoading: boolean;
  onModelChange: (model: string) => void;
}

export function Header({ availableModels, currentModel, isLoading, onModelChange }: HeaderProps) {
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

        {/* Statistiken/Badges */}
        <div className="mt-3 flex justify-center md:justify-start gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Verfügbar</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Code-Optimiert</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span>Multi-Language Support</span>
          </div>
        </div>
      </div>
    </header>
  );
}