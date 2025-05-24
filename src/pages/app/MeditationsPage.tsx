import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MeditationCard } from '@/components/meditation/MeditationCard'
import { Button } from '@/components/ui/Button'
import { useMeditationStore } from '@/stores/meditationStore'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { MEDITATION_CONFIG } from '@/lib/constants'
import type { MeditationTab, MeditationCategory } from '@/types'
import styles from '@/styles/pages/MeditationsPage.module.css'

export function MeditationsPage(): React.ReactElement {
  const { user } = useAuth()
  const { isDark } = useTheme()
  
  // Meditation store state
  const activeTab = useMeditationStore((state) => state.activeTab)
  const selectedCategory = useMeditationStore((state) => state.selectedCategory)
  const meditations = useMeditationStore((state) => state.meditations)
  const generatedMeditations = useMeditationStore((state) => state.generatedMeditations)
  const progress = useMeditationStore((state) => state.progress)
  const currentMeditation = useMeditationStore((state) => state.player.currentMeditation)
  
  // Actions
  const setActiveTab = useMeditationStore((state) => state.setActiveTab)
  const setSelectedCategory = useMeditationStore((state) => state.setSelectedCategory)

  // Filter meditations based on selected category
  const filteredMeditations = useMemo(() => {
    if (selectedCategory === 'all') return meditations
    return meditations.filter(m => m.category === selectedCategory)
  }, [meditations, selectedCategory])

  // Tab definitions
  const tabs: { id: MeditationTab; label: string; icon: string }[] = [
    { id: 'library', label: 'Library', icon: '📚' },
    { id: 'for-you', label: 'For You', icon: '✨' },
    { id: 'progress', label: 'Progress', icon: '📊' }
  ]

  const handleGenerateMeditation = () => {
    // This will be implemented with OpenAI integration
    console.log('Generate meditation based on recent therapy sessions')
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Meditations</h1>
            <p className={styles.subtitle}>
              Find peace and clarity with guided practices
            </p>
          </div>
          
          {currentMeditation && (
            <motion.div 
              className={styles.nowPlaying}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className={styles.nowPlayingIcon}>🎵</span>
              <span className={styles.nowPlayingText}>
                Now Playing: {currentMeditation.title}
              </span>
            </motion.div>
          )}
        </div>

        {/* Tab Navigation */}
        <nav className={styles.tabNav}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
              {tab.id === 'for-you' && generatedMeditations.length > 0 && (
                <span className={styles.badge}>{generatedMeditations.length}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {/* Library Tab */}
          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.tabContent}
            >
              {/* Category Filter */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Categories</h3>
                <div className={styles.categoryFilters}>
                  <button
                    className={`${styles.categoryFilter} ${selectedCategory === 'all' ? styles.active : ''}`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    <span className={styles.categoryIcon}>🌟</span>
                    <span>All</span>
                  </button>
                  
                  {Object.entries(MEDITATION_CONFIG.categories).map(([key, config]) => (
                    <button
                      key={key}
                      className={`${styles.categoryFilter} ${selectedCategory === key ? styles.active : ''}`}
                      onClick={() => setSelectedCategory(key as MeditationCategory)}
                    >
                      <span className={styles.categoryIcon}>{config.icon}</span>
                      <span>{config.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Meditation Grid */}
              <div className={styles.meditationsGrid}>
                {filteredMeditations.map((meditation) => (
                  <MeditationCard 
                    key={meditation.id} 
                    meditation={meditation}
                  />
                ))}
              </div>

              {filteredMeditations.length === 0 && (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🔍</span>
                  <h3>No meditations found</h3>
                  <p>Try selecting a different category</p>
                </div>
              )}
            </motion.div>
          )}

          {/* For You Tab */}
          {activeTab === 'for-you' && (
            <motion.div
              key="for-you"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.tabContent}
            >
              <div className={styles.personalizedSection}>
                <div className={styles.personalizedHeader}>
                  <h3>Personalized Meditations</h3>
                  <p>Meditations created just for you based on your therapy conversations</p>
                </div>

                <Button 
                  onClick={handleGenerateMeditation}
                  className={styles.generateButton}
                >
                  <span>✨</span>
                  Generate New Meditation
                </Button>
              </div>

              {/* Generated Meditations */}
              {generatedMeditations.length > 0 ? (
                <div className={styles.meditationsGrid}>
                  {generatedMeditations.map((meditation, index) => (
                    <MeditationCard 
                      key={`generated-${index}`} 
                      meditation={meditation}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🌱</span>
                  <h3>No personalized meditations yet</h3>
                  <p>
                    After a few therapy conversations, we'll create custom 
                    meditations tailored to your needs and current state of mind.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.tabContent}
            >
              <div className={styles.progressContent}>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <span className={styles.statIcon}>🧘</span>
                    <div className={styles.statInfo}>
                      <span className={styles.statNumber}>{progress.total_sessions}</span>
                      <span className={styles.statLabel}>Sessions</span>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <span className={styles.statIcon}>⏰</span>
                    <div className={styles.statInfo}>
                      <span className={styles.statNumber}>{Math.round(progress.total_minutes)}</span>
                      <span className={styles.statLabel}>Minutes</span>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <span className={styles.statIcon}>🔥</span>
                    <div className={styles.statInfo}>
                      <span className={styles.statNumber}>{progress.current_streak}</span>
                      <span className={styles.statLabel}>Day Streak</span>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <span className={styles.statIcon}>🎯</span>
                    <div className={styles.statInfo}>
                      <span className={styles.statNumber}>{Math.round(progress.average_session_duration)}</span>
                      <span className={styles.statLabel}>Avg Minutes</span>
                    </div>
                  </div>
                </div>

                {progress.total_sessions === 0 && (
                  <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📈</span>
                    <h3>Start your meditation journey</h3>
                    <p>
                      Begin with a meditation session to see your progress and statistics here.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
} 