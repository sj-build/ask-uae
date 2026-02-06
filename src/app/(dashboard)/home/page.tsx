'use client'

import { useState, useCallback } from 'react'
import { AskMeHero } from '@/components/home/AskMeHero'
import { UAENowDashboard } from '@/components/home/UAENowDashboard'
import { NewsHeadlines } from '@/components/overview/NewsHeadlines'
import { SearchModal } from '@/components/layout/SearchModal'

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState<string | undefined>()

  const handleOpenSearch = useCallback(() => {
    setInitialQuery(undefined)
    setIsSearchOpen(true)
  }, [])

  const handleQuickQuestion = useCallback((question: string) => {
    setInitialQuery(question)
    setIsSearchOpen(true)
  }, [])

  const handleCloseSearch = useCallback(() => {
    setIsSearchOpen(false)
    setInitialQuery(undefined)
  }, [])

  return (
    <>
      <AskMeHero onOpenSearch={handleOpenSearch} onQuickQuestion={handleQuickQuestion} />

      <UAENowDashboard />

      <NewsHeadlines />

      <SearchModal isOpen={isSearchOpen} onClose={handleCloseSearch} initialQuery={initialQuery} />
    </>
  )
}
