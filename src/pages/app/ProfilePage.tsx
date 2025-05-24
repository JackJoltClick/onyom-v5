import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants'
import styles from '@/styles/pages/ProfilePage.module.css'

export function ProfilePage(): React.ReactElement {
  const { user, signOut } = useAuth()
  const { theme, setTheme, isDark } = useTheme()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    try {
      await signOut()
      // Success message will be shown briefly before redirect
      console.log(SUCCESS_MESSAGES.auth.signOutSuccess)
    } catch (error) {
      console.error('Sign out failed:', error)
      alert(ERROR_MESSAGES.general.unexpectedError)
      setIsSigningOut(false)
    }
  }

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>Manage your account and preferences</p>
        </div>

        {/* User Information */}
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            <span className={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{user?.name || 'User'}</h2>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
        </div>

        {/* Settings */}
        <div className={styles.settingsSection}>
          <h3 className={styles.sectionTitle}>Settings</h3>
          
          {/* Theme Toggle */}
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Theme</span>
              <span className={styles.settingValue}>
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </span>
            </div>
            <button
              onClick={handleThemeToggle}
              className={styles.settingButton}
            >
              Switch to {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actionsSection}>
          <motion.button
            className={`${styles.signOutButton} ${isSigningOut ? styles.loading : ''}`}
            onClick={handleSignOut}
            disabled={isSigningOut}
            whileHover={!isSigningOut ? { scale: 1.02 } : {}}
            whileTap={!isSigningOut ? { scale: 0.98 } : {}}
          >
            <span className={styles.signOutIcon}>
              {isSigningOut ? '⏳' : '🚪'}
            </span>
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </motion.button>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Thank you for using Onyom for your wellness journey.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 