import React from 'react'
import { motion } from 'framer-motion'
import { IoSparkles } from 'react-icons/io5'
import type { AuthMode, AuthStep, AuthData } from '../AuthFlow'
import styles from '@/styles/components/auth/LoadingScreen.module.css'

interface LoadingScreenProps {
  mode: AuthMode
  authData: AuthData
  onNext: (step: AuthStep, data?: Partial<AuthData>) => void
  onBack: () => void
  onError: (error: string) => void
  error: string | null
  onComplete?: () => void | undefined
}

export function LoadingScreen({ mode }: LoadingScreenProps): React.ReactElement {
  const isLogin = mode === 'login'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const sparkleVariants = {
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
        staggerChildren: 0.2
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
      <div className={styles.content}>
        {/* Main loading animation */}
        <motion.div className={styles.loadingContainer}>
          <motion.div
            className={styles.centerOrb}
            variants={pulseVariants}
            animate="animate"
          >
            <IoSparkles className={styles.centerIcon} />
          </motion.div>

          {/* Orbiting elements */}
          <motion.div
            className={styles.orbit}
            variants={orbitVariants}
            animate="animate"
          >
            <div className={styles.orbitDot1} />
            <div className={styles.orbitDot2} />
            <div className={styles.orbitDot3} />
          </motion.div>

          {/* Sparkle effects */}
          <div className={styles.sparkles}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={styles.sparkle}
                variants={sparkleVariants}
                animate="animate"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  left: `${20 + (i * 12)}%`,
                  top: `${30 + (i % 2) * 40}%`
                }}
              >
                <IoSparkles />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          className={styles.textContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className={styles.title}>
            {isLogin ? 'Signing you in...' : 'Creating your account...'}
          </h2>
          <p className={styles.subtitle}>
            {isLogin 
              ? 'Welcome back! Preparing your personalized experience...'
              : 'Setting up your wellness journey with AI-powered guidance...'
            }
          </p>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          className={styles.progressDots}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.dot}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Background animation */}
      <div className={styles.background}>
        <motion.div
          className={styles.backgroundOrb1}
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={styles.backgroundOrb2}
          animate={{
            x: [100, -100, 100],
            y: [50, -50, 50],
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2]
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