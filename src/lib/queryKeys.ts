/**
 * Query key factory for React Query
 * Provides type-safe, hierarchical query keys
 */
export const queryKeys = {
  all: ['onyom'] as const,
  
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    profile: (userId: string) => [...queryKeys.auth.all, 'profile', userId] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
  
  chats: {
    all: ['chats'] as const,
    lists: () => [...queryKeys.chats.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.chats.lists(), userId] as const,
    details: () => [...queryKeys.chats.all, 'detail'] as const,
    detail: (chatId: string) => [...queryKeys.chats.details(), chatId] as const,
  },
  
  messages: {
    all: ['messages'] as const,
    lists: () => [...queryKeys.messages.all, 'list'] as const,
    list: (chatId: string) => [...queryKeys.messages.lists(), chatId] as const,
    infinite: (chatId: string) => [...queryKeys.messages.all, 'infinite', chatId] as const,
  },
  
  therapist: {
    all: ['therapist'] as const,
    personalities: () => [...queryKeys.therapist.all, 'personalities'] as const,
    completion: (prompt: string) => [...queryKeys.therapist.all, 'completion', prompt] as const,
  },
  
  settings: {
    all: ['settings'] as const,
    theme: () => [...queryKeys.settings.all, 'theme'] as const,
    typing: () => [...queryKeys.settings.all, 'typing'] as const,
  },
} as const

/**
 * Utility to invalidate related queries
 */
export const invalidationKeys = {
  // Invalidate all user-related data
  user: (userId: string) => [
    queryKeys.auth.profile(userId),
    queryKeys.chats.list(userId),
    queryKeys.settings.all,
  ],
  
  // Invalidate chat-related data
  chat: (chatId: string) => [
    queryKeys.chats.detail(chatId),
    queryKeys.messages.list(chatId),
    queryKeys.messages.infinite(chatId),
  ],
  
  // Invalidate all chats for a user
  allChats: (userId: string) => [
    queryKeys.chats.list(userId),
    queryKeys.chats.all,
  ],
  
  // Invalidate auth data
  auth: () => [
    queryKeys.auth.all,
    queryKeys.settings.all,
  ],
} as const 