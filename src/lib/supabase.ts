import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables. Using development fallback.')
  console.log('Please create a .env file with:')
  console.log('VITE_SUPABASE_URL=your_supabase_project_url')
  console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
}

// Use fallback values for development if env vars are missing
const fallbackUrl = supabaseUrl || 'https://placeholder.supabase.co'
const fallbackKey = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient<Database>(fallbackUrl, fallbackKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export type SupabaseClient = typeof supabase 