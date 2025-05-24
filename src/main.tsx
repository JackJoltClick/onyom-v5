import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { registerServiceWorker, setupNetworkStatusListeners, setupPWAInstallPrompt } from '@/lib/serviceWorker'
import '@/styles/globals.css'

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
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