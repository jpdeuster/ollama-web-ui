import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/websearch': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/api/upload-pdf': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        secure: false,
      }
    },
  }
});