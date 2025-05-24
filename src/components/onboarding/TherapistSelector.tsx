import React from 'react'
import { motion } from 'framer-motion'
import { THERAPIST_PERSONALITIES } from '@/lib/constants'
import type { TherapistTone } from '@/types'
import styles from '@/styles/components/TherapistSelector.module.css'

interface TherapistSelectorProps {
  selectedTone: TherapistTone | null
  onSelect: (tone: TherapistTone) => void
}

export function TherapistSelector({ selectedTone, onSelect }: TherapistSelectorProps): React.ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Choose Your Therapist Style</h2>
        <p className={styles.subtitle}>
          Select the therapeutic approach that feels most comfortable for you
        </p>
      </div>

      <div className={styles.options}>
        {Object.entries(THERAPIST_PERSONALITIES).map(([tone, personality]) => (
          <motion.button
            key={tone}
            className={`${styles.option} ${selectedTone === tone ? styles.selected : ''}`}
            onClick={() => onSelect(tone as TherapistTone)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.optionHeader}>
              <h3 className={styles.optionTitle}>
                {personality.tone.charAt(0).toUpperCase() + personality.tone.slice(1)}
              </h3>
              {selectedTone === tone && (
                <motion.div
                  className={styles.checkmark}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  ✓
                </motion.div>
              )}
            </div>
            
            <p className={styles.optionDescription}>
              {personality.greeting}
            </p>
            
            <div className={styles.characteristics}>
              {personality.characteristics.map((characteristic, index) => (
                <span key={index} className={styles.characteristic}>
                  {characteristic}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
} 