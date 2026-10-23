import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ParaisoAdmin from './ParaisoAdmin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ParaisoAdmin />
  </StrictMode>,
)
