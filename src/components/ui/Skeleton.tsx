import React from 'react'
import { cn } from '@/lib/utils'
import styles from '@/styles/components/Skeleton.module.css'

export interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  className,
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse',
  ...props
}: SkeletonProps): React.ReactElement {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div
      className={cn(
        styles.skeleton,
        styles[variant],
        styles[animation],
        className
      )}
      style={style}
      {...props}
    />
  )
}

// Specialized skeleton components for common use cases
export function SkeletonText({
  lines = 1,
  className,
  ...props
}: SkeletonProps & { lines?: number }): React.ReactElement {
  if (lines === 1) {
    return <Skeleton variant="text" {...props} {...(className && { className })} />
  }

  return (
    <div className={styles.textContainer}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          variant="text"
          {...props}
          className={cn(
            className,
            i === lines - 1 && styles.lastLine
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({
  size = 40,
  className,
  ...props
}: SkeletonProps & { size?: number }): React.ReactElement {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      {...props}
      {...(className && { className })}
    />
  )
}

export function SkeletonButton({
  width = 100,
  height = 40,
  className,
  ...props
}: SkeletonProps): React.ReactElement {
  return (
    <Skeleton
      variant="rounded"
      width={width}
      height={height}
      {...props}
      {...(className && { className })}
    />
  )
}

export function SkeletonCard({
  children,
  className,
  ...props
}: SkeletonProps & { children?: React.ReactNode }): React.ReactElement {
  return (
    <div className={cn(styles.card, className)} {...props}>
      {children || (
        <>
          <div className={styles.cardHeader}>
            <SkeletonAvatar size={48} />
            <div className={styles.cardHeaderText}>
              <SkeletonText width="60%" height={16} />
              <SkeletonText width="40%" height={14} />
            </div>
          </div>
          <div className={styles.cardBody}>
            <SkeletonText lines={3} />
          </div>
        </>
      )}
    </div>
  )
} 