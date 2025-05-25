import React from 'react'
import { motion } from 'framer-motion'
import { IoStar, IoTrendingUp, IoSparkles } from 'react-icons/io5'
import type { UserProfile as UserProfileType } from '@/types'
import styles from '@/styles/components/UserProfile.module.css'

interface UserProfileProps {
  user: UserProfileType | null
  level: string
  experiencePoints: number
  nextLevelPoints: number
}

export function UserProfile({ user, level, experiencePoints, nextLevelPoints }: UserProfileProps): React.ReactElement {
  const progressPercentage = (experiencePoints / nextLevelPoints) * 100
  const initials = user?.name?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || 
                   user?.email?.charAt(0)?.toUpperCase() || '?'

  return (
    <motion.div 
      className={styles.heroCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Elements */}
      <div className={styles.heroBackground}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gradientOrb3} />
        <div className={styles.floatingParticles}>
          <div className={styles.particle} />
          <div className={styles.particle} />
          <div className={styles.particle} />
          <div className={styles.particle} />
          <div className={styles.particle} />
          <div className={styles.particle} />
        </div>
      </div>

      <div className={styles.heroContent}>
        {/* Profile Section */}
        <div className={styles.profileSection}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              <div className={styles.avatarGlow} />
              <span className={styles.avatarText}>{initials}</span>
            </div>
            <div className={styles.statusBadge}>
              <IoSparkles className={styles.statusIcon} />
              Active
            </div>
          </div>

          <div className={styles.userInfo}>
            <p className={styles.welcomeText}>Welcome back,</p>
            <h1 className={styles.userName}>
              {user?.name || user?.email?.split('@')[0] || 'Mindful User'}
            </h1>
            {user?.email && (
              <p className={styles.userEmail}>{user.email}</p>
            )}
            <div className={styles.levelBadge}>
              <div className={styles.levelGlow} />
              <IoStar className={styles.levelIcon} />
              <span className={styles.levelText}>{level} Level</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <div className={styles.progressInfo}>
              <h3 className={styles.progressLabel}>Progress to Next Level</h3>
              <div className={styles.progressMeta}>
                <IoTrendingUp className={styles.trendIcon} />
              </div>
            </div>
          </div>

          <div className={styles.progressBarContainer}>
            <div className={styles.progressTrack}>
              <div className={styles.progressGlow} />
              <motion.div 
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <span className={styles.progressPercentage}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}