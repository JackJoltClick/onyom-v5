import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoChatbubble, IoPerson, IoLeaf, IoWater } from 'react-icons/io5'
import { ROUTES } from '@/lib/constants'
import styles from '@/styles/components/BottomNavigation.module.css'

interface NavItem {
  to: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
}

const navItems: NavItem[] = [
  {
    to: ROUTES.app.chat,
    icon: IoChatbubble,
    label: 'Chat'
  },
  {
    to: ROUTES.app.meditations,
    icon: IoWater,
    label: 'Meditation'
  },
  {
    to: ROUTES.app.breathwork,
    icon: IoLeaf,
    label: 'Breathwork'
  },
  {
    to: ROUTES.app.profile,
    icon: IoPerson,
    label: 'Profile'
  }
]

export function BottomNavigation(): React.ReactElement {
  return (
    <nav className={styles.container}>
      <div className={styles.content}>
        {navItems.map((item) => {
          const IconComponent = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>
                <IconComponent size={22} />
              </span>
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
} 