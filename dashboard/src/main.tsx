/**
 * Sharif Digital Hub - WiFi Hotspot Billing System Dashboard
 * Copyright (c) 2024 Sharif Digital Hub. All rights reserved.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
