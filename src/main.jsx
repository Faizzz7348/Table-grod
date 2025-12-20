import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FlexibleScrollDemo from './FlexibleScrollDemo.jsx'
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FlexibleScrollDemo />
  </StrictMode>,
)
