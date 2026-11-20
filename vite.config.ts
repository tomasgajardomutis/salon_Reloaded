import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const cloudflareAlias = process.env.CF_PAGES
  ? { '@appdeploy/client': fileURLToPath(new URL('./src/appdeploy-client-cloudflare.ts', import.meta.url)) }
  : {};

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: cloudflareAlias,
  },
  build: {
    outDir: process.env.APPDEPLOY_VITE_OUT_DIR || 'dist',
    sourcemap:
      process.env.APPDEPLOY_VITE_SOURCEMAP === 'hidden' ? 'hidden' : false,
    rollupOptions: {
      maxParallelFileOps: 128,
    },
  },
});
