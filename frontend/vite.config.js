// vite.config.js
// Configuración de Vite (la herramienta que ejecuta React mientras programamos).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // PROXY ("la recepcionista"):
    // todo pedido que empiece con /api se lo pasamos a Express (puerto 3000)
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});