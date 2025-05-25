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
      }
    ]

    // Add more conversation history for better context (last 15 messages instead of default)
    const recentHistory = conversationHistory.slice(-15)
    messages.push(...recentHistory)

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    })

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
      "Damn, that sounds really tough. But you're here talking about it, which is huge.",
      "I feel you on that. What's been getting you through it?",
      "That takes guts to share. How are you holding up?",
      "Shit, that's a lot. You're stronger than you know though.",
    ],
    analytical: [
      "Interesting. When did this start happening?",
      "I'm curious - what do you think might be connecting all this?",
      "Help me understand what's going on in your head when this happens.",
      "What would it look like if things were different?",
    ],
    gentle: [
      "That sounds really hard. I'm here with you.",
      "Take all the time you need. What's your heart telling you?",
      "I hear you. You're not alone in this.",
      "That must feel heavy. What do you need right now?",
    ],
  }

  const responseList = responses[therapistTone]
  return responseList[Math.floor(Math.random() * responseList.length)]!
}

export function isOpenAIAvailable(): boolean {
  return openai !== null
} 