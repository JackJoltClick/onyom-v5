import React from 'react'
import { cn } from '@/lib/utils'
import styles from '@/styles/components/TherapeuticCard.module.css'

export interface TherapeuticCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'elevated' | 'floating'
  effect?: 'none' | 'breathe' | 'glow' | 'pulse'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  onClick?: () => void
  disabled?: boolean
}

export function TherapeuticCard({
  children,
  className,
  variant = 'default',
  effect = 'none',
  padding = 'md',
  onClick,
  disabled = false,
}: TherapeuticCardProps): React.ReactElement {
  const isInteractive = onClick && !disabled

  return (
    <div
      className={cn(
        styles.card,
        styles[variant],
        styles[effect],
        styles[`padding-${padding}`],
        isInteractive && styles.interactive,
        disabled && styles.disabled,
        className
      )}
      onClick={isInteractive ? onClick : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  )
} 