'use client'

import { emirates as emiratesKo } from '@/data/overview/emirates'
import { emirates as emiratesEn } from '@/data/overview/emirates.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { EmirateCard } from './EmirateCard'

export function EmiratesCards() {
  const emirates = useLocalizedData(emiratesKo, emiratesEn)

  return (
    <div className="mb-6">
      <div className="text-sm font-bold mb-3 text-gold">🗺️ 7개 에미리트 — 각각이 독립 왕국</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {emirates.map((emirate) => (
          <EmirateCard key={emirate.name} emirate={emirate} />
        ))}
      </div>
    </div>
  )
}
