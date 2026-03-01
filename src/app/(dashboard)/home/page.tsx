'use client'

import { useState, useCallback, useEffect } from 'react'
import { AskMeHero } from '@/components/home/AskMeHero'
import { QuickStart } from '@/components/home/QuickStart'
import { UAENowSection, OpportunityRiskSummary } from '@/components/home/UAENowDashboard'
import { NewsHeadlines } from '@/components/overview/NewsHeadlines'
import { SearchModal } from '@/components/layout/SearchModal'
import { HormuzCrisisBanner } from '@/components/hormuz/HormuzCrisisBanner'
import { HormuzCrisisDashboard } from '@/components/hormuz/HormuzCrisisDashboard'
import { getHormuzDashboardData } from '@/lib/hormuz/queries'
import type { HormuzDashboardData } from '@/types/hormuz'

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState<string | undefined>()
  const [hormuzData, setHormuzData] = useState<HormuzDashboardData | null>(null)

  useEffect(() => {
    getHormuzDashboardData()
      .then(setHormuzData)
      .catch((err) => console.error('Failed to load Hormuz data:', err))
  }, [])

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

      {hormuzData && <HormuzCrisisBanner data={hormuzData} />}

      {hormuzData && <HormuzCrisisDashboard data={hormuzData} />}

      <QuickStart />

      <NewsHeadlines />

      <UAENowSection />

      <OpportunityRiskSummary />

      <SearchModal isOpen={isSearchOpen} onClose={handleCloseSearch} initialQuery={initialQuery} />
    </>
  )
}
