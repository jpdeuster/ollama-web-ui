import React, { useState } from 'react';
import { FileUp, Loader } from 'lucide-react';
import { parsePdfFile } from '../api/pdf';

interface PdfUploaderProps {
  onPdfContent: (content: string) => void;
}

export function PdfUploader({ onPdfContent }: PdfUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('Keine Datei ausgewählt');
      return;
    }

    console.log('Datei ausgewählt:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starte PDF-Upload...');
      const text = await parsePdfFile(file);
      console.log('PDF erfolgreich geparst, Textlänge:', text.length);
      onPdfContent(text);
    } catch (err) {
      console.error('Detaillierter Fehler:', err);
      setError(`Fehler beim Verarbeiten der PDF: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className={`
        flex items-center justify-center w-full p-4
        border-2 border-dashed rounded-lg
        ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
        hover:bg-gray-100 cursor-pointer
      `}>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isLoading}
        />
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader className="animate-spin" size={20} />
            <span>PDF wird verarbeitet...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-600">
            <FileUp size={20} />
            <span>PDF hochladen</span>
          </div>
        )}
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 