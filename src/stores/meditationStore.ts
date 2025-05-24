import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  Meditation, 
  GeneratedMeditation, 
  MeditationTab, 
  MeditationCategory, 
  MeditationPlayerState,
  MeditationProgress 
} from '@/types'
import { SAMPLE_MEDITATIONS } from '@/lib/constants'

interface MeditationState {
  // UI State
  activeTab: MeditationTab
  selectedCategory: MeditationCategory | 'all'
  
  // Content
  meditations: Meditation[]
  generatedMeditations: GeneratedMeditation[]
  
  // Player State
  player: MeditationPlayerState
  
  // Progress
  progress: MeditationProgress
  
  // Preferences
  preferences: {
    defaultBackgroundSound?: string
    autoPlayNext: boolean
    showSubtitles: boolean
    preferredDuration: number
  }
  
  // Actions
  setActiveTab: (tab: MeditationTab) => void
  setSelectedCategory: (category: MeditationCategory | 'all') => void
  
  // Player Actions
  playMeditation: (meditation: Meditation | GeneratedMeditation) => void
  pauseMeditation: () => void
  resumeMeditation: () => void
  stopMeditation: () => void
  seekTo: (time: number) => void
  setVolume: (volume: number) => void
  setPlaybackRate: (rate: number) => void
  toggleSubtitles: () => void
  setBackgroundSound: (sound?: string) => void
  
  // Content Actions
  addGeneratedMeditation: (meditation: GeneratedMeditation) => void
  favoriteMeditation: (meditationId: string) => void
  
  // Progress Actions
  recordSession: (meditationId: string, duration: number, mood?: { pre?: number, post?: number }) => void
  updateProgress: () => void
}

export const useMeditationStore = create<MeditationState>()(
  persist(
    (set, get) => ({
      // Initial State
      activeTab: 'library',
      selectedCategory: 'all',
      
      meditations: SAMPLE_MEDITATIONS,
      generatedMeditations: [],
      
      player: {
        currentMeditation: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.8,
        playbackRate: 1,
        isLoading: false,
        showSubtitles: false
      },
      
      progress: {
        total_sessions: 0,
        total_minutes: 0,
        current_streak: 0,
        longest_streak: 0,
        favorite_categories: [],
        average_session_duration: 0
      },
      
      preferences: {
        autoPlayNext: false,
        showSubtitles: false,
        preferredDuration: 10
      },
      
      // UI Actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      
      // Player Actions
      playMeditation: (meditation) => {
        console.log('MeditationStore: Playing meditation:', meditation.title)
        set(state => ({
          player: {
            ...state.player,
            currentMeditation: meditation,
            isPlaying: true,
            isLoading: true,
            currentTime: 0,
            duration: meditation.duration_minutes * 60 // Convert to seconds
          }
        }))
        
        // Simulate loading complete after a short delay
        setTimeout(() => {
          set(state => ({
            player: {
              ...state.player,
              isLoading: false
            }
          }))
        }, 1000)
      },
      
      pauseMeditation: () => {
        console.log('MeditationStore: Pausing meditation')
        set(state => ({
          player: {
            ...state.player,
            isPlaying: false
          }
        }))
      },
      
      resumeMeditation: () => {
        console.log('MeditationStore: Resuming meditation')
        set(state => ({
          player: {
            ...state.player,
            isPlaying: true
          }
        }))
      },
      
      stopMeditation: () => {
        console.log('MeditationStore: Stopping meditation')
        set(state => ({
          player: {
            ...state.player,
            isPlaying: false,
            currentTime: 0
          }
        }))
      },
      
      seekTo: (time) => {
        set(state => ({
          player: {
            ...state.player,
            currentTime: time
          }
        }))
      },
      
      setVolume: (volume) => {
        set(state => ({
          player: {
            ...state.player,
            volume: Math.max(0, Math.min(1, volume))
          }
        }))
      },
      
      setPlaybackRate: (rate) => {
        set(state => ({
          player: {
            ...state.player,
            playbackRate: Math.max(0.5, Math.min(2, rate))
          }
        }))
      },
      
      toggleSubtitles: () => {
        set(state => ({
          player: {
            ...state.player,
            showSubtitles: !state.player.showSubtitles
          },
          preferences: {
            ...state.preferences,
            showSubtitles: !state.player.showSubtitles
          }
        }))
      },
      
      setBackgroundSound: (sound) => {
        set((state) => {
          const newState: Partial<MeditationState> = {
            player: {
              ...state.player,
              backgroundSound: sound
            },
            preferences: {
              ...state.preferences,
              defaultBackgroundSound: sound
            }
          }
          return newState
        })
      },
      
      // Content Actions
      addGeneratedMeditation: (meditation) => {
        console.log('MeditationStore: Adding generated meditation:', meditation.title)
        set(state => ({
          generatedMeditations: [meditation, ...state.generatedMeditations]
        }))
      },
      
      favoriteMeditation: (meditationId) => {
        console.log('MeditationStore: Favoriting meditation:', meditationId)
        // This would typically update a favorites list
        // For now, we'll just log it
      },
      
      // Progress Actions
      recordSession: (meditationId, durationSeconds, mood) => {
        console.log('MeditationStore: Recording session:', { meditationId, durationSeconds, mood })
        
        set(state => {
          const newTotalMinutes = state.progress.total_minutes + (durationSeconds / 60)
          const newTotalSessions = state.progress.total_sessions + 1
          
          return {
            progress: {
              ...state.progress,
              total_sessions: newTotalSessions,
              total_minutes: newTotalMinutes,
              average_session_duration: newTotalMinutes / newTotalSessions,
              last_session_date: new Date().toISOString()
            }
          }
        })
      },
      
      updateProgress: () => {
        // This would typically sync with backend
        console.log('MeditationStore: Updating progress')
      }
    }),
    {
      name: 'meditation-store',
      partialize: (state) => ({
        preferences: state.preferences,
        progress: state.progress,
        generatedMeditations: state.generatedMeditations
      })
    }
  )
) 