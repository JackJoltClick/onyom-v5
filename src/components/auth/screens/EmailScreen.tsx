import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoArrowBack, IoMail, IoCheckmarkCircle } from 'react-icons/io5'
import { Button } from '@/components/ui/Button'
import type { AuthMode, AuthStep, AuthData } from '../AuthFlow'
import styles from '@/styles/components/auth/EmailScreen.module.css'

interface EmailScreenProps {
  mode: AuthMode
  authData: AuthData
  onNext: (step: AuthStep, data?: Partial<AuthData>) => void
  onBack: () => void
  onError: (error: string) => void
  error: string | null
  onComplete?: () => void | undefined
}

export function EmailScreen({ mode, authData, onNext, onBack, error }: EmailScreenProps): React.ReactElement {
  const [email, setEmail] = useState(authData.email || '')
  const [isValid, setIsValid] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [hasTyped, setHasTyped] = useState(false)

  const isLogin = mode === 'login'

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValid(emailRegex.test(email))
  }, [email])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onNext('password', { email })
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (!hasTyped) setHasTyped(true)
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
            <IoMail />
          </div>
        </motion.div>

        <motion.h1 className={styles.title} variants={itemVariants}>
          What's your email?
        </motion.h1>

        <motion.p className={styles.subtitle} variants={itemVariants}>
          {isLogin 
            ? 'Enter the email address associated with your account'
            : "We'll use this to create your account and send you updates"
          }
        </motion.p>

        <motion.form onSubmit={handleSubmit} className={styles.form} variants={itemVariants}>
          <div className={styles.inputContainer}>
            <div className={`${styles.inputWrapper} ${isFocused ? styles.focused : ''} ${isValid && hasTyped ? styles.valid : ''}`}>
              <IoMail className={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter your email address"
                className={styles.input}
                autoComplete="email"
                autoFocus
              />
              {isValid && hasTyped && (
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
          </div>

          <motion.div
            className={styles.buttonContainer}
            variants={itemVariants}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isValid}
              className={styles.continueButton}
            >
              Continue
            </Button>
          </motion.div>
        </motion.form>

        <motion.div className={styles.helpText} variants={itemVariants}>
          <p>
            {isLogin 
              ? 'Forgot your email? Contact support for help.'
              : 'By continuing, you agree to our Terms of Service and Privacy Policy.'
            }
          </p>
        </motion.div>
      </motion.div>

      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <motion.div
          className={styles.floatingElement1}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={styles.floatingElement2}
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </motion.div>
  )
} 