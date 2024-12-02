import React from 'react';

export function Impressum() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Impressum</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
        <p className="mb-4">
          DeusterDevelopment<br />
          Jörg-Peter Deuster<br />
          <a href="mailto:jp@deuster-development.de" className="text-blue-600 hover:text-blue-800">
            jp@deuster-development.de
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Haftungsausschluss</h2>
        <p className="mb-4">
          Die Inhalte dieser Anwendung wurden mit größtmöglicher Sorgfalt erstellt. 
          Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
        </p>
      </section>
    </div>
  );
} 