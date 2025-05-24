import { supabase } from '@/lib/supabase'
import type { Chat, Message } from '@/types'
import type { Database } from '@/types/database'

// Type aliases for database operations
type ChatInsert = Database['public']['Tables']['chats']['Insert']
type MessageInsert = Database['public']['Tables']['messages']['Insert']

/**
 * Chat API functions
 */
export const chatApi = {
  /**
   * Get all chats for the current user
   */
  async getChats(): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching chats:', error)
      throw new Error('Failed to load chats')
    }

    return data || []
  },

  /**
   * Get a specific chat by ID
   */
  async getChat(chatId: string): Promise<Chat | null> {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Chat not found
      }
      console.error('Error fetching chat:', error)
      throw new Error('Failed to load chat')
    }

    return data
  },

  /**
   * Create a new chat session
   */
  async createChat(title: string): Promise<Chat> {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('=== Creating Chat Debug ===')
    console.log('Auth user:', user)
    console.log('Auth user error:', userError)
    console.log('User ID to insert:', user?.id)
    console.log('========================')
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Verify user exists in user_profiles (workaround for foreign key issue)
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    console.log('User profile check:', { profileData, profileError })

    if (profileError && profileError.code === 'PGRST116') {
      throw new Error('User profile not found. Please complete onboarding first.')
    } else if (profileError) {
      throw new Error('Error verifying user profile')
    }

    const chatData: ChatInsert = {
      user_id: user.id,
      title: title.substring(0, 100), // Ensure title doesn't exceed limit
    }

    console.log('Chat data to insert:', chatData)

    const { data, error } = await supabase
      .from('chats')
      .insert(chatData)
      .select()
      .single()

    if (error) {
      console.error('Error creating chat:', error)
      console.error('Detailed error info:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      
      // Specific handling for foreign key constraint errors
      if (error.code === '23503') {
        throw new Error('Database setup incomplete. Please run the database migration script.')
      }
      
      throw new Error('Failed to create chat')
    }

    return data
  },

  /**
   * Update chat title
   */
  async updateChatTitle(chatId: string, title: string): Promise<Chat> {
    const { data, error } = await supabase
      .from('chats')
      .update({ title: title.substring(0, 100) })
      .eq('id', chatId)
      .select()
      .single()

    if (error) {
      console.error('Error updating chat:', error)
      throw new Error('Failed to update chat')
    }

    return data
  },

  /**
   * Delete a chat and all its messages
   */
  async deleteChat(chatId: string): Promise<void> {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId)

    if (error) {
      console.error('Error deleting chat:', error)
      throw new Error('Failed to delete chat')
    }
  },
}

/**
 * Message API functions
 */
export const messageApi = {
  /**
   * Get all messages for a specific chat
   */
  async getMessages(chatId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      throw new Error('Failed to load messages')
    }

    return data || []
  },

  /**
   * Send a new message
   */
  async sendMessage(chatId: string, content: string, sender: 'user' | 'assistant'): Promise<Message> {
    const messageData: MessageInsert = {
      chat_id: chatId,
      content: content,
      sender: sender,
    }

    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      throw new Error('Failed to send message')
    }

    // Update chat's updated_at timestamp
    // TODO: Uncomment when updated_at column exists in database
    // await supabase
    //   .from('chats')
    //   .update({ updated_at: new Date().toISOString() })
    //   .eq('id', chatId)

    return data
  },

  /**
   * Get messages with pagination (for large conversations)
   */
  async getMessagesPaginated(
    chatId: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<{ messages: Message[]; hasMore: boolean }> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit)

    if (error) {
      console.error('Error fetching messages:', error)
      throw new Error('Failed to load messages')
    }

    return {
      messages: (data || []).reverse(), // Reverse to get chronological order
      hasMore: data?.length === limit + 1
    }
  },

  /**
   * Delete a specific message
   */
  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (error) {
      console.error('Error deleting message:', error)
      throw new Error('Failed to delete message')
    }
  },
}

/**
 * Combined operations that work with both chats and messages
 */
export const chatOperations = {
  /**
   * Create a new chat with an initial message
   */
  async createChatWithMessage(title: string, initialMessage: string): Promise<{ chat: Chat; message: Message }> {
    const chat = await chatApi.createChat(title)
    const message = await messageApi.sendMessage(chat.id, initialMessage, 'user')
    
    return { chat, message }
  },

  /**
   * Get chat with its message count
   */
  async getChatWithStats(chatId: string): Promise<Chat & { messageCount: number; lastMessage: Message | null }> {
    const [chat, messages] = await Promise.all([
      chatApi.getChat(chatId),
      messageApi.getMessages(chatId)
    ])

    if (!chat) {
      throw new Error('Chat not found')
    }

    return {
      ...chat,
      messageCount: messages.length,
      lastMessage: messages.length > 0 ? messages[messages.length - 1]! : null
    }
  },
} 