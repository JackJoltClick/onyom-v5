import OpenAI from 'openai'
import { THERAPIST_PERSONALITIES, API_CONFIG } from '@/lib/constants'
import type { TherapistTone } from '@/types'

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