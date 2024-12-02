import React from 'react';
import { Github, Mail, Code2, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright und Entwickler-Info */}
          <div className="text-sm text-gray-600 text-center md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <Code2 size={16} className="text-blue-500" />
              <span>
                Entwickelt von <span className="font-semibold">Jörg-Peter Deuster</span>
              </span>
            </div>
            <div>
              © {currentYear} Ollama Web UI. Alle Rechte vorbehalten.
            </div>
          </div>

          {/* Powered by Section */}
          <div className="text-sm text-gray-500 flex items-center gap-1">
            Powered by
            <a 
              href="https://ollama.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              Ollama
            </a>
            <span className="mx-1">•</span>
            Made with <Heart size={14} className="text-red-500 mx-1" /> in Germany
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yourusername/ollama-web-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="GitHub Repository"
            >
              <Github size={20} />
            </a>
            <a
              href="mailto:jp@deuster.eu"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Kontakt"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Zusätzliche rechtliche Hinweise */}
        <div className="mt-4 pt-4 border-t text-xs text-gray-500 text-center">
          <p>
            Diese Software verwendet Ollama unter der MIT-Lizenz. 
            Alle Produktnamen, Logos und Marken sind Eigentum ihrer jeweiligen Inhaber.
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="/datenschutz" className="hover:text-gray-700">Datenschutz</a>
            <a href="/impressum" className="hover:text-gray-700">Impressum</a>
            <a href="/nutzungsbedingungen" className="hover:text-gray-700">Nutzungsbedingungen</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 