'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, AlertTriangle, Ship, Fuel, ArrowRight, ShieldCheck } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'
import { getThreatColor, getThreatLabel } from '@/lib/hormuz/threat-level'
import type { HormuzDashboardData, CrisisThreatLevel } from '@/types/hormuz'

interface HormuzCrisisBannerProps {
  readonly data: HormuzDashboardData
}

function ThreatDots({ level }: { readonly level: CrisisThreatLevel }) {
  const filled = level === 'CRITICAL' ? 4 : level === 'HIGH' ? 3 : level === 'ELEVATED' ? 2 : 1
  const color = getThreatColor(level)

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full transition-all ${i < filled ? 'animate-glow-pulse' : 'opacity-30'}`}
          style={{ backgroundColor: i < filled ? color : '#6b7280' }}
        />
      ))}
    </div>
  )
}

export function HormuzCrisisBanner({ data }: HormuzCrisisBannerProps) {
  const { locale } = useLocale()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const { threatLevel, vessels, oil, latestNews } = data
  const isElevatedOrHigher = threatLevel !== 'LOW'
  const threatColor = getThreatColor(threatLevel)
  const threatLabel = getThreatLabel(threatLevel, locale)

  // Low threat: subtle green indicator
  if (!isElevatedOrHigher) {
    return (
      <div className="mb-4 animate-fade-in">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-green/[0.06] border border-accent-green/20">
          <ShieldCheck className="w-4 h-4 text-accent-green flex-shrink-0" />
          <span className="text-[12px] font-medium text-accent-green">
            {locale === 'en' ? 'Hormuz Strait: Normal Operations' : '호르무즈 해협: 정상 운항'}
          </span>
          <ThreatDots level={threatLevel} />
          <Link
            href="/hormuz"
            className="ml-auto text-[11px] text-t4 hover:text-accent-green transition-colors flex items-center gap-1"
          >
            {locale === 'en' ? 'Monitor' : '모니터'}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    )
  }

  // Elevated or higher: full alert banner
  const bgColor = threatLevel === 'CRITICAL'
    ? 'bg-accent-red/[0.08] border-accent-red/30'
    : threatLevel === 'HIGH'
      ? 'bg-accent-orange/[0.08] border-accent-orange/30'
      : 'bg-yellow-500/[0.06] border-yellow-500/25'

  const latestHeadline = latestNews[0]?.title ?? (locale === 'en' ? 'No recent alerts' : '최근 경보 없음')
  const brentPrice = oil.brent?.price ? `$${oil.brent.price.toFixed(2)}` : '—'
  const brentChange = oil.brent?.change_pct

  return (
    <div className="mb-4 animate-fade-in">
      <div className={`relative rounded-lg border ${bgColor} overflow-hidden`}>
        {/* Pulsing accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] animate-glow-pulse"
          style={{ backgroundColor: threatColor }}
        />

        <div className="px-4 py-3">
          {/* Top row: threat level + dismiss */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: threatColor }} />
              <span className="text-[13px] font-bold tracking-tight" style={{ color: threatColor }}>
                {locale === 'en' ? 'HORMUZ CRISIS ALERT' : '호르무즈 위기 경보'}
              </span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase"
                style={{ backgroundColor: `${threatColor}20`, color: threatColor }}
              >
                {threatLabel}
              </span>
              <ThreatDots level={threatLevel} />
            </div>

            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded hover:bg-bg3/60 text-t4 hover:text-t2 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-4 text-[12px]">
            <div className="flex items-center gap-1.5 text-t2">
              <Ship className="w-3.5 h-3.5 text-t4" />
              <span className="font-semibold text-t1">{vessels.total}</span>
              <span className="text-t4">{locale === 'en' ? 'vessels/24h' : '척/24h'}</span>
              {vessels.changePct !== null && (
                <span className={vessels.changePct < 0 ? 'text-accent-red' : 'text-accent-green'}>
                  {vessels.changePct > 0 ? '▲' : '▼'} {Math.abs(vessels.changePct).toFixed(0)}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-t2">
              <Fuel className="w-3.5 h-3.5 text-t4" />
              <span className="text-t4">Brent</span>
              <span className="font-semibold text-t1">{brentPrice}</span>
              {brentChange !== null && brentChange !== undefined && (
                <span className={brentChange > 0 ? 'text-accent-red' : 'text-accent-green'}>
                  {brentChange > 0 ? '▲' : '▼'} {Math.abs(brentChange).toFixed(1)}%
                </span>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-t3 min-w-0 flex-1">
              <span className="truncate">{latestHeadline}</span>
            </div>

            <Link
              href="/hormuz"
              className="ml-auto flex items-center gap-1 text-[11px] font-semibold hover:opacity-80 transition-opacity"
              style={{ color: threatColor }}
            >
              {locale === 'en' ? 'View Details' : '상세보기'}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
