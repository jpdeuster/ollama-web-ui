import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function LegalHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-gray-50 border-b">
      <div className="container mx-auto px-4 py-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Zurück zur Startseite</span>
        </button>
      </div>
    </header>
  );
} 