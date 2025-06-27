import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import StripeProvider from './components/StripeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StripeProvider>
      <App />
    </StripeProvider>
  </StrictMode>
);