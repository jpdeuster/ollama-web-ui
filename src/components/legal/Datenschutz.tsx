import React from 'react';

export function Datenschutz() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Verantwortlicher</h2>
        <p className="mb-4">
          DeusterDevelopment<br />
          Jörg-Peter Deuster<br />
          <a href="mailto:jp@deuster-development.de" className="text-blue-600 hover:text-blue-800">
            jp@deuster-development.de
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Datenerfassung</h2>
        <p className="mb-4">
          Diese Web-Anwendung speichert keine personenbezogenen Daten. 
          Alle Konversationen mit dem Ollama-Modell werden lokal auf Ihrem Gerät verarbeitet.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Lokale Speicherung</h2>
        <p className="mb-4">
          Für die Funktionalität der Anwendung werden einige Daten im localStorage Ihres Browsers gespeichert:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Chat-Verlauf</li>
          <li>Benutzereinstellungen</li>
        </ul>
        <p>
          Diese Daten verlassen nicht Ihren Computer und können von Ihnen jederzeit gelöscht werden.
        </p>
      </section>
    </div>
  );
} 