import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Volume2, Copy, Check } from 'lucide-react';

interface MessageActionsProps {
  content: string;
  onRegenerate?: () => void;
  onSave?: () => void;
  onSpeak?: () => void;
  isAssistant: boolean;
}

interface Language {
  code: string;
  name: string;
  voices: SpeechSynthesisVoice[];
}

export function MessageActions({ content, onRegenerate, onSave, onSpeak, isAssistant }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);

  // Vordefinierte Liste von Sprachen
  const predefinedLanguages = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'Englisch' },
    { code: 'fr', name: 'Französisch' },
    { code: 'es', name: 'Spanisch' },
    { code: 'it', name: 'Italienisch' }
  ];

  useEffect(() => {
    const initVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const languageMap = new Map<string, Language>();

      voices.forEach(voice => {
        const langCode = voice.lang.split('-')[0];
        if (predefinedLanguages.some(lang => lang.code === langCode)) {
          if (!languageMap.has(langCode)) {
            const langName = predefinedLanguages.find(lang => lang.code === langCode)?.name || langCode;
            languageMap.set(langCode, {
              code: langCode,
              name: langName,
              voices: []
            });
          }
          languageMap.get(langCode)?.voices.push(voice);
        }
      });

      setAvailableLanguages(Array.from(languageMap.values())
        .filter(lang => lang.voices.length > 0)
        .sort((a, b) => a.name.localeCompare(b.name)));
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length > 0) {
        initVoices();
      }
      window.speechSynthesis.onvoiceschanged = initVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const handleSave = () => {
    let formattedContent = content;
    if (content.includes('```')) {
      formattedContent = content
        .split('\n')
        .map(line => line.trim())
        .join('\n');
    }
    const blob = new Blob([formattedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ollama-antwort.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSpeak = (language: Language) => {
    window.speechSynthesis.cancel();

    let textToSpeak = content.replace(/```[\s\S]*?```/g, 'Code-Block ausgelassen');
    textToSpeak = textToSpeak.replace(/`.*?`/g, '');
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Bevorzuge macOS-Stimmen
    const voice = language.voices.find(v => 
      v.name.includes('Anna') || // Deutsche Premium-Stimme
      v.name.includes('Helena') || // Alternative deutsche Stimme
      v.localService // Fallback auf andere lokale Stimmen
    ) || language.voices[0];

    console.log('Verfügbare Stimmen:', language.voices.map(v => v.name)); // Debug-Info
    console.log('Gewählte Stimme:', voice?.name); // Debug-Info
    
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
      // Optimierte Einstellungen für macOS-Stimmen
      utterance.rate = 1.0; // Normale Geschwindigkeit
      utterance.pitch = 1.0; // Normale Tonhöhe
      utterance.volume = 1.0; // Volle Lautstärke
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Sprachausgabe-Fehler:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    setShowLanguages(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fehler beim Kopieren:', err);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

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
      <button
        onClick={handleSave}
        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
        title="Als Markdown speichern"
      >
        <Save size={16} />
      </button>
      <button
        onClick={onRegenerate}
        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
        title="Antwort neu generieren"
      >
        <RefreshCw size={16} />
      </button>
      <div className="relative">
        <button
          onClick={() => {
            if (isSpeaking) {
              stopSpeaking();
            } else {
              setShowLanguages(!showLanguages);
            }
          }}
          className={`p-1 transition-colors ${
            isSpeaking ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'
          }`}
          title={isSpeaking ? "Vorlesen stoppen" : "Vorlesen"}
        >
          <Volume2 size={16} />
        </button>
        
        {showLanguages && !isSpeaking && availableLanguages.length > 0 && (
          <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg py-1 min-w-[150px] z-50">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSpeak(lang)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <span>{lang.name}</span>
                <span className="text-xs text-gray-500">
                  ({lang.voices.length})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 