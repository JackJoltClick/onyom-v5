import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { chatApi, messageApi } from '@/lib/api/chats'
import { generateTherapyResponse, type ChatMessage } from '@/lib/openai'
import { generateChatTitle } from '@/lib/utils'
import { queryKeys } from '@/lib/queryKeys'
import { STORAGE_KEYS } from '@/lib/constants'
import type { Chat, Message, TherapistTone } from '@/types'

/**
 * Hook to get all chats for the current user
 */
export function useChats() {
  return useQuery({
    queryKey: queryKeys.chats.all,
    queryFn: chatApi.getChats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get a specific chat
 */
export function useChat(chatId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.chats.detail(chatId || ''),
    queryFn: () => chatId ? chatApi.getChat(chatId) : null,
    enabled: !!chatId,
  })
}

/**
 * Hook to get messages for a specific chat
 */
export function useMessages(chatId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.messages.list(chatId || ''),
    queryFn: () => chatId ? messageApi.getMessages(chatId) : [],
    enabled: !!chatId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to create a new chat
 */
export function useCreateChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: chatApi.createChat,
    onSuccess: (newChat) => {
      // Update the chats list cache
      queryClient.setQueryData<Chat[]>(queryKeys.chats.all, (oldChats) => {
        return oldChats ? [newChat, ...oldChats] : [newChat]
      })

      // Store the last chat ID
      localStorage.setItem(STORAGE_KEYS.lastChatId, newChat.id)
    },
    onError: (error) => {
      console.error('Failed to create chat:', error)
    },
  })
}

/**
 * Hook to send a message and get AI response
 */
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      chatId,
      content,
      therapistTone,
      conversationHistory = [],
    }: {
      chatId: string
      content: string
      therapistTone: TherapistTone
      conversationHistory?: ChatMessage[]
    }) => {
      // Save user message first
      const userMessage = await messageApi.sendMessage(chatId, content, 'user')

      // Get AI response
      const aiResponse = await generateTherapyResponse(
        content,
        therapistTone,
        conversationHistory
      )

      // Save AI response
      const assistantMessage = await messageApi.sendMessage(chatId, aiResponse, 'assistant')

      return {
        userMessage,
        assistantMessage,
        aiResponse,
      }
    },
    onMutate: async ({ chatId, content }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.messages.list(chatId) })

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<Message[]>(queryKeys.messages.list(chatId))

      // Optimistically update to the new value
      const tempUserMessage: Message = {
        id: `temp-user-${Date.now()}`,
        chat_id: chatId,
        content,
        sender: 'user',
        created_at: new Date().toISOString(),
      }

      queryClient.setQueryData<Message[]>(queryKeys.messages.list(chatId), (old) => {
        return old ? [...old, tempUserMessage] : [tempUserMessage]
      })

      return { previousMessages, tempUserMessage }
    },
    onSuccess: ({ userMessage, assistantMessage }, { chatId }) => {
      // Update messages with real data from server
      queryClient.setQueryData<Message[]>(queryKeys.messages.list(chatId), (old) => {
        if (!old) return [userMessage, assistantMessage]

        // Remove temp message and add real messages
        const withoutTemp = old.filter(msg => !msg.id.startsWith('temp-'))
        return [...withoutTemp, userMessage, assistantMessage]
      })

      // Invalidate chats list to update "updated_at" timestamp
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.all })
    },
    onError: (_, { chatId }, context) => {
      // Rollback optimistic update
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKeys.messages.list(chatId), context.previousMessages)
      }
    },
  })
}

/**
 * Hook to delete a chat
 */
export function useDeleteChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: chatApi.deleteChat,
    onSuccess: (_, chatId) => {
      // Remove from chats list
      queryClient.setQueryData<Chat[]>(queryKeys.chats.all, (oldChats) => {
        return oldChats ? oldChats.filter(chat => chat.id !== chatId) : []
      })

      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.chats.detail(chatId) })
      queryClient.removeQueries({ queryKey: queryKeys.messages.list(chatId) })

      // Clear last chat ID if it was this chat
      const lastChatId = localStorage.getItem(STORAGE_KEYS.lastChatId)
      if (lastChatId === chatId) {
        localStorage.removeItem(STORAGE_KEYS.lastChatId)
      }
    },
  })
}

/**
 * Hook to update chat title
 */
export function useUpdateChatTitle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ chatId, title }: { chatId: string; title: string }) =>
      chatApi.updateChatTitle(chatId, title),
    onSuccess: (updatedChat) => {
      // Update the specific chat in cache
      queryClient.setQueryData(queryKeys.chats.detail(updatedChat.id), updatedChat)

      // Update the chat in the chats list
      queryClient.setQueryData<Chat[]>(queryKeys.chats.all, (oldChats) => {
        return oldChats?.map(chat =>
          chat.id === updatedChat.id ? updatedChat : chat
        ) || []
      })
    },
  })
}

/**
 * Composite hook that manages a complete chat session
 */
export function useChatSession(chatId?: string) {
  const { data: chat, isLoading: chatLoading } = useChat(chatId)
  const { data: messages = [], isLoading: messagesLoading } = useMessages(chatId)
  const sendMessage = useSendMessage()
  const deleteChat = useDeleteChat()
  const updateTitle = useUpdateChatTitle()

  // Convert messages to conversation history format for OpenAI
  const conversationHistory: ChatMessage[] = messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }))

  return {
    chat,
    messages,
    conversationHistory,
    isLoading: chatLoading || messagesLoading,
    sendMessage: sendMessage.mutate,
    isSending: sendMessage.isPending,
    deleteChat: () => chatId && deleteChat.mutate(chatId),
    updateTitle: (title: string) => chatId && updateTitle.mutate({ chatId, title }),
    error: sendMessage.error || deleteChat.error || updateTitle.error,
  }
}

/**
 * Hook to create a new chat session with first message
 */
export function useCreateChatSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      firstMessage, 
      therapistTone 
    }: { 
      firstMessage: string
      therapistTone: TherapistTone 
    }) => {
      // Generate title from first message
      const title = generateChatTitle(firstMessage)
      
      // Create chat
      const chat = await chatApi.createChat(title)
      
      // Send first message and get response
      const userMessage = await messageApi.sendMessage(chat.id, firstMessage, 'user')
      
      // Get AI response
      const aiResponse = await generateTherapyResponse(firstMessage, therapistTone, [])
      const assistantMessage = await messageApi.sendMessage(chat.id, aiResponse, 'assistant')

      return {
        chat,
        messages: [userMessage, assistantMessage],
      }
    },
    onSuccess: ({ chat, messages }) => {
      // Update chats list
      queryClient.setQueryData<Chat[]>(queryKeys.chats.all, (oldChats) => {
        return oldChats ? [chat, ...oldChats] : [chat]
      })

      // Set messages for this chat
      queryClient.setQueryData(queryKeys.messages.list(chat.id), messages)

      // Store as last chat
      localStorage.setItem(STORAGE_KEYS.lastChatId, chat.id)
    },
  })
} 