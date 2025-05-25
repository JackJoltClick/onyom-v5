import React, { useRef, useEffect, useState } from 'react'
import { IoPlay, IoPause, IoStop, IoWarning, IoVolumeHigh, IoVolumeMute, IoCloudDownload, IoBody, IoClose } from 'react-icons/io5'
import { useMeditationStore } from '@/stores/meditationStore'
import { MEDITATION_CONFIG } from '@/lib/constants'
import styles from '@/styles/components/MeditationPlayer.module.css'

export function MeditationPlayer(): React.ReactElement | null {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isAudioLoaded, setIsAudioLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isAudioMissing, setIsAudioMissing] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)

  const { 
    player,
    pauseMeditation,
    resumeMeditation,
    stopMeditation,
    updateCurrentTime,
    updateDuration
  } = useMeditationStore()

  const { currentMeditation, isPlaying, currentTime, duration } = player

  // Format time helper
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentMeditation?.audio_url) return

    const handleLoadedData = () => {
      setIsAudioLoaded(true)
      setHasError(false)
      setIsAudioMissing(false)
      updateCurrentTime(0)
      updateDuration(audio.duration)
    }

    const handleError = (e: Event) => {
      console.error('Audio failed to load:', currentMeditation.audio_url)
      setHasError(true)
      setIsAudioLoaded(false)
      
      // Check if it's a 404 (file not found) error
      const target = e.target as HTMLAudioElement
      if (target?.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        setIsAudioMissing(true)
      }
    }

    const handleTimeUpdate = () => {
      updateCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      stopMeditation()
    }

    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('error', handleError)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    // Set volume
    audio.volume = isMuted ? 0 : volume

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentMeditation?.audio_url, volume, isMuted, updateCurrentTime, updateDuration, stopMeditation])

  // Play/pause control
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isAudioLoaded) return

    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error)
          setHasError(true)
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying, isAudioLoaded])

  const handlePlayPause = () => {
    if (!isAudioLoaded) return
    
    if (isPlaying) {
      pauseMeditation()
    } else {
      resumeMeditation()
    }
  }

  const handleStop = () => {
    stopMeditation()
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio || !isAudioLoaded) return
    
    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    updateCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume
    }
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : volume
    }
  }

  const handleClose = () => {
    stopMeditation()
    // This will clear the current meditation and hide the player
  }

  // Don't render if no meditation is selected
  if (!currentMeditation) {
    return null
  }

  const categoryConfig = MEDITATION_CONFIG.categories[currentMeditation.category] || {
    name: 'Mindfulness',
    icon: IoBody,
    color: '#4F46E5'
  }

  const IconComponent = categoryConfig.icon

  return (
    <div className={styles.player}>
      {/* Hidden audio element */}
      {currentMeditation?.audio_url && (
        <audio
          ref={audioRef}
          src={currentMeditation.audio_url}
          preload="metadata"
        />
      )}

      {/* Track Info */}
      <div className={styles.trackInfo}>
        <div className={styles.albumArt}>
          <IconComponent size={24} color={categoryConfig.color} />
        </div>
        <div className={styles.trackDetails}>
          <h4 className={styles.trackTitle}>{currentMeditation.title}</h4>
          <p className={styles.trackArtist}>{currentMeditation.instructor}</p>
        </div>
        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="Close player"
        >
          <IoClose size={20} />
        </button>
      </div>

      {/* Error States */}
      {isAudioMissing && (
        <div className={styles.audioMissing}>
          <IoCloudDownload size={20} style={{ color: '#F59E0B', marginRight: '8px' }} />
          <div>
            <p><strong>Audio file not found</strong></p>
            <p>The meditation audio hasn't been uploaded yet. You can still read the script below or add audio files to the /public/audio/ directory.</p>
          </div>
        </div>
      )}

      {hasError && !isAudioMissing && (
        <div className={styles.error}>
          <IoWarning size={20} style={{ color: '#DC2626', marginRight: '8px' }} />
          <p>Audio failed to load. Please try again later.</p>
        </div>
      )}

      {/* Audio Controls */}
      {!hasError && !isAudioMissing && (
        <>
          {/* Progress Bar */}
          <div className={styles.progressSection}>
            <span className={styles.timeDisplay}>{formatTime(currentTime)}</span>
            
            <div className={styles.progressContainer}>
              <div className={styles.progressTrack}>
                <div 
                  className={styles.progressFill}
                  style={{ 
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                  }}
                />
                <div 
                  className={styles.progressColorLayer}
                  style={{ 
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                    '--progress-percentage': duration > 0 ? (currentTime / duration) * 100 : 0
                  } as React.CSSProperties}
                />
                <div 
                  className={styles.progressThumb}
                  style={{ 
                    left: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                  }}
                />
              </div>
              
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className={styles.progressInput}
                disabled={!isAudioLoaded}
                aria-label="Meditation progress"
              />
            </div>
            
            <span className={styles.timeDisplay}>{formatTime(duration)}</span>
          </div>

          {/* Control Buttons */}
          <div className={styles.controls}>
            <button
              onClick={handleStop}
              className={styles.controlButton}
              disabled={!isAudioLoaded}
              aria-label="Stop"
            >
              <IoStop size={20} />
            </button>

            <button
              onClick={handlePlayPause}
              className={`${styles.playButton} ${!isAudioLoaded ? styles.loading : ''}`}
              disabled={!isAudioLoaded}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {!isAudioLoaded ? (
                <div className={styles.spinner} />
              ) : isPlaying ? (
                <IoPause size={24} />
              ) : (
                <IoPlay size={24} />
              )}
            </button>

            {/* Volume Control */}
            <div className={styles.volumeContainer}>
              <button
                onClick={toggleMute}
                className={styles.volumeButton}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <IoVolumeMute size={18} /> : <IoVolumeHigh size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
                aria-label="Volume"
              />
            </div>
          </div>
        </>
      )}

      {/* Meditation Script Fallback */}
      {(isAudioMissing || hasError) && currentMeditation.script_text && (
        <div className={styles.scriptFallback}>
          <h5>Meditation Script</h5>
          <p>{currentMeditation.script_text}</p>
        </div>
      )}
    </div>
  )
} 