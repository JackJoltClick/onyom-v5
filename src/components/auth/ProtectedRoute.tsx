import React from 'react'
import { Navigate } from 'react-router-dom'
import type { ProtectedRouteProps } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'
import { ROUTES } from '@/lib/constants'

export function ProtectedRoute({ 
  children, 
  redirectTo = ROUTES.auth.login 
}: ProtectedRouteProps): React.ReactElement {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        padding: '1rem',
        gap: '1rem'
      }}>
        {/* Header skeleton */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1rem 0'
        }}>
          <Skeleton width="150px" height="32px" variant="rounded" />
          <Skeleton width="40px" height="40px" variant="circular" />
        </div>
        
        {/* Main content skeleton */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SkeletonCard />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Skeleton height="60px" variant="rounded" />
            <Skeleton height="60px" variant="rounded" />
            <Skeleton height="60px" variant="rounded" />
          </div>
        </div>
        
        {/* Bottom navigation skeleton */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          padding: '1rem 0',
          borderTop: '1px solid #e5e7eb'
        }}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Skeleton width="24px" height="24px" variant="rounded" />
              <Skeleton width="50px" height="12px" variant="text" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute: User not authenticated, redirecting to:', redirectTo)
    return <Navigate to={redirectTo} replace />
  }

  console.log('ProtectedRoute: User authenticated, rendering protected content')
  return <>{children}</>
} 