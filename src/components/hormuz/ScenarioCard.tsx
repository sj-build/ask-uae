'use client'

import type { WarScenario } from '@/types/hormuz'
import { useLocale } from '@/hooks/useLocale'

interface ScenarioCardProps {
  readonly scenario: WarScenario
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const { locale } = useLocale()

  const name = locale === 'en' ? scenario.nameEn : scenario.nameKo
  const description = locale === 'en' ? scenario.descriptionEn : scenario.descriptionKo
  const oilImpact = locale === 'en' ? scenario.oilImpactEn : scenario.oilImpactKo

  const barColor = scenario.probability >= 50
    ? '#ef4444'
    : scenario.probability >= 30
      ? '#f59e0b'
      : '#22c55e'

  return (
    <div
      className={`
        bg-bg3/80 rounded-lg p-5 transition-all duration-200
        ${scenario.isActive
          ? 'border-2 border-gold/60 shadow-[0_0_16px_rgba(200,164,78,0.12)]'
          : 'border border-brd/60 hover:border-brd'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-bold text-t1">{name}</h3>
        {scenario.isActive && (
          <span className="px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase bg-gold/15 text-gold rounded">
            {locale === 'en' ? 'ACTIVE' : '활성'}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[12px] text-t3 leading-relaxed mb-4">{description}</p>

      {/* Probability bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-t4 uppercase tracking-wide">
            {locale === 'en' ? 'Probability' : '확률'}
          </span>
          <span className="text-[13px] font-bold" style={{ color: barColor }}>
            {scenario.probability}%
          </span>
        </div>
        <div className="w-full h-2 bg-bg/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${scenario.probability}%`,
              backgroundColor: barColor,
              boxShadow: `0 0 8px ${barColor}40`,
            }}
          />
        </div>
      </div>

      {/* Oil impact */}
      <div className="pt-3 border-t border-brd/40">
        <span className="text-[10px] text-t4 uppercase tracking-wide">
          {locale === 'en' ? 'Oil Impact' : '유가 영향'}
        </span>
        <p className="text-[12px] text-t2 font-medium mt-1">{oilImpact}</p>
      </div>
    </div>
  )
}
