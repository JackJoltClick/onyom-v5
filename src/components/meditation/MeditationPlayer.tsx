import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useMeditationStore } from '@/stores/meditationStore'
import { MeditationService } from '@/services/meditationService'
import { MEDITATION_CONFIG } from '@/lib/constants'
import type { Meditation, GeneratedMeditation } from '@/types'
import styles from '@/styles/components/MeditationPlayer.module.css'

export function MeditationPlayer(): React.ReactElement {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [localCurrentTime, setLocalCurrentTime] = useState(0)
  const [audioLoaded, setAudioLoaded] = useState(false)

  // Store state
  const player = useMeditationStore((state) => state.player)
  const pauseMeditation = useMeditationStore((state) => state.pauseMeditation)
  const resumeMeditation = useMeditationStore((state) => state.resumeMeditation)
  const stopMeditation = useMeditationStore((state) => state.stopMeditation)
  const seekTo = useMeditationStore((state) => state.seekTo)
  const setVolume = useMeditationStore((state) => state.setVolume)
  const setBackgroundSound = useMeditationStore((state) => state.setBackgroundSound)

  const { currentMeditation, isPlaying, currentTime, duration, volume, backgroundSound } = player

  // Handle audio loading and playback
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentMeditation?.audio_url) return

    audio.src = currentMeditation.audio_url
    audio.volume = volume

    const handleLoadedData = () => {
      setAudioLoaded(true)
      seekTo(currentTime)
    }

    const handleTimeUpdate = () => {
      setLocalCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      stopMeditation()
      setLocalCurrentTime(0)
    }

    const handleError = () => {
      console.error('Audio playback error')
      setAudioLoaded(false)
    }

    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [currentMeditation?.audio_url, volume, currentTime, seekTo, stopMeditation])

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioLoaded) return

    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise) {
        playPromise.catch(error => {
          console.error('Audio play error:', error)
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying, audioLoaded])

  // Handle seeking
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioLoaded) return

    if (Math.abs(audio.currentTime - currentTime) > 1) {
      audio.currentTime = currentTime
    }
  }, [currentTime, audioLoaded])

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseMeditation()
    } else {
      resumeMeditation()
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    seekTo(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = (): number => {
    if (!duration) return 0
    return (localCurrentTime / duration) * 100
  }

  const handleClose = () => {
    stopMeditation()
    if (currentMeditation?.audio_url) {
      MeditationService.cleanupAudioUrl(currentMeditation.audio_url)
    }
  }

  if (!currentMeditation) {
    return <></>
  }

  const categoryConfig = MEDITATION_CONFIG.categories[currentMeditation.category]
  const isGenerated = 'is_personalized' in currentMeditation

  return (
    <AnimatePresence>
      <motion.div
        className={styles.player}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <audio ref={audioRef} preload="auto" />
        
        <div className={styles.playerContent}>
          {/* Meditation Info */}
          <div className={styles.meditationInfo}>
            <div className={styles.meditationDetails}>
              <h3 className={styles.title}>{currentMeditation.title}</h3>
              <div className={styles.metadata}>
                <span className={styles.category} style={{ color: categoryConfig.color }}>
                  {categoryConfig.icon} {categoryConfig.name}
                </span>
                {isGenerated && (
                  <span className={styles.generatedBadge}>✨ Personalized</span>
                )}
                <span className={styles.duration}>
                  {currentMeditation.duration_minutes} min
                </span>
              </div>
            </div>
            
            <button 
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close player"
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progress}
                style={{ width: `${getProgressPercentage()}%` }}
              />
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={localCurrentTime}
                onChange={handleSeek}
                className={styles.progressInput}
                disabled={!audioLoaded}
              />
            </div>
            
            <div className={styles.timeDisplay}>
              <span>{formatTime(localCurrentTime)}</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.playbackControls}>
              <Button
                variant="primary"
                size="lg"
                onClick={handlePlayPause}
                disabled={!audioLoaded}
                className={styles.playButton}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => stopMeditation()}
                disabled={!audioLoaded}
                className={styles.stopButton}
              >
                ⏹️
              </Button>
            </div>

            <div className={styles.volumeControl}>
              <span className={styles.volumeIcon}>🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
              />
            </div>
          </div>

          {/* Background Sound Selector */}
          <div className={styles.backgroundSounds}>
            <span className={styles.backgroundLabel}>Background:</span>
            <div className={styles.soundOptions}>
              {Object.entries(MEDITATION_CONFIG.backgroundSounds).map(([key, sound]) => (
                <button
                  key={key}
                  className={`${styles.soundOption} ${backgroundSound === key ? styles.active : ''}`}
                  onClick={() => setBackgroundSound(backgroundSound === key ? undefined : key)}
                >
                  <span>{sound.icon}</span>
                  <span>{sound.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 