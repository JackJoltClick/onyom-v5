import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoSparkles, IoHeart, IoLeaf, IoShield, IoChatbubbles, IoTrendingUp, IoArrowForward, IoMoon, IoSunny } from 'react-icons/io5'
import { ROUTES, APP_CONFIG } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import styles from '@/styles/components/LandingPage.module.css'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const features = [
  {
    icon: IoHeart,
    title: 'Therapeutic Design',
    description: 'Psychologically-calibrated colors and layouts designed for emotional comfort and healing'
  },
  {
    icon: IoChatbubbles,
    title: 'Personalized Therapy',
    description: 'Choose from three distinct AI therapist personalities to match your unique needs'
  },
  {
    icon: IoTrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your wellness journey with insights and gentle guidance along the way'
  },
  {
    icon: IoShield,
    title: 'Safe Space',
    description: 'A judgment-free environment where you can explore your thoughts and feelings freely'
  }
]

const principles = [
  {
    icon: IoLeaf,
    title: 'Mindful Minimalism',
    description: 'Clean, uncluttered interfaces that promote focus and reduce overwhelm'
  },
  {
    icon: IoSparkles,
    title: 'Gentle Premium',
    description: 'High-quality experience that feels supportive rather than clinical'
  },
  {
    icon: IoHeart,
    title: 'Human-Centered',
    description: 'Warm, approachable design that prioritizes your emotional well-being'
  }
]

export function LandingPage(): React.ReactElement {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section className={styles.hero} variants={itemVariants}>
          <div className={styles.heroContent}>
            <motion.div className={styles.heroIcon} variants={itemVariants}>
              <IoSparkles />
            </motion.div>
            
            <motion.h1 className={styles.title} variants={itemVariants}>
              Welcome to <span className={styles.brandName}>{APP_CONFIG.name}</span>
            </motion.h1>
            
            <motion.p className={styles.description} variants={itemVariants}>
              {APP_CONFIG.description}
            </motion.p>

            <motion.div className={styles.actions} variants={itemVariants}>
              <Link
                to={ROUTES.auth.signup}
                className={styles.primaryButton}
              >
                <IoLeaf />
                Get Started
              </Link>
              
              <Link
                to={ROUTES.auth.login}
                className={styles.secondaryButton}
              >
                <IoArrowForward />
                Sign In
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section className={styles.features} variants={itemVariants}>
          <motion.h2 className={styles.sectionTitle} variants={itemVariants}>
            Why Choose Onyom?
          </motion.h2>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={styles.feature}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={styles.featureIcon}>
                  <feature.icon />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Principles Section */}
        <motion.section className={styles.principles} variants={itemVariants}>
          <motion.h2 className={styles.sectionTitle} variants={itemVariants}>
            Built with Therapeutic Design
          </motion.h2>
          
          <div className={styles.principlesGrid}>
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                className={styles.principle}
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className={styles.principleIcon}>
                  <principle.icon />
                </div>
                <h3 className={styles.principleTitle}>{principle.title}</h3>
                <p className={styles.principleDescription}>{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section className={styles.cta} variants={itemVariants}>
          <motion.div className={styles.ctaContent} variants={itemVariants}>
            <h2 className={styles.ctaTitle}>Ready to start your wellness journey?</h2>
            <p className={styles.ctaDescription}>
              Join thousands who have found peace and growth with Onyom's therapeutic approach.
            </p>
            
            <Link
              to={ROUTES.auth.signup}
              className={styles.ctaButton}
            >
              <IoSparkles />
              Begin Your Journey
            </Link>
          </motion.div>
        </motion.section>

        {/* Design System Link for Development */}
        <motion.div className={styles.devSection} variants={itemVariants}>
          <Link
            to="/design"
            className={styles.designButton}
          >
            🎨 View Design System
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
} 