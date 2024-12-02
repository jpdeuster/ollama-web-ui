import React, { useState } from 'react';
import { Volume2, Square, Copy, Check, Save, RefreshCw } from 'lucide-react';

interface MessageActionsProps {
  content: string;
  onRegenerate?: () => void;
  isAssistant: boolean;
}

interface Language {
  code: string;
  name: string;
  voiceNames: string[];
}

export function MessageActions({ content, onRegenerate, isAssistant }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  
  // Vordefinierte Sprachen mit optimierten Stimmen
  const languages: Language[] = [
    { code: 'de-DE', name: 'Deutsch', voiceNames: ['Anna'] },
    { code: 'en-US', name: 'Englisch', voiceNames: ['Samantha'] },
    { code: 'fr-FR', name: 'Französisch', voiceNames: ['Thomas'] },
    { code: 'es-ES', name: 'Spanisch', voiceNames: ['Paulina'] },
    { code: 'it-IT', name: 'Italienisch', voiceNames: ['Alice'] }
  ];

  // Sprachausgabe mit Fehlerbehandlung
  const speak = (text: string, langCode: string) => {
    const synthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthesis.getVoices();
    const selectedLang = languages.find(l => l.code === langCode);
    
    // Flexiblere Stimmenauswahl mit Fallback
    const voice = voices.find(v => 
      v.lang.includes(langCode.split('-')[0]) &&
      (selectedLang?.voiceNames ? 
        selectedLang.voiceNames.some(name => v.name.includes(name)) : 
        true) &&
      (v.localService || true)
    ) || voices.find(v => v.lang.includes(langCode.split('-')[0]));

    if (voice) {
      utterance.voice = voice;
      utterance.lang = langCode;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Fehler beim Abspielen der Stimme:', event);
        setIsSpeaking(false);
      };

      synthesis.speak(utterance);
    } else {
      console.error(`Keine kompatible Stimme für ${selectedLang?.name || langCode} gefunden`);
      setIsSpeaking(false);
    }
  };

  // Kopieren in die Zwischenablage
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fehler beim Kopieren:', err);
    }
  };

  // Stoppen der Sprachausgabe
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Nur für Assistenten-Nachrichten anzeigen
  if (!isAssistant) return null;

  return (
    <div className="flex gap-2 mt-2 relative">
      <button
        onClick={handleCopy}
        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
        title="In Zwischenablage kopieren"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
      </button>

      {onRegenerate && (
        <button
          onClick={onRegenerate}
          className="text-gray-500 hover:text-gray-700 p-1 rounded"
          title="Regenerate"
        >
          <RefreshCw size={16} />
        </button>
      )}
      
      {/* Sprach-Button mit Dropdown */}
      <div className="relative">
        <button
          onClick={() => !isSpeaking && setShowLanguages(!showLanguages)}
          className="text-gray-500 hover:text-gray-700 p-1 rounded flex items-center gap-1"
          title="Text vorlesen"
        >
          {isSpeaking ? (
            <Square size={16} onClick={handleStop} />
          ) : (
            <Volume2 size={16} />
          )}
        </button>

        {/* Sprachen-Dropdown */}
        {showLanguages && !isSpeaking && (
          <div className="absolute bottom-full mb-2 left-0 bg-white shadow-lg rounded-lg py-1 min-w-[150px] z-10">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  speak(content, lang.code);
                  setShowLanguages(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 