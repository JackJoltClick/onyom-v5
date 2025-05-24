import OpenAI from 'openai'
import { THERAPIST_PERSONALITIES, API_CONFIG } from '@/lib/constants'
import type { TherapistTone, GeneratedMeditation, MeditationCategory } from '@/types'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!apiKey) {
  console.warn('OpenAI API key not found. Using mock responses.')
}

const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
}) : null

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function generateTherapyResponse(
  userMessage: string,
  therapistTone: TherapistTone,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  // If no OpenAI client, return mock response
  if (!openai) {
    return getMockResponse(userMessage, therapistTone)
  }

  try {
    const personality = THERAPIST_PERSONALITIES[therapistTone]
    
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: personality.systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ]

    const completion = await openai.chat.completions.create({
      model: API_CONFIG.openai.model,
      messages: messages,
      max_tokens: API_CONFIG.openai.maxTokens,
      temperature: API_CONFIG.openai.temperature,
      top_p: API_CONFIG.openai.topP,
      frequency_penalty: API_CONFIG.openai.frequencyPenalty,
      presence_penalty: API_CONFIG.openai.presencePenalty,
    })

    return completion.choices[0]?.message?.content || 'I apologize, but I\'m having trouble responding right now. Could you please try again?'
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Fallback to mock response on API error
    return getMockResponse(userMessage, therapistTone)
  }
}

function getMockResponse(_userMessage: string, therapistTone: TherapistTone): string {
  const responses = {
    supportive: [
      "I hear you, and what you're feeling is completely valid. You're taking a brave step by sharing this with me.",
      "That sounds challenging, but I want you to know that you have the strength to work through this. What feels like the most important thing to focus on right now?",
      "Thank you for trusting me with this. Your feelings matter, and we're going to work through this together.",
      "I can sense this is weighing on you. Remember, every step forward, no matter how small, is progress worth celebrating.",
    ],
    analytical: [
      "That's an interesting perspective. Can you help me understand what patterns you've noticed in similar situations?",
      "I'm curious about the connection between this experience and how you typically respond to stress. What do you think?",
      "Let's explore this further. What thoughts were going through your mind when this happened?",
      "I notice you mentioned several key points. Which of these feels most significant to you right now?",
    ],
    gentle: [
      "I can feel the emotion in your words, and I want you to know it's safe to feel everything you're experiencing.",
      "Your heart is telling you something important. Take a moment to breathe and be gentle with yourself.",
      "This sounds so difficult, dear. Please know that you're not alone in this, and your feelings are completely understandable.",
      "What a tender place you're in right now. Let's hold space for all of these feelings together.",
    ],
  }

  const responseList = responses[therapistTone]
  return responseList[Math.floor(Math.random() * responseList.length)]!
}

export function isOpenAIAvailable(): boolean {
  return openai !== null
}

export interface MeditationGenerationContext {
  recentChatMessages: string[]
  userMood?: string
  preferredDuration?: number
  therapistTone: TherapistTone
  currentChallenges?: string[]
}

export async function generatePersonalizedMeditation(
  context: MeditationGenerationContext
): Promise<GeneratedMeditation> {
  if (!openai) {
    throw new Error('OpenAI not available')
  }

  const { recentChatMessages, userMood, preferredDuration = 10, therapistTone, currentChallenges } = context

  // Create a summary of recent therapy conversation
  const conversationSummary = recentChatMessages.slice(-10).join('\n')
  
  const prompt = `Based on this recent therapy conversation, create a personalized meditation script:

CONVERSATION CONTEXT:
${conversationSummary}

USER DETAILS:
- Preferred therapist tone: ${therapistTone}
- Current mood: ${userMood || 'not specified'}
- Duration: ${preferredDuration} minutes
- Current challenges: ${currentChallenges?.join(', ') || 'general wellness'}

Create a meditation that:
1. Addresses themes from the therapy conversation
2. Matches the ${therapistTone} therapeutic style
3. Is approximately ${preferredDuration} minutes when spoken
4. Provides comfort and insight related to their discussed concerns

Please respond with a JSON object in this exact format:
{
  "title": "Meditation title that reflects the session theme",
  "description": "1-2 sentence description of what this meditation addresses",
  "category": "mindfulness|anxiety-relief|sleep|focus|self-compassion|body-scan|breathing|stress-relief|loving-kindness",
  "difficulty_level": "beginner|intermediate|advanced",
  "script_text": "Full meditation script with natural pauses indicated by ... (aim for ~${Math.round(preferredDuration * 150)} words)",
  "tags": ["tag1", "tag2", "tag3"],
  "instructor": "AI Therapist",
  "background_sound": "rain|ocean|forest|birds|silence"
}

Make the script warm, therapeutic, and specifically tailored to their conversation themes.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a compassionate AI therapist creating personalized meditations. Respond only with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    const meditationData = JSON.parse(response)
    
    // Create the generated meditation object
    const generatedMeditation: GeneratedMeditation = {
      title: meditationData.title,
      description: meditationData.description,
      duration_minutes: preferredDuration,
      category: meditationData.category as MeditationCategory,
      difficulty_level: meditationData.difficulty_level,
      script_text: meditationData.script_text,
      instructor: meditationData.instructor,
      tags: meditationData.tags,
      background_sound: meditationData.background_sound,
      therapist_tone: therapistTone,
      is_personalized: true,
      user_context: conversationSummary.slice(0, 200) + '...',
      generated_from_chat: new Date().toISOString()
    }

    return generatedMeditation

  } catch (error) {
    console.error('Error generating meditation:', error)
    throw new Error('Failed to generate personalized meditation')
  }
}

export async function generateMeditationAudio(
  scriptText: string,
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'nova'
): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI not available')
  }

  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: scriptText,
      speed: 0.9 // Slightly slower for meditation
    })

    // Convert the response to a blob URL
    const buffer = Buffer.from(await mp3.arrayBuffer())
    const blob = new Blob([buffer], { type: 'audio/mpeg' })
    const audioUrl = URL.createObjectURL(blob)
    
    return audioUrl

  } catch (error) {
    console.error('Error generating audio:', error)
    throw new Error('Failed to generate meditation audio')
  }
}

export function getVoiceForTherapistTone(tone: TherapistTone): 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' {
  switch (tone) {
    case 'gentle':
      return 'nova' // Warm, female voice
    case 'supportive':
      return 'alloy' // Balanced, encouraging
    case 'analytical':
      return 'echo' // Clear, thoughtful
    default:
      return 'nova'
  }
} 