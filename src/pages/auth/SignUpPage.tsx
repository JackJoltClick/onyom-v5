import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthFlow } from '@/components/auth/AuthFlow'
import { ROUTES } from '@/lib/constants'

export function SignUpPage(): React.ReactElement {
  const navigate = useNavigate()

  const handleComplete = () => {
    navigate(ROUTES.onboarding)
  }

  return (
    <AuthFlow 
      mode="signup" 
      onComplete={handleComplete}
    />
  )
} 