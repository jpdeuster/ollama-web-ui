import React from 'react';
import { Bot } from 'lucide-react';
import { MODEL_CONFIG } from '../config/models';

export function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <div className="flex items-center gap-2">
          <Bot size={24} />
          <h1 className="text-xl font-bold">Ollama Web UI</h1>
        </div>
        <div className="mt-1 text-sm text-gray-300">
          Using {MODEL_CONFIG.displayName} - {MODEL_CONFIG.description}
        </div>
      </div>
    </header>
  );
}