# Onyom - Wellness Chat Application

A modern, production-ready wellness and therapy chat application built with TypeScript, React, and CSS Modules.

## 🌟 Features

- **Personalized AI Therapy**: Three distinct therapist personalities (Supportive, Analytical, Gentle)
- **Real-time Chat**: AI-powered conversations with typewriter effects
- **Modern UI**: Mobile-first design with CSS Modules and custom properties
- **Authentication**: Secure user authentication with Supabase
- **Theme Support**: Dark/light/system theme preferences
- **Progressive Web App**: Offline-capable with service worker support
- **TypeScript**: Fully typed with strict TypeScript configuration

## 🛠 Tech Stack

- **Frontend**: React 19+ with TypeScript
- **Build Tool**: Vite 5+
- **Routing**: React Router v7
- **State Management**: TanStack Query v5
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Styling**: CSS Modules with CSS Custom Properties
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Linting**: ESLint + Prettier

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd onyom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Database Setup**
   
   Run the following SQL in your Supabase SQL editor:
   
   ```sql
   -- User profiles table
   create table user_profiles (
     id uuid references auth.users on delete cascade primary key,
     email text not null,
     name text,
     avatar_url text,
     therapist_tone text default 'supportive' check (therapist_tone in ('supportive', 'analytical', 'gentle')),
     theme_preference text default 'dark' check (theme_preference in ('dark', 'light', 'system')),
     typing_speed integer default 50 check (typing_speed between 10 and 100),
     created_at timestamptz default now(),
     updated_at timestamptz default now()
   );

   -- Chats table
   create table chats (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id) on delete cascade not null,
     title text not null,
     created_at timestamptz default now(),
     updated_at timestamptz default now()
   );

   -- Messages table
   create table messages (
     id uuid default gen_random_uuid() primary key,
     chat_id uuid references chats(id) on delete cascade not null,
     content text not null check (char_length(content) > 0),
     sender text not null check (sender in ('user', 'assistant')),
     created_at timestamptz default now()
   );

   -- Enable RLS
   alter table user_profiles enable row level security;
   alter table chats enable row level security;
   alter table messages enable row level security;

   -- RLS Policies
   create policy "Users can view own profile" on user_profiles for select using (auth.uid() = id);
   create policy "Users can update own profile" on user_profiles for update using (auth.uid() = id);
   create policy "Users can insert own profile" on user_profiles for insert with check (auth.uid() = id);

   create policy "Users can view own chats" on chats for select using (auth.uid() = user_id);
   create policy "Users can create own chats" on chats for insert with check (auth.uid() = user_id);
   create policy "Users can update own chats" on chats for update using (auth.uid() = user_id);
   create policy "Users can delete own chats" on chats for delete using (auth.uid() = user_id);

   create policy "Users can view messages in own chats" on messages for select using (
     exists (select 1 from chats where chats.id = messages.chat_id and chats.user_id = auth.uid())
   );
   create policy "Users can create messages in own chats" on messages for insert with check (
     exists (select 1 from chats where chats.id = messages.chat_id and chats.user_id = auth.uid())
   );
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Button, Input, etc.)
│   ├── chat/           # Chat-specific components
│   ├── auth/           # Authentication components
│   └── layout/         # Layout components (TopBar, TabBar)
├── pages/              # Route components
│   ├── auth/           # Authentication pages
│   └── app/            # Main app pages
├── hooks/              # Custom React hooks
│   ├── auth/           # Authentication hooks
│   ├── chat/           # Chat-related hooks
│   └── api/            # API query hooks
├── lib/                # Utilities and configurations
│   ├── supabase.ts     # Supabase client
│   ├── validations.ts  # Zod schemas
│   ├── queryKeys.ts    # React Query key factory
│   ├── constants.ts    # App constants
│   └── utils.ts        # Helper functions
├── types/              # TypeScript type definitions
├── contexts/           # React contexts (theme, settings)
├── styles/             # CSS modules and global styles
│   ├── globals.css     # Global styles and CSS custom properties
│   └── components/     # Component-specific CSS modules
└── App.tsx
```

## 🎯 Current Implementation Status

### ✅ Completed Features

