'use client'

import { useState, useEffect, useCallback } from 'react'

interface AuthState {
  readonly isAuthenticated: boolean
  readonly isLoading: boolean
}

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  })

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/check')
      const data = await response.json()
      setAuthState({ isAuthenticated: data.authenticated, isLoading: false })
    } catch {
      setAuthState({ isAuthenticated: false, isLoading: false })
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await response.json()

      if (data.success) {
        setAuthState({ isAuthenticated: true, isLoading: false })
        return true
      }

      return false
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch('/api/auth', { method: 'DELETE' })
      setAuthState({ isAuthenticated: false, isLoading: false })
    } catch {
      setAuthState({ isAuthenticated: false, isLoading: false })
    }
  }, [])

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    logout,
  } as const
}
