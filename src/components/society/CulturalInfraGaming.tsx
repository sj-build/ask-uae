'use client'

import { Card } from '@/components/ui/Card'
import {
  culturalInfrastructure as culturalInfrastructureKo,
  unescoItems as unescoItemsKo,
  culturalInsights as culturalInsightsKo,
  gamingMetrics as gamingMetricsKo,
  gamingInsights as gamingInsightsKo,
} from '@/data/society/trends'
import {
  culturalInfrastructure as culturalInfrastructureEn,
  unescoItems as unescoItemsEn,
  culturalInsights as culturalInsightsEn,
  gamingMetrics as gamingMetricsEn,
  gamingInsights as gamingInsightsEn,
} from '@/data/society/trends.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function InsightBox({ title, insights }: { readonly title: string; readonly insights: readonly string[] }) {
  return (
    <div className="mt-4 p-3.5 bg-gold/5 border border-gold/15 rounded-lg">
      <div className="text-[11px] font-bold text-gold mb-2">{title}</div>
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

function CulturalInfraCard() {
  const culturalInfrastructure = useLocalizedData(culturalInfrastructureKo, culturalInfrastructureEn)
  const unescoItems = useLocalizedData(unescoItemsKo, unescoItemsEn)
  const culturalInsights = useLocalizedData(culturalInsightsKo, culturalInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🏛️</span>
          <h3 className="text-sm font-bold text-t1">문화 인프라 폭발</h3>
        </div>
        <p className="text-[10px] text-t4 mb-4 ml-7">2025년 = UAE 문화 인프라 역사상 가장 많은 박물관/기관 개관</p>

        <div className="space-y-2.5 mb-4">
          {culturalInfrastructure.map((infra) => (
            <div
              key={infra.name}
              className="p-3 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-t1">{infra.name}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent-purple/10 text-accent-purple border border-accent-purple/15">
                  {infra.year}
                </span>
              </div>
              <div className="text-[10px] text-t4 mb-0.5">{infra.location}</div>
              <div className="text-[11px] text-t3 leading-snug">{infra.description}</div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-accent-purple/5 border border-accent-purple/15 rounded-lg mb-4">
          <div className="text-[11px] font-bold text-accent-purple mb-2">UNESCO 무형문화유산 (2025, 4건)</div>
          <div className="flex flex-wrap gap-2">
            {unescoItems.map((item) => (
              <span
                key={item.name}
                className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-accent-purple/10 text-accent-purple border border-accent-purple/15"
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>

        <InsightBox title="투자자 시사점" insights={culturalInsights} />
      </div>
    </Card>
  )
}

function GamingCard() {
  const gamingMetrics = useLocalizedData(gamingMetricsKo, gamingMetricsEn)
  const gamingInsights = useLocalizedData(gamingInsightsKo, gamingInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🎮</span>
          <h3 className="text-sm font-bold text-t1">게이밍/e스포츠 허브 부상</h3>
        </div>
        <p className="text-[10px] text-t4 mb-4 ml-7">UAE+사우디가 중동을 글로벌 게이밍/e스포츠의 새로운 중심지로</p>

        <div className="space-y-2 mb-4">
          {gamingMetrics.map((metric) => (
            <div key={metric.label} className="flex gap-3 p-2.5 bg-bg/60 border border-brd rounded-lg">
              <div className="w-[130px] shrink-0 text-[11px] font-bold text-accent-cyan">{metric.label}</div>
              <div className="text-[11px] text-t2 leading-snug">{metric.value}</div>
            </div>
          ))}
        </div>

        <InsightBox title="투자자 시사점" insights={gamingInsights} />
      </div>
    </Card>
  )
}

export function CulturalInfraGaming() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CulturalInfraCard />
      <GamingCard />
    </div>
  )
}
