import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/app/App';
import '@/styles/index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker using vite-plugin-pwa module
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('[PWA] Service Worker: New content is available; please refresh.');
  },
  onOfflineReady() {
    console.log('[PWA] Service Worker: App is ready for offline usage.');
  },
  onRegistered(registration) {
    console.log('[PWA] Service Worker registered successfully:', registration);
  },
  onRegisterError(error) {
    console.error('[PWA] Service Worker registration failed:', error);
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
