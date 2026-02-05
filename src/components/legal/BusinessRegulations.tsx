'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Collapsible } from '@/components/ui/Collapsible'
import { taxMetrics as taxMetricsKo, regulations as regulationsKo } from '@/data/legal/legal-data'
import { taxMetrics as taxMetricsEn, regulations as regulationsEn } from '@/data/legal/legal-data.en'
import type { TaxMetric, RegulationItem } from '@/data/legal/legal-data'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function TaxMetricCard({ metric }: { readonly metric: TaxMetric }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card>
      <div
        className="relative p-5 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${metric.color}15 0%, ${metric.color}05 100%)`,
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
        <div
          className="font-display text-4xl font-black mb-1 tracking-tight"
          style={{ color: metric.color }}
        >
          {metric.value}
        </div>
        <div className="text-xs text-t3 leading-relaxed">{metric.subLabel}</div>
      </div>
    </Card>
  )
}

function RegulationCard({ regulation }: { readonly regulation: RegulationItem }) {
  return (
    <Collapsible
      header={
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xl shrink-0">{regulation.icon}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-t1">{regulation.title}</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${regulation.badgeColor}18`,
                  color: regulation.badgeColor,
                  border: `1px solid ${regulation.badgeColor}30`,
                }}
              >
                {regulation.category}
              </span>
            </div>
            <p className="text-xs text-t3 truncate">{regulation.description}</p>
          </div>
        </div>
      }
    >
      <ul className="space-y-2">
        {regulation.details.map((detail) => (
          <li key={detail} className="flex items-start gap-2.5 text-sm text-t2">
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: regulation.badgeColor }}
            />
            <span className="leading-relaxed">{detail}</span>
          </li>
        ))}
      </ul>
    </Collapsible>
  )
}

export function BusinessRegulations() {
  const taxMetrics = useLocalizedData(taxMetricsKo, taxMetricsEn)
  const regulations = useLocalizedData(regulationsKo, regulationsEn)

  return (
    <div className="space-y-6 mb-8">
      {/* Tax metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {taxMetrics.map((metric) => (
          <TaxMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* Regulation detail cards */}
      <div className="space-y-0">
        {regulations.map((regulation) => (
          <RegulationCard key={regulation.title} regulation={regulation} />
        ))}
      </div>
    </div>
  )
}
