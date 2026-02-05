'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import {
  wastaConcepts as wastaConceptsKo,
  wastaPrinciple as wastaPrincipleKo,
  wastaTips as wastaTipsKo,
  majlisInfo as majlisInfoKo,
  meetingComparisons as meetingComparisonsKo,
  dressCodes as dressCodesKo,
  dressWarning as dressWarningKo,
  hierarchyTiers as hierarchyTiersKo,
  hierarchyInsights as hierarchyInsightsKo,
} from '@/data/society/business-culture'
import {
  wastaConcepts as wastaConceptsEn,
  wastaPrinciple as wastaPrincipleEn,
  wastaTips as wastaTipsEn,
  majlisInfo as majlisInfoEn,
  meetingComparisons as meetingComparisonsEn,
  dressCodes as dressCodesEn,
  dressWarning as dressWarningEn,
  hierarchyTiers as hierarchyTiersEn,
  hierarchyInsights as hierarchyInsightsEn,
} from '@/data/society/business-culture.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function WastaSection() {
  const wastaConcepts = useLocalizedData(wastaConceptsKo, wastaConceptsEn)
  const wastaPrinciple = useLocalizedData(wastaPrincipleKo, wastaPrincipleEn)
  const wastaTips = useLocalizedData(wastaTipsKo, wastaTipsEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-1">Wasta -- 관계의 힘</h3>
        <p className="text-[11px] text-gold mb-4 font-semibold">{wastaPrinciple}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {wastaConcepts.map((item) => (
            <div key={item.concept} className="p-3 bg-bg/60 rounded-lg border border-brd">
              <div className="text-xs font-bold text-t1 mb-0.5">
                {item.concept} <span className="text-t4 font-normal">({item.arabic})</span>
              </div>
              <div className="text-[11px] text-t3 leading-snug">{item.description}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {wastaTips.map((tip) => (
            <div key={tip} className="text-[11px] text-t3 flex gap-2">
              <span className="text-gold shrink-0">&#x2192;</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function MajlisSection() {
  const majlisInfo = useLocalizedData(majlisInfoKo, majlisInfoEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-3">Majlis -- 통치자 접근의 전통</h3>
        <div className="space-y-3">
          {majlisInfo.map((item) => (
            <div key={item.label} className="flex gap-3">
              <div className="w-[120px] shrink-0 text-[11px] font-bold text-gold">{item.label}</div>
              <div className="text-[12px] text-t2 leading-snug">{item.content}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function MeetingComparisonTable() {
  const meetingComparisons = useLocalizedData(meetingComparisonsKo, meetingComparisonsEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-3">비즈니스 미팅: 한국 vs UAE</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-brd">
                <th className="text-left py-2 pr-3 text-t4 font-medium w-[120px]">상황</th>
                <th className="text-left py-2 px-3 text-[#4a9eff] font-medium">한국</th>
                <th className="text-left py-2 pl-3 text-gold font-medium">UAE</th>
              </tr>
            </thead>
            <tbody>
              {meetingComparisons.map((row) => (
                <tr key={row.situation} className="border-b border-brd/50">
                  <td className="py-2.5 pr-3 font-semibold text-t2">{row.situation}</td>
                  <td className="py-2.5 px-3 text-t3">{row.korea}</td>
                  <td className="py-2.5 pl-3 text-t3">{row.uae}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}

function DressCodeSection() {
  const dressCodes = useLocalizedData(dressCodesKo, dressCodesEn)
  const dressWarning = useLocalizedData(dressWarningKo, dressWarningEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-3">드레스 코드</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {dressCodes.map((item) => (
            <div key={item.who} className="flex gap-3 p-3 bg-bg/60 rounded-lg border border-brd">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <div className="text-xs font-bold text-t1 mb-0.5">{item.who}</div>
                <div className="text-[11px] text-t3 leading-snug">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-t4 italic">{dressWarning}</div>
      </div>
    </Card>
  )
}

function HierarchySection() {
  const [activeRank, setActiveRank] = useState<number | null>(null)
  const hierarchyTiers = useLocalizedData(hierarchyTiersKo, hierarchyTiersEn)
  const hierarchyInsights = useLocalizedData(hierarchyInsightsKo, hierarchyInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4">사회 계층 구조</h3>
        <div className="space-y-1.5">
          {hierarchyTiers.map((tier) => {
            const isActive = activeRank === tier.rank
            const widthPercent = 30 + (tier.rank * 10)
            return (
              <button
                key={tier.rank}
                onClick={() => setActiveRank(isActive ? null : tier.rank)}
                className="w-full text-left"
              >
                <div
                  className="relative rounded-lg p-3 transition-all duration-300 border"
                  style={{
                    width: `${Math.min(widthPercent, 100)}%`,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderColor: isActive ? `${tier.color}50` : 'transparent',
                    backgroundColor: isActive ? `${tier.color}10` : `${tier.color}08`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-black/80 shrink-0"
                      style={{ backgroundColor: tier.color }}
                    >
                      {tier.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-t1 truncate">{tier.name}</div>
                      <div className="text-[10px] text-t4 truncate">{tier.members}</div>
                    </div>
                  </div>
                  {isActive && (
                    <div className="mt-2 text-[11px] text-t3 animate-fade-in leading-snug">
                      {tier.description}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
        <div className="mt-4 p-3 bg-gold/5 border border-gold/15 rounded-lg">
          <div className="text-[11px] font-bold text-gold mb-2">시사점</div>
          <div className="space-y-1.5">
            {hierarchyInsights.map((insight) => (
              <div key={insight} className="text-[11px] text-t3 flex gap-2">
                <span className="text-gold shrink-0">&#x2022;</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export function BusinessCulture() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WastaSection />
        <MajlisSection />
      </div>
      <MeetingComparisonTable />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DressCodeSection />
        <HierarchySection />
      </div>
    </div>
  )
}
