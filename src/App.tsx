import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignUpPage } from '@/pages/auth/SignUpPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { ChatPage } from '@/pages/app/ChatPage'
import { MeditationsPage } from '@/pages/app/MeditationsPage'
import { BreathworkPage } from '@/pages/app/BreathworkPage'
import { ProfilePage } from '@/pages/app/ProfilePage'
import { useAuthNavigation } from '@/hooks/useAuthNavigation'
import { ROUTES } from '@/lib/constants'

function AppRoutes(): React.ReactElement {
  const { isInitialized } = useAuthNavigation()

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.home} element={<LandingPage />} />
      <Route path={ROUTES.auth.login} element={<LoginPage />} />
      <Route path={ROUTES.auth.signup} element={<SignUpPage />} />
      
      {/* Protected routes */}
      <Route
        path={ROUTES.onboarding}
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.app.chat}
        element={
          <ProtectedRoute>
            <AppLayout>
              <ChatPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.app.meditations}
        element={
          <ProtectedRoute>
            <AppLayout>
              <MeditationsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.app.breathwork}
        element={
          <ProtectedRoute>
            <AppLayout>
              <BreathworkPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.app.profile}
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  )
}

function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App 