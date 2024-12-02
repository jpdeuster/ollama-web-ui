import React from 'react';
import { ChevronDown, Loader } from 'lucide-react';

interface ModelSelectorProps {
  availableModels: string[];
  currentModel: string;
  isLoading: boolean;
  onModelChange: (model: string) => void;
}

export function ModelSelector({ 
  availableModels, 
  currentModel, 
  isLoading, 
  onModelChange 
}: ModelSelectorProps) {
  return (
    <div className="relative inline-block">
      <select
        value={currentModel}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={isLoading}
        className="appearance-none bg-gray-700 text-white px-4 py-2 pr-8 rounded-lg 
                 border border-gray-600 hover:border-blue-500 focus:border-blue-500 
                 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
      >
        {availableModels.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {isLoading ? (
          <Loader size={16} className="animate-spin text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </div>
    </div>
  );
} 