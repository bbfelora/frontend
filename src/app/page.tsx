'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated by looking for JWT in localStorage
    const token = localStorage.getItem('jwt')
    
    if (token) {
      // User is authenticated, redirect to dashboard
      router.push('/dashboard')
    } else {
      // User is not authenticated, redirect to login
      router.push('/login')
    }
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-accent-500 font-bold text-xl">F</span>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}