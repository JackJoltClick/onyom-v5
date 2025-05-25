import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { MeditationPlayer } from '@/components/meditation/MeditationPlayer'
import { useAuthNavigation } from '@/hooks/useAuthNavigation'

// Pages
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignUpPage } from '@/pages/auth/SignUpPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { ChatPage } from '@/pages/app/ChatPage'
import { MeditationsPage } from '@/pages/app/MeditationsPage'
import { BreathworkPage } from '@/pages/app/BreathworkPage'
import { ProfilePage } from '@/pages/app/ProfilePage'
import { DebugPage } from '@/pages/DebugPage'

// Navigation
import { BottomNavigation } from '@/components/navigation/BottomNavigation'

// Design System
import { DesignShowcase } from '@/components/ui/DesignShowcase'

import { ROUTES } from '@/lib/constants'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// App content component that uses navigation hook
function AppContent(): React.ReactElement {
  // This hook handles automatic navigation after auth state changes
  useAuthNavigation()

  return (
    <div className="app">
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.home} element={<LandingPage />} />
        <Route path={ROUTES.auth.login} element={<LoginPage />} />
        <Route path={ROUTES.auth.signup} element={<SignUpPage />} />
        
        {/* Design System Showcase */}
        <Route path="/design" element={<DesignShowcase />} />
        
        {/* Onboarding */}
        <Route
          path={ROUTES.onboarding}
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        
        {/* Protected app routes */}
        <Route
          path={ROUTES.app.chat}
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <ChatPage />
                <BottomNavigation />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path={ROUTES.app.meditations}
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <MeditationsPage />
                <BottomNavigation />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path={ROUTES.app.breathwork}
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <BreathworkPage />
                <BottomNavigation />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path={ROUTES.app.profile}
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <ProfilePage />
                <BottomNavigation />
              </div>
            </ProtectedRoute>
          }
        />
        
        {/* Debug route */}
        <Route path={ROUTES.debug} element={<DebugPage />} />
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
      
      {/* Global Meditation Player */}
      <MeditationPlayer />
      
      {/* Global toast notifications */}
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--onyom-bg-surface)',
            color: 'var(--onyom-text-primary)',
            border: '1px solid var(--onyom-border-soft)',
            borderRadius: 'var(--onyom-radius-lg)',
            boxShadow: 'var(--onyom-shadow-lg)',
          },
          success: {
            iconTheme: {
              primary: 'var(--onyom-accent-primary)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--onyom-error)',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  )
}

function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App 