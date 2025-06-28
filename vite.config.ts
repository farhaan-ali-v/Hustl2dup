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

    // Optional prompt (good default):
    prompt: Act as a professional software localization expert. Translate each string from {source} to {target}.
Preserve placeholders like {name} and {{count}}, and do not translate technical terms like "API", "SDK", or "React".
Maintain Markdown and code formatting. Match the tone and formality of the original.,

    lingoDir: "src/lingo",
  })(viteConfig),
);
