import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { IoSettings, IoLogOut } from 'react-icons/io5'
import { useAuth } from '@/hooks/useAuth'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants'
import { UserProfile } from '@/components/profile/UserProfile'
import { ProgressStats } from '@/components/profile/ProgressStats'
import styles from '@/styles/pages/ProfilePage.module.css'

export function ProfilePage(): React.ReactElement {
  const { user, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    try {
      await signOut()
      console.log(SUCCESS_MESSAGES.auth.signOutSuccess)
    } catch (error) {
      console.error('Sign out failed:', error)
      alert(ERROR_MESSAGES.general.unexpectedError)
      setIsSigningOut(false)
    }
  }

  // Mock progress data - in a real app this would come from your backend
  const progressData = {
    totalSessions: 47,
    totalMinutes: 1240,
    currentStreak: 12,
    weeklyGoal: 5,
    completedThisWeek: 3,
    level: 'Mindful Explorer',
    experiencePoints: 2340,
    nextLevelPoints: 3000,
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
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
      {/* Header */}
      <motion.header className={styles.header} variants={itemVariants}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Your Journey</h1>
          <p className={styles.subtitle}>
            Track your mindfulness progress and celebrate your growth
          </p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* User Profile Hero */}
        <motion.section className={styles.heroSection} variants={itemVariants}>
          <UserProfile 
            user={user}
            level={progressData.level}
            experiencePoints={progressData.experiencePoints}
            nextLevelPoints={progressData.nextLevelPoints}
          />
        </motion.section>

        {/* Progress Section */}
        <motion.section className={styles.progressSection} variants={itemVariants}>
          <h3 className={styles.sectionTitle}>Your Progress</h3>
          <ProgressStats data={progressData} />
        </motion.section>

        {/* Actions */}
        <motion.section className={styles.actionsSection} variants={itemVariants}>
          <div className={styles.actionButtons}>
            <motion.button
              className={styles.settingsButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoSettings />
              <span>Settings</span>
            </motion.button>

            <motion.button
              className={`${styles.signOutButton} ${isSigningOut ? styles.loading : ''}`}
              onClick={handleSignOut}
              disabled={isSigningOut}
              whileHover={!isSigningOut ? { scale: 1.02 } : {}}
              whileTap={!isSigningOut ? { scale: 0.98 } : {}}
            >
              <IoLogOut />
              <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
            </motion.button>
          </div>
        </motion.section>
      </main>
    </motion.div>
  )
} 