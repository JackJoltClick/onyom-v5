-- =============================================
-- ONYOM SUPABASE DATABASE SCHEMA - FIXED VERSION
-- =============================================
-- Run this in your Supabase SQL Editor to fix chat issues
-- =============================================

-- First, let's check if tables exist and drop/recreate if needed
-- This ensures clean setup

-- =============================================
-- CLEAN UP EXISTING TABLES (if needed)
-- =============================================
-- Uncomment these lines if you want to start fresh:
-- DROP TABLE IF EXISTS public.messages CASCADE;
-- DROP TABLE IF EXISTS public.chats CASCADE;
-- DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- =============================================
-- USER PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    therapist_tone TEXT DEFAULT 'supportive' CHECK (therapist_tone IN ('supportive', 'analytical', 'gentle')),
    theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('dark', 'light', 'system')),
    typing_speed INTEGER DEFAULT 50 CHECK (typing_speed >= 10 AND typing_speed <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- CHATS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on chats
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can insert own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can update own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can delete own chats" ON public.chats;

-- RLS Policies for chats - More permissive for debugging
CREATE POLICY "Users can view own chats" ON public.chats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON public.chats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON public.chats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON public.chats
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.messages;

-- RLS Policies for messages - More permissive for debugging
CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own messages" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = auth.uid()
        )
    );

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        -- Log error but don't fail the user creation
        RAISE WARNING 'Failed to create user profile: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_chats_updated_at ON public.chats;
CREATE TRIGGER update_chats_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON public.chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- =============================================
-- GRANT PERMISSIONS - More explicit
-- =============================================
-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chats TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;

-- Grant permissions on sequences (for auto-generated IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================
-- ADDITIONAL DEBUG FUNCTIONS
-- =============================================

-- Function to check user permissions (for debugging)
CREATE OR REPLACE FUNCTION public.debug_user_permissions()
RETURNS TABLE (
    user_id UUID,
    can_read_profiles BOOLEAN,
    can_read_chats BOOLEAN,
    can_read_messages BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        auth.uid() as user_id,
        EXISTS(SELECT 1 FROM public.user_profiles WHERE id = auth.uid()) as can_read_profiles,
        EXISTS(SELECT 1 FROM public.chats WHERE user_id = auth.uid()) as can_read_chats,
        EXISTS(SELECT 1 FROM public.messages m JOIN public.chats c ON m.chat_id = c.id WHERE c.user_id = auth.uid()) as can_read_messages;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these to verify the setup:

-- Check tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'chats', 'messages');

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'chats', 'messages');

-- Check policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- =============================================
-- DONE!
-- =============================================
-- Your Onyom database should now be properly configured!
-- If you're still having issues, run the debug function:
-- SELECT * FROM public.debug_user_permissions(); 