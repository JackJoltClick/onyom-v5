import React, { useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { ChatInput } from '@/components/chat/ChatInput'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { useChatSession, useCreateChatSession, useChats } from '@/hooks/useChat'
import { useChatStore } from '@/stores/chatStore'
import { THERAPIST_PERSONALITIES, STORAGE_KEYS } from '@/lib/constants'
import { isOpenAIAvailable } from '@/lib/openai'
import styles from '@/styles/components/ChatPage.module.css'

export function ChatPage(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const { setTheme, isDark } = useTheme()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Chat store state
  const currentChatId = useChatStore((state) => state.currentChatId)
  const isTyping = useChatStore((state) => state.isTyping)
  const showWelcome = useChatStore((state) => state.showWelcome)
  const setCurrentChatId = useChatStore((state) => state.setCurrentChatId)
  const setIsTyping = useChatStore((state) => state.setIsTyping)
  const clearCurrentChat = useChatStore((state) => state.clearCurrentChat)

  // Get chat ID from URL params
  const chatIdFromUrl = searchParams.get('chatId')

  // Get current therapist personality
  const therapistTone = user?.therapist_tone || 'supportive'
  const personality = THERAPIST_PERSONALITIES[therapistTone]

  // Chat hooks
  const { data: chats } = useChats()
  const {
    chat,
    messages,
    conversationHistory,
    isLoading,
    sendMessage,
    isSending,
    deleteChat: deleteChatMutation,
    error
  } = useChatSession(currentChatId || undefined)

  const createChatSession = useCreateChatSession()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Sync URL with current chat ID
  useEffect(() => {
    if (chatIdFromUrl && chatIdFromUrl !== currentChatId) {
      setCurrentChatId(chatIdFromUrl)
    } else if (currentChatId && currentChatId !== chatIdFromUrl) {
      setSearchParams({ chatId: currentChatId })
    }
  }, [chatIdFromUrl, currentChatId, setCurrentChatId, setSearchParams])

  // Handle no chat selected - show the most recent chat or create new one
  useEffect(() => {
    if (!currentChatId && chats && chats.length > 0 && !createChatSession.isPending) {
      const lastChat = chats[0]
      if (lastChat) {
        setCurrentChatId(lastChat.id)
      }
    }
  }, [currentChatId, chats, createChatSession.isPending, setCurrentChatId])

  const handleSendMessage = async (content: string): Promise<void> => {
    setIsTyping(true)

    try {
      if (!currentChatId) {
        // Create new chat session with first message
        const result = await new Promise<{ chat: { id: string } }>((resolve, reject) => {
          createChatSession.mutate(
            { firstMessage: content, therapistTone },
            {
              onSuccess: resolve,
              onError: reject,
            }
          )
        })
        
        setCurrentChatId(result.chat.id)
      } else {
        // Send message to existing chat
        await new Promise<void>((resolve, reject) => {
          sendMessage(
            {
              chatId: currentChatId,
              content,
              therapistTone,
              conversationHistory,
            },
            {
              onSuccess: () => resolve(),
              onError: reject,
            }
          )
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleClearChat = (): void => {
    if (currentChatId && window.confirm('Are you sure you want to delete this conversation?')) {
      deleteChatMutation()
      clearCurrentChat()
      setSearchParams({})
    }
  }

  const handleThemeToggle = (): void => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const handleNewChat = (): void => {
    clearCurrentChat()
    setSearchParams({})
  }

  const openAIStatus = isOpenAIAvailable()
  const hasMessages = messages.length > 0

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>
              {chat?.title || 'Therapy Chat'}
            </h1>
            <p className={styles.subtitle}>
              {personality.tone.charAt(0).toUpperCase() + personality.tone.slice(1)} Therapist
              {openAIStatus ? ' • AI Powered' : ' • Demo Mode'}
              {hasMessages && ` • ${messages.length} messages`}
            </p>
          </div>
          
          <div className={styles.headerActions}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              aria-label="New chat"
              title="Start new conversation"
            >
              ➕
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </Button>
            
            {currentChatId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                aria-label="Delete chat"
                title="Delete this conversation"
              >
                🗑️
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className={styles.chatContainer} ref={chatContainerRef}>
        <div className={styles.messagesContainer}>
          {/* Welcome message when no chat selected */}
          {showWelcome && (
            <div className={styles.welcomeMessage}>
              <div className={styles.welcomeContent}>
                <h2>Welcome to your therapy space</h2>
                <p>
                  I'm your {personality.tone} therapist, here to listen and support you.
                  What would you like to talk about today?
                </p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className={styles.loadingMessage}>
              <span>Loading conversation...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className={styles.errorMessage}>
              <span>⚠️ Error loading conversation. Please try again.</span>
            </div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ChatBubble
                  message={message}
                  isTyping={
                    message.sender === 'assistant' && 
                    index === messages.length - 1 && 
                    (isTyping || isSending)
                  }
                  onTypingComplete={() => setIsTyping(false)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {(isTyping || isSending) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={styles.typingIndicator}
            >
              <div className={styles.typingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className={styles.typingText}>
                {openAIStatus ? 'AI is thinking...' : 'Therapist is thinking...'}
              </span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isTyping || isSending || createChatSession.isPending}
        placeholder={
          showWelcome 
            ? "Share what's on your mind to start your first conversation..."
            : `Continue your conversation with your ${therapistTone} therapist...`
        }
      />
    </div>
  )
} 