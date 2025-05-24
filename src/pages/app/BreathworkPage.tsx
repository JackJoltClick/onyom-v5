import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/hooks/useAuth'
import styles from '@/styles/pages/BreathworkPage.module.css'

export function BreathworkPage(): React.ReactElement {
  const { theme } = useTheme()
  const { user } = useAuth()

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>Breathwork</h1>
          <p className={styles.subtitle}>
            Welcome {user?.name}! Let's practice mindful breathing together.
          </p>
        </div>

        <div className={styles.comingSoon}>
          <motion.div
            className={styles.breathIcon}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🫁
          </motion.div>
          <h2 className={styles.comingSoonTitle}>Coming Soon</h2>
          <p className={styles.comingSoonText}>
            Guided breathing exercises and techniques are in development.
            Stay tuned for a comprehensive breathwork experience!
          </p>
        </div>
      </motion.div>
    </div>
  )
} 