import React, { useEffect } from 'react'
import type { ChatBubbleProps } from '@/types'
import { useTypewriter } from '@/hooks/useTypewriter'
import { formatMessageTime } from '@/lib/utils'
import styles from '@/styles/components/ChatBubble.module.css'

export function ChatBubble({
  message,
  isTyping = false,
  onTypingComplete,
  className,
}: ChatBubbleProps): React.ReactElement {
  const typewriterOptions = onTypingComplete 
    ? { speed: 50, onComplete: onTypingComplete }
    : { speed: 50 }
    
  const { displayText, startTyping } = useTypewriter(typewriterOptions)

  useEffect(() => {
    if (isTyping && message.sender === 'assistant') {
      startTyping(message.content)
    }
  }, [isTyping, message.content, message.sender, startTyping])

  const isUser = message.sender === 'user'
  const content = isTyping && message.sender === 'assistant' ? displayText : message.content

  return (
    <div className={`${styles.container} ${isUser ? styles.userContainer : styles.assistantContainer} ${className || ''}`}>
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
        <p className={styles.content}>{content}</p>
        {isTyping && message.sender === 'assistant' && (
          <span className={styles.cursor}>|</span>
        )}
      </div>
      <time className={styles.timestamp}>
        {formatMessageTime(message.created_at)}
      </time>
    </div>
  )
} 