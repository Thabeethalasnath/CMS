import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { supabaseDbPlugin } from './src/server/supabaseDbPlugin';

export default defineConfig({
  plugins: [react(), supabaseDbPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
