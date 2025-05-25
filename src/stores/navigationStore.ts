import { create } from 'zustand'
import type { UserProfile } from '@/types'
import { ROUTES } from '@/lib/constants'

interface NavigationState {
  // State
  redirectPath: string | null
  lastUserState: UserProfile | null

  // Actions
  setRedirectPath: (path: string | null) => void
  handleAuthNavigation: (user: UserProfile | null, currentPath: string) => string | null
  reset: () => void
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  // Initial state
  redirectPath: null,
  lastUserState: null,

  // Actions
  setRedirectPath: (redirectPath) => set({ redirectPath }),

  handleAuthNavigation: (user: UserProfile | null, currentPath: string) => {
    const { lastUserState } = get()
    
    // Check if auth state actually changed
    const userChanged = (
      (lastUserState === null && user !== null) || // User signed in
      (lastUserState !== null && user === null) || // User signed out
      (lastUserState?.id !== user?.id) // Different user
    )
    
    // Update last user state
    set({ lastUserState: user })
    
    if (!user) {
      // User not logged in - redirect to login if not on public pages
      const publicPaths = ['/', '/auth/login', '/auth/signup']
      if (!publicPaths.includes(currentPath)) {
        console.log('NavigationStore: Redirecting to login from', currentPath)
        return ROUTES.auth.login
      }
      return null
    }

    // User is logged in
    const needsOnboarding = !user.name || user.name === user.email
    
    console.log('NavigationStore: User navigation check:', {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      needsOnboarding,
      currentPath
    })

    if (needsOnboarding && currentPath !== ROUTES.onboarding) {
      console.log('NavigationStore: Redirecting to onboarding for', user.id)
      return ROUTES.onboarding
    }

    if (!needsOnboarding) {
      // Redirect from auth pages to chat after sign-in
      if (currentPath === ROUTES.auth.login || currentPath === ROUTES.auth.signup) {
        console.log('NavigationStore: Redirecting from auth page to chat')
        return ROUTES.app.chat
      }
      
      // Redirect from onboarding to chat
      if (currentPath === ROUTES.onboarding) {
        console.log('NavigationStore: Redirecting from onboarding to chat')
        return ROUTES.app.chat
      }
      
      // Redirect from root to chat for authenticated users
      if (currentPath === '/') {
        console.log('NavigationStore: Redirecting from root to chat')
        return ROUTES.app.chat
      }
    }

    return null
  },

  reset: () => set({ 
    redirectPath: null, 
    lastUserState: null 
  }),
})) 