import type { TherapistPersonality, TherapistTone } from '@/types'

/**
 * App configuration constants
 */
export const APP_CONFIG = {
  name: 'Onyom',
  description: 'A modern wellness and therapy chat application',
  version: '1.0.0',
  maxMessageLength: 1000,
  maxChatSessions: 50,
  defaultTypingSpeed: 50,
  minTypingSpeed: 10,
  maxTypingSpeed: 100,
} as const

/**
 * API configuration
 */
export const API_CONFIG = {
  openai: {
    model: 'gpt-4',
    maxTokens: 500,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  },
  supabase: {
    realtime: {
      heartbeatIntervalMs: 30000,
      reconnectDelayMs: 1000,
    },
  },
} as const

/**
 * Route paths
 */
export const ROUTES = {
  home: '/',
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },
  onboarding: '/onboarding',
  app: {
    chat: '/app/chat',
    meditations: '/app/meditations',
    breathwork: '/app/breathwork',
    profile: '/app/profile',
  },
} as const

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  theme: 'onyom-theme',
  onboardingComplete: 'onyom-onboarding-complete',
  lastChatId: 'onyom-last-chat-id',
  typingSpeed: 'onyom-typing-speed',
} as const

/**
 * Therapist personality configurations
 */
export const THERAPIST_PERSONALITIES: Record<TherapistTone, TherapistPersonality> = {
  supportive: {
    tone: 'supportive',
    systemPrompt: `You are a supportive and encouraging therapist. Your approach is warm, optimistic, and partnership-focused. You help users feel empowered and capable of positive change. Use encouraging language, celebrate progress, and help users see their strengths. Ask open-ended questions that help users discover their own solutions.`,
    greeting: "Hello! I'm here to support you on your wellness journey. What would you like to talk about today?",
    characteristics: [
      'Encouraging and warm',
      'Focuses on strengths and progress',
      'Partnership approach to therapy',
      'Optimistic perspective',
      'Empowering language'
    ]
  },
  analytical: {
    tone: 'analytical',
    systemPrompt: `You are a thoughtful and analytical therapist. Your approach is methodical, pattern-focused, and insight-oriented. You help users understand underlying patterns in their thoughts and behaviors. Ask probing questions that encourage deep reflection and help users gain clarity about their experiences.`,
    greeting: "Welcome. I'd like to understand what's on your mind and explore it together. What patterns or thoughts have you been noticing lately?",
    characteristics: [
      'Thoughtful and methodical',
      'Pattern recognition focused',
      'Encourages deep reflection',
      'Insight-oriented approach',
      'Probing questions'
    ]
  },
  gentle: {
    tone: 'gentle',
    systemPrompt: `You are a gentle and nurturing therapist. Your approach is soft, deeply empathetic, and compassionate. You create a safe space for users to express vulnerable feelings. Use gentle language, validate emotions, and provide comfort while helping users process difficult experiences.`,
    greeting: "Hello, dear. I'm here to listen with care and compassion. Please feel free to share whatever is in your heart today.",
    characteristics: [
      'Soft and nurturing',
      'Deeply empathetic',
      'Creates safe emotional space',
      'Validates feelings',
      'Compassionate presence'
    ]
  }
} as const

/**
 * UI configuration
 */
export const UI_CONFIG = {
  animations: {
    typewriterDelay: 50, // milliseconds per character
    fadeInDuration: 300,
    slideUpDuration: 250,
    tabTransitionDuration: 200,
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
  toast: {
    duration: 4000,
    position: 'top-center' as const,
  },
} as const

/**
 * Validation constants
 */
export const VALIDATION = {
  email: {
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
  },
  message: {
    minLength: 1,
    maxLength: 1000,
  },
  chatTitle: {
    minLength: 1,
    maxLength: 100,
  },
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  auth: {
    invalidCredentials: 'Invalid email or password',
    emailAlreadyExists: 'An account with this email already exists',
    weakPassword: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    networkError: 'Network error. Please check your connection and try again.',
    sessionExpired: 'Your session has expired. Please sign in again.',
  },
  validation: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordMismatch: 'Passwords do not match',
    messageTooLong: `Message must be ${VALIDATION.message.maxLength} characters or less`,
    nameTooShort: `Name must be at least ${VALIDATION.name.minLength} characters`,
  },
  chat: {
    sendFailed: 'Failed to send message. Please try again.',
    loadFailed: 'Failed to load chat history.',
    connectionLost: 'Connection lost. Attempting to reconnect...',
    aiUnavailable: 'AI assistant is temporarily unavailable.',
  },
  general: {
    unexpectedError: 'An unexpected error occurred. Please try again.',
    offline: 'You appear to be offline. Please check your connection.',
  },
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  auth: {
    signUpSuccess: 'Account created successfully! Welcome to Onyom.',
    signInSuccess: 'Welcome back!',
    signOutSuccess: 'Signed out successfully.',
    profileUpdated: 'Profile updated successfully.',
  },
  chat: {
    messageSent: 'Message sent.',
    chatCleared: 'Chat history cleared.',
  },
  settings: {
    saved: 'Settings saved successfully.',
    themeChanged: 'Theme preference updated.',
  },
} as const 