import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Meditation, MeditationPlayerState } from '@/types'
import { PREMADE_MEDITATIONS } from '@/data/meditations'

interface MeditationStore {
  // Available meditations
  meditations: Meditation[]
  
  // Player state
  player: MeditationPlayerState
  
  // Actions
  loadMeditations: () => void
  playMeditation: (meditation: Meditation) => void
  pauseMeditation: () => void
  resumeMeditation: () => void
  stopMeditation: () => void
  seekTo: (time: number) => void
  updateCurrentTime: (time: number) => void
  updateDuration: (duration: number) => void
}

export const useMeditationStore = create<MeditationStore>()(
  persist(
    (set, get) => ({
      meditations: [],
      
      player: {
        currentMeditation: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.8
      },

      loadMeditations: () => {
        console.log('Loading premade meditations')
        set({ meditations: PREMADE_MEDITATIONS })
      },

      playMeditation: (meditation: Meditation) => {
        console.log('Playing meditation:', meditation.title)
        set(state => ({
          player: {
            ...state.player,
            currentMeditation: meditation,
            isPlaying: true,
            currentTime: 0
          }
        }))
      },

      pauseMeditation: () => {
        console.log('Pausing meditation')
        set(state => ({
          player: {
            ...state.player,
            isPlaying: false
          }
        }))
      },

      resumeMeditation: () => {
        console.log('Resuming meditation')
        set(state => ({
          player: {
            ...state.player,
            isPlaying: true
          }
        }))
      },

      stopMeditation: () => {
        console.log('Stopping meditation')
        set(state => ({
          player: {
            ...state.player,
            isPlaying: false,
            currentTime: 0,
            currentMeditation: null
          }
        }))
      },

      seekTo: (time: number) => {
        console.log('Seeking to:', time)
        set(state => ({
          player: {
            ...state.player,
            currentTime: time
          }
        }))
      },

      updateCurrentTime: (time: number) => {
        set(state => ({
          player: {
            ...state.player,
            currentTime: time
          }
        }))
      },

      updateDuration: (duration: number) => {
        set(state => ({
          player: {
            ...state.player,
            duration: duration
          }
        }))
      }
    }),
    {
      name: 'meditation-store',
      partialize: (state) => ({
        player: {
          volume: state.player.volume
        }
      })
    }
  )
) 