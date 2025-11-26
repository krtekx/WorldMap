import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL: This makes assets load correctly on GitHub Pages (e.g. your-repo/assets/...)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});