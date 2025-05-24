import { clsx, type ClassValue } from 'clsx'
import type { ThemePreference } from '@/types'

/**
 * Utility for combining CSS classes
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

/**
 * Format date/time utilities
 */
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60)
    return minutes <= 1 ? 'Just now' : `${minutes}m ago`
  }

  if (diffInHours < 24) {
    const hours = Math.floor(diffInHours)
    return `${hours}h ago`
  }

  if (diffInHours < 48) {
    return 'Yesterday'
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export function formatChatTitle(firstMessage: string, maxLength: number = 40): string {
  if (firstMessage.length <= maxLength) {
    return firstMessage
  }
  
  return firstMessage.substring(0, maxLength).trim() + '...'
}

/**
 * Theme utilities
 */
export function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme(preference: ThemePreference): 'dark' | 'light' {
  if (preference === 'system') {
    return getSystemTheme()
  }
  return preference
}

export function applyTheme(theme: 'dark' | 'light'): void {
  if (typeof window === 'undefined') return
  
  const root = window.document.documentElement
  root.setAttribute('data-theme', theme)
}

/**
 * Local storage utilities
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error)
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error)
  }
}

/**
 * Text processing utilities
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/[<>]/g, '') // Remove potential HTML brackets
}

export function generateChatTitle(firstMessage: string): string {
  const words = firstMessage.split(' ').slice(0, 6)
  let title = words.join(' ')
  
  if (firstMessage.split(' ').length > 6) {
    title += '...'
  }
  
  return title
}

/**
 * Validation utilities
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

/**
 * Debounce utility
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Sleep utility for testing
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Error handling utilities
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('Network') || 
           error.message.includes('fetch') ||
           error.message.includes('connection')
  }
  return false
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred'
}

/**
 * URL utilities
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.origin !== window.location.origin
  } catch {
    return false
  }
}

/**
 * Array utilities
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp!
  }
  return shuffled
}

/**
 * Object utilities
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}

/**
 * Device detection utilities
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export function isIOS(): boolean {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches
} 