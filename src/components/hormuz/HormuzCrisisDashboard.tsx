'use client'

import Link from 'next/link'
import {
  Ship,
  Fuel,
  Shield,
  ArrowRight,
  Map,
  BarChart3,
  Newspaper,
  TrendingUp,
  Radio,
  Info,
} from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'
import { useHormuzRealtime } from '@/hooks/useHormuzRealtime'
import { getThreatColor, getThreatLabel } from '@/lib/hormuz/threat-level'
import { NEWS_CATEGORIES } from '@/data/hormuz/scenarios'
import { SourceMeta } from '@/components/ui/SourceMeta'
import type { HormuzDashboardData, CrisisThreatLevel, NewsSeverity } from '@/types/hormuz'

// ============================================================================
// Types & Constants
// ============================================================================

interface HormuzCrisisDashboardProps {
  readonly data: HormuzDashboardData
}

const SEVERITY_COLORS: Record<NewsSeverity, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#6b7280',
}

// ============================================================================
// Sub-components
// ============================================================================

function ThreatLevelDots({ level }: { readonly level: CrisisThreatLevel }) {
  const maxDots = 5
  const filled = level === 'CRITICAL' ? 5 : level === 'HIGH' ? 4 : level === 'ELEVATED' ? 3 : 1
  const color = getThreatColor(level)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxDots }).map((_, i) => (
        <span
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i < filled ? '' : 'opacity-20'}`}
          style={{ backgroundColor: i < filled ? color : '#4b5563' }}
        />
      ))}
    </div>
  )
}

function StatCard({
  icon,
  labelKo,
  labelEn,
  value,
  subValue,
  changePct,
  accentColor,
  locale,
}: {
  readonly icon: React.ReactNode
  readonly labelKo: string
  readonly labelEn: string
  readonly value: string
  readonly subValue?: string
  readonly changePct?: number | null
  readonly accentColor?: string
  readonly locale: string
}) {
  return (
    <div className="bg-bg3/80 border border-brd/60 rounded-lg p-4 hover:border-gold/40 transition-colors group">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-t4 group-hover:text-gold transition-colors">{icon}</span>
        <span className="text-[11px] text-t4 uppercase tracking-wide font-medium">
          {locale === 'en' ? labelEn : labelKo}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className="text-[22px] font-bold tracking-tight animate-fade-in"
          style={{ color: accentColor ?? '#e8e6e1' }}
        >
          {value}
        </span>
        {subValue && (
          <span className="text-[11px] text-t4">{subValue}</span>
        )}
      </div>
      {changePct !== null && changePct !== undefined && (
        <div className="mt-1.5 flex items-center gap-1">
          <span className={`text-[12px] font-semibold ${changePct > 0 ? 'text-accent-red' : changePct < 0 ? 'text-accent-green' : 'text-t4'}`}>
            {changePct > 0 ? '▲' : changePct < 0 ? '▼' : '—'} {changePct !== 0 ? `${Math.abs(changePct).toFixed(1)}%` : ''}
          </span>
        </div>
      )}
    </div>
  )
}

function SeverityBadge({ severity, locale }: { readonly severity: NewsSeverity | null; readonly locale: string }) {
  if (!severity) return null
  const color = SEVERITY_COLORS[severity]
  const labels: Record<NewsSeverity, { ko: string; en: string }> = {
    critical: { ko: '심각', en: 'CRIT' },
    high: { ko: '높음', en: 'HIGH' },
    medium: { ko: '중간', en: 'MED' },
    low: { ko: '낮음', en: 'LOW' },
  }

  return (
    <span
      className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase flex-shrink-0"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {locale === 'en' ? labels[severity].en : labels[severity].ko}
    </span>
  )
}

function QuickNavLink({
  href,
  icon,
  labelKo,
  labelEn,
  locale,
}: {
  readonly href: string
  readonly icon: React.ReactNode
  readonly labelKo: string
  readonly labelEn: string
  readonly locale: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-bg3/60 border border-brd/40 hover:border-gold/40 hover:bg-bg2 transition-all group"
    >
      <span className="text-t4 group-hover:text-gold transition-colors">{icon}</span>
      <span className="text-[12px] font-medium text-t2 group-hover:text-gold transition-colors">
        {locale === 'en' ? labelEn : labelKo}
      </span>
      <ArrowRight className="w-3 h-3 text-t4 group-hover:text-gold group-hover:translate-x-0.5 transition-all ml-auto" />
    </Link>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function HormuzCrisisDashboard({ data }: HormuzCrisisDashboardProps) {
  const { locale } = useLocale()
  const realtime = useHormuzRealtime()

  // Merge realtime updates
  const threatLevel = data.threatLevel
  const threatColor = getThreatColor(threatLevel)
  const threatLabel = getThreatLabel(threatLevel, locale)

  // Oil with realtime fallback
  const brent = realtime.latestOil?.benchmark === 'brent' ? realtime.latestOil : data.oil.brent
  const wti = realtime.latestOil?.benchmark === 'wti' ? realtime.latestOil : data.oil.wti

  // News: merge realtime new news with initial data
  const allNews = [
    ...realtime.newNews.filter(n => n.severity === 'critical' || n.severity === 'high'),
    ...data.latestNews,
  ]
  const uniqueNewsIds = new Set<string>()
  const topNews = allNews.filter(n => {
    if (uniqueNewsIds.has(n.id)) return false
    uniqueNewsIds.add(n.id)
    return true
  }).slice(0, 5)

  // No longer using alerts — replaced with crisis impact reference

  return (
    <section className="mb-6 animate-fade-in">
      {/* Section Header */}
      <div className="bg-bg3/60 border border-brd/50 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-brd/40 bg-bg2/50">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-glow-pulse"
              style={{ backgroundColor: threatColor }}
            />
            <h2 className="text-[15px] font-bold text-t1 tracking-tight">
              {locale === 'en' ? 'IRAN CRISIS MONITOR' : '이란 위기 모니터'}
            </h2>
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase"
                style={{ backgroundColor: `${threatColor}18`, color: threatColor }}
              >
                {threatLabel}
              </span>
              <ThreatLevelDots level={threatLevel} />
            </div>
            {realtime.connected && (
              <span className="hidden md:flex items-center gap-1 ml-2 text-[10px] text-accent-green">
                <Radio className="w-3 h-3" />
                LIVE
              </span>
            )}
          </div>
          <SourceMeta
            sourceName="Hormuz Monitor"
            asOf={new Date().toISOString().slice(0, 10)}
            method="computed"
            compact
          />
        </div>

        {/* Stat Cards Row */}
        <div className="p-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <StatCard
              icon={<Ship className="w-4 h-4" />}
              labelKo="해협 통행"
              labelEn="Strait Traffic"
              value={data.vessels.changePct !== null ? `${data.vessels.changePct > 0 ? '+' : ''}${data.vessels.changePct}%` : '—'}
              subValue={locale === 'en' ? `vs pre-crisis (${data.vessels.total} vessels)` : `vs 사태 전 (${data.vessels.total}척)`}
              accentColor={data.vessels.changePct !== null && data.vessels.changePct < -20 ? '#ef4444' : data.vessels.changePct !== null && data.vessels.changePct > 0 ? '#22c55e' : undefined}
              locale={locale}
            />
            <StatCard
              icon={<Fuel className="w-4 h-4" />}
              labelKo="브렌트유"
              labelEn="Brent"
              value={brent?.price ? `$${brent.price.toFixed(2)}` : '—'}
              changePct={brent?.change_pct}
              locale={locale}
            />
            <StatCard
              icon={<Fuel className="w-4 h-4" />}
              labelKo="WTI유"
              labelEn="WTI"
              value={wti?.price ? `$${wti.price.toFixed(2)}` : '—'}
              changePct={wti?.change_pct}
              locale={locale}
            />
            <StatCard
              icon={<Shield className="w-4 h-4" />}
              labelKo="위협 수준"
              labelEn="Threat Level"
              value={threatLabel}
              accentColor={threatColor}
              locale={locale}
            />
          </div>

          {/* Crisis Impact Reference */}
          <div className="bg-bg3/80 border border-brd/60 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-2.5">
              <Info className="w-3.5 h-3.5 text-t4" />
              <span className="text-[11px] font-semibold text-t3 uppercase tracking-wide">
                {locale === 'en' ? 'Hormuz Strait — Key Facts' : '호르무즈 해협 — 핵심 지표'}
              </span>
              <span className="ml-auto text-[9px] text-t4 italic">EIA · JP Morgan · Baltic Exchange</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-bg2/60 rounded px-2.5 py-2">
                <div className="text-[10px] text-t4 mb-0.5">{locale === 'en' ? 'Global Oil Share' : '글로벌 원유 비중'}</div>
                <div className="font-bold text-accent-red">20% (20M bbl/d)</div>
              </div>
              <div className="bg-bg2/60 rounded px-2.5 py-2">
                <div className="text-[10px] text-t4 mb-0.5">{locale === 'en' ? 'Global LNG Share' : '글로벌 LNG 비중'}</div>
                <div className="font-bold text-accent-orange">20% (290M m³/d)</div>
              </div>
              <div className="bg-bg2/60 rounded px-2.5 py-2">
                <div className="text-[10px] text-t4 mb-0.5">{locale === 'en' ? 'JPM Closure Est.' : 'JPM 봉쇄 추정'}</div>
                <div className="font-bold text-accent-red">$120–130/bbl</div>
              </div>
              <div className="bg-bg2/60 rounded px-2.5 py-2">
                <div className="text-[10px] text-t4 mb-0.5">{locale === 'en' ? 'VLCC Rate (MEG→CN)' : 'VLCC 운임 (MEG→CN)'}</div>
                <div className="font-bold text-accent-orange">
                  {(() => {
                    const vlcc = data.shippingIndicators.find(i => i.indicator_type === 'vlcc_freight_rate')
                    if (!vlcc) return '—'
                    return vlcc.unit === 'WS' ? `WS ${vlcc.value}` : `$${vlcc.value.toLocaleString()}/day`
                  })()}
                </div>
              </div>
            </div>
          </div>

            {/* Latest War News — Full Width */}
            <div className="bg-bg3/80 border border-brd/60 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Newspaper className="w-4 h-4 text-t4" />
                <span className="text-[12px] font-semibold text-t2 uppercase tracking-wide">
                  {locale === 'en' ? 'Key Developments' : '주요 상황'}
                </span>
                <span className="ml-auto text-[10px] text-t4">
                  ({topNews.length})
                </span>
              </div>
              {topNews.length > 0 ? (
                <ul className="space-y-2">
                  {topNews.map((news) => {
                    const categoryInfo = news.category ? NEWS_CATEGORIES[news.category] : null
                    return (
                      <li key={news.id} className="flex items-start gap-2">
                        <SeverityBadge severity={news.severity} locale={locale} />
                        <div className="min-w-0 flex-1">
                          {news.url ? (
                            <a
                              href={news.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] text-t2 leading-snug hover:text-gold transition-colors line-clamp-2"
                            >
                              {news.title}
                            </a>
                          ) : (
                            <p className="text-[12px] text-t2 leading-snug line-clamp-2">
                              {news.title}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-0.5">
                            {categoryInfo && (
                              <span
                                className="text-[10px]"
                                style={{ color: categoryInfo.color }}
                              >
                                {locale === 'en' ? categoryInfo.labelEn : categoryInfo.labelKo}
                              </span>
                            )}
                            <span className="text-[10px] text-t4">
                              {news.source_name}
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-[12px] text-t4 italic">
                  {locale === 'en' ? 'No critical news at this time' : '현재 주요 뉴스 없음'}
                </p>
              )}
              <Link
                href="/war-room"
                className="flex items-center gap-1 text-[11px] text-t4 hover:text-gold transition-colors mt-3 pt-2 border-t border-brd/30"
              >
                {locale === 'en' ? 'View all news' : '더 보기'}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <QuickNavLink
              href="/hormuz"
              icon={<Map className="w-4 h-4" />}
              labelKo="위기 지도"
              labelEn="Crisis Map"
              locale={locale}
            />
            <QuickNavLink
              href="/hormuz/monitor"
              icon={<BarChart3 className="w-4 h-4" />}
              labelKo="풀 모니터"
              labelEn="Full Monitor"
              locale={locale}
            />
            <QuickNavLink
              href="/hormuz/news"
              icon={<Newspaper className="w-4 h-4" />}
              labelKo="전쟁 상황실"
              labelEn="War Room"
              locale={locale}
            />
            <QuickNavLink
              href="/hormuz/market"
              icon={<TrendingUp className="w-4 h-4" />}
              labelKo="시장 영향"
              labelEn="Market Impact"
              locale={locale}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
