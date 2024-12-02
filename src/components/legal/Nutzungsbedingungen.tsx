import React from 'react';

export function Nutzungsbedingungen() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Nutzungsbedingungen</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Nutzung der Anwendung</h2>
        <p className="mb-4">
          Diese Web-Anwendung dient als Benutzeroberfläche für Ollama. 
          Sie ermöglicht die Interaktion mit verschiedenen KI-Modellen für private und geschäftliche Zwecke.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Haftungsausschluss</h2>
        <p className="mb-4">
          Die Antworten der KI-Modelle werden automatisch generiert. 
          Wir übernehmen keine Garantie für die Richtigkeit, Vollständigkeit oder Angemessenheit der generierten Inhalte.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Datenschutz</h2>
        <p className="mb-4">
          Alle Konversationen werden lokal auf Ihrem Gerät verarbeitet. 
          Es werden keine Daten an externe Server übermittelt, außer zur lokalen Ollama-Instanz.
        </p>
      </section>
    </div>
  );
} 