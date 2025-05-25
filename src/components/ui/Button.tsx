import React from 'react'
import { cn } from '@/lib/utils'
import styles from '@/styles/components/Button.module.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'sage' | 'beige'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        isLoading && styles.loading,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  )
} 