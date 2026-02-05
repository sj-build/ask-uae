'use client'

import { AskMeHero } from '@/components/home/AskMeHero'
import { UAENowDashboard } from '@/components/home/UAENowDashboard'
import { NewsHeadlines } from '@/components/overview/NewsHeadlines'

export default function HomePage() {
  return (
    <>
      <AskMeHero />

      <UAENowDashboard />

      <NewsHeadlines />
    </>
  )
}
