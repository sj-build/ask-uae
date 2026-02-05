'use client'

import { useState, useCallback, useRef } from 'react'
import type { SearchResponse } from '@/types/search'

export function useSearch() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SearchResponse | null>(null)
  const [history, setHistory] = useState<readonly string[]>([])
  const abortRef = useRef<AbortController | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setResult(null)

    setHistory(prev => {
      const filtered = prev.filter(q => q !== query)
      return [query, ...filtered].slice(0, 8)
    })

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      })
      const data: SearchResponse = await response.json()
      setResult(data)
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setResult({ success: false, error: error.message })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isLoading, result, history, search } as const
}
