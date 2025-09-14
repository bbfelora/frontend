'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { FeloraLogo } from '@/components/ui/felora-logo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // For now, simulate login with demo credentials
      if (email === 'demo@felora.io' && password === 'demo') {
        localStorage.setItem('jwt', 'demo-jwt-token')
        addToast('Successfully signed in!', 'success')
        router.push('/dashboard')
      } else {
        addToast('Invalid credentials. Use demo@felora.io / demo', 'error')
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FeloraLogo size="xl" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your Felora account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-accent hover:bg-accent/90 text-base font-medium" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground text-center mb-2">Demo credentials:</p>
          <div className="text-center space-y-1">
            <p className="font-mono text-xs bg-background px-2 py-1 rounded border">demo@felora.io</p>
            <p className="font-mono text-xs bg-background px-2 py-1 rounded border">demo</p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link href="https://felora.io" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to felora.io
          </Link>
        </div>
      </div>
    </div>
  )
}