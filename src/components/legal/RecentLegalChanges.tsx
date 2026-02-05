'use client'

import { useState } from 'react'
import { timelineEvents as timelineEventsKo } from '@/data/legal/legal-data'
import { timelineEvents as timelineEventsEn } from '@/data/legal/legal-data.en'
import type { TimelineEvent } from '@/data/legal/legal-data'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const IMPACT_CONFIG = {
  high: {
    label: 'HIGH',
    dotSize: 'w-3.5 h-3.5',
    ringSize: 'w-7 h-7',
    color: '#c8a44e',
    bgColor: 'rgba(200, 164, 78, 0.08)',
  },
  medium: {
    label: 'MED',
    dotSize: 'w-2.5 h-2.5',
    ringSize: 'w-6 h-6',
    color: '#4a9eff',
    bgColor: 'rgba(74, 158, 255, 0.06)',
  },
  low: {
    label: 'LOW',
    dotSize: 'w-2 h-2',
    ringSize: 'w-5 h-5',
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.04)',
  },
} as const

function getUniqueYears(events: readonly TimelineEvent[]): readonly number[] {
  const seen = new Set<number>()
  return events.reduce<readonly number[]>((acc, event) => {
    if (seen.has(event.year)) return acc
    seen.add(event.year)
    return [...acc, event.year]
  }, [])
}

function TimelineItem({
  event,
  isActive,
  onSelect,
  showYearMarker,
}: {
  readonly event: TimelineEvent
  readonly isActive: boolean
  readonly onSelect: () => void
  readonly showYearMarker: boolean
}) {
  const impact = IMPACT_CONFIG[event.impact]

  return (
    <div className="relative">
      {/* Year marker */}
      {showYearMarker && (
        <div className="flex items-center gap-3 mb-4 ml-[-2px]">
          <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center">
            <span className="text-xs font-bold text-gold">{event.year}</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
        </div>
      )}

      {/* Timeline item */}
      <button
        onClick={onSelect}
        className="w-full text-left group"
      >
        <div className="flex gap-4">
          {/* Timeline line + dot */}
          <div className="flex flex-col items-center shrink-0 pt-1">
            <div
              className={`${impact.ringSize} rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive ? 'animate-glow-pulse' : ''
              }`}
              style={{
                backgroundColor: isActive ? `${impact.color}20` : 'transparent',
                border: isActive ? `1px solid ${impact.color}40` : '1px solid transparent',
              }}
            >
              <div
                className={`${impact.dotSize} rounded-full transition-all duration-300`}
                style={{
                  backgroundColor: impact.color,
                  boxShadow: isActive ? `0 0 12px ${impact.color}60` : 'none',
                }}
              />
            </div>
            <div className="w-px flex-1 min-h-[20px] bg-gradient-to-b from-brd to-transparent" />
          </div>

          {/* Content */}
          <div
            className={`flex-1 pb-6 border rounded-xl p-4 mb-2 transition-all duration-300 ease-out ${
              isActive
                ? 'border-brd2 bg-bg3'
                : 'border-transparent bg-transparent group-hover:bg-bg3/40 group-hover:border-brd/50'
            }`}
            style={{
              backgroundColor: isActive ? impact.bgColor : undefined,
            }}
          >
            {/* Meta row */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {event.month && (
                <span className="text-[10px] text-t4 font-medium">
                  {event.year}.{event.month}
                </span>
              )}
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${event.categoryColor}15`,
                  color: event.categoryColor,
                  border: `1px solid ${event.categoryColor}30`,
                }}
              >
                {event.category}
              </span>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider"
                style={{
                  color: impact.color,
                  backgroundColor: `${impact.color}10`,
                }}
              >
                {impact.label}
              </span>
            </div>

            {/* Title */}
            <div
              className={`text-sm font-semibold mb-1.5 transition-colors duration-300 ${
                isActive ? 'text-t1' : 'text-t2 group-hover:text-t1'
              }`}
            >
              {event.title}
            </div>

            {/* Description (expanded when active) */}
            {isActive && (
              <p className="text-xs text-t3 leading-relaxed animate-fade-in">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </button>
    </div>
  )
}

function YearFilter({
  years,
  activeYear,
  onSelect,
}: {
  readonly years: readonly number[]
  readonly activeYear: number | null
  readonly onSelect: (year: number | null) => void
}) {
  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      <span className="text-[10px] text-t4 uppercase tracking-wider font-medium mr-1">
        Filter
      </span>
      <button
        onClick={() => onSelect(null)}
        className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
          activeYear === null
            ? 'border-gold/40 bg-gold/10 text-gold'
            : 'border-brd bg-bg3/60 text-t3 hover:border-brd2 hover:text-t2'
        }`}
      >
        All
      </button>
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onSelect(year)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
            activeYear === year
              ? 'border-gold/40 bg-gold/10 text-gold'
              : 'border-brd bg-bg3/60 text-t3 hover:border-brd2 hover:text-t2'
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  )
}

export function RecentLegalChanges() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [filterYear, setFilterYear] = useState<number | null>(null)
  const timelineEvents = useLocalizedData(timelineEventsKo, timelineEventsEn)

  const years = getUniqueYears(timelineEvents)
  const filteredEvents = filterYear === null
    ? timelineEvents
    : timelineEvents.filter((event) => event.year === filterYear)

  const seenYears = new Set<number>()

  return (
    <div className="mb-8">
      {/* Year filter */}
      <YearFilter
        years={years}
        activeYear={filterYear}
        onSelect={setFilterYear}
      />

      {/* Timeline */}
      <div className="relative ml-2">
        {filteredEvents.map((event, index) => {
          const showYearMarker = !seenYears.has(event.year)
          if (showYearMarker) {
            seenYears.add(event.year)
          }

          return (
            <TimelineItem
              key={`${event.year}-${event.title}`}
              event={event}
              isActive={activeIndex === index}
              onSelect={() => setActiveIndex(index)}
              showYearMarker={showYearMarker}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 ml-2">
        <span className="text-[10px] text-t4 uppercase tracking-wider">Impact:</span>
        {Object.entries(IMPACT_CONFIG).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className={`${config.dotSize} rounded-full`}
              style={{ backgroundColor: config.color }}
            />
            <span className="text-[10px] text-t4">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
