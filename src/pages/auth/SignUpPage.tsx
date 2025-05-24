import React from 'react'
import { SignUpForm } from '@/components/auth/SignUpForm'

export function SignUpPage(): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background-color to-surface-color">
      <SignUpForm />
    </div>
  )
} 