import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthFlow } from '@/components/auth/AuthFlow'
import { ROUTES } from '@/lib/constants'

export function LoginPage(): React.ReactElement {
  const navigate = useNavigate()

  const handleComplete = () => {
    navigate(ROUTES.app.meditations)
  }

  return (
    <AuthFlow 
      mode="login" 
      onComplete={handleComplete}
    />
  )
} 