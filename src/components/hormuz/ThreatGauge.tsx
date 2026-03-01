'use client'

import type { CrisisThreatLevel } from '@/types/hormuz'
import { getThreatColor, getThreatLabel } from '@/lib/hormuz/threat-level'
import { useLocale } from '@/hooks/useLocale'

const LEVEL_ORDER: CrisisThreatLevel[] = ['LOW', 'ELEVATED', 'HIGH', 'CRITICAL']

interface ThreatGaugeProps {
  readonly level: CrisisThreatLevel
}

export function ThreatGauge({ level }: ThreatGaugeProps) {
  const { locale } = useLocale()
  const color = getThreatColor(level)
  const label = getThreatLabel(level, locale)
  const activeIndex = LEVEL_ORDER.indexOf(level)

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Dots */}
      <div className="flex items-center gap-1.5">
        {LEVEL_ORDER.map((lvl, i) => {
          const isActive = i <= activeIndex
          const dotColor = isActive ? getThreatColor(LEVEL_ORDER[Math.min(i, activeIndex)]) : '#2a2f3d'
          return (
            <span
              key={lvl}
              className="w-3 h-3 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: isActive ? color : dotColor,
                boxShadow: isActive ? `0 0 8px ${color}40` : 'none',
              }}
            />
          )
        })}
      </div>
      {/* Label */}
      <span
        className="text-xs font-bold tracking-wider uppercase"
        style={{ color }}
      >
        {label}
      </span>
      {/* Glow background */}
      <div
        className="absolute inset-0 rounded-lg opacity-[0.04] pointer-events-none"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}
