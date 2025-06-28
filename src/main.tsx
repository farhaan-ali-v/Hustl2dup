import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import StripeProvider from './components/StripeProvider.tsx';
import { TranslationProvider } from './components/TranslationProvider.tsx';
import { LingoProviderWrapper, loadDictionary } from "lingo.dev/react/client";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LingoProviderWrapper loadDictionary={(locale) => loadDictionary(locale)}>
      <TranslationProvider>
        <StripeProvider>
          <App />
        </StripeProvider>
      </TranslationProvider>
    </LingoProviderWrapper>
  </StrictMode>
);