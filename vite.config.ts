import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import lingoCompiler from 'lingo.dev/compiler';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const viteConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
};

export default defineConfig(() =>
  lingoCompiler.vite({
    sourceRoot: 'src',
    sourceLocale: 'en',
    targetLocales: ['es', 'fr', 'de'],
    models: {
      'es': 'mistral:mistral-small',
      'fr': 'mistral:mistral-small', 
      'de': 'mistral:mistral-small',
    },
    lingoDir: 'src/lingo',
  })(viteConfig)
);