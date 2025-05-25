import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { IoCheckmarkCircle, IoSparkles, IoHeart, IoLeaf } from 'react-icons/io5'
import type { AuthMode, AuthStep, AuthData } from '../AuthFlow'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import styles from '@/styles/components/auth/SuccessScreen.module.css'

interface SuccessScreenProps {
  mode: AuthMode
  authData: AuthData
  onNext: (step: AuthStep, data?: Partial<AuthData>) => void
  onBack: () => void
  onError: (error: string) => void
  error: string | null
  onComplete?: () => void | undefined
}

export function SuccessScreen({ mode, authData, onComplete }: SuccessScreenProps): React.ReactElement {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    // Create confetti effect
    const createConfetti = () => {
      const colors = ['#6998B0', '#90B589', '#C2A278', '#E8D5C4']
      const confettiContainer = document.createElement('div')
      confettiContainer.className = styles.confettiContainer || ''
      document.body.appendChild(confettiContainer)

      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div')
        confetti.className = styles.confetti ?? 'confetti-particle'
        confetti.style.left = Math.random() * 100 + '%'
        confetti.style.animationDelay = Math.random() * 3 + 's'
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's'
        confettiContainer.appendChild(confetti)
      }

      // Clean up after animation
      setTimeout(() => {
        if (document.body.contains(confettiContainer)) {
          document.body.removeChild(confettiContainer)
        }
      }, 5000)
    }

    const timer = setTimeout(createConfetti, 500)
    return () => clearTimeout(timer)
  }, [])

  // Auto-complete after showing success for a few seconds
  useEffect(() => {
    const completionTimer = setTimeout(() => {
      console.log('SuccessScreen: Auto-completing after delay', { isAuthenticated, user })
      
      if (isAuthenticated && user) {
        // Check if user needs onboarding
        const needsOnboarding = !user.name || user.name === user.email
        
        if (needsOnboarding) {
          console.log('SuccessScreen: User needs onboarding, navigating to /onboarding')
          navigate(ROUTES.onboarding, { replace: true })
        } else {
          console.log('SuccessScreen: User completed onboarding, navigating to chat')
          navigate(ROUTES.app.chat, { replace: true })
        }
      } else {
        console.log('SuccessScreen: User not authenticated, calling onComplete')
        onComplete?.()
      }
    }, 3000) // 3 seconds to show the success screen

    return () => clearTimeout(completionTimer)
  }, [isAuthenticated, user, navigate, onComplete])

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 20,
        staggerChildren: 0.1
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

  const checkmarkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        delay: 0.2
      }
    }
  }

  const celebrationVariants = {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const floatingVariants = {
    animate: (i: number) => ({
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      rotate: [0, 360],
      transition: {
        duration: 4 + i,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.5
      }
    })
  }

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating celebration icons */}
      <div className={styles.floatingIcons}>
        {[IoSparkles, IoHeart, IoLeaf].map((Icon, i) => (
          <motion.div
            key={i}
            className={styles.floatingIcon}
            custom={i}
            variants={floatingVariants}
            animate="animate"
          >
            <Icon />
          </motion.div>
        ))}
      </div>

      <div className={styles.content}>
        {/* Success checkmark */}
        <motion.div
          className={styles.checkmarkContainer}
          variants={checkmarkVariants}
        >
          <div className={styles.checkmarkCircle}>
            <IoCheckmarkCircle className={styles.checkmarkIcon} />
          </div>
          <motion.div
            className={styles.checkmarkGlow}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Success message */}
        <motion.div className={styles.messageContainer} variants={itemVariants}>
          <motion.h1 
            className={styles.title}
            variants={celebrationVariants}
            animate="animate"
          >
            {isLogin ? 'Welcome back!' : 'Account created!'}
          </motion.h1>
          
          <motion.p className={styles.subtitle} variants={itemVariants}>
            {isLogin 
              ? `Great to see you again! Your personalized wellness journey continues.`
              : `Welcome to Onyom, ${authData.email.split('@')[0]}! Your wellness journey begins now.`
            }
          </motion.p>
        </motion.div>

        {/* Success features */}
        <motion.div className={styles.features} variants={itemVariants}>
          <motion.div 
            className={styles.feature}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className={styles.featureIcon}>
              <IoSparkles />
            </div>
            <div className={styles.featureText}>
              <h3>AI Guidance</h3>
              <p>Personalized meditation recommendations</p>
            </div>
          </motion.div>

          <motion.div 
            className={styles.feature}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className={styles.featureIcon}>
              <IoHeart />
            </div>
            <div className={styles.featureText}>
              <h3>Wellness Tracking</h3>
              <p>Monitor your progress and growth</p>
            </div>
          </motion.div>

          <motion.div 
            className={styles.feature}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className={styles.featureIcon}>
              <IoLeaf />
            </div>
            <div className={styles.featureText}>
              <h3>Mindful Community</h3>
              <p>Connect with like-minded individuals</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Continue message */}
        <motion.div 
          className={styles.continueMessage}
          variants={itemVariants}
          animate={{
            opacity: [0.7, 1, 0.7],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <p>
            {isLogin 
              ? 'Redirecting to your dashboard...'
              : 'Setting up your personalized experience...'
            }
          </p>
        </motion.div>
      </div>

      {/* Background celebration elements */}
      <div className={styles.backgroundElements}>
        <motion.div
          className={styles.celebrationRing1}
          animate={{
            scale: [1, 2, 1],
            opacity: [0, 0.3, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={styles.celebrationRing2}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0, 0.2, 0],
            rotate: [360, 0]
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