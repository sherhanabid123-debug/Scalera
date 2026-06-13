import React from 'react'
import ReactDOM from 'react-dom/client'
import ScaleraAIBuilder from './components/sections/ScaleraAIBuilder'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ScaleraAIBuilder onBack={() => { window.location.href = '/' }} />
  </React.StrictMode>
)
