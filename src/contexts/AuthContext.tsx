import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string | undefined
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('onyom_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('onyom_user')
      }
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate sign-in (replace with real auth later)
      const userName = email.split('@')[0]
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: userName
      }
      setUser(mockUser)
      localStorage.setItem('onyom_user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Sign-in error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true)
    try {
      // Simulate sign-up (replace with real auth later)
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        ...(name && { name })
      }
      setUser(mockUser)
      localStorage.setItem('onyom_user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Sign-up error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('onyom_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 