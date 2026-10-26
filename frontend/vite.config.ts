import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { supabaseDbPlugin } from './src/server/supabaseDbPlugin';

export default defineConfig({
  plugins: [react(), supabaseDbPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
