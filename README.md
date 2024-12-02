# Ollama Web UI

Eine Web-basierte Benutzeroberfläche für die Interaktion mit Ollama-Modellen.

## Features

- Echtzeit-Chat-Interface
- Mehrsprachige Sprachausgabe (DE, EN, FR, ES, IT)
- PDF-Analyse und Webseiten-Integration
- Modellstatus-Überwachung
- Responsive Design
- Fehlerbehandlung und Wiederherstellung
- Markdown-Unterstützung
- Code-Highlighting
- Kopieren und Regenerieren von Antworten

## Setup & Ausführung

1. Ollama mit CORS starten:
   ```bash
   OLLAMA_ORIGINS=* ollama serve
   ```

2. Web UI starten:
   ```bash
   npm install
   npm run dev
   ```

3. PDF-Server starten (optional):
   ```bash
   cd server
   npm install
   npm start
   ```

4. Browser öffnen unter der angezeigten URL (standardmäßig http://localhost:5173)

## Anforderungen

- Node.js 16+
- Ollama lokal installiert
- Ein kompatibles Ollama-Modell (z.B. `ollama pull qwen2.5-coder:32b`)

## Entwicklung

- TypeScript für typsichere Entwicklung
- React für die Benutzeroberfläche
- Tailwind CSS für das Styling
- Express.js für den PDF-Server

## Lizenz MIT