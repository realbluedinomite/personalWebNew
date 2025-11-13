import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // This ensures assets are loaded correctly
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  server: {
    open: true,
    port: 3000
  }
});
