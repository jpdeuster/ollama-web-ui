import React, { useState } from 'react';
import { Search, Loader, Globe } from 'lucide-react';

interface WebSearchProps {
  onSearchResult: (content: string) => void;
}

export function WebSearch({ onSearchResult }: WebSearchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/websearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Webseite');
      }

      const data = await response.json();
      onSearchResult(`Inhalt von ${url}:\n\n${data.content}`);
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1">
          <label className={`
            flex items-center justify-center w-full p-4
            border-2 border-dashed rounded-lg
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
            hover:bg-gray-100 cursor-pointer
          `}>
            <div className="flex items-center gap-2 text-gray-600">
              <Globe size={20} />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="bg-transparent border-none focus:outline-none flex-1"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <Search size={20} />
                )}
              </button>
            </div>
          </label>
        </div>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 