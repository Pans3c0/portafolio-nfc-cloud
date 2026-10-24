import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Configuración de Vite optimizada para despliegue estático en Cloudflare Pages.
 * El comando `npm run build` genera la carpeta `dist/` lista para subir sin servidor Node.
 */
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
