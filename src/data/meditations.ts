import type { Meditation } from '@/types'

export const PREMADE_MEDITATIONS: Meditation[] = [
  {
    id: '1',
    title: 'Mindful Breathing',
    description: 'A simple breathing meditation to center yourself and find calm.',
    duration_minutes: 5,
    category: 'breathing',
    difficulty_level: 'beginner',
    instructor: 'Sarah Chen',
    tags: ['breathing', 'calm', 'stress-relief'],
    background_sound: 'silence',
    audio_url: '/audio/mindful-breathing.mp3',
    script_text: 'Begin by finding a comfortable position, either sitting or lying down. Close your eyes gently and take a deep breath in through your nose... Hold for a moment... And exhale slowly through your mouth. Let your breathing return to its natural rhythm now, simply observing each inhale and exhale without trying to change anything...',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Body Scan Relaxation',
    description: 'Progressive relaxation technique to release tension throughout your body.',
    duration_minutes: 10,
    category: 'body-scan',
    difficulty_level: 'beginner',
    instructor: 'Michael Rodriguez',
    tags: ['relaxation', 'body-scan', 'tension-relief'],
    background_sound: 'rain',
    audio_url: '/audio/body-scan.mp3',
    script_text: 'Let yourself settle into a comfortable position. We\'ll begin by bringing awareness to your feet. Notice any sensations there... warmth, coolness, tingling, or perhaps no sensation at all. This is all perfectly normal. Now slowly move your attention up to your ankles...',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Loving Kindness',
    description: 'Cultivate compassion for yourself and others with this heart-opening practice.',
    duration_minutes: 8,
    category: 'loving-kindness',
    difficulty_level: 'intermediate',
    instructor: 'Emily Watson',
    tags: ['compassion', 'self-love', 'kindness'],
    background_sound: 'forest',
    audio_url: '/audio/loving-kindness.mp3',
    script_text: 'Begin by placing your hand on your heart and taking a few deep breaths. Think of yourself sitting here right now. Silently repeat these phrases: May I be happy. May I be healthy. May I be at peace. May I live with ease...',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Sleep Preparation',
    description: 'A gentle meditation to prepare your mind and body for restful sleep.',
    duration_minutes: 15,
    category: 'sleep',
    difficulty_level: 'beginner',
    instructor: 'David Kim',
    tags: ['sleep', 'rest', 'bedtime'],
    background_sound: 'ocean',
    audio_url: '/audio/sleep-prep.mp3',
    script_text: 'As you lie comfortably in bed, allow your eyes to close softly. Take a slow, deep breath in... and let it go with a long, gentle exhale. Feel your body beginning to sink into the mattress, heavy and relaxed...',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Anxiety Relief',
    description: 'Techniques to calm racing thoughts and reduce anxiety symptoms.',
    duration_minutes: 7,
    category: 'anxiety-relief',
    difficulty_level: 'beginner',
    instructor: 'Lisa Thompson',
    tags: ['anxiety', 'calm', 'grounding'],
    background_sound: 'birds',
    audio_url: '/audio/anxiety-relief.mp3',
    script_text: 'When anxiety arises, remember that this feeling will pass. Right now, let\'s focus on grounding yourself in this moment. Feel your feet on the floor, your body in the chair. Take a deep breath and count: one... breathe out... two...',
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Focus Enhancement',
    description: 'Sharpen your concentration and mental clarity with mindful attention.',
    duration_minutes: 12,
    category: 'focus',
    difficulty_level: 'intermediate',
    instructor: 'James Park',
    tags: ['focus', 'concentration', 'clarity'],
    background_sound: 'silence',
    audio_url: '/audio/focus-enhancement.mp3',
    script_text: 'Sit with your spine straight but not rigid. Choose a single point of focus - perhaps your breath, or a word like "peace" or "calm". When your mind wanders, gently guide it back to your chosen focus point...',
    created_at: new Date().toISOString()
  }
] 