'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Collapsible } from '@/components/ui/Collapsible'
import {
  demographicStats as demographicStatsKo,
  nationalityGroups as nationalityGroupsKo,
  populationInsights as populationInsightsKo,
  emiratePopulations as emiratePopulationsKo,
  emirateInsights as emirateInsightsKo,
  kafalaSystem as kafalaSystemKo,
  kafalaWarnings as kafalaWarningsKo,
} from '@/data/society/population'
import {
  demographicStats as demographicStatsEn,
  nationalityGroups as nationalityGroupsEn,
  populationInsights as populationInsightsEn,
  emiratePopulations as emiratePopulationsEn,
  emirateInsights as emirateInsightsEn,
  kafalaSystem as kafalaSystemEn,
  kafalaWarnings as kafalaWarningsEn,
} from '@/data/society/population.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function InsightBox({ insights }: { readonly insights: readonly string[] }) {
  return (
    <div className="mt-3 p-3.5 bg-gold/5 border border-gold/15 rounded-lg">
      <div className="text-[11px] font-bold text-gold mb-2">투자자 시사점</div>
      <div className="space-y-1.5">
        {insights.map((insight) => (
          <div key={insight} className="text-[11px] text-t3 flex gap-2">
            <span className="text-gold shrink-0">&#x2022;</span>
            <span>{insight}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatGrid() {
  const demographicStats = useLocalizedData(demographicStatsKo, demographicStatsEn)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {demographicStats.map((stat) => (
        <Card key={stat.label}>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-[11px] text-t3 font-medium">{stat.label}</span>
            </div>
            <div className="font-display text-lg font-bold text-t1 leading-tight">{stat.value}</div>
            <div className="text-[10px] text-t4 mt-1 leading-snug">{stat.note}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function NationalityBar({ group, maxPercentage }: {
  readonly group: typeof nationalityGroupsKo[number]
  readonly maxPercentage: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const barWidth = (group.percentage / maxPercentage) * 100

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 mb-1.5">
        <div className="w-[140px] flex items-center gap-2 shrink-0">
          <span className="text-base">{group.flag}</span>
          <span className="text-xs font-semibold text-t2">{group.name}</span>
        </div>
        <div className="flex-1 h-[26px] bg-bg rounded-md overflow-hidden relative">
          <div
            className="h-full rounded-md flex items-center px-2.5 transition-all duration-500 ease-out"
            style={{
              width: `${barWidth}%`,
              background: group.color,
              opacity: isHovered ? 1 : 0.85,
              boxShadow: isHovered ? `0 0 16px ${group.color}40` : 'none',
            }}
          >
            {group.percentage >= 4 && (
              <span className="text-[10px] font-bold text-black/80">{group.percentage}%</span>
            )}
          </div>
        </div>
        <div className="w-[70px] text-right text-[11px] text-t3 font-mono shrink-0">{group.population}</div>
      </div>
      {isHovered && (
        <div className="ml-[164px] mb-2 text-[10px] text-t3 animate-fade-in leading-snug">
          {group.characteristics}
        </div>
      )}
    </div>
  )
}

function NationalityBreakdown() {
  const nationalityGroups = useLocalizedData(nationalityGroupsKo, nationalityGroupsEn)
  const maxPercentage = Math.max(...nationalityGroups.map(g => g.percentage))

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4">국적별 인구 비율 (추정)</h3>
        <div className="space-y-1">
          {nationalityGroups.map((group) => (
            <NationalityBar
              key={group.name}
              group={group}
              maxPercentage={maxPercentage}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}

function EmirateCards() {
  const emiratePopulations = useLocalizedData(emiratePopulationsKo, emiratePopulationsEn)
  const emirateInsights = useLocalizedData(emirateInsightsKo, emirateInsightsEn)

  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold text-t1 mb-3">에미리트별 인구 분포</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {emiratePopulations.map((emirate) => (
          <Card key={emirate.name}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{emirate.icon}</span>
                <div>
                  <div className="text-sm font-bold text-t1">{emirate.name}</div>
                  {emirate.nameEn !== emirate.name && (
                    <div className="text-[10px] text-t4">{emirate.nameEn}</div>
                  )}
                </div>
              </div>
              <div className="text-xs font-mono text-gold font-semibold mb-1.5">{emirate.population}</div>
              <div className="text-[11px] text-t3 leading-snug">{emirate.characteristics}</div>
            </div>
          </Card>
        ))}
      </div>
      <InsightBox insights={emirateInsights} />
    </div>
  )
}

function KafalaSection() {
  const kafalaSystem = useLocalizedData(kafalaSystemKo, kafalaSystemEn)
  const kafalaWarnings = useLocalizedData(kafalaWarningsKo, kafalaWarningsEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4">노동시장 구조 -- Kafala(카팔라) 시스템</h3>
        <div className="space-y-3">
          {kafalaSystem.map((item) => (
            <div key={item.label} className="flex gap-3">
              <div className="w-[130px] shrink-0 text-[11px] font-bold text-gold">{item.label}</div>
              <div className="text-[12px] text-t2 leading-snug">{item.content}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-accent-orange/5 border border-accent-orange/15 rounded-lg">
          <div className="text-[11px] font-bold text-accent-orange mb-2">한국 기업 주의사항</div>
          <div className="space-y-1.5">
            {kafalaWarnings.map((warning) => (
              <div key={warning} className="text-[11px] text-t3 flex gap-2">
                <span className="text-accent-orange shrink-0">!</span>
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export function PopulationStructure() {
  const populationInsights = useLocalizedData(populationInsightsKo, populationInsightsEn)

  return (
    <div>
      <StatGrid />
      <NationalityBreakdown />
      <InsightBox insights={populationInsights} />
      <div className="mt-6">
        <Collapsible
          header={
            <span className="text-sm font-bold text-t1">에미리트별 인구 분포 & 노동시장 구조</span>
          }
        >
          <EmirateCards />
          <KafalaSection />
        </Collapsible>
      </div>
    </div>
  )
}
