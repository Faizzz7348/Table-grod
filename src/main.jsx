import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FlexibleScrollDemo from './FlexibleScrollDemo.jsx'
import './index.css'
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';
import 'leaflet/dist/leaflet.css';

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <StrictMode>
    <FlexibleScrollDemo />
  </StrictMode>,
)
