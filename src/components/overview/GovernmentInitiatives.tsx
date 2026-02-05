'use client'

import { initiatives as initiativesKo } from '@/data/overview/initiatives'
import { initiatives as initiativesEn } from '@/data/overview/initiatives.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { InitiativeCard } from './InitiativeCard'

export function GovernmentInitiatives() {
  const initiatives = useLocalizedData(initiativesKo, initiativesEn)

  return (
    <div className="mb-6">
      <div className="mt-9 mb-2">
        <h2 className="font-display text-[28px] font-black bg-gradient-to-br from-gold to-gold3 bg-clip-text text-transparent">
          🚀 정부 핵심 이니셔티브 — 지금 UAE가 가장 밀고 있는 것들
        </h2>
        <p className="text-t3 text-[13px] mt-1">2025~2031년 국가 방향성. 투자 기회는 이 이니셔티브들 안에 있다.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {initiatives.map((initiative) => (
          <InitiativeCard key={initiative.title} initiative={initiative} />
        ))}
      </div>
    </div>
  )
}
