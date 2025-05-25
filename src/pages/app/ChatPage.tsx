import React, { useRef, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IoAdd, IoTrash, IoSparkles, IoWarning } from 'react-icons/io5'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { ChatInput } from '@/components/chat/ChatInput'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useChatSession, useCreateChatSession, useChats } from '@/hooks/useChat'
import { useChatStore } from '@/stores/chatStore'
import { THERAPIST_PERSONALITIES } from '@/lib/constants'
import { isOpenAIAvailable } from '@/lib/openai'
import { isSupabaseConfigured } from '@/lib/supabase'
import styles from '@/styles/components/ChatPage.module.css'

export function ChatPage(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sendError, setSendError] = useState<string | null>(null)
  const { user } = useAuth()
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
    if (!content.trim()) return
    
    try {
      setSendError(null)
      
      // Check if we have a valid chat session
      if (!currentChatId) {
        console.error('No chat ID available')
        setSendError('No active chat session. Please create a new chat.')
        return
      }

      console.log('Attempting to send message to chat:', currentChatId)
      console.log('User authenticated:', !!user)
      console.log('User ID:', user?.id)
      
      await sendMessage(
        {
          chatId: currentChatId,
          content,
          therapistTone,
          conversationHistory,
        },
        {
          onSuccess: () => {
            console.log('Message sent successfully')
          },
          onError: (error: any) => {
            console.error('Error sending message:', error)
            
            // Provide specific error messages based on the error
            if (error.message?.includes('Chat not found')) {
              setSendError('This chat session no longer exists. Please create a new chat.')
            } else if (error.message?.includes('not authenticated')) {
              setSendError('You need to be logged in to send messages.')
            } else if (error.message?.includes('Database access denied')) {
              setSendError('Database connection issue. Please check your setup and try again.')
            } else if (error.message?.includes('Row-level security')) {
              setSendError('Permission denied. Please check your account setup.')
            } else if (error.message?.includes('406')) {
              setSendError('Database configuration error. Please check the setup guide.')
            } else {
              setSendError(error.message || 'Failed to send message. Please try again.')
            }
          }
        }
      )
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Set user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('row-level security')) {
          setSendError('Database access denied. Please check your account setup.')
        } else if (error.message.includes('foreign key')) {
          setSendError('Database setup incomplete. Please contact support.')
        } else if (error.message.includes('User profile not found')) {
          setSendError('Please complete your profile setup first.')
        } else {
          setSendError(error.message)
        }
      } else {
        setSendError('Failed to send message. Please try again.')
      }
    }
  }

  const handleClearChat = (): void => {
    if (currentChatId && window.confirm('Are you sure you want to delete this conversation?')) {
      deleteChatMutation()
      clearCurrentChat()
      setSearchParams({})
    }
  }

  const handleNewChat = (): void => {
    clearCurrentChat()
    setSearchParams({})
  }

  const openAIStatus = isOpenAIAvailable()
  const hasMessages = messages.length > 0
  const supabaseConfigured = isSupabaseConfigured

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Configuration Warning */}
      {!supabaseConfigured && (
        <motion.div 
          className={styles.configWarning}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <IoWarning size={16} />
          <span>Database not configured. Please set up your Supabase credentials.</span>
        </motion.div>
      )}

      {/* Header */}
      <motion.header 
        className={styles.header}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>
              {chat?.title || 'Therapy Session'}
            </h1>
            <p className={styles.subtitle}>
              <IoSparkles size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
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
              <IoAdd size={18} />
            </Button>
            
            {currentChatId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                aria-label="Delete chat"
                title="Delete this conversation"
              >
                <IoTrash size={16} />
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Chat Messages */}
      <main className={styles.chatContainer} ref={chatContainerRef}>
        <div className={styles.messagesContainer}>
          {/* Welcome message when no chat selected */}
          {showWelcome && (
            <motion.div 
              className={styles.welcomeMessage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.welcomeContent}>
                <h2>Welcome to your therapy space</h2>
                <p>
                  I'm your {personality.tone} therapist, here to listen and support you.
                  What would you like to talk about today?
                </p>
                {!supabaseConfigured && (
                  <div className={styles.setupNote}>
                    <IoWarning size={16} />
                    <span>Note: Database not configured. Messages won't be saved.</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Loading state */}
          {isLoading && (
            <motion.div 
              className={styles.loadingMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span>Loading conversation...</span>
            </motion.div>
          )}

          {/* Error state */}
          {error && (
            <motion.div 
              className={styles.errorMessage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <IoWarning size={16} />
              <span>Error loading conversation. Please try again.</span>
            </motion.div>
          )}

          {/* Send Error */}
          {sendError && (
            <motion.div 
              className={styles.sendErrorMessage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <IoWarning size={16} />
              <span>{sendError}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSendError(null)}
                aria-label="Dismiss error"
              >
                ×
              </Button>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.05
                }}
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
    </motion.div>
  )
} 