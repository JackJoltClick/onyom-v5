import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { IoSparkles, IoHeart, IoLeaf } from 'react-icons/io5'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants'
import type { AuthMode, AuthStep, AuthData } from '../AuthFlow'
import styles from '@/styles/components/auth/WelcomeScreen.module.css'

interface WelcomeScreenProps {
  mode: AuthMode
  authData: AuthData
  onNext: (step: AuthStep, data?: Partial<AuthData>) => void
  onBack: () => void
  onError: (error: string) => void
  error: string | null
  onComplete?: () => void | undefined
}

export function WelcomeScreen({ mode, onNext }: WelcomeScreenProps): React.ReactElement {
  const isLogin = mode === 'login'
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
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

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        delay: 0.3
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
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
      {/* Floating icons */}
      <div className={styles.floatingIcons}>
        <motion.div
          className={styles.floatingIcon}
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '0s' }}
        >
          <IoSparkles />
        </motion.div>
        <motion.div
          className={styles.floatingIcon}
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '1.5s' }}
        >
          <IoHeart />
        </motion.div>
        <motion.div
          className={styles.floatingIcon}
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '3s' }}
        >
          <IoLeaf />
        </motion.div>
      </div>

      {/* Main content */}
      <motion.div className={styles.content} variants={itemVariants}>
        <motion.div className={styles.logoContainer} variants={iconVariants}>
          <div className={styles.logo}>
            <IoSparkles className={styles.logoIcon} />
          </div>
        </motion.div>

        <motion.h1 className={styles.title} variants={itemVariants}>
          {isLogin ? 'Welcome Back' : 'Welcome to Onyom'}
        </motion.h1>

        <motion.p className={styles.subtitle} variants={itemVariants}>
          {isLogin 
            ? 'Continue your mindfulness journey with personalized meditation and wellness practices'
            : 'Begin your journey to inner peace and wellness with AI-powered meditation and therapeutic guidance'
          }
        </motion.p>

        <motion.div className={styles.features} variants={itemVariants}>
          <div className={styles.feature}>
            <IoSparkles className={styles.featureIcon} />
            <span>AI-Powered Guidance</span>
          </div>
          <div className={styles.feature}>
            <IoHeart className={styles.featureIcon} />
            <span>Personalized Experience</span>
          </div>
          <div className={styles.feature}>
            <IoLeaf className={styles.featureIcon} />
            <span>Mindful Growth</span>
          </div>
        </motion.div>

        <motion.div className={styles.actions} variants={itemVariants}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNext('email')}
            className={styles.primaryButton}
          >
            {isLogin ? 'Sign In' : 'Get Started'}
          </Button>
          
          <p className={styles.switchText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              className={styles.switchButton}
              onClick={() => navigate(isLogin ? ROUTES.auth.signup : ROUTES.auth.login)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className={styles.decorativeElements}>
        <motion.div
          className={styles.circle1}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={styles.circle2}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
    </motion.div>
  )
} 