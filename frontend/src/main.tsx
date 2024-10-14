import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "react-big-calendar/lib/css/react-big-calendar.css";
import App from './app/App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
