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
    sourceRoot: "src",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],

    // Add this section:
    models: {
      ":": "mistral:mistral-small", // You can use mistral-small, mistral-medium, etc.
    },
    lingoDir: "src/lingo",
  })(viteConfig),
);
