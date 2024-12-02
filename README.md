# Ollama Web UI

A web-based user interface for interacting with Ollama models.

## Setup & Running

1. Start Ollama with CORS enabled:
   ```bash
   OLLAMA_ORIGINS=* ollama serve
   ```

2. Start the web UI:
   ```bash
   npm install
   npm run dev
   ```

3. Open your browser to the provided URL (usually http://localhost:5173)

## Features

- Real-time chat interface
- Connection status monitoring
- Support for Qwen 2.5 Coder model
- Responsive design
- Error handling and recovery

## Requirements

- Node.js 16+
- Ollama installed locally
- Qwen 2.5 Coder model pulled (`ollama pull qwen2.5-coder:32b`)