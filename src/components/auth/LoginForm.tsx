import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage } from '@/lib/utils'
import styles from '@/styles/components/AuthForm.module.css'

export function LoginForm(): React.ReactElement {
  const { signIn } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      
      await signIn(data.email, data.password)
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
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your Onyom account</p>
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
            autoComplete="current-password"
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className={styles.errorText}>{errors.password.message}</span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Don't have an account?{' '}
          <Link to={ROUTES.auth.signup} className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  )
} 