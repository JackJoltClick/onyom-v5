import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { EmailScreen } from './screens/EmailScreen'
import { PasswordScreen } from './screens/PasswordScreen'
import { SuccessScreen } from './screens/SuccessScreen'
import { LoadingScreen } from './screens/LoadingScreen'
import { EmailVerificationScreen } from './screens/EmailVerificationScreen'
import styles from '@/styles/components/AuthFlow.module.css'

export type AuthMode = 'login' | 'signup'
export type AuthStep = 'welcome' | 'email' | 'password' | 'loading' | 'success' | 'email-verification'

interface AuthFlowProps {
  mode: AuthMode
  onComplete?: () => void
}

export interface AuthData {
  email: string
  password: string
  confirmPassword?: string
}

export function AuthFlow({ mode, onComplete }: AuthFlowProps): React.ReactElement {
  const [currentStep, setCurrentStep] = useState<AuthStep>('welcome')
  const [authData, setAuthData] = useState<AuthData>({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string | null>(null)

  const handleNext = (step: AuthStep, data?: Partial<AuthData>) => {
    if (data) {
      setAuthData(prev => ({ ...prev, ...data }))
    }
    setError(null)
    setCurrentStep(step)
  }

  const handleBack = () => {
    setError(null)
    switch (currentStep) {
      case 'email':
        setCurrentStep('welcome')
        break
      case 'password':
        setCurrentStep('email')
        break
      case 'email-verification':
        setCurrentStep('password')
        break
      default:
        setCurrentStep('welcome')
    }
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }

  const getDirection = (step: AuthStep): number => {
    const steps: AuthStep[] = ['welcome', 'email', 'password', 'loading', 'success', 'email-verification']
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(step)
    return stepIndex > currentIndex ? 1 : -1
  }

  const renderCurrentScreen = () => {
    const commonProps = {
      mode,
      authData,
      onNext: handleNext,
      onBack: handleBack,
      onError: handleError,
      error,
      onComplete
    }

    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen {...commonProps} />
      case 'email':
        return <EmailScreen {...commonProps} />
      case 'password':
        return <PasswordScreen {...commonProps} />
      case 'loading':
        return <LoadingScreen {...commonProps} />
      case 'success':
        return <SuccessScreen {...commonProps} />
      case 'email-verification':
        return <EmailVerificationScreen {...commonProps} />
      default:
        return <WelcomeScreen {...commonProps} />
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>
      
      <div className={styles.content}>
        <AnimatePresence mode="wait" custom={getDirection(currentStep)}>
          <motion.div
            key={currentStep}
            custom={getDirection(currentStep)}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className={styles.screen}
          >
            {renderCurrentScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progressFill}
            initial={{ width: '0%' }}
            animate={{
              width: currentStep === 'welcome' ? '20%' :
                     currentStep === 'email' ? '40%' :
                     currentStep === 'password' ? '60%' :
                     currentStep === 'loading' ? '80%' :
                     currentStep === 'email-verification' ? '90%' :
                     '100%'
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  )
} 