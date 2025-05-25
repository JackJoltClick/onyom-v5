import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const signIn = useAuthStore((state) => state.signIn)
  const signUp = useAuthStore((state) => state.signUp)
  const signOut = useAuthStore((state) => state.signOut)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const resendVerificationEmail = useAuthStore((state) => state.resendVerificationEmail)

  const isAuthenticated = user !== null

  // Debug authentication state changes
  useEffect(() => {
    console.log('useAuth: Auth state changed:', {
      isAuthenticated,
      isLoading,
      isInitialized,
      userId: user?.id,
      userEmail: user?.email
    })
  }, [isAuthenticated, isLoading, isInitialized, user?.id, user?.email])

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resendVerificationEmail,
  }
} 