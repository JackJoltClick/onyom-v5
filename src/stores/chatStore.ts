import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/lib/constants'

interface ChatUIState {
  // Current chat state
  currentChatId: string | null
  isTyping: boolean
  
  // UI state  
  showWelcome: boolean
  
  // Actions
  setCurrentChatId: (chatId: string | null) => void
  setIsTyping: (isTyping: boolean) => void
  setShowWelcome: (show: boolean) => void
  clearCurrentChat: () => void
}

export const useChatStore = create<ChatUIState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentChatId: null,
      isTyping: false,
      showWelcome: true,

      // Actions
      setCurrentChatId: (currentChatId) => {
        set({ currentChatId, showWelcome: !currentChatId })
        
        // Update localStorage
        if (currentChatId) {
          localStorage.setItem(STORAGE_KEYS.lastChatId, currentChatId)
        } else {
          localStorage.removeItem(STORAGE_KEYS.lastChatId)
        }
      },

      setIsTyping: (isTyping) => set({ isTyping }),

      setShowWelcome: (showWelcome) => set({ showWelcome }),

      clearCurrentChat: () => {
        set({ 
          currentChatId: null, 
          isTyping: false, 
          showWelcome: true 
        })
        localStorage.removeItem(STORAGE_KEYS.lastChatId)
      },
    }),
    {
      name: 'chat-ui-storage',
      partialize: (state) => ({ 
        currentChatId: state.currentChatId 
      }),
    }
  )
) 