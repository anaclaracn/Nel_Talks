// src/main.jsx (Versão Corrigida)
import React, { StrictMode } from 'react' // <--- Garante o import de React
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)