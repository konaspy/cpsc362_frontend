'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogIn, User, Lock, AlertCircle } from 'lucide-react'
import { AddMemberDialog } from '@/components/dialogs/memberDialogs'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        
        if (token && role) {
          if (role === 'admin') {
            router.push('/staff')
          } else if (role === 'user') {
            router.push('/member')
          }
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error)
        // Clear potentially corrupted data
        localStorage.removeItem('token')
        localStorage.removeItem('role')
      }
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Make GET request to /api/login with query parameters
      const response = await fetch(`/api/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        return
      }

      // Store token in localStorage (in production, consider more secure storage)
      try {
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('role', data.data.role)
      } catch (error) {
        console.error('Error storing authentication data:', error)
        setError('Failed to store login credentials')
        return
      }

      // Route to appropriate dashboard based on role
      if (data.data.role === 'admin') {
        router.push('/staff')
      } else if (data.data.role === 'user') {
        router.push('/member')
      } else {
        setError('Unknown user role')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <LogIn className="h-6 w-6 mr-2" />
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
          </div>
          <CardDescription>
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <AddMemberDialog
              trigger={
                <Button variant="outline" className="w-full">
                  Register
                </Button>
              }
              open={dialogOpen}
              onOpenChange={setDialogOpen}
            />
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo credentials:</p>
            <p>Staff: username = "admin", password = "admin"</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}