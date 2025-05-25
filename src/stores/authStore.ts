import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useNavigationStore } from '@/stores/navigationStore'
import type { UserProfile } from '@/types'

interface AuthState {
  // State
  user: UserProfile | null
  isLoading: boolean
  isInitialized: boolean

  // Actions
  setUser: (user: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<{ needsEmailVerification: boolean }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  initialize: () => Promise<void>
  resendVerificationEmail: (email: string) => Promise<void>
}

// Track if we're already loading a profile to prevent duplicates
let isLoadingProfile = false

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      isInitialized: false,

      // Actions
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          
          if (!isSupabaseConfigured) {
            // Development fallback - simulate successful signin
            console.log('AuthStore: Supabase not configured, simulating signin...')
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
            
            const mockUser = {
              id: `mock-${Date.now()}`,
              email,
              name: '', // Empty name to trigger onboarding
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              avatar_url: null,
              therapist_tone: 'supportive' as const,
              theme_preference: 'dark' as const,
              typing_speed: 50
            }
            
            set({ user: mockUser, isLoading: false })
            console.log('AuthStore: Mock signin successful')
            return
          }

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw new Error(error.message)
          if (!data.user) throw new Error('No user returned from sign in')

          await loadUserProfileWithTimeout(data.user.id, set)
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      signUp: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          
          if (!isSupabaseConfigured) {
            // Development fallback - simulate successful signup
            console.log('AuthStore: Supabase not configured, simulating signup...')
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
            
            const mockUser = {
              id: `mock-${Date.now()}`,
              email,
              name: '', // Empty name to trigger onboarding
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              avatar_url: null,
              therapist_tone: 'supportive' as const,
              theme_preference: 'dark' as const,
              typing_speed: 50
            }
            
            console.log('AuthStore: Setting mock user:', mockUser)
            set({ user: mockUser, isLoading: false })
            console.log('AuthStore: Mock signup successful, user state updated')
            return { needsEmailVerification: false }
          }
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          })

          if (error) throw new Error(error.message)
          
          // If user is created and confirmed immediately (no email confirmation required)
          if (data.user && data.session) {
            console.log('AuthStore: User signed up and confirmed, loading profile...')
            await loadUserProfileWithTimeout(data.user.id, set)
            return { needsEmailVerification: false }
          } else {
            console.log('AuthStore: User signed up, waiting for email confirmation...')
            set({ isLoading: false })
            return { needsEmailVerification: true }
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true })
          console.log('AuthStore: Signing out...')
          
          // Add timeout to sign out
          const signOutPromise = supabase.auth.signOut()
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Sign out timeout')), 10000)
          )
          
          const { error } = await Promise.race([signOutPromise, timeoutPromise]) as any
          
          if (error) throw new Error(error.message)
          
          console.log('AuthStore: Sign out successful')
          set({ user: null, isLoading: false })
          
          // Reset navigation state when signing out
          useNavigationStore.getState().reset()
        } catch (error) {
          console.error('AuthStore: Error signing out:', error)
          set({ isLoading: false })
          throw error
        }
      },

      updateProfile: async (updates: Partial<UserProfile>) => {
        const { user } = get()
        if (!user) throw new Error('No user logged in')

        try {
          const { error } = await supabase
            .from('user_profiles')
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

          if (error) throw new Error(error.message)

          // Update local state
          set({ user: { ...user, ...updates } })
        } catch (error) {
          throw error
        }
      },

      initialize: async () => {
        console.log('AuthStore: Starting initialization...')
        if (get().isInitialized) {
          console.log('AuthStore: Already initialized')
          return
        }
        
        if (!isSupabaseConfigured) {
          console.log('AuthStore: Supabase not configured, setting initialized to true')
          set({ isInitialized: true, isLoading: false })
          return
        }
        
        try {
          console.log('AuthStore: Setting loading to true')
          set({ isLoading: true })
          
          // Get current session with timeout
          console.log('AuthStore: Getting current session...')
          const sessionPromise = supabase.auth.getSession()
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session timeout')), 10000)
          )
          
          const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any
          console.log('AuthStore: Session result:', session ? 'Session found' : 'No session')
          
          if (session?.user) {
            console.log('AuthStore: Loading user profile for user:', session.user.id)
            await loadUserProfileWithTimeout(session.user.id, set)
          }
          
          console.log('AuthStore: Setting initialized to true')
          set({ isInitialized: true, isLoading: false })
        } catch (error) {
          console.error('AuthStore: Error initializing auth:', error)
          // Always set initialized to true so app doesn't hang
          set({ isInitialized: true, isLoading: false })
        }
      },

      resendVerificationEmail: async (email: string) => {
        try {
          set({ isLoading: true })
          console.log('AuthStore: Resending verification email...')
          
          if (!isSupabaseConfigured) {
            console.log('AuthStore: Supabase not configured, skipping resend verification email')
            set({ isLoading: false })
            return
          }
          
          const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email: email
          })

          if (error) throw new Error(error.message)
          
          console.log('AuthStore: Verification email resend successful')
          set({ isLoading: false })
        } catch (error) {
          console.error('AuthStore: Error resending verification email:', error)
          set({ isLoading: false })
          throw error
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isInitialized: state.isInitialized 
      }),
      onRehydrateStorage: () => (state) => {
        console.log('AuthStore: Rehydrating from storage:', state)
      },
    }
  )
)

