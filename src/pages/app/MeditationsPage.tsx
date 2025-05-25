import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoPlay, IoPause, IoSparkles, IoFlower } from 'react-icons/io5'
import { MeditationCard } from '@/components/meditation/MeditationCard'
import { useMeditationStore } from '@/stores/meditationStore'
import { MEDITATION_CONFIG } from '@/lib/constants'
import type { MeditationCategory } from '@/types'
import styles from '@/styles/pages/MeditationsPage.module.css'

export function MeditationsPage(): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState<MeditationCategory | 'all'>('all')
  const [showAllCategories, setShowAllCategories] = useState(false)
  
  // Meditation store state
  const meditations = useMeditationStore((state) => state.meditations)
  const player = useMeditationStore((state) => state.player)
  const loadMeditations = useMeditationStore((state) => state.loadMeditations)
  const playMeditation = useMeditationStore((state) => state.playMeditation)

  // Load meditations on mount
  useEffect(() => {
    loadMeditations()
  }, [loadMeditations])

  // Filter meditations
  const filteredMeditations = useMemo(() => {
    if (selectedCategory === 'all') return meditations
    return meditations.filter(m => m.category === selectedCategory)
  }, [meditations, selectedCategory])

  // Get featured meditation (first one or currently playing)
  const featuredMeditation = player.currentMeditation || filteredMeditations[0]
  const otherMeditations = filteredMeditations.filter(m => m.id !== featuredMeditation?.id)

  const handleMeditationSelect = (meditation: any) => {
    playMeditation(meditation)
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
          <h1 className={styles.title}>Find Your Peace</h1>
          <p className={styles.subtitle}>
            Guided meditations to calm your mind and soothe your soul
          </p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Hero Meditation */}
        {featuredMeditation && (
          <motion.section className={styles.heroSection} variants={itemVariants}>
            <div className={styles.heroCard}>
              <div className={styles.heroContent}>
                <div className={styles.heroMeta}>
                  <span className={styles.heroCategory}>
                    {(() => {
                      const IconComponent = MEDITATION_CONFIG.categories[featuredMeditation.category]?.icon
                      return IconComponent ? <IconComponent size={16} /> : null
                    })()}
                    {MEDITATION_CONFIG.categories[featuredMeditation.category]?.name}
                  </span>
                  <span className={styles.heroDuration}>
                    {featuredMeditation.duration_minutes} min
                  </span>
                </div>
                
                <h2 className={styles.heroTitle}>{featuredMeditation.title}</h2>
                <p className={styles.heroDescription}>{featuredMeditation.description}</p>
                
                <div className={styles.heroActions}>
                  <motion.button
                    className={styles.heroPlayButton}
                    onClick={() => handleMeditationSelect(featuredMeditation)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={styles.playIcon}>
                      {player.currentMeditation?.id === featuredMeditation.id && player.isPlaying ? (
                        <IoPause size={20} />
                      ) : (
                        <IoPlay size={20} />
                      )}
                    </span>
                    {player.currentMeditation?.id === featuredMeditation.id && player.isPlaying ? 'Pause' : 'Start Session'}
                  </motion.button>
                </div>

                <div className={styles.heroInstructor}>
                  <span>with {featuredMeditation.instructor}</span>
                </div>
              </div>

              <div className={styles.heroVisual}>
                <div className={styles.heroGradient}></div>
                <div className={styles.heroPattern}></div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Category Navigation */}
        <motion.section className={styles.categorySection} variants={itemVariants}>
          <div className={styles.categoryHeader}>
            <h3 className={styles.categoryTitle}>Explore by mood</h3>
            <button 
              className={styles.categoryToggle}
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              {showAllCategories ? 'Show less' : 'View all'}
            </button>
          </div>

          <div className={styles.categoryContainer}>
            <motion.button
              className={`${styles.categoryChip} ${selectedCategory === 'all' ? styles.active : ''}`}
              onClick={() => setSelectedCategory('all')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoSparkles className={styles.categoryIcon} size={16} />
              <span>All</span>
            </motion.button>
            
            {Object.entries(MEDITATION_CONFIG.categories)
              .slice(0, showAllCategories ? undefined : 4)
              .map(([key, config]) => {
                const IconComponent = config.icon
                return (
                  <motion.button
                    key={key}
                    className={`${styles.categoryChip} ${selectedCategory === key ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(key as MeditationCategory)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconComponent className={styles.categoryIcon} size={16} />
                    <span>{config.name}</span>
                  </motion.button>
                )
              })}
          </div>
        </motion.section>

        {/* Meditation Collection */}
        {otherMeditations.length > 0 && (
          <motion.section className={styles.collectionSection} variants={itemVariants}>
            <h3 className={styles.collectionTitle}>
              {selectedCategory === 'all' ? 'More meditations' : `More ${MEDITATION_CONFIG.categories[selectedCategory as MeditationCategory]?.name.toLowerCase()}`}
            </h3>
            
            <div className={styles.meditationGrid}>
              <AnimatePresence>
                {otherMeditations.map((meditation, index) => (
                  <motion.div
                    key={meditation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100,
                      damping: 12
                    }}
                  >
                    <MeditationCard 
                      meditation={meditation}
                      onSelect={handleMeditationSelect}
                      isSelected={player.currentMeditation?.id === meditation.id}
                      variant="minimal"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {/* Empty State */}
        {filteredMeditations.length === 0 && (
          <motion.div className={styles.emptyState} variants={itemVariants}>
            <IoFlower className={styles.emptyIcon} size={48} />
            <h3>No meditations found</h3>
            <p>Try exploring a different mood or category</p>
            <button 
              className={styles.emptyAction}
              onClick={() => setSelectedCategory('all')}
            >
              View all meditations
            </button>
          </motion.div>
        )}
      </main>
    </motion.div>
  )
} 