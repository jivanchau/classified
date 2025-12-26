import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', '@emotion/cache']
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
