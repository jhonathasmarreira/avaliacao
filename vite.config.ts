import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const raiz = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/avaliacao/' : '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(raiz, 'index.html'),
        cypressTest: resolve(raiz, 'cypress-test/index.html'),
        sandbox: resolve(raiz, 'sandbox.html'),
      },
    },
  },
});
