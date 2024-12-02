import { CURRENT_MODEL } from '../config/models';

export async function parsePdfFile(file: File): Promise<string> {
  console.log('Bereite PDF-Upload vor...');
  
  const formData = new FormData();
  formData.append('pdf', file);

  try {
    // Prüfe Server-Verfügbarkeit über Proxy
    try {
      const healthCheck = await fetch('/health');
      if (!healthCheck.ok) {
        console.error('Health-Check fehlgeschlagen:', await healthCheck.text());
        throw new Error('Server nicht erreichbar');
      }
    } catch (error) {
      console.error('Server-Health-Check fehlgeschlagen:', error);
      throw new Error('PDF-Server nicht erreichbar - Läuft der Server auf Port 3000?');
    }

    console.log('Sende PDF an Server...');
    // Verwende Proxy-URL
    const response = await fetch('/api/upload-pdf', {
      method: 'POST',
      body: formData,
    });

    console.log('Server Antwort Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Fehlerantwort:', errorText);
      throw new Error(`Server Fehler: ${errorText}`);
    }

    const data = await response.json();
    if (!data.text) {
      throw new Error('Keine Text-Daten in der Server-Antwort');
    }

    console.log('PDF erfolgreich verarbeitet, Textlänge:', data.text.length);
    return data.text;
  } catch (error) {
    console.error('Detaillierter Upload-Fehler:', error);
    if (error instanceof Error) {
      throw new Error(`PDF Verarbeitungsfehler: ${error.message}`);
    }
    throw new Error('Unbekannter Fehler bei der PDF-Verarbeitung');
  }
} 