export async function checkOllamaConnection(): Promise<boolean> {
  try {
    const response = await fetch('/api/tags');
    if (!response.ok) {
      console.error('Ollama server responded with:', response.status);
      return false;
    }
    const data = await response.json();
    console.log('Connected to Ollama, available models:', data);
    return true;
  } catch (error) {
    console.error('Ollama connection error:', error);
    return false;
  }
}