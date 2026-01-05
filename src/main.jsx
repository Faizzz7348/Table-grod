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

const rootElement = document.getElementById('root');
console.log('🚀 App initializing...', { rootElement: !!rootElement });

// Force hide loading screen if taking too long
setTimeout(() => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.remove();
    console.log('⏰ Loading screen force removed after timeout');
  }
}, 2000);

if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<div style="color: red; padding: 20px; font-family: sans-serif; text-align: center; margin-top: 50px;"><h2>❌ App Failed to Load</h2><p>Root element not found!</p><button onclick="location.reload()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Reload Page</button></div>';
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) loadingScreen.remove();
} else {
  try {
    console.log('✅ Rendering React app...');
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <FlexibleScrollDemo />
        </ErrorBoundary>
      </StrictMode>,
    );
    console.log('✅ React app rendered successfully');
  } catch (error) {
    console.error('❌ Failed to render app:', error);
    rootElement.innerHTML = `<div style="color: red; padding: 20px; font-family: sans-serif; text-align: center; margin-top: 50px;"><h2>❌ App Failed to Load</h2><p>Error: ${error.message}</p><button onclick="location.reload()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-top: 10px;">Reload Page</button></div>`;
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) loadingScreen.remove();
  }
}

