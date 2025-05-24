import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { signUpSchema, type SignUpFormData } from '@/lib/validations'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage } from '@/lib/utils'
import styles from '@/styles/components/AuthForm.module.css'

export function SignUpForm(): React.ReactElement {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const password = watch('password')

  const onSubmit = async (data: SignUpFormData): Promise<void> => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      
      await signUp(data.email, data.password)
      
      // Navigate to onboarding after successful signup
      navigate(ROUTES.onboarding)
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Join Onyom</h1>
        <p className={styles.subtitle}>Create your wellness journey account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {submitError && (
          <motion.div
            className={styles.errorAlert}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {submitError}
          </motion.div>
        )}

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            autoComplete="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            autoComplete="new-password"
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            placeholder="Create a password"
          />
          {errors.password && (
            <span className={styles.errorText}>{errors.password.message}</span>
          )}
          
          {/* Password strength indicator */}
          {password && (
            <div className={styles.passwordStrength}>
              <div className={styles.strengthIndicator}>
                <div 
                  className={`${styles.strengthBar} ${
                    password.length >= 8 ? styles.strengthGood : styles.strengthWeak
                  }`}
                  style={{ 
                    width: `${Math.min((password.length / 8) * 100, 100)}%` 
                  }}
                />
              </div>
              <div className={styles.strengthText}>
                {password.length >= 8 ? 'Strong password' : 'Password too short'}
              </div>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <span className={styles.errorText}>{errors.confirmPassword.message}</span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className={styles.terms}>
          <p>
            By creating an account, you agree to our{' '}
            <a href="#" className={styles.link}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" className={styles.link}>Privacy Policy</a>
          </p>
        </div>
      </form>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Already have an account?{' '}
          <Link to={ROUTES.auth.login} className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  )
} 