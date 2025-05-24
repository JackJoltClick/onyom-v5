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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    
    const trimmedMessage = sanitizeInput(message)
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage)
      setMessage('')
      
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

  const canSend = message.trim().length > 0 && !disabled

  return (
    <form onSubmit={handleSubmit} className={`${styles.container} ${className || ''}`}>
      <div className={styles.inputWrapper}>
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
      
      {message.length > 900 && (
        <div className={styles.counter}>
          {message.length}/1000
        </div>
      )}
    </form>
  )
} 