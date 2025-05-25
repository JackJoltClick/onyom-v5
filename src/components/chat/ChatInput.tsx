import React, { useState, useRef, useEffect } from 'react'
import type { ChatInputProps } from '@/types'
import { Button } from '@/components/ui/Button'
import { sanitizeInput } from '@/lib/utils'
import styles from '@/styles/components/ChatInput.module.css'

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
  className,
}: ChatInputProps): React.ReactElement {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    
    const trimmedMessage = sanitizeInput(message)
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage)
      setMessage('')
      setIsTyping(false)
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value
    setMessage(value)
    
    // Show typing indicator
    setIsTyping(value.length > 0)
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Hide typing indicator after 1 second of no typing
    if (value.length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
      }, 1000)
    }
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus()
    }
  }, [disabled])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const canSend = message.trim().length > 0 && !disabled
  const characterCount = message.length
  const isNearLimit = characterCount > 800
  const isAtLimit = characterCount >= 1000

  return (
    <form onSubmit={handleSubmit} className={`${styles.container} ${className || ''}`}>
      <div className={`${styles.inputWrapper} ${isTyping ? styles.typing : ''}`}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.textarea}
          rows={1}
          maxLength={1000}
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!canSend}
          className={styles.sendButton}
          aria-label="Send message"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22,2 15,22 11,13 2,9" />
          </svg>
        </Button>
      </div>
      
      {characterCount > 700 && (
        <div className={`${styles.counter} ${isNearLimit ? styles.warning : ''} ${isAtLimit ? styles.error : ''}`}>
          {characterCount}/1000
        </div>
      )}
    </form>
  )
} 