import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import * as pdfjsLib from 'pdfjs-dist';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const server = createServer(app);

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'PDF Server Running',
    endpoints: {
      health: '/health',
      version: '/api/version',
      pdfUpload: '/api/upload-pdf',
      webSearch: '/api/websearch'
    },
    documentation: 'PDF Upload und Verarbeitungsserver'
  });
});

// Version endpoint
app.get('/api/version', (req, res) => {
  res.json({ version: '1.0.0', status: 'running' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'pdf-server'
  });
});

const upload = multer({ storage: multer.memoryStorage() });

// PDF Parser Funktion
async function parsePDF(buffer: Buffer): Promise<string> {
  const data = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(' ') + '\n';
  }
  
  return fullText.trim();
}

// PDF upload endpoint
app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  console.log('PDF Upload-Anfrage empfangen');
  
  try {
    if (!req.file) {
      console.log('Keine Datei im Request gefunden');
      return res.status(400).json({ error: 'Keine Datei hochgeladen' });
    }

    console.log('Datei empfangen:', {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer ? 'Buffer vorhanden' : 'Kein Buffer'
    });

    try {
      const text = await parsePDF(req.file.buffer);
      console.log('PDF erfolgreich geparst, Textlänge:', text.length);
      
      res.json({ 
        text: text,
        pages: text.split('\n').length
      });
    } catch (parseError) {
      console.error('PDF Parse Fehler:', parseError);
      res.status(500).json({ 
        error: 'PDF Parse Fehler',
        details: parseError instanceof Error ? parseError.message : 'Unbekannter Fehler'
      });
    }
  } catch (error) {
    console.error('Server Fehler:', error);
    res.status(500).json({ 
      error: 'Server Fehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

// Web Search Endpoint
app.post('/api/websearch', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL ist erforderlich' });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Entferne Scripts, Styles und andere unwichtige Elemente
    $('script').remove();
    $('style').remove();
    $('head').remove();
    
    // Extrahiere den Text
    const text = $('body')
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    res.json({ 
      content: text,
      url: url
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Webseite:', error);
    res.status(500).json({ 
      error: 'Fehler beim Abrufen der Webseite',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    server.listen(port, () => {
      const address = server.address() as AddressInfo;
      console.log(`✅ PDF-Server erfolgreich gestartet auf Port ${address.port}`);
      console.log(`🔗 Server-URL: http://localhost:${address.port}`);
      console.log(`📝 Health-Check: http://localhost:${address.port}/health`);
    });
  } catch (error) {
    console.error('❌ Kritischer Fehler beim Serverstart:', 
      error instanceof Error ? error.message : 'Unbekannter Fehler');
    process.exit(1);
  }
}

startServer(); 