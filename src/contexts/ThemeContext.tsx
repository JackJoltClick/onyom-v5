import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ThemeContextValue, ThemePreference } from '@/types'
import { getStorageItem, setStorageItem, resolveTheme, applyTheme } from '@/lib/utils'
import { STORAGE_KEYS } from '@/lib/constants'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
  const [theme, setThemeState] = useState<ThemePreference>(() =>
    getStorageItem(STORAGE_KEYS.theme, 'dark')
  )

  const setTheme = (newTheme: ThemePreference): void => {
    setThemeState(newTheme)
    setStorageItem(STORAGE_KEYS.theme, newTheme)
  }

  const isDark = resolveTheme(theme) === 'dark'

  useEffect(() => {
    const resolvedTheme = resolveTheme(theme)
    applyTheme(resolvedTheme)
  }, [theme])

  // Listen for system theme changes when using 'system' preference
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (): void => {
      applyTheme(resolveTheme(theme))
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const value: ThemeContextValue = {
    theme,
    setTheme,
    isDark,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 