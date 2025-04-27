import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './contexts/LanguageContext';
import { TimerProvider } from './contexts/TimerContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <TimerProvider>
        <App />
      </TimerProvider>
    </LanguageProvider>
  </StrictMode>
);