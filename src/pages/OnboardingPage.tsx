import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { TherapistSelector } from '@/components/onboarding/TherapistSelector'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { onboardingSchema, type OnboardingFormData } from '@/lib/validations'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage } from '@/lib/utils'
import type { TherapistTone, ThemePreference } from '@/types'
import styles from '@/styles/components/OnboardingPage.module.css'

const steps = [
  { id: 'welcome', title: 'Welcome to Onyom', subtitle: 'Let\'s personalize your wellness journey' },
  { id: 'name', title: 'What should we call you?', subtitle: 'This helps us create a more personal experience' },
  { id: 'therapist', title: 'Choose your therapist style', subtitle: 'Select the approach that feels right for you' },
  { id: 'preferences', title: 'Customize your experience', subtitle: 'Set your theme and interaction preferences' },
  { id: 'complete', title: 'You\'re all set!', subtitle: 'Ready to start your wellness journey' }
]

export function OnboardingPage(): React.ReactElement {
  const navigate = useNavigate()
  const { updateProfile } = useAuth()
  const { theme, setTheme } = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      therapist_tone: 'supportive',
      theme_preference: theme,
      typing_speed: 50,
    },
  })

  const watchedValues = watch()

  const nextStep = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: OnboardingFormData): Promise<void> => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      
      // Update user profile with onboarding data
      await updateProfile(data)
      
      // Set theme preference
      setTheme(data.theme_preference)
      
      // Navigate to chat page
      navigate(ROUTES.app.chat)
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleThemeChange = (newTheme: ThemePreference): void => {
    setValue('theme_preference', newTheme)
    setTheme(newTheme)
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: // Name step
        return Boolean(watchedValues.name?.trim())
      case 2: // Therapist step
        return Boolean(watchedValues.therapist_tone)
      case 3: // Preferences step
        return Boolean(watchedValues.theme_preference && watchedValues.typing_speed)
      default:
        return true
    }
  }

  const currentStepData = steps[currentStep]!

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Progress indicator */}
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.stepContent}
          >
            <div className={styles.stepHeader}>
              <h1 className={styles.stepTitle}>{currentStepData.title}</h1>
              <p className={styles.stepSubtitle}>{currentStepData.subtitle}</p>
            </div>

            {currentStep === 0 && (
              <div className={styles.welcomeContent}>
                <div className={styles.welcomeIcon}>🌟</div>
                <p className={styles.welcomeText}>
                  We're excited to help you on your wellness journey. 
                  Let's take a few moments to customize your experience.
                </p>
              </div>
            )}

            {currentStep === 1 && (
              <div className={styles.nameStep}>
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>
                    Your name
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    autoComplete="given-name"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder="Enter your first name"
                    autoFocus
                  />
                  {errors.name && (
                    <span className={styles.errorText}>{errors.name.message}</span>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <TherapistSelector
                selectedTone={watchedValues.therapist_tone}
                onSelect={(tone: TherapistTone) => setValue('therapist_tone', tone)}
              />
            )}

            {currentStep === 3 && (
              <div className={styles.preferencesStep}>
                <div className={styles.preferenceGroup}>
                  <h3 className={styles.preferenceTitle}>Theme Preference</h3>
                  <div className={styles.themeOptions}>
                    {(['dark', 'light', 'system'] as const).map((themeOption) => (
                      <button
                        key={themeOption}
                        type="button"
                        className={`${styles.themeOption} ${watchedValues.theme_preference === themeOption ? styles.selected : ''}`}
                        onClick={() => handleThemeChange(themeOption)}
                      >
                        <span className={styles.themeIcon}>
                          {themeOption === 'dark' ? '🌙' : themeOption === 'light' ? '☀️' : '💻'}
                        </span>
                        <span className={styles.themeName}>
                          {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.preferenceGroup}>
                  <label htmlFor="typing_speed" className={styles.preferenceTitle}>
                    AI Response Speed
                  </label>
                  <div className={styles.sliderGroup}>
                    <input
                      {...register('typing_speed', { valueAsNumber: true })}
                      type="range"
                      id="typing_speed"
                      min="10"
                      max="100"
                      step="10"
                      className={styles.slider}
                    />
                    <div className={styles.sliderLabels}>
                      <span>Slow</span>
                      <span>{watchedValues.typing_speed}%</span>
                      <span>Fast</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className={styles.completeStep}>
                <div className={styles.completeIcon}>🎉</div>
                <p className={styles.completeText}>
                  Perfect! Your personalized wellness experience is ready. 
                  You can always change these preferences later in your profile settings.
                </p>
                {submitError && (
                  <div className={styles.errorAlert}>{submitError}</div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className={styles.navigation}>
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={styles.navButton}
          >
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={!canProceed()}
              className={styles.navButton}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              className={styles.navButton}
            >
              {isSubmitting ? 'Setting up...' : 'Start Your Journey'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 