#### Core Infrastructure
- [x] **Project Setup**: Vite 5, TypeScript, React 19 configuration
- [x] **Build System**: ESLint, Prettier, path mapping, CSS modules
- [x] **Theme System**: Dark/light/system themes with CSS custom properties
- [x] **Authentication Context**: Supabase integration with user management
- [x] **Type Safety**: Comprehensive TypeScript interfaces and schemas
- [x] **Validation**: Zod schemas for forms and data validation
- [x] **Routing**: React Router v7 with protected routes

#### UI Components
- [x] **Button Component**: Multiple variants (primary, secondary, ghost, danger), sizes, loading states
- [x] **ChatBubble**: Message display with typewriter effect and timestamp
- [x] **ChatInput**: Auto-expanding textarea with send functionality
- [x] **LoginForm**: React Hook Form with validation and error handling
- [x] **ProtectedRoute**: Authentication guard component

#### Pages & Features
- [x] **Landing Page**: Modern design with feature showcase and animations
- [x] **Login Page**: Functional authentication with form validation
- [x] **Chat Interface**: Real-time chat with AI personality simulation
  - Three therapist personalities with unique response patterns
  - Message history and persistence
  - Typing indicators and animations
  - Theme switching and chat clearing
- [x] **Navigation**: App routing with authentication flow

#### Styling & UX
- [x] **CSS Architecture**: CSS Modules with custom properties for theming
- [x] **Responsive Design**: Mobile-first approach with iOS safe areas
- [x] **Animations**: Framer Motion for smooth transitions
- [x] **Accessibility**: ARIA labels, focus management, keyboard navigation

### 🚧 In Progress / Next Steps

#### Authentication & Onboarding
- [ ] **Sign Up Form**: Registration with email validation
- [ ] **Onboarding Flow**: User preference setup (name, therapist tone, theme)
- [ ] **Profile Management**: Settings page with preference updates

#### Chat Enhancements
- [ ] **Real AI Integration**: OpenAI API integration for actual therapy responses
- [ ] **Chat Persistence**: Supabase database integration for message storage
- [ ] **Chat Sessions**: Multiple conversation threads
- [ ] **Message Search**: Find previous conversations

#### Additional Features
- [ ] **Meditations Page**: Guided meditation library
- [ ] **Profile Page**: User dashboard and statistics
- [ **Tab Navigation**: Bottom tab bar for mobile
- [ ] **Push Notifications**: Session reminders and check-ins
- [ ] **Progressive Web App**: Service worker and offline capabilities

#### Advanced Features
- [ ] **Voice Input**: Speech-to-text for accessibility
- [ ] **Export Conversations**: PDF/text export of chat history
- [ ] **Wellness Tracking**: Mood tracking and progress visualization
- [ ] **Appointment Scheduling**: Calendar integration for therapy sessions

## 🎨 CSS Architecture

The app uses CSS Modules with CSS Custom Properties for theming:

### Global Variables
```css
:root {
  --background-color: #1c1c1c;
  --surface-color: #2a2a2a;
  --text-color: #ffffff;
  --accent-color: #4f46e5;
  --border-radius: 8px;
  /* ... */
}

[data-theme="light"] {
  --background-color: #ffffff;
  --surface-color: #f8f9fa;
  --text-color: #1a1a1a;
  /* ... */
}
```

### Component Modules
```css
/* styles/components/ChatBubble.module.css */
.chatBubble {
  padding: 12px 16px;
  border-radius: var(--border-radius);
  background-color: var(--surface-color);
  color: var(--text-color);
}
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

## 🏗 Core Features Implementation

### Therapist Personalities

Three distinct AI personalities with different approaches:

1. **Supportive**: Encouraging, warm, partnership-focused
2. **Analytical**: Thoughtful, pattern-exploring, insight-oriented  
3. **Gentle**: Soft, nurturing, deeply empathetic

### Real-time Chat

- TypeScript-powered message handling
- Typewriter effect for AI responses
- Optimistic updates for instant feedback
- Theme-aware styling

### Authentication Flow

1. Landing page with feature overview
2. Sign up/Sign in with email/password
3. Onboarding flow for personalization (planned)
4. Protected app routes

### Mobile-First Design

- iOS safe area support
- Touch-friendly 44px minimum tap targets
- Responsive breakpoints
- Progressive Web App capabilities (planned)

## 🔒 Security

- Row Level Security (RLS) policies
- Input validation with Zod schemas
- XSS protection with input sanitization
- Secure authentication with Supabase

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Environment Variables

Make sure to set these in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and type checking
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using modern web technologies for a better wellness experience. 