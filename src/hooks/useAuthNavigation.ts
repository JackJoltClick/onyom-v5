import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useNavigationStore } from '@/stores/navigationStore'

export function useAuthNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const user = useAuthStore((state) => state.user)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const initialize = useAuthStore((state) => state.initialize)
  
  const handleAuthNavigation = useNavigationStore((state) => state.handleAuthNavigation)

  // Initialize auth on mount
  useEffect(() => {
    initialize()
  }, [initialize])

  // Handle navigation based on auth state
  useEffect(() => {
    if (!isInitialized) return

    const redirectPath = handleAuthNavigation(user, location.pathname)
    
    if (redirectPath) {
      console.log('AuthNavigation: Redirecting to', redirectPath)
      navigate(redirectPath, { replace: true })
    }
  }, [user, isInitialized, location.pathname, handleAuthNavigation, navigate])

  return {
    isInitialized,
    user,
  }
} 