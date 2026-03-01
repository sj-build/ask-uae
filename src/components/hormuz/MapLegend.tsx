'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'
import { VESSEL_ICONS, EVENT_ICONS } from '@/data/hormuz/scenarios'

const VESSEL_LEGEND: { key: string; labelKo: string; labelEn: string }[] = [
  { key: 'tanker_transiting', labelKo: '유조선 (운항)', labelEn: 'Tanker (Transiting)' },
  { key: 'tanker_stopped', labelKo: '유조선 (정지)', labelEn: 'Tanker (Stopped)' },
  { key: 'tanker_u_turn', labelKo: '유조선 (유턴)', labelEn: 'Tanker (U-Turn)' },
  { key: 'lng_carrier', labelKo: 'LNG 운반선', labelEn: 'LNG Carrier' },
  { key: 'container', labelKo: '컨테이너선', labelEn: 'Container Ship' },
  { key: 'military', labelKo: '군함', labelEn: 'Military' },
  { key: 'dark_vessel', labelKo: '은닉 선박', labelEn: 'Dark Vessel' },
]

const EVENT_LEGEND_KEYS = [
  'airstrike', 'missile_launch', 'missile_intercept',
  'naval_incident', 'vessel_seizure', 'explosion',
  'military_deployment', 'port_closure',
]

export function MapLegend() {
  const { locale } = useLocale()
  const isKo = locale === 'ko'
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="absolute bottom-6 left-3 z-[1000] w-[200px]">
      <div className="bg-[#12131a]/95 backdrop-blur-sm border border-[#2a2b35] rounded-lg overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#1a1b23] transition-colors"
        >
          <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
            {isKo ? '범례' : 'Legend'}
          </span>
          {expanded
            ? <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            : <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
          }
        </button>

        {expanded && (
          <div className="px-3 pb-3 space-y-3">
            {/* Vessels */}
            <div>
              <div className="text-[10px] font-semibold text-[#c8a44e] uppercase tracking-wider mb-1.5">
                {isKo ? '선박' : 'Vessels'}
              </div>
              <div className="space-y-1">
                {VESSEL_LEGEND.map((item) => {
                  const meta = VESSEL_ICONS[item.key]
                  return (
                    <div key={item.key} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: meta?.color ?? '#94a3b8' }}
                      />
                      <span className="text-[10px] text-gray-400">
                        {isKo ? item.labelKo : item.labelEn}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-[#2a2b35]" />

            {/* Events */}
            <div>
              <div className="text-[10px] font-semibold text-[#c8a44e] uppercase tracking-wider mb-1.5">
                {isKo ? '이벤트' : 'Events'}
              </div>
              <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
                {EVENT_LEGEND_KEYS.map((key) => {
                  const meta = EVENT_ICONS[key]
                  if (!meta) return null
                  return (
                    <div key={key} className="flex items-center gap-1">
                      <span className="text-xs">{meta.icon}</span>
                      <span className="text-[9px] text-gray-400 truncate">
                        {isKo ? meta.labelKo : meta.labelEn}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Zones */}
            <div className="border-t border-[#2a2b35]" />
            <div>
              <div className="text-[10px] font-semibold text-[#c8a44e] uppercase tracking-wider mb-1.5">
                {isKo ? '보안 구역' : 'Zones'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-red-500 rounded" />
                  <span className="text-[10px] text-gray-400">{isKo ? '호르무즈 해협' : 'Hormuz Strait'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-orange-500 rounded" />
                  <span className="text-[10px] text-gray-400">{isKo ? '페르시아만' : 'Persian Gulf'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-yellow-500 rounded" />
                  <span className="text-[10px] text-gray-400">{isKo ? '오만만' : 'Gulf of Oman'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
