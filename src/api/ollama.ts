import { CURRENT_MODEL } from '../config/models';

const OLLAMA_API_BASE = '/api';

export interface OllamaRequestBody {
  model: string;
  prompt: string;
  stream: boolean;
}

export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export class OllamaError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'OllamaError';
  }
}

async function makeRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${OLLAMA_API_BASE}${endpoint}`;
  try {
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error(`Ollama API error: ${response.status}`);
      throw new OllamaError(`HTTP error ${response.status}`, response.status);
    }

    return response;
  } catch (error) {
    console.error('Request error:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new OllamaError('Cannot connect to Ollama. Please ensure:\n1. Ollama is running\n2. It\'s accessible on port 11434', 0);
    }
    throw error;
  }
}

export async function generateResponse(prompt: string): Promise<string> {
  try {
    console.log(`Generating response using model: ${CURRENT_MODEL}`);
    const response = await makeRequest('/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: CURRENT_MODEL,
        prompt,
        stream: false,
      }),
    });

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error('Generation error:', error);
    if (error instanceof OllamaError) {
      throw error;
    }
    throw new OllamaError('Failed to generate response');
  }
}

export async function checkModelAvailability(): Promise<boolean> {
  try {
    const response = await makeRequest('/tags');
    const data = await response.json();
    const models = data.models || [];
    return models.some((model: any) => model.name === CURRENT_MODEL);
  } catch (error) {
    console.error('Model check error:', error);
    return false;
  }
}