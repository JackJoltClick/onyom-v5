import React from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import styles from '@/styles/components/BottomNavigation.module.css'

interface NavItem {
  to: string
  icon: string
  label: string
}

const navItems: NavItem[] = [
  {
    to: ROUTES.app.chat,
    icon: '💬',
    label: 'Chat'
  },
  {
    to: ROUTES.app.meditations,
    icon: '🧘',
    label: 'Meditation'
  },
  {
    to: ROUTES.app.breathwork,
    icon: '🫁',
    label: 'Breathwork'
  },
  {
    to: ROUTES.app.profile,
    icon: '👤',
    label: 'Profile'
  }
]

export function BottomNavigation(): React.ReactElement {
  return (
    <nav className={styles.container}>
      <div className={styles.content}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
} 