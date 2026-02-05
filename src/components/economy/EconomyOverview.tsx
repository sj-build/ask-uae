'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'

interface MetricCardData {
  readonly label: string
  readonly value: string
  readonly subValue?: string
  readonly comparison?: string
  readonly icon: string
  readonly gradient: string
  readonly glowColor: string
}

const metrics: readonly MetricCardData[] = [
  {
    label: 'GDP (2024)',
    value: '$537B',
    subValue: '성장률 4.0%',
    icon: '📊',
    gradient: 'from-[#c8a44e]/20 to-[#c8a44e]/5',
    glowColor: 'rgba(200, 164, 78, 0.15)',
  },
  {
    label: '1인당 GDP',
    value: '$49,500',
    comparison: '한국 $33,100의 1.5배',
    icon: '💰',
    gradient: 'from-[#34d399]/15 to-[#34d399]/5',
    glowColor: 'rgba(52, 211, 153, 0.12)',
  },
  {
    label: '무역규모 (2024)',
    value: '$1.42T',
    comparison: '한국보다 큼',
    icon: '🌐',
    gradient: 'from-[#4a9eff]/15 to-[#4a9eff]/5',
    glowColor: 'rgba(74, 158, 255, 0.12)',
  },
  {
    label: 'SWF 총자산',
    value: '$2.5T+',
    comparison: '한국 GDP의 1.5배',
    icon: '🏦',
    gradient: 'from-[#a78bfa]/15 to-[#a78bfa]/5',
    glowColor: 'rgba(167, 139, 250, 0.12)',
  },
  {
    label: '인플레이션',
    value: '1.6%',
    subValue: '안정적 물가',
    icon: '📉',
    gradient: 'from-[#22d3ee]/15 to-[#22d3ee]/5',
    glowColor: 'rgba(34, 211, 238, 0.12)',
  },
  {
    label: '실업률',
    value: '2.1%',
    subValue: '사실상 완전고용',
    icon: '👥',
    gradient: 'from-[#f59e0b]/15 to-[#f59e0b]/5',
    glowColor: 'rgba(245, 158, 11, 0.12)',
  },
] as const

function MetricCard({ metric }: { readonly metric: MetricCardData }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card>
      <div
        className={`relative p-5 bg-gradient-to-br ${metric.gradient} transition-all duration-300`}
        style={{
          boxShadow: isHovered ? `inset 0 0 40px ${metric.glowColor}` : 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs text-t3 font-medium tracking-wide uppercase">
            {metric.label}
          </span>
          <span className="text-lg">{metric.icon}</span>
        </div>
        <div className="font-display text-3xl font-black text-t1 mb-1 tracking-tight">
          {metric.value}
        </div>
        {metric.subValue && (
          <div className="text-sm text-gold font-semibold">{metric.subValue}</div>
        )}
        {metric.comparison && (
          <div className="mt-2 inline-block text-[11px] text-t2 bg-bg/60 px-2.5 py-1 rounded-full border border-brd">
            vs. {metric.comparison}
          </div>
        )}
      </div>
    </Card>
  )
}

export function EconomyOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </div>
  )
}
