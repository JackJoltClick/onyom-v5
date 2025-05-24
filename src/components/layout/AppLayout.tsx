import React from 'react'
import { BottomNavigation } from '@/components/navigation/BottomNavigation'
import styles from '@/styles/components/AppLayout.module.css'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps): React.ReactElement {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {children}
      </main>
      <BottomNavigation />
    </div>
  )
} 