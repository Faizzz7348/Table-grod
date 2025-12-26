import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FlexibleScrollDemo from './FlexibleScrollDemo.jsx'
import { AnimatedModalDemo } from './components/AnimatedModalDemo'
import './index-clean.css'
import 'primeicons/primeicons.css';
import 'leaflet/dist/leaflet.css';

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <StrictMode>
    {/* Uncomment line berikut untuk test modal */}
    {/* <AnimatedModalDemo /> */}
    
    {/* Default app */}
    <FlexibleScrollDemo />
  </StrictMode>,
)
