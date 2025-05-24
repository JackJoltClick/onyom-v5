import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useMeditationStore } from '@/stores/meditationStore'
import { MEDITATION_CONFIG } from '@/lib/constants'
import type { Meditation, GeneratedMeditation } from '@/types'
import styles from '@/styles/components/MeditationCard.module.css'

interface MeditationCardProps {
  meditation: Meditation | GeneratedMeditation
  className?: string
}

export function MeditationCard({ meditation, className = '' }: MeditationCardProps): React.ReactElement {
  const playMeditation = useMeditationStore((state) => state.playMeditation)
  const currentMeditation = useMeditationStore((state) => state.player.currentMeditation)
  const isPlaying = useMeditationStore((state) => state.player.isPlaying)
  
  const categoryConfig = MEDITATION_CONFIG.categories[meditation.category]
  const isCurrentlyPlaying = currentMeditation?.title === meditation.title && isPlaying
  const isGenerated = 'is_personalized' in meditation

  const handlePlay = () => {
    playMeditation(meditation)
  }

  return (
    <motion.div
      className={`${styles.card} ${isCurrentlyPlaying ? styles.playing : ''} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Category Badge */}
      <div 
        className={styles.categoryBadge}
        style={{ backgroundColor: categoryConfig.color }}
      >
        <span className={styles.categoryIcon}>{categoryConfig.icon}</span>
        <span className={styles.categoryName}>{categoryConfig.name}</span>
      </div>

      {/* Generated Badge */}
      {isGenerated && (
        <div className={styles.generatedBadge}>
          <span>✨ For You</span>
        </div>
      )}

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{meditation.title}</h3>
          <div className={styles.duration}>
            <span className={styles.durationIcon}>⏱️</span>
            <span>{meditation.duration_minutes} min</span>
          </div>
        </div>

        <p className={styles.description}>{meditation.description}</p>

        <div className={styles.metadata}>
          <div className={styles.instructor}>
            {meditation.instructor && (
              <>
                <span className={styles.instructorIcon}>👤</span>
                <span>{meditation.instructor}</span>
              </>
            )}
            {isGenerated && (
              <>
                <span className={styles.instructorIcon}>🤖</span>
                <span>AI Generated</span>
              </>
            )}
          </div>
          
          <div className={styles.difficulty}>
            <span className={styles.difficultyBadge}>
              {meditation.difficulty_level}
            </span>
          </div>
        </div>

        <div className={styles.tags}>
          {meditation.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          variant={isCurrentlyPlaying ? 'secondary' : 'primary'}
          size="sm"
          onClick={handlePlay}
          className={styles.playButton}
        >
          <span className={styles.playIcon}>
            {isCurrentlyPlaying ? '⏸️' : '▶️'}
          </span>
          {isCurrentlyPlaying ? 'Playing' : 'Play'}
        </Button>

        <button 
          className={styles.favoriteButton}
          aria-label="Add to favorites"
        >
          <span>🤍</span>
        </button>
      </div>
    </motion.div>
  )
} 