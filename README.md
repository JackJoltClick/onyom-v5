# Onyom V5 - AI Wellness Platform

## Recent Updates

### Simplified Meditation System ✨
We've completely simplified the meditation system to use premade audio files instead of complex AI generation:

**How it works:**
1. **Premade Meditations**: 6 carefully crafted meditation sessions
2. **Static Audio Files**: Simple MP3 files stored in `/public/audio/`
3. **Clean Player**: Simple audio player with play/pause/seek controls
4. **Reliable**: No blob URLs, no AI generation, no complex state management

**Benefits:**
- ✅ **Rock Solid**: No more audio loading issues or blob URL errors
- ✅ **Fast Loading**: Instant meditation access with static files
- ✅ **Predictable**: Always works the same way, every time
- ✅ **Simple**: Clean codebase that's easy to maintain
- ✅ **Offline Ready**: Works without API calls once loaded

**Available Meditations:**
- 🌬️ **Mindful Breathing** (5 min) - Basic breathing meditation
- 🧘 **Body Scan** (10 min) - Progressive relaxation technique  
- ❤️ **Loving Kindness** (8 min) - Compassion cultivation
- 😴 **Sleep Preparation** (15 min) - Bedtime relaxation
- 🌊 **Anxiety Relief** (7 min) - Calming techniques
- 🎯 **Focus Enhancement** (12 min) - Concentration practice

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: CSS Modules + Framer Motion
- **State**: Zustand + localStorage persistence
- **AI**: OpenAI GPT (chat only)
- **Auth**: Supabase
- **Audio**: Native HTML5 audio with MP3 files

## Development
```bash
npm install
npm run dev
```

## Adding Audio Files

Place MP3 files in `public/audio/` directory:
- `mindful-breathing.mp3`
- `body-scan.mp3` 
- `loving-kindness.mp3`
- `sleep-prep.mp3`
- `anxiety-relief.mp3`
- `focus-enhancement.mp3`

See `public/audio/README.md` for details.

## Features

- **AI Therapy Chat** - Chat with SAM, your AI therapist with Rock-inspired personality
- **Premade Meditations** - Curated meditation library with audio playback
- **Multiple Therapist Tones** - Supportive, Analytical, and Gentle approaches
- **Modern UI** - Clean, responsive design with smooth animations
- **Secure Auth** - User authentication with Supabase
- **Theme Support** - Dark/light mode preferences

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at http://localhost:5173

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── meditation/     # Meditation player & cards
│   ├── chat/           # Chat components
│   └── ui/             # Base components
├── pages/              # Route components
├── stores/             # Zustand state management
├── data/               # Static data (meditations)
├── lib/                # Utilities and API clients
├── types/              # TypeScript definitions
└── styles/             # CSS modules
```

## Simplified Architecture

```
┌─────────────────┐    ┌────────────────────┐    ┌─────────────────┐
│   React App     │───▶│  Static MP3 Files  │───▶│   HTML5 Audio   │
│                 │    │  (/public/audio/)  │    │   Element       │
└─────────────────┘    └────────────────────┘    └─────────────────┘
         │                        │                         │
         │                        ▼                         │
         │              ┌────────────────────┐              │
         │              │ Meditation Store   │◀─────────────┘
         │              │ (Zustand + Local)  │
         │              └────────────────────┘
         │                        │
         └────────────────────────▼
                        Simple State
```

No complex blob management, no Edge Functions, no external storage needed!

---

Built with ❤️ using modern web technologies for a better wellness experience. 