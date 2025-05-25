import React from 'react'
import { motion } from 'framer-motion'
import { IoTime, IoTrophy, IoFlame, IoHeart, IoTrendingUp, IoCalendar } from 'react-icons/io5'
import styles from '@/styles/components/ProgressStats.module.css'

interface ProgressData {
  totalSessions: number
  totalMinutes: number
  currentStreak: number
  weeklyGoal: number
  completedThisWeek: number
  level: string
  experiencePoints: number
  nextLevelPoints: number
}

interface ProgressStatsProps {
  data: ProgressData
}

export function ProgressStats({ data }: ProgressStatsProps): React.ReactElement {
  const weeklyProgress = (data.completedThisWeek / data.weeklyGoal) * 100
  const levelProgress = (data.experiencePoints / data.nextLevelPoints) * 100

  const stats = [
    {
      icon: IoTime,
      value: data.totalMinutes,
      label: 'Minutes',
      color: 'var(--onyom-accent-primary)',
      suffix: 'min'
    },
    {
      icon: IoTrophy,
      value: data.totalSessions,
      label: 'Sessions',
      color: 'var(--onyom-sage)',
      suffix: ''
    },
    {
      icon: IoFlame,
      value: data.currentStreak,
      label: 'Day Streak',
      color: 'var(--onyom-beige)',
      suffix: 'days'
    },
    {
      icon: IoCalendar,
      value: data.completedThisWeek,
      label: 'This Week',
      color: 'var(--onyom-accent-primary)',
      suffix: `/${data.weeklyGoal}`
    }
  ]

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
    <div className={styles.container}>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={styles.statCard}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className={styles.statIcon} style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)` }}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>
                {stat.value}{stat.suffix}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Cards */}
      <div className={styles.progressGrid}>
        {/* Level Progress */}
        <motion.div
          className={styles.progressCard}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <div className={styles.progressHeader}>
            <div className={styles.progressInfo}>
              <h3 className={styles.progressTitle}>Level Progress</h3>
              <p className={styles.progressSubtitle}>{data.level}</p>
            </div>
            <div className={styles.progressIcon}>
              <IoTrendingUp />
            </div>
          </div>
          
          <div className={styles.progressBar}>
            <div className={styles.progressTrack}>
              <motion.div 
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
            <div className={styles.progressMeta}>
              <span className={styles.progressPoints}>
                {data.experiencePoints} / {data.nextLevelPoints} XP
              </span>
              <span className={styles.progressPercentage}>
                {Math.round(levelProgress)}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Weekly Goal */}
        <motion.div
          className={styles.progressCard}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <div className={styles.progressHeader}>
            <div className={styles.progressInfo}>
              <h3 className={styles.progressTitle}>Weekly Goal</h3>
              <p className={styles.progressSubtitle}>
                {data.completedThisWeek} of {data.weeklyGoal} sessions
              </p>
            </div>
            <div className={styles.progressIcon}>
              <IoHeart />
            </div>
          </div>
          
          <div className={styles.progressBar}>
            <div className={styles.progressTrack}>
              <motion.div 
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${weeklyProgress}%` }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
            <div className={styles.progressMeta}>
              <span className={styles.progressPoints}>
                {weeklyProgress >= 100 ? 'Goal completed!' : `${data.weeklyGoal - data.completedThisWeek} sessions to go`}
              </span>
              <span className={styles.progressPercentage}>
                {Math.round(weeklyProgress)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 