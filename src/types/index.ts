import type { ReactNode } from 'react'

/**
 * Core database types
 */
export interface UserProfile {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  therapist_tone: TherapistTone
  theme_preference: ThemePreference
  typing_speed: number
  created_at: string
  updated_at: string
}

export interface Chat {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  chat_id: string
  content: string
  sender: MessageSender
  created_at: string
}

/**
 * Enums and union types
 */
export type TherapistTone = 'supportive' | 'analytical' | 'gentle'
export type ThemePreference = 'dark' | 'light' | 'system'
export type MessageSender = 'user' | 'assistant'

/**
 * Component props interfaces
 */
export interface ChatBubbleProps {
  message: Message
  isTyping?: boolean
  onTypingComplete?: () => void
  className?: string
}

export interface ChatInputProps {
  onSendMessage: (content: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export interface TopBarProps {
  title: string
  showBackButton?: boolean
  onBackClick?: () => void
  showSettingsButton?: boolean
  onSettingsClick?: () => void
  className?: string
}

export interface TabBarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  className?: string
}

export interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  userProfile: UserProfile | null
  onUpdateProfile: (updates: Partial<UserProfile>) => void
}

export interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

/**
 * Navigation types
 */
export type TabType = 'chat' | 'meditations' | 'profile' | 'settings'

/**
 * Form types
 */
export interface LoginFormData {
  email: string
  password: string
}

export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
}

export interface OnboardingFormData {
  name: string
  therapist_tone: TherapistTone
  theme_preference: ThemePreference
  typing_speed: number
}

export interface ProfileFormData {
  name: string
  therapist_tone: TherapistTone
  theme_preference: ThemePreference
  typing_speed: number
}

/**
 * API response types
 */
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  success: boolean
}

export interface ChatCompletionResponse {
  content: string
  role: 'assistant'
}

/**
 * Context types
 */
export interface ThemeContextValue {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
  isDark: boolean
}

export interface AuthContextValue {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

/**
 * Hook return types
 */
export interface UseTypewriterReturn {
  displayText: string
  isTyping: boolean
  startTyping: (text: string) => void
  stopTyping: () => void
}

export interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
}

/**
 * Utility types
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Error types
 */
export interface AppError {
  code: string
  message: string
  details?: Record<string, unknown>
}

/**
 * Theme context value
 */
export interface SettingsContextValue {
  settings: {
    theme: ThemePreference
    typingSpeed: number
  }
  updateSettings: (settings: Partial<SettingsContextValue['settings']>) => void
}

/**
 * Therapist personality configurations
 */
export interface TherapistPersonality {
  tone: TherapistTone
  systemPrompt: string
  greeting: string
  characteristics: string[]
}

/**
 * Chat session data
 */
export interface ChatSession {
  id: string
  title: string
  messageCount: number
  lastMessageAt: string
  therapistTone: TherapistTone
} 