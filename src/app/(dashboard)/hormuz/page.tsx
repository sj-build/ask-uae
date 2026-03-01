'use client'

import { useState, useEffect } from 'react'
import { useLocale } from '@/hooks/useLocale'
import { useHormuzRealtime } from '@/hooks/useHormuzRealtime'
import { StatCard } from '@/components/hormuz/StatCard'
import { ThreatGauge } from '@/components/hormuz/ThreatGauge'
import { TrafficChart } from '@/components/hormuz/TrafficChart'
import { OilPriceChart } from '@/components/hormuz/OilPriceChart'
import {
  getHormuzDashboardData,
  getTrafficHistory,
  getOilPriceHistory,
} from '@/lib/hormuz/queries'
import type {
  HormuzDashboardData,
  TrafficSummary,
  OilPrice,
  MaritimeAlert,
  ShippingIndicator,
} from '@/types/hormuz'
import { getThreatColor, getThreatLabel } from '@/lib/hormuz/threat-level'

type TrafficView = 'hourly' | 'daily'
type OilRange = '1D' | '1W' | '1M'

const OIL_RANGE_LIMITS: Record<OilRange, number> = {
  '1D': 288,
  '1W': 2016,
  '1M': 8640,
}

export default function HormuzMonitorPage() {
  const { locale, t } = useLocale()
  const realtime = useHormuzRealtime()

  const [dashboard, setDashboard] = useState<HormuzDashboardData | null>(null)
  const [trafficHistory, setTrafficHistory] = useState<TrafficSummary[]>([])
  const [brentHistory, setBrentHistory] = useState<OilPrice[]>([])
  const [wtiHistory, setWtiHistory] = useState<OilPrice[]>([])
  const [trafficView, setTrafficView] = useState<TrafficView>('hourly')
  const [oilRange, setOilRange] = useState<OilRange>('1D')
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch initial data
  useEffect(() => {
    async function load() {
      try {
        const [dash, traffic, brent, wti] = await Promise.all([
          getHormuzDashboardData(),
          getTrafficHistory('hourly', 72),
          getOilPriceHistory('brent', 288),
          getOilPriceHistory('wti', 288),
        ])
        setDashboard(dash)
        setTrafficHistory(traffic)
        setBrentHistory(brent)
        setWtiHistory(wti)
      } catch (err) {
        console.error('Failed to load Hormuz data:', err)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  // Reload traffic when view changes
  useEffect(() => {
    async function reload() {
      const limit = trafficView === 'hourly' ? 72 : 30
      const data = await getTrafficHistory(trafficView, limit)
      setTrafficHistory(data)
    }
    void reload()
  }, [trafficView])

  // Reload oil when range changes
  useEffect(() => {
    async function reload() {
      const limit = OIL_RANGE_LIMITS[oilRange]
      const [brent, wti] = await Promise.all([
        getOilPriceHistory('brent', limit),
        getOilPriceHistory('wti', limit),
      ])
      setBrentHistory(brent)
      setWtiHistory(wti)
    }
    void reload()
  }, [oilRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-t4 text-sm animate-pulse">
          {locale === 'en' ? 'Loading Hormuz data...' : '호르무즈 데이터 로딩 중...'}
        </div>
      </div>
    )
  }

  if (!dashboard) return null

  const brentPrice = dashboard.oil.brent
  const wtiPrice = dashboard.oil.wti

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚓</span>
        <div>
          <h1 className="text-lg font-bold text-t1 tracking-tight">{t.pages.hormuz.title}</h1>
          <p className="text-sm text-t4">{t.pages.hormuz.subtitle}</p>
        </div>
        {realtime.connected && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      {/* Section 1: Overview Cards */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Threat Level */}
          <div className="relative bg-bg3/80 border border-brd/60 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
            <span className="text-[11px] text-t4 font-medium uppercase tracking-wide">
              {t.pages.hormuz.threatLevel}
            </span>
            <ThreatGauge level={dashboard.threatLevel} />
          </div>

          <StatCard
            icon="🚢"
            label={locale === 'en' ? 'Vessel Traffic' : '선박 통행량'}
            value={dashboard.vessels.total.toLocaleString()}
            changePct={dashboard.vessels.changePct}
            suffix={locale === 'en' ? 'vessels' : '척'}
          />

          <StatCard
            icon="🛢️"
            label="Brent Crude"
            value={brentPrice ? `$${brentPrice.price.toFixed(2)}` : 'N/A'}
            changePct={brentPrice?.change_pct}
          />

          <StatCard
            icon="🛢️"
            label="WTI"
            value={wtiPrice ? `$${wtiPrice.price.toFixed(2)}` : 'N/A'}
            changePct={wtiPrice?.change_pct}
          />
        </div>
      </section>

      {/* Section 2: Traffic Chart */}
      <section>
        <div className="bg-bg3/80 border border-brd/60 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <h2 className="text-[14px] font-bold text-t1">{t.pages.hormuz.traffic}</h2>
            </div>
            <div className="flex gap-1">
              {(['hourly', 'daily'] as const).map(view => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setTrafficView(view)}
                  className={`px-3 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    trafficView === view
                      ? 'bg-gold/15 text-gold'
                      : 'text-t4 hover:text-t2 hover:bg-bg2'
                  }`}
                >
                  {view === 'hourly'
                    ? (locale === 'en' ? '24H' : '24시간')
                    : (locale === 'en' ? '7D' : '7일')}
                </button>
              ))}
            </div>
          </div>
          <TrafficChart data={trafficHistory} />
        </div>
      </section>

      {/* Section 3: Oil Price Chart */}
      <section>
        <div className="bg-bg3/80 border border-brd/60 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <h2 className="text-[14px] font-bold text-t1">{t.pages.hormuz.oilPrices}</h2>
            </div>
            <div className="flex gap-1">
              {(['1D', '1W', '1M'] as const).map(range => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setOilRange(range)}
                  className={`px-3 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    oilRange === range
                      ? 'bg-gold/15 text-gold'
                      : 'text-t4 hover:text-t2 hover:bg-bg2'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <OilPriceChart brentHistory={brentHistory} wtiHistory={wtiHistory} />
        </div>
      </section>

      {/* Section 4: Active Maritime Alerts */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🚨</span>
          <h2 className="text-[14px] font-bold text-t1">{t.pages.hormuz.alerts}</h2>
          <span className="text-[11px] text-t4">({dashboard.latestAlerts.length})</span>
        </div>
        <div className="space-y-3">
          {dashboard.latestAlerts.length === 0 ? (
            <div className="bg-bg3/80 border border-brd/60 rounded-lg p-6 text-center text-t4 text-sm">
              {locale === 'en' ? 'No active alerts' : '활성 알림 없음'}
            </div>
          ) : (
            dashboard.latestAlerts.map((alert: MaritimeAlert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                locale={locale}
                expanded={expandedAlert === alert.id}
                onToggle={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
              />
            ))
          )}
        </div>
      </section>

      {/* Section 5: Shipping Market Indicators */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📈</span>
          <h2 className="text-[14px] font-bold text-t1">{t.pages.hormuz.shipping}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dashboard.shippingIndicators.map((ind: ShippingIndicator) => (
            <div
              key={ind.id}
              className="bg-bg3/80 border border-brd/60 rounded-lg p-4"
            >
              <div className="text-[10px] text-t4 uppercase tracking-wide mb-1">
                {ind.indicator_name ?? ind.indicator_type.replace(/_/g, ' ')}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-t1">
                  {ind.value.toLocaleString()}
                </span>
                {ind.unit && <span className="text-[11px] text-t4">{ind.unit}</span>}
              </div>
              {ind.change_pct != null && (
                <div className={`text-xs font-semibold mt-1 ${ind.change_pct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {ind.change_pct >= 0 ? '▲' : '▼'} {Math.abs(ind.change_pct).toFixed(1)}%
                </div>
              )}
              {ind.notes && (
                <div className="text-[10px] text-t4 mt-1">{ind.notes}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// -- Alert sub-component --
function AlertCard({
  alert,
  locale,
  expanded,
  onToggle,
}: {
  readonly alert: MaritimeAlert
  readonly locale: string
  readonly expanded: boolean
  readonly onToggle: () => void
}) {
  const threatColor = alert.threat_level
    ? getThreatColor(alert.threat_level.toUpperCase() as 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW')
    : '#6b7280'

  return (
    <div className="bg-bg3/80 border border-brd/60 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 text-left flex items-start gap-3 cursor-pointer"
      >
        <span
          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
          style={{ backgroundColor: threatColor }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: threatColor }}>
              {alert.threat_level ?? 'unknown'}
            </span>
            <span className="text-[10px] text-t4">{alert.source}</span>
            {alert.published_at && (
              <span className="text-[10px] text-t4 ml-auto">
                {new Date(alert.published_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'ko-KR')}
              </span>
            )}
          </div>
          <h3 className="text-[13px] font-semibold text-t1 leading-snug">{alert.title}</h3>
          {alert.summary && (
            <p className="text-[12px] text-t3 mt-1 line-clamp-2">{alert.summary}</p>
          )}
        </div>
      </button>
      {expanded && alert.full_text && (
        <div className="px-4 pb-4 pt-0 border-t border-brd/40 mx-4 mb-2">
          <p className="text-[12px] text-t3 leading-relaxed whitespace-pre-wrap">{alert.full_text}</p>
        </div>
      )}
    </div>
  )
}
