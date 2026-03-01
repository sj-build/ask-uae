'use client'

import { useState } from 'react'
import { Ship, Anchor, RotateCcw, Eye, EyeOff, AlertTriangle, Clock, ChevronRight, ChevronLeft } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'
import { EVENT_ICONS } from '@/data/hormuz/scenarios'
import type { VesselPosition, MapEvent } from '@/types/hormuz'

interface MapSidebarProps {
  readonly vessels: VesselPosition[]
  readonly events: MapEvent[]
  readonly lastUpdate: Date | null
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60_000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  } catch {
    return dateStr
  }
}

function getSeverityBadge(severity: string | null) {
  const colors: Record<string, string> = {
    critical: 'bg-red-500/15 text-red-400',
    high: 'bg-orange-500/15 text-orange-400',
    medium: 'bg-yellow-500/15 text-yellow-400',
    low: 'bg-green-500/15 text-green-400',
  }
  if (!severity) return null
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${colors[severity] ?? 'bg-gray-500/15 text-gray-400'}`}>
      {severity}
    </span>
  )
}

export function MapSidebar({ vessels, events, lastUpdate }: MapSidebarProps) {
  const { locale } = useLocale()
  const isKo = locale === 'ko'
  const [isOpen, setIsOpen] = useState(true)

  // Compute stats
  const tankerCount = vessels.filter(v => v.vessel_type === 'tanker').length
  const stoppedCount = vessels.filter(v => v.status === 'stopped').length
  const uTurnCount = vessels.filter(v => v.status === 'u_turn').length
  const darkCount = vessels.filter(v => v.status === 'dark').length

  const stats = [
    { labelKo: '총 선박', labelEn: 'Total', value: vessels.length, icon: <Ship className="w-3.5 h-3.5" />, color: '#c8a44e' },
    { labelKo: '유조선', labelEn: 'Tankers', value: tankerCount, icon: <Anchor className="w-3.5 h-3.5" />, color: '#22c55e' },
    { labelKo: '정지', labelEn: 'Stopped', value: stoppedCount, icon: <AlertTriangle className="w-3.5 h-3.5" />, color: '#ef4444' },
    { labelKo: '유턴', labelEn: 'U-Turns', value: uTurnCount, icon: <RotateCcw className="w-3.5 h-3.5" />, color: '#eab308' },
  ]

  // Sort events by date descending
  const sortedEvents = [...events].sort((a, b) =>
    new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  )

  return (
    <>
      {/* Toggle button (always visible) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-3 right-[196px] z-[1000] bg-[#12131a]/95 backdrop-blur-sm border border-[#2a2b35] rounded-lg p-2 hover:bg-[#1a1b23] transition-colors md:hidden"
        title={isOpen ? (isKo ? '사이드바 닫기' : 'Close sidebar') : (isKo ? '사이드바 열기' : 'Open sidebar')}
      >
        {isOpen ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
      </button>

      {/* Sidebar panel — desktop: right side, mobile: bottom sheet */}
      <div
        className={`
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          transition-transform duration-300 ease-in-out
          fixed md:absolute top-0 right-0 z-[999]
          w-full md:w-[280px] h-full
          md:top-0 md:bottom-0
          flex flex-col
          bg-[#0c0d14]/98 backdrop-blur-md
          border-l border-[#2a2b35]
          md:rounded-none
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2b35] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">📡</span>
            <h3 className="text-[13px] font-bold text-gray-200">
              {isKo ? '실시간 모니터링' : 'Live Monitor'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdate && (
              <span className="text-[9px] text-gray-500 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {lastUpdate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-300 transition-colors md:hidden"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Traffic Stats */}
        <div className="px-4 py-3 border-b border-[#2a2b35] shrink-0">
          <div className="text-[10px] font-semibold text-[#c8a44e] uppercase tracking-wider mb-2">
            {isKo ? '해상 교통' : 'Maritime Traffic'}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.labelEn}
                className="bg-[#12131a] border border-[#2a2b35] rounded-md px-2.5 py-2 flex flex-col"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-wide">
                    {isKo ? stat.labelKo : stat.labelEn}
                  </span>
                </div>
                <span className="text-lg font-bold tabular-nums" style={{ color: stat.color }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
          {darkCount > 0 && (
            <div className="mt-2 flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded text-[10px]">
              <Eye className="w-3 h-3 text-gray-500" />
              <span className="text-gray-400">
                {isKo ? '은닉 선박' : 'Dark vessels'}: <span className="text-gray-300 font-medium">{darkCount}</span>
              </span>
            </div>
          )}
        </div>

        {/* Event Timeline */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="px-4 py-2.5 border-b border-[#2a2b35] shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold text-[#c8a44e] uppercase tracking-wider">
                {isKo ? '이벤트 타임라인' : 'Event Timeline'}
              </div>
              <span className="text-[9px] text-gray-500">
                {sortedEvents.length} {isKo ? '건' : 'events'}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2a2b35]">
            {sortedEvents.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <EyeOff className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-[11px] text-gray-500">
                  {isKo ? '활성 이벤트 없음' : 'No active events'}
                </p>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-1">
                {sortedEvents.map((evt) => {
                  const meta = EVENT_ICONS[evt.event_type]
                  return (
                    <div
                      key={evt.id}
                      className="group px-2.5 py-2 rounded-md hover:bg-[#1a1b23] transition-colors cursor-default border border-transparent hover:border-[#2a2b35]"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-sm mt-0.5 shrink-0">{meta?.icon ?? '📍'}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[11px] font-medium text-gray-200 truncate">
                              {evt.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {getSeverityBadge(evt.severity)}
                            {evt.is_verified && (
                              <span className="text-[8px] text-emerald-400/80">✓</span>
                            )}
                            <span className="text-[9px] text-gray-500 ml-auto shrink-0">
                              {formatRelativeTime(evt.event_date)}
                            </span>
                          </div>
                          {evt.description && (
                            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed line-clamp-2">
                              {evt.description}
                            </p>
                          )}
                          {evt.location_name && (
                            <p className="text-[9px] text-gray-600 mt-0.5">
                              📍 {evt.location_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
