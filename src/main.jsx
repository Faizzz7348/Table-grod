import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './ErrorBoundary.jsx'
import FlexibleScrollDemo from './FlexibleScrollDemo.jsx'
import './index-clean.css'
import 'primeicons/primeicons.css';
import 'leaflet/dist/leaflet.css';
import { performanceMonitor } from './utils/performance.js';

// Initialize performance monitoring
performanceMonitor;

// Hide loading screen after app loads
const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<div style="color: red; padding: 20px; font-family: sans-serif;">❌ Root element not found! Please refresh the page.</div>';
  hideLoadingScreen();
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <FlexibleScrollDemo />
        </ErrorBoundary>
      </StrictMode>,
    );
    // Hide loading screen after render
    setTimeout(hideLoadingScreen, 100);
  } catch (error) {
    console.error('Failed to render app:', error);
    rootElement.innerHTML = `<div style="color: red; padding: 20px; font-family: sans-serif;">❌ Error loading app: ${error.message}<br><br>Please refresh the page or contact support.</div>`;
    hideLoadingScreen();
  }
}


