import React from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

export function LoginPage(): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background-color to-surface-color">
      <LoginForm />
    </div>
  )
} 