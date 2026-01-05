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
if (!rootElement) {
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Root element not found!</div>';
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <FlexibleScrollDemo />
        </ErrorBoundary>
      </StrictMode>,
    )
  } catch (error) {
    console.error('Failed to render app:', error);
    rootElement.innerHTML = `<div style="color: red; padding: 20px;">Error: ${error.message}</div>`;
  }
}


