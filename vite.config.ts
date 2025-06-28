import 'dotenv/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import lingoCompiler from 'lingo.dev/compiler';

// Wrap your config using lingoCompiler.vite()
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
    targetLocales: ['es', 'fr', 'de'],
    llm: {
      mistral: {
        apiKey: process.env.MISTRAL_API_KEY
      }
    },
    models: {
      "es": "mistral:mistral-7b-instruct",
      "fr": "mistral:mistral-7b-instruct",
      "de": "mistral:mistral-7b-instruct"
    }
  })(viteConfig)
);