// Helper function to load user profile with timeout
async function loadUserProfileWithTimeout(
  userId: string, 
  set: (state: Partial<AuthState>) => void
) {
  // Prevent duplicate calls
  if (isLoadingProfile) {
    console.log('AuthStore: Profile loading already in progress, skipping...')
    return
  }
  
  isLoadingProfile = true
  
  try {
    await loadUserProfile(userId, set)
  } finally {
    isLoadingProfile = false
  }
}

// Helper function to load user profile
async function loadUserProfile(
  userId: string, 
  set: (state: Partial<AuthState>) => void
) {
  console.log('AuthStore: loadUserProfile called for user:', userId)
  try {
    console.log('AuthStore: Querying user_profiles table...')
    
    // Add timeout to the query
    const queryPromise = supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile query timeout')), 15000)
    )
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any

    if (error) {
      console.log('AuthStore: Error querying user_profiles:', error.code, error.message)
      // If user profile doesn't exist, create one
      if (error.code === 'PGRST116') {
        console.log('AuthStore: User profile not found, creating new one...')
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          console.log('AuthStore: No auth user found, stopping')
          set({ isLoading: false })
          return
        }

        console.log('AuthStore: Creating new user profile...')
        // Create new profile with timeout
        const createPromise = supabase
          .from('user_profiles')
          .insert({
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || authUser.email || 'User'
          })
          .select()
          .single()
        
        const createTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile creation timeout')), 15000)
        )

        const { data: newProfile, error: createError } = await Promise.race([createPromise, createTimeoutPromise]) as any

        if (createError) {
          console.error('AuthStore: Error creating user profile:', createError)
          set({ isLoading: false })
          return
        }

        console.log('AuthStore: New user profile created:', newProfile)
        set({ user: newProfile, isLoading: false })
      } else {
        console.error('AuthStore: Error loading user profile:', error)
        set({ isLoading: false })
      }
      return
    }

    console.log('AuthStore: User profile loaded successfully:', data)
    set({ user: data, isLoading: false })
  } catch (error) {
    console.error('AuthStore: Exception in loadUserProfile:', error)
    set({ isLoading: false })
  }
}

// Set up auth state change listener
if (isSupabaseConfigured) {
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('AuthStore: Auth state changed:', event, session ? 'Session exists' : 'No session')
    const { setUser, setLoading } = useAuthStore.getState()
    
    if (event === 'SIGNED_IN' && session?.user) {
      console.log('AuthStore: User signed in, loading profile...')
      await loadUserProfileWithTimeout(session.user.id, useAuthStore.setState)
    } else if (event === 'SIGNED_OUT') {
      console.log('AuthStore: User signed out')
      setUser(null)
      setLoading(false)
    }
  })
} else {
  console.log('AuthStore: Supabase not configured, skipping auth state listener setup')
} 