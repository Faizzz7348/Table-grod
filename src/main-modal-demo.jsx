import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatedModalDemo } from './components/AnimatedModalDemo'
import './index-clean.css'
import 'primeicons/primeicons.css'

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <StrictMode>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AnimatedModalDemo />
    </div>
  </StrictMode>,
)
