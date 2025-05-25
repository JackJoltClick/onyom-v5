import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { TherapeuticCard } from '@/components/ui/TherapeuticCard'
import { MeditationCard } from '@/components/meditation/MeditationCard'
import { MeditationPlayer } from '@/components/meditation/MeditationPlayer'
import { PREMADE_MEDITATIONS } from '@/data/meditations'
import { useMeditationStore } from '@/stores/meditationStore'
import styles from '@/styles/components/DesignShowcase.module.css'

export function DesignShowcase(): React.ReactElement {
  const [theme, setTheme] = useState<string>('dark')
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const sampleMeditation = PREMADE_MEDITATIONS[0]
  const secondMeditation = PREMADE_MEDITATIONS[1]

  // Safety check for meditations
  if (!sampleMeditation || !secondMeditation) {
    return <div>Loading design showcase...</div>
  }

  return (
    <div className={styles.showcase} data-theme={theme}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              Onyom Design System
            </h1>
            <p className={styles.subtitle}>
              Therapeutic & Mindful UI/UX
            </p>
          </div>
          
          {/* Theme switcher */}
          <div className={styles.themeSwitcher}>
            <Button 
              variant={theme === 'dark' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleThemeChange('dark')}
            >
              Dark
            </Button>
            <Button 
              variant={theme === 'light' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleThemeChange('light')}
            >
              Light
            </Button>
            <Button 
              variant={theme === 'calming' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleThemeChange('calming')}
            >
              Calming
            </Button>
            <Button 
              variant={theme === 'easy-read' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleThemeChange('easy-read')}
            >
              Easy Read
            </Button>
          </div>
        </header>

        {/* Color Palette */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Color Palette</h2>
          <div className={styles.colorGrid}>
            <div className={styles.colorGroup}>
              <h3 className={styles.colorGroupTitle}>Primary Colors</h3>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--onyom-bg-deep)' }}>
                <span>Deep Background</span>
                <code>#151A23</code>
              </div>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--onyom-bg-surface)' }}>
                <span>Surface</span>
                <code>#212832</code>
              </div>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--onyom-accent-primary)' }}>
                <span>Therapeutic Blue</span>
                <code>#6998B0</code>
              </div>
            </div>
            
            <div className={styles.colorGroup}>
              <h3 className={styles.colorGroupTitle}>Secondary Colors</h3>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--onyom-sage)' }}>
                <span>Sage Green</span>
                <code>#90B589</code>
              </div>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--onyom-beige)' }}>
                <span>Warm Beige</span>
                <code>#C2A278</code>
              </div>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--onyom-success)' }}>
                <span>Gentle Success</span>
                <code>#7DD3C0</code>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Typography</h2>
          <div className={styles.typographyGrid}>
            <h1>Heading 1 - Hero Title</h1>
            <h2>Heading 2 - Section Title</h2>
            <h3>Heading 3 - Subsection</h3>
            <h4>Heading 4 - Component Title</h4>
            <h5>Heading 5 - Small Heading</h5>
            <h6>Heading 6 - Label</h6>
            <p className="large">Large body text for important content and descriptions that need emphasis.</p>
            <p>Regular body text for general content, maintaining comfortable reading with relaxed line height.</p>
            <p className="small">Small text for metadata, captions, and secondary information.</p>
          </div>
        </section>

        {/* Buttons */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Buttons</h2>
          
          <div className={styles.buttonGrid}>
            <div className={styles.buttonGroup}>
              <h3>Primary Variants</h3>
              <div className={styles.buttonRow}>
                <Button variant="primary" size="lg">Primary Large</Button>
                <Button variant="primary" size="md">Primary Medium</Button>
                <Button variant="primary" size="sm">Primary Small</Button>
              </div>
            </div>
            
            <div className={styles.buttonGroup}>
              <h3>Secondary & Ghost</h3>
              <div className={styles.buttonRow}>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
            
            <div className={styles.buttonGroup}>
              <h3>Color Variants</h3>
              <div className={styles.buttonRow}>
                <Button variant="sage">Sage Green</Button>
                <Button variant="beige">Warm Beige</Button>
                <Button variant="primary" className="breathe">Breathing Effect</Button>
              </div>
            </div>
            
            <div className={styles.buttonGroup}>
              <h3>Special States</h3>
              <div className={styles.buttonRow}>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="primary" isLoading>Loading</Button>
                <Button variant="primary" className="floating">Floating</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Therapeutic Cards */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Therapeutic Cards</h2>
          <div className={styles.cardGrid}>
            <div className={styles.cardRow}>
              <TherapeuticCard variant="default" padding="md">
                <h3>Default Card</h3>
                <p>Simple elevated surface with soft shadows</p>
              </TherapeuticCard>
              
              <TherapeuticCard variant="glass" padding="md">
                <h3>Glass Card</h3>
                <p>Glassmorphism effect with backdrop blur</p>
              </TherapeuticCard>
              
              <TherapeuticCard variant="elevated" padding="md">
                <h3>Elevated Card</h3>
                <p>Higher elevation for visual prominence</p>
              </TherapeuticCard>
            </div>
            
            <div className={styles.cardRow}>
              <TherapeuticCard variant="floating" padding="md">
                <h3>Floating Card</h3>
                <p>Maximum elevation with subtle glow effects</p>
              </TherapeuticCard>
              
              <TherapeuticCard variant="glass" effect="breathe" padding="md">
                <h3>Breathing Glass</h3>
                <p>Meditation-appropriate breathing animation</p>
              </TherapeuticCard>
              
              <TherapeuticCard 
                variant="elevated" 
                effect="glow" 
                padding="md"
                onClick={() => alert('Interactive card clicked!')}
              >
                <h3>Interactive Card</h3>
                <p>Click me! Gentle glow with hover effects</p>
              </TherapeuticCard>
            </div>
          </div>
        </section>

        {/* Meditation Cards */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Meditation Components</h2>
          
          {/* Original meditation cards */}
          <div className={styles.cardGrid}>
            <div className={styles.cardRow}>
              <h3 style={{ width: '100%', marginBottom: 'var(--onyom-space-4)' }}>Meditation Cards</h3>
            </div>
            <div className={styles.cardRow}>
              <MeditationCard 
                meditation={sampleMeditation}
                variant="default"
                onSelect={(meditation) => setSelectedCard(meditation.id)}
                isSelected={selectedCard === sampleMeditation.id}
              />
              <MeditationCard 
                meditation={secondMeditation}
                variant="minimal"
                onSelect={(meditation) => setSelectedCard(meditation.id)}
                isSelected={selectedCard === secondMeditation.id}
                className="featured"
              />
            </div>
          </div>

          {/* Meditation Player Demo */}
          <div className={styles.playerDemo}>
            <h3 style={{ marginBottom: 'var(--onyom-space-4)' }}>Spotify-Style Meditation Player</h3>
            <p style={{ marginBottom: 'var(--onyom-space-6)', color: 'var(--onyom-text-secondary)' }}>
              Clean, minimal audio player with therapeutic design principles. Click a meditation card above to see it in action.
            </p>
            
            {/* Demo controls */}
            <div className={styles.playerControls}>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => {
                  const { playMeditation } = useMeditationStore.getState()
                  playMeditation(sampleMeditation)
                }}
              >
                Demo Player
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  const { stopMeditation } = useMeditationStore.getState()
                  stopMeditation()
                }}
              >
                Stop Demo
              </Button>
            </div>
            
            {/* Player features */}
            <div className={styles.playerFeatures}>
              <div className={styles.feature}>
                <h4>✨ Glassmorphism Design</h4>
                <p>Blurred backdrop with subtle borders for modern depth</p>
              </div>
              <div className={styles.feature}>
                <h4>🎵 Spotify-Inspired Controls</h4>
                <p>Familiar interface with therapeutic color palette</p>
              </div>
              <div className={styles.feature}>
                <h4>📱 Mobile-First</h4>
                <p>Optimized touch targets and responsive volume controls</p>
              </div>
              <div className={styles.feature}>
                <h4>🧘 Therapeutic Icons</h4>
                <p>React icons replace emojis for professional consistency</p>
              </div>
            </div>
          </div>
        </section>

        {/* Glassmorphism */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Glassmorphism Effects</h2>
          <div className={styles.glassGrid}>
            <div className={styles.glassCard + ' onyom-glass'}>
              <h3>Glass Card</h3>
              <p>Subtle glassmorphism effect with backdrop blur and soft borders for modern depth.</p>
            </div>
            <div className={styles.glassCard + ' onyom-glass'}>
              <h3>Interactive Glass</h3>
              <p>Hover and focus states maintain the therapeutic feel while providing clear feedback.</p>
              <Button variant="primary" size="sm">Action</Button>
            </div>
          </div>
        </section>

        {/* Animations */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Therapeutic Animations</h2>
          <div className={styles.animationGrid}>
            <div className={styles.animationDemo + ' onyom-breathe'}>
              <h3>Breathing Animation</h3>
              <p>4-second breathing rhythm for meditation contexts</p>
            </div>
            <div className={styles.animationDemo + ' onyom-lift'}>
              <h3>Gentle Lift</h3>
              <p>Hover to see the subtle upward movement</p>
            </div>
            <div className={styles.animationDemo + ' animate-pulse'}>
              <h3>Pulse Animation</h3>
              <p>Gentle pulsing for attention</p>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Accessibility Features</h2>
          <div className={styles.accessibilityGrid}>
            <div className={styles.accessibilityItem}>
              <h3>Touch Targets</h3>
              <p>Minimum 44px touch targets for mobile accessibility</p>
              <Button variant="primary" size="sm">Touch Me</Button>
            </div>
            <div className={styles.accessibilityItem}>
              <h3>Focus Rings</h3>
              <p>Visible focus indicators with proper contrast</p>
              <Button variant="secondary" className="focus-ring">Focus Test</Button>
            </div>
            <div className={styles.accessibilityItem}>
              <h3>Reduced Motion</h3>
              <p>Respects prefers-reduced-motion for comfort</p>
              <div className={styles.motionNote}>
                Enable "Reduce motion" in your OS settings to test
              </div>
            </div>
          </div>
        </section>

        {/* Design Principles */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Design Principles</h2>
          <div className={styles.principlesGrid}>
            <div className={styles.principle}>
              <h3>🧘 Therapeutic & Calming</h3>
              <p>Psychologically-calibrated colors and gentle animations designed for emotional comfort</p>
            </div>
            <div className={styles.principle}>
              <h3>✨ Mindful Minimalism</h3>
              <p>Clean, uncluttered interfaces with purposeful elements that don't overwhelm</p>
            </div>
            <div className={styles.principle}>
              <h3>💎 Gentle Premium</h3>
              <p>High-quality, sophisticated feel without being clinical or intimidating</p>
            </div>
            <div className={styles.principle}>
              <h3>❤️ Human-Centered</h3>
              <p>Warm, approachable design that feels like a supportive companion</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 