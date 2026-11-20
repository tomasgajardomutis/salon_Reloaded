import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    // This repository is deployed outside AppDeploy (Cloudflare Pages).
    // Resolve the AppDeploy-only SDK imports to the local compatibility layer
    // in every build environment; do not depend on CF_PAGES being injected.
    alias: {
      '@appdeploy/client': fileURLToPath(
        new URL('./src/appdeploy-client-cloudflare.ts', import.meta.url),
      ),
    },
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
