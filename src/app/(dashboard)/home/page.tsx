'use client'

import { useState } from 'react'
import { AskMeHero } from '@/components/home/AskMeHero'
import { UAENowDashboard } from '@/components/home/UAENowDashboard'
import { NewsHeadlines } from '@/components/overview/NewsHeadlines'
import { SearchModal } from '@/components/layout/SearchModal'

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <AskMeHero onOpenSearch={() => setIsSearchOpen(true)} />

      <UAENowDashboard />

      <NewsHeadlines />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
