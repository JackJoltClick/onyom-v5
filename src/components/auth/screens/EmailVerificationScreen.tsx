import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoMail, IoRefresh, IoCheckmarkCircle } from 'react-icons/io5'
import { Button } from '@/components/ui/Button'
import type { AuthMode, AuthStep, AuthData } from '../AuthFlow'
import { useAuth } from '@/hooks/useAuth'
import styles from '@/styles/components/auth/EmailVerificationScreen.module.css'

interface EmailVerificationScreenProps {
  mode: AuthMode
  authData: AuthData
  onNext: (step: AuthStep, data?: Partial<AuthData>) => void
  onBack: () => void
  onError: (error: string) => void
  error: string | null
  onComplete?: () => void | undefined
}

export function EmailVerificationScreen({ 
  authData, 
  onNext, 
  onBack, 
  onError,
  error,
  onComplete 
}: EmailVerificationScreenProps): React.ReactElement {
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const { user, isAuthenticated, resendVerificationEmail } = useAuth()

  // Check if user becomes authenticated (email verified)
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('EmailVerificationScreen: User authenticated, proceeding to onboarding')
      onComplete?.()
    }
  }, [isAuthenticated, user, onComplete])

  // Periodically check authentication status
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (isAuthenticated && user) {
        console.log('EmailVerificationScreen: User authenticated via periodic check')
        onComplete?.()
      }
    }, 3000) // Check every 3 seconds

    return () => clearInterval(checkInterval)
  }, [isAuthenticated, user, onComplete])

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return

    try {
      setIsResending(true)
      await resendVerificationEmail(authData.email)
      setResendCooldown(60) // 60 second cooldown
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to resend email')
    } finally {
      setIsResending(false)
    }
  }

  const handleCheckVerification = async () => {
    try {
      setIsChecking(true)
      // Give a moment for any pending auth state changes to process
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // If still not verified, show message
      if (!isAuthenticated) {
        onError('Email not yet verified. Please check your inbox and click the verification link.')
      } else {
        // User is authenticated, proceed to onboarding
        onComplete?.()
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to check verification status')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.content}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={styles.iconContainer}
        >
          <IoMail className={styles.icon} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={styles.title}
        >
          Check Your Email
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={styles.description}
        >
          We've sent a verification link to <strong>{authData.email}</strong>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className={styles.subdescription}
        >
          Click the link in your email to verify your account and continue to Onyom.
        </motion.p>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.error}
          >
            {error}
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className={styles.actions}
        >
          <Button
            onClick={handleCheckVerification}
            disabled={isChecking}
            className={styles.primaryButton}
          >
            {isChecking ? (
              <>
                <IoRefresh className={`${styles.buttonIcon} ${styles.spinning}`} />
                Checking...
              </>
            ) : (
              <>
                <IoCheckmarkCircle className={styles.buttonIcon} />
                I've Verified My Email
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={handleResendEmail}
            disabled={isResending || resendCooldown > 0}
            className={styles.secondaryButton}
          >
            {isResending ? (
              <>
                <IoRefresh className={`${styles.buttonIcon} ${styles.spinning}`} />
                Sending...
              </>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              <>
                <IoMail className={styles.buttonIcon} />
                Resend Email
              </>
            )}
          </Button>
        </motion.div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className={styles.backContainer}
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className={styles.backButton}
          >
            Back to Sign Up
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
} 