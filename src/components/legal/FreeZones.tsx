'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { freeZones as freeZonesKo, freeZoneProsCons as freeZoneProsConsKo } from '@/data/legal/legal-data'
import { freeZones as freeZonesEn, freeZoneProsCons as freeZoneProsConsEn } from '@/data/legal/legal-data.en'
import type { FreeZone, FreeZoneProCon } from '@/data/legal/legal-data'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function FreeZoneCard({
  zone,
  isActive,
  onSelect,
}: {
  readonly zone: FreeZone
  readonly isActive: boolean
  readonly onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left transition-all duration-300 ease-out"
    >
      <div
        className={`relative border rounded-xl p-5 h-full transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
          isActive
            ? 'border-brd2 bg-bg3 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'border-brd bg-bg3/60 hover:border-brd2 hover:bg-bg3/80'
        }`}
        style={{
          boxShadow: isActive
            ? `inset 0 0 40px ${zone.glowColor}, 0 4px 30px rgba(0,0,0,0.3)`
            : undefined,
        }}
      >
        {/* Glow accent top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
          style={{
            backgroundColor: zone.color,
            opacity: isActive ? 1 : 0.3,
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div
              className="text-lg font-display font-bold tracking-tight"
              style={{ color: isActive ? zone.color : '#e8e6e1' }}
            >
              {zone.name}
            </div>
            <div className="text-[10px] text-t4 mt-0.5">{zone.location}</div>
          </div>
          <span
            className="text-[10px] px-2.5 py-1 rounded-full font-medium shrink-0"
            style={{
              backgroundColor: `${zone.color}15`,
              color: zone.color,
              border: `1px solid ${zone.color}30`,
            }}
          >
            {zone.specialty}
          </span>
        </div>

        {/* Full name */}
        <div className="text-[11px] text-t3 mb-3 leading-relaxed">
          {zone.fullName}
        </div>

        {/* Stats */}
        <div className="space-y-1.5 mb-4">
          {zone.stats.map((stat) => (
            <div key={stat} className="flex items-center gap-2 text-xs text-t2">
              <span
                className="w-1 h-1 rounded-full shrink-0"
                style={{ backgroundColor: zone.color }}
              />
              {stat}
            </div>
          ))}
        </div>

        {/* Advantages (shown when active) */}
        {isActive && (
          <div className="pt-3 border-t border-brd animate-fade-in">
            <div className="text-[10px] text-t4 uppercase tracking-wider mb-2 font-medium">
              Key Advantages
            </div>
            <div className="space-y-1.5">
              {zone.advantages.map((adv) => (
                <div key={adv} className="flex items-center gap-2 text-xs text-t2">
                  <span className="text-[10px]" style={{ color: zone.color }}>+</span>
                  {adv}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </button>
  )
}

function ProConItem({ item }: { readonly item: FreeZoneProCon }) {
  const isPro = item.type === 'pro'
  return (
    <div className="flex items-center gap-2.5 text-sm text-t2">
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
          isPro
            ? 'bg-accent-green/15 text-accent-green border border-accent-green/30'
            : 'bg-accent-red/15 text-accent-red border border-accent-red/30'
        }`}
      >
        {isPro ? '+' : '-'}
      </span>
      <span className="leading-relaxed">{item.text}</span>
    </div>
  )
}

export function FreeZones() {
  const [activeIndex, setActiveIndex] = useState(0)
  const freeZones = useLocalizedData(freeZonesKo, freeZonesEn)
  const freeZoneProsCons = useLocalizedData(freeZoneProsConsKo, freeZoneProsConsEn)

  const pros = freeZoneProsCons.filter((item) => item.type === 'pro')
  const cons = freeZoneProsCons.filter((item) => item.type === 'con')

  return (
    <div className="space-y-6 mb-8">
      {/* Free zone card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {freeZones.map((zone, index) => (
          <FreeZoneCard
            key={zone.name}
            zone={zone}
            isActive={activeIndex === index}
            onSelect={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* Pros and Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-accent-green" />
              <span className="text-sm font-semibold text-t1">
                Advantages
              </span>
              <span className="text-[10px] text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-full">
                PRO
              </span>
            </div>
            <div className="space-y-3">
              {pros.map((item) => (
                <ProConItem key={item.text} item={item} />
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-sm font-semibold text-t1">
                Limitations
              </span>
              <span className="text-[10px] text-accent-red bg-accent-red/10 px-2 py-0.5 rounded-full">
                CON
              </span>
            </div>
            <div className="space-y-3">
              {cons.map((item) => (
                <ProConItem key={item.text} item={item} />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
