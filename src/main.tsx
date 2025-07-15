import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { exposeCacheUtils } from './utils/cacheUtils'

// Exponer utilidades de caché en desarrollo
exposeCacheUtils()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
