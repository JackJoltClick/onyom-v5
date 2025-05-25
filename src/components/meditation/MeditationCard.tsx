import React from 'react'
import { motion } from 'framer-motion'
import { IoPlay, IoPause, IoTime, IoPerson, IoHeart, IoHeartOutline, IoBody } from 'react-icons/io5'
import { Button } from '@/components/ui/Button'
import { useMeditationStore } from '@/stores/meditationStore'
import { MEDITATION_CONFIG } from '@/lib/constants'
import type { Meditation } from '@/types'
import styles from '@/styles/components/MeditationCard.module.css'

interface MeditationCardProps {
  meditation: Meditation
  onSelect?: (meditation: Meditation) => void
  isSelected?: boolean
  className?: string
  variant?: 'default' | 'minimal'
}

export function MeditationCard({ 
  meditation, 
  onSelect,
  isSelected = false,
  className = '',
  variant = 'default'
}: MeditationCardProps): React.ReactElement {
  const player = useMeditationStore((state) => state.player)
  
  const categoryConfig = MEDITATION_CONFIG.categories[meditation.category] || {
    name: 'Mindfulness',
    icon: IoBody,
    color: '#4F46E5'
  }
  
  const isCurrentlyPlaying = player.currentMeditation?.id === meditation.id && player.isPlaying

  const handlePlay = () => {
    if (onSelect) {
      onSelect(meditation)
    }
  }

  // Render the icon component
  const IconComponent = categoryConfig.icon

  return (
    <motion.div
      className={`${styles.card} ${styles[variant]} ${isCurrentlyPlaying ? styles.playing : ''} ${isSelected ? styles.selected : ''} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Category Badge */}
      {variant === 'default' && (
        <div 
          className={styles.categoryBadge}
          style={{ backgroundColor: categoryConfig.color }}
        >
          <span className={styles.categoryIcon}>
            <IconComponent size={16} />
          </span>
          <span className={styles.categoryName}>{categoryConfig.name}</span>
        </div>
      )}

      {/* Content */}
      <div className={styles.content}>
        {variant === 'minimal' && (
          <div className={styles.minimalHeader}>
            <span className={styles.minimalCategory}>
              <IconComponent size={16} /> {categoryConfig.name}
            </span>
            <span className={styles.minimalDuration}>
              {meditation.duration_minutes} min
            </span>
          </div>
        )}

        <div className={styles.header}>
          <h3 className={styles.title}>{meditation.title}</h3>
          {variant === 'default' && (
            <div className={styles.duration}>
              <IoTime className={styles.durationIcon} size={14} />
              <span>{meditation.duration_minutes} min</span>
            </div>
          )}
        </div>

        <p className={styles.description}>{meditation.description}</p>

        {variant === 'default' && (
          <>
            <div className={styles.metadata}>
              <div className={styles.instructor}>
                <IoPerson className={styles.instructorIcon} size={14} />
                <span>{meditation.instructor}</span>
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
          </>
        )}

        {variant === 'minimal' && (
          <div className={styles.minimalInstructor}>
            with {meditation.instructor}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          variant={isCurrentlyPlaying ? 'secondary' : 'primary'}
          size={variant === 'minimal' ? 'md' : 'sm'}
          onClick={handlePlay}
          className={styles.playButton}
        >
          {isCurrentlyPlaying ? (
            <IoPause className={styles.playIcon} size={16} />
          ) : (
            <IoPlay className={styles.playIcon} size={16} />
          )}
          {isCurrentlyPlaying ? 'Playing' : variant === 'minimal' ? 'Start' : 'Play'}
        </Button>

        {variant === 'default' && (
          <button 
            className={styles.favoriteButton}
            aria-label="Add to favorites"
          >
            <IoHeartOutline size={18} />
          </button>
        )}
      </div>
    </motion.div>
  )
} 