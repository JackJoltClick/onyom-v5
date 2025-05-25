# Onyom V5 Setup Guide

## 🚨 Quick Fix for Chat Issues

The chat functionality is failing because the database isn't properly configured. Here's how to fix it:

### 1. Set Up Supabase Database

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for it to initialize (this can take a few minutes)

2. **Get Your Credentials**:
   - Go to Settings → API
   - Copy your Project URL and anon/public key

3. **Create Environment File**:
   Create a `.env` file in your project root:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_OPENAI_API_KEY=your_openai_key_here
   ```

### 2. Set Up Database Schema

1. **Go to Supabase SQL Editor**
2. **Run the Fixed Database Schema**:
   - Copy the contents of `supabase-schema-fix.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

### 3. Test the Setup

1. **Access the Debug Page**:
   - Start your development server: `npm run dev`
   - Navigate to `http://localhost:5173/debug`
   - Click "Run Database Tests"
   - Check if all tests pass

2. **If Tests Fail**:
   - Check your environment variables are correct
   - Verify your Supabase project is active
   - Try running the schema again

### 4. Common Issues & Solutions

#### Issue: 406 "Not Acceptable" Error
**Solution**: This usually means RLS policies aren't working. Run the fixed schema:
```sql
-- Copy and run supabase-schema-fix.sql in your Supabase SQL Editor
```

#### Issue: "Profile query timeout"
**Solution**: Your user profile wasn't created. Run this in SQL Editor:
```sql
INSERT INTO public.user_profiles (id, email, name)
VALUES (auth.uid(), auth.email(), auth.email())
ON CONFLICT (id) DO NOTHING;
```

#### Issue: "Chat not found"
**Solution**: The chat you're trying to access doesn't exist or doesn't belong to you. Create a new chat first.

#### Issue: Environment variables not loading
**Solution**: 
1. Make sure `.env` is in the project root (same level as `package.json`)
2. Restart your development server after creating/editing `.env`
3. Check the debug page shows "Set" for both variables

### 5. Verification Steps

After setup, verify everything works:

1. **Sign up/Login**: Should work without errors
2. **Profile Loading**: Should see your profile in the app
3. **Chat Creation**: Should be able to create new chats
4. **Message Sending**: Should be able to send messages

### 6. Development Notes

- **Mock Mode**: If you don't set up Supabase, the app runs in mock mode (limited functionality)
- **OpenAI**: Optional - without it, you'll get mock AI responses
- **Debug Page**: Always available at `/debug` for troubleshooting

### 7. Database Schema Overview

The app uses these main tables:
- `user_profiles`: User settings and preferences
- `chats`: Chat sessions
- `messages`: Individual messages in chats

All tables use Row Level Security (RLS) to ensure users can only access their own data.

### 8. Need Help?

If you're still having issues:
1. Check the browser console for detailed error messages
2. Use the debug page to test database connectivity
3. Verify your Supabase project is in the correct region
4. Make sure you're using the correct API keys

---

## Full Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)
- OpenAI API key (optional)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd onyom-v5

# Install dependencies
npm install

# Set up environment variables (see above)
# Set up database (see above)

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── stores/        # Zustand state stores
├── lib/           # Utilities and configurations
├── styles/        # CSS modules and global styles
└── types/         # TypeScript type definitions
```

---

## Production Deployment

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Build and Deploy
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

### Recommended Hosting
- **Vercel**: Automatic deployments from Git
- **Netlify**: Easy static site hosting
- **Supabase**: Can host the frontend too

---

## Troubleshooting

### Common Development Issues

1. **Hot reload not working**: Restart the dev server
2. **TypeScript errors**: Run `npm run type-check`
3. **Styling issues**: Check CSS module imports
4. **State not persisting**: Check Zustand store configuration

### Performance Tips

1. **Large bundle size**: Check for unnecessary imports
2. **Slow queries**: Add database indexes
3. **Memory leaks**: Check for unsubscribed listeners
4. **Slow rendering**: Use React.memo for expensive components

---

*Last updated: $(date)* 