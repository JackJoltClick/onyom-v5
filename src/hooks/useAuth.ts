import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const signIn = useAuthStore((state) => state.signIn)
  const signUp = useAuthStore((state) => state.signUp)
  const signOut = useAuthStore((state) => state.signOut)
  const updateProfile = useAuthStore((state) => state.updateProfile)

  const isAuthenticated = user !== null

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
} 