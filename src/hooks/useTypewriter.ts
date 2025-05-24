import { useState, useEffect, useCallback, useRef } from 'react'
import type { UseTypewriterReturn } from '@/types'

interface UseTypewriterOptions {
  speed?: number
  onComplete?: () => void
}

export function useTypewriter(options: UseTypewriterOptions = {}): UseTypewriterReturn {
  const { speed = 50, onComplete } = options
  
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [targetText, setTargetText] = useState('')
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const currentIndexRef = useRef(0)

  const startTyping = useCallback((text: string): void => {
    setTargetText(text)
    setDisplayText('')
    setIsTyping(true)
    currentIndexRef.current = 0
  }, [])

  const stopTyping = useCallback((): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsTyping(false)
    setDisplayText(targetText)
    currentIndexRef.current = targetText.length
  }, [targetText])

  useEffect(() => {
    if (!isTyping || !targetText) return

    const typeNextCharacter = (): void => {
      if (currentIndexRef.current < targetText.length) {
        setDisplayText(targetText.slice(0, currentIndexRef.current + 1))
        currentIndexRef.current += 1
        
        timeoutRef.current = setTimeout(typeNextCharacter, speed)
      } else {
        setIsTyping(false)
        onComplete?.()
      }
    }

    timeoutRef.current = setTimeout(typeNextCharacter, speed)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isTyping, targetText, speed, onComplete])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    displayText,
    isTyping,
    startTyping,
    stopTyping,
  }
} 