import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/palette.css'
import './styles/typography.css'
import './styles/shadows.css'
import './styles/app.css'
import './styles/screens.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
