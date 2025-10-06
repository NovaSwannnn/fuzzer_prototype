import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ... your existing setupVite function ...

export function serveStatic(app: express.Express) {
  // Serve static files from the Vite build
  app.use(express.static(path.join(__dirname, '../dist/public')));

  // Important: Handle client-side routing for SPA
  // This must be after all API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'));
  });
}

// ... rest of your existing code ...
