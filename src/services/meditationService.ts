import { 
  generatePersonalizedMeditation, 
  generateMeditationAudio, 
  getVoiceForTherapistTone,
  type MeditationGenerationContext 
} from '@/lib/openai'
import { useMeditationStore } from '@/stores/meditationStore'
import { useAuthStore } from '@/stores/authStore'
import type { GeneratedMeditation, Message, TherapistTone } from '@/types'

export class MeditationService {
  static async generateFromMessages(
    messages: Message[], 
    therapistTone: TherapistTone,
    preferredDuration: number = 10
  ): Promise<GeneratedMeditation> {
    if (messages.length === 0) {
      throw new Error('No conversation found. Please chat with your therapist first.')
    }

    // Get recent messages
    const recentMessages = messages
      .slice(-10) // Last 10 messages
      .filter(msg => msg.sender === 'user' || msg.sender === 'assistant')
      .map(msg => `${msg.sender}: ${msg.content}`)

    const context: MeditationGenerationContext = {
      recentChatMessages: recentMessages,
      therapistTone: therapistTone,
      preferredDuration: preferredDuration
    }

    // Generate the meditation
    const meditation = await generatePersonalizedMeditation(context)
    
    // Ensure script_text exists
    if (!meditation.script_text) {
      throw new Error('Generated meditation is missing script text')
    }
    
    // Generate audio for the meditation
    const voice = getVoiceForTherapistTone(meditation.therapist_tone)
    const audioUrl = await generateMeditationAudio(meditation.script_text, voice)
    
    // Add audio URL to meditation
    const meditationWithAudio: GeneratedMeditation = {
      ...meditation,
      audio_url: audioUrl
    }

    return meditationWithAudio
  }

  static async generateAndStore(
    messages: Message[], 
    therapistTone: TherapistTone,
    preferredDuration?: number
  ): Promise<GeneratedMeditation> {
    const meditationStore = useMeditationStore.getState()
    const duration = preferredDuration || meditationStore.preferences.preferredDuration

    const meditation = await this.generateFromMessages(messages, therapistTone, duration)
    
    // Add to store
    meditationStore.addGeneratedMeditation(meditation)

    return meditation
  }

  static async generatePostChatMeditation(
    messages: Message[], 
    therapistTone: TherapistTone
  ): Promise<GeneratedMeditation | null> {
    // Check if this chat has enough content and emotional depth for a meditation
    if (messages.length < 6) { // Need at least 3 exchanges
      return null
    }

    // Look for emotional keywords that suggest meditation would be helpful
    const emotionalKeywords = [
      'anxious', 'anxiety', 'stressed', 'overwhelmed', 'sad', 'worried', 
      'difficult', 'challenging', 'frustrated', 'angry', 'tired', 'exhausted',
      'upset', 'emotional', 'feeling', 'struggle', 'hard', 'tough'
    ]

    const hasEmotionalContent = messages.some(msg => 
      emotionalKeywords.some(keyword => 
        msg.content.toLowerCase().includes(keyword)
      )
    )

    if (!hasEmotionalContent) {
      return null
    }

    try {
      return await this.generateAndStore(messages, therapistTone)
    } catch (error) {
      console.error('Failed to generate post-chat meditation:', error)
      return null
    }
  }

  static shouldSuggestMeditation(messages: Message[]): boolean {
    // Suggest meditation if:
    // 1. Chat session is ending (>6 messages)
    // 2. User expressed stress/anxiety
    // 3. Assistant provided coping strategies

    if (messages.length < 6) return false

    const recentMessages = messages.slice(-6)
    const userMessages = recentMessages.filter(m => m.sender === 'user')
    const assistantMessages = recentMessages.filter(m => m.sender === 'assistant')

    // Check for stress indicators in user messages
    const stressIndicators = [
      'stressed', 'anxious', 'overwhelmed', 'worried', 'difficult', 
      'struggling', 'hard time', 'can\'t handle', 'too much'
    ]

    const hasStressIndicators = userMessages.some(msg =>
      stressIndicators.some(indicator => 
        msg.content.toLowerCase().includes(indicator)
      )
    )

    // Check if assistant suggested coping strategies
    const copingKeywords = [
      'breathe', 'breathing', 'relax', 'calm', 'mindful', 'meditation',
      'take a moment', 'slow down', 'pause', 'center yourself'
    ]

    const suggestedCoping = assistantMessages.some(msg =>
      copingKeywords.some(keyword =>
        msg.content.toLowerCase().includes(keyword)
      )
    )

    return hasStressIndicators || suggestedCoping
  }

  static getMeditationSuggestionMessage(): string {
    const suggestions = [
      "Based on our conversation, would you like me to create a personalized meditation for you?",
      "I think a custom meditation might help process what we've discussed. Would you like me to generate one?",
      "Our conversation touched on some important themes. A personalized meditation could help you reflect further. Interested?",
      "I can create a guided meditation based on our session to help you continue this work. Would that be helpful?",
      "A personalized meditation might be a good way to integrate what we've explored. Shall I create one for you?"
    ]
    
    return suggestions[Math.floor(Math.random() * suggestions.length)]
  }

  static getAudioDuration(audioUrl: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl)
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration)
      })
      audio.addEventListener('error', reject)
    })
  }

  static cleanupAudioUrl(audioUrl: string) {
    if (audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl)
    }
  }
} 