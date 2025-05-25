import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { registerServiceWorker, setupNetworkStatusListeners, setupPWAInstallPrompt } from '@/lib/serviceWorker'
import '@/styles/globals.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Register service worker for PWA functionality
if (import.meta.env.PROD) {
  registerServiceWorker({
    onSuccess: () => {
      console.log('PWA: App is ready for offline use')
    },
    onUpdate: () => {
      console.log('PWA: New content available, please refresh')
    },
    onOffline: () => {
      console.log('PWA: App is now offline')
    },
    onOnline: () => {
      console.log('PWA: App is back online')
    }
  })
}

// Setup network status listeners
setupNetworkStatusListeners()

// Setup PWA install prompt
setupPWAInstallPrompt() 