import type { TherapistPersonality, TherapistTone, Meditation, MeditationCategory } from '@/types'

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

/**
 * Meditation configuration
 */
export const MEDITATION_CONFIG = {
  categories: {
    mindfulness: {
      name: 'Mindfulness',
      description: 'Present moment awareness and acceptance',
      icon: '🧘',
      color: '#4F46E5'
    },
    'anxiety-relief': {
      name: 'Anxiety Relief',
      description: 'Calming practices for anxious thoughts',
      icon: '😌',
      color: '#059669'
    },
    sleep: {
      name: 'Sleep',
      description: 'Relaxation for better rest',
      icon: '🌙',
      color: '#7C3AED'
    },
    focus: {
      name: 'Focus',
      description: 'Concentration and clarity practices',
      icon: '🎯',
      color: '#DC2626'
    },
    'self-compassion': {
      name: 'Self-Compassion',
      description: 'Loving-kindness towards yourself',
      icon: '💝',
      color: '#EC4899'
    },
    'body-scan': {
      name: 'Body Scan',
      description: 'Progressive relaxation techniques',
      icon: '🫧',
      color: '#0891B2'
    },
    breathing: {
      name: 'Breathing',
      description: 'Focused breathwork exercises',
      icon: '🫁',
      color: '#65A30D'
    },
    'stress-relief': {
      name: 'Stress Relief',
      description: 'Techniques for managing daily stress',
      icon: '🌊',
      color: '#0284C7'
    },
    'loving-kindness': {
      name: 'Loving Kindness',
      description: 'Compassion for self and others',
      icon: '❤️',
      color: '#BE185D'
    }
  } as Record<MeditationCategory, { name: string; description: string; icon: string; color: string }>,
  
  defaultDurations: [5, 10, 15, 20, 30, 45] as const,
  
  backgroundSounds: {
    rain: { name: 'Rain', icon: '🌧️' },
    ocean: { name: 'Ocean Waves', icon: '🌊' },
    forest: { name: 'Forest', icon: '🌲' },
    birds: { name: 'Birds', icon: '🐦' },
    silence: { name: 'Silence', icon: '🔇' }
  }
} as const

/**
 * Sample meditation library
 */
export const SAMPLE_MEDITATIONS: Meditation[] = [
  {
    id: '1',
    title: 'Morning Mindfulness',
    description: 'Start your day with intention and awareness. A gentle practice to center yourself.',
    duration_minutes: 10,
    category: 'mindfulness',
    difficulty_level: 'beginner',
    script_text: 'Welcome to your morning mindfulness practice. Find a comfortable position...',
    instructor: 'Sarah Chen',
    tags: ['morning', 'beginners', 'daily'],
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    title: 'Anxiety Release',
    description: 'A calming meditation to help release anxious thoughts and find peace.',
    duration_minutes: 15,
    category: 'anxiety-relief',
    difficulty_level: 'beginner',
    script_text: 'Take a moment to notice where you are. Notice any anxiety in your body...',
    instructor: 'Dr. Michael Torres',
    tags: ['anxiety', 'calm', 'breathing'],
    created_at: '2024-01-16T14:30:00Z'
  },
  {
    id: '3',
    title: 'Deep Sleep Journey',
    description: 'Drift into peaceful sleep with this guided relaxation practice.',
    duration_minutes: 20,
    category: 'sleep',
    difficulty_level: 'beginner',
    script_text: 'As you settle into bed, allow your body to fully relax...',
    instructor: 'Luna Rodriguez',
    tags: ['sleep', 'relaxation', 'evening'],
    created_at: '2024-01-17T21:00:00Z'
  },
  {
    id: '4',
    title: 'Focus & Clarity',
    description: 'Sharpen your concentration and clear mental fog with this practice.',
    duration_minutes: 12,
    category: 'focus',
    difficulty_level: 'intermediate',
    script_text: 'Sit upright with your spine straight. We will practice single-pointed focus...',
    instructor: 'James Kim',
    tags: ['concentration', 'productivity', 'clarity'],
    created_at: '2024-01-18T09:15:00Z'
  },
  {
    id: '5',
    title: 'Self-Compassion Practice',
    description: 'Cultivate kindness towards yourself with this heart-opening meditation.',
    duration_minutes: 18,
    category: 'self-compassion',
    difficulty_level: 'intermediate',
    script_text: 'Place your hand on your heart. Feel the warmth and rhythm...',
    instructor: 'Dr. Elena Vasquez',
    tags: ['self-love', 'healing', 'emotions'],
    created_at: '2024-01-19T16:45:00Z'
  },
  {
    id: '6',
    title: 'Full Body Scan',
    description: 'Progressive relaxation from head to toe, releasing tension everywhere.',
    duration_minutes: 25,
    category: 'body-scan',
    difficulty_level: 'beginner',
    script_text: 'Begin by noticing the top of your head. Scan slowly down...',
    instructor: 'David Park',
    tags: ['relaxation', 'tension-release', 'body-awareness'],
    created_at: '2024-01-20T12:00:00Z'
  }
] 