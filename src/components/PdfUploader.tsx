import React, { useState } from 'react';
import { FileUp, Loader } from 'lucide-react';
import { parsePdfFile } from '../api/pdf';

interface PdfUploaderProps {
  onPdfContent: (content: string) => void;
}

export function PdfUploader({ onPdfContent }: PdfUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
  } | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileInfo({
      name: file.name,
      size: file.size
    });
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      const text = await parsePdfFile(file);
      const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
      onPdfContent(`PDF "${file.name}" (${formatFileSize(file.size)}) wurde in ${processingTime}s verarbeitet:\n\n${text}`);
    } catch (err) {
      setError(`Fehler beim Verarbeiten der PDF: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className={`
        flex flex-col items-center justify-center w-full p-4
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
        
        {fileInfo && !isLoading && !error && (
          <div className="text-sm text-gray-600 mb-2">
            {fileInfo.name} ({formatFileSize(fileInfo.size)})
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader className="animate-spin" size={20} />
            <span className="text-gray-600">PDF wird verarbeitet...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-600">
            <FileUp size={20} />
            <span>{fileInfo ? 'Andere PDF hochladen' : 'PDF hochladen'}</span>
          </div>
        )}
      </label>
      
      {error && (
        <div className="mt-2 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
} 