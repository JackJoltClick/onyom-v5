import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoArrowBack, IoLockClosed, IoEye, IoEyeOff, IoCheckmarkCircle, IoShield } from 'react-icons/io5'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import type { AuthMode, AuthStep, AuthData } from '../AuthFlow'
import styles from '@/styles/components/auth/PasswordScreen.module.css'

interface PasswordScreenProps {
  mode: AuthMode
  authData: AuthData
  onNext: (step: AuthStep, data?: Partial<AuthData>) => void
  onBack: () => void
  onError: (error: string) => void
  error: string | null
  onComplete?: () => void | undefined
}

export function PasswordScreen({ 
  mode, 
  authData, 
  onNext, 
  onBack, 
  onError, 
  error,
  onComplete 
}: PasswordScreenProps): React.ReactElement {
  const { signIn, signUp } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const isLogin = mode === 'login'
  const isSignup = mode === 'signup'

  useEffect(() => {
    if (isSignup) {
      let strength = 0
      if (password.length >= 8) strength += 25
      if (/[A-Z]/.test(password)) strength += 25
      if (/[a-z]/.test(password)) strength += 25
      if (/[0-9]/.test(password)) strength += 25
      setPasswordStrength(strength)
    }
  }, [password, isSignup])

  const isPasswordValid = isLogin ? password.length > 0 : password.length >= 8
  const isConfirmPasswordValid = isLogin ? true : password === confirmPassword && confirmPassword.length > 0
  const canSubmit = isPasswordValid && isConfirmPasswordValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    try {
      setIsSubmitting(true)
      onNext('loading')

      if (isLogin) {
        await signIn(authData.email, password)
        onNext('success')
      } else {
        const result = await signUp(authData.email, password)
        if (result.needsEmailVerification) {
          onNext('email-verification')
        } else {
          onNext('success')
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Authentication failed')
      onNext('password') // Stay on password screen to show error
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'var(--onyom-error)'
    if (passwordStrength < 75) return 'var(--onyom-warning)'
    return 'var(--onyom-success)'
  }

  const getStrengthText = () => {
    if (passwordStrength < 25) return 'Very weak'
    if (passwordStrength < 50) return 'Weak'
    if (passwordStrength < 75) return 'Good'
    return 'Strong'
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        className={styles.backButton}
        onClick={onBack}
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoArrowBack />
      </motion.button>

      <motion.div className={styles.content} variants={itemVariants}>
        <motion.div className={styles.iconContainer} variants={itemVariants}>
          <div className={styles.icon}>
            <IoLockClosed />
          </div>
        </motion.div>

        <motion.h1 className={styles.title} variants={itemVariants}>
          {isLogin ? 'Enter your password' : 'Create a secure password'}
        </motion.h1>

        <motion.p className={styles.subtitle} variants={itemVariants}>
          {isLogin 
            ? `Welcome back! Please enter your password for ${authData.email}`
            : 'Your password should be at least 8 characters long and include a mix of letters and numbers'
          }
        </motion.p>

        <motion.form onSubmit={handleSubmit} className={styles.form} variants={itemVariants}>
          {/* Password Input */}
          <div className={styles.inputContainer}>
            <div className={`${styles.inputWrapper} ${isPasswordValid ? styles.valid : ''}`}>
              <IoLockClosed className={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                className={styles.input}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                autoFocus
              />
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </button>
              {isPasswordValid && (
                <motion.div
                  className={styles.validIcon}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <IoCheckmarkCircle />
                </motion.div>
              )}
            </div>

            {/* Password Strength Indicator for Signup */}
            {isSignup && password.length > 0 && (
              <motion.div
                className={styles.strengthContainer}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.strengthBar}>
                  <motion.div
                    className={styles.strengthFill}
                    initial={{ width: '0%' }}
                    animate={{ width: `${passwordStrength}%` }}
                    style={{ backgroundColor: getStrengthColor() }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className={styles.strengthText} style={{ color: getStrengthColor() }}>
                  <IoShield />
                  {getStrengthText()}
                </div>
              </motion.div>
            )}
          </div>

          {/* Confirm Password Input for Signup */}
          {isSignup && (
            <motion.div
              className={styles.inputContainer}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className={`${styles.inputWrapper} ${isConfirmPasswordValid ? styles.valid : ''}`}>
                <IoLockClosed className={styles.inputIcon} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={styles.input}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                </button>
                {isConfirmPasswordValid && confirmPassword.length > 0 && (
                  <motion.div
                    className={styles.validIcon}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <IoCheckmarkCircle />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              className={styles.errorMessage}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            className={styles.buttonContainer}
            variants={itemVariants}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!canSubmit}
              isLoading={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting 
                ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </Button>
          </motion.div>
        </motion.form>

        {isLogin && (
          <motion.div className={styles.helpText} variants={itemVariants}>
            <button className={styles.forgotPassword}>
              Forgot your password?
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <motion.div
          className={styles.securityIcon1}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={styles.securityIcon2}
          animate={{
            rotate: [360, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>
    </motion.div>
  )
} 