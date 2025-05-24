-- =============================================
-- ONYOM DATABASE MIGRATION SCRIPT
-- =============================================
-- Run this in your Supabase SQL Editor to fix foreign key issues
-- =============================================

-- First, let's check what tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Drop existing foreign key constraints that might be causing issues
ALTER TABLE IF EXISTS public.chats DROP CONSTRAINT IF EXISTS chats_user_id_fkey;
ALTER TABLE IF EXISTS public.messages DROP CONSTRAINT IF EXISTS messages_chat_id_fkey;

-- Recreate chats table with correct structure
DROP TABLE IF EXISTS public.chats CASCADE;
CREATE TABLE public.chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint to user_profiles instead of auth.users
ALTER TABLE public.chats 
ADD CONSTRAINT chats_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Recreate messages table if needed
DROP TABLE IF EXISTS public.messages CASCADE;
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID NOT NULL,
    content TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for messages
ALTER TABLE public.messages 
ADD CONSTRAINT messages_chat_id_fkey 
FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;

-- Enable RLS on both tables
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies for chats
DROP POLICY IF EXISTS "Users can view own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can insert own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can update own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can delete own chats" ON public.chats;

CREATE POLICY "Users can view own chats" ON public.chats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON public.chats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON public.chats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON public.chats
    FOR DELETE USING (auth.uid() = user_id);

-- Recreate RLS policies for messages
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.messages;

CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.chats WHERE id = messages.chat_id
        )
    );

CREATE POLICY "Users can insert own messages" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.chats WHERE id = messages.chat_id
        )
    );

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON public.chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Grant permissions
GRANT ALL ON public.chats TO authenticated;
GRANT ALL ON public.messages TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these to verify the setup:
-- 
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM pg_policies WHERE schemaname = 'public';
-- SELECT conname, conrelid::regclass, confrelid::regclass FROM pg_constraint WHERE contype = 'f'; 