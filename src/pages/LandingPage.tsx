import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ROUTES, APP_CONFIG } from '@/lib/constants'
import styles from '@/styles/components/LandingPage.module.css'

export function LandingPage(): React.ReactElement {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Welcome to {APP_CONFIG.name}
        </motion.h1>
        
        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {APP_CONFIG.description}
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to={ROUTES.auth.signup} className={styles.primaryButton}>
            Get Started
          </Link>
          <Link to={ROUTES.auth.login} className={styles.secondaryButton}>
            Sign In
          </Link>
        </motion.div>

        <motion.div
          className={styles.features}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className={styles.feature}>
            <h3>Personalized Therapy</h3>
            <p>Choose from three distinct therapist personalities to match your needs</p>
          </div>
          <div className={styles.feature}>
            <h3>Real-time Chat</h3>
            <p>Engage in meaningful conversations with AI-powered therapy assistance</p>
          </div>
          <div className={styles.feature}>
            <h3>Wellness Journey</h3>
            <p>Track your progress and build healthy habits with guided support</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 