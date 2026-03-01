'use client'

import { useState, useEffect } from 'react'
import { useLocale } from '@/hooks/useLocale'
import { OilPriceChart } from '@/components/hormuz/OilPriceChart'
import { ScenarioCard } from '@/components/hormuz/ScenarioCard'
import {
  getOilPriceHistory,
  getLatestOilPrices,
  getShippingIndicators,
} from '@/lib/hormuz/queries'
import { WAR_SCENARIOS } from '@/data/hormuz/scenarios'
import type { OilPrice, ShippingIndicator } from '@/types/hormuz'

type OilRange = '1D' | '1W' | '1M' | '3M'

const OIL_RANGE_LIMITS: Record<OilRange, number> = {
  '1D': 288,
  '1W': 2016,
  '1M': 8640,
  '3M': 25920,
}

export default function MarketImpactPage() {
  const { locale, t } = useLocale()

  const [brentHistory, setBrentHistory] = useState<OilPrice[]>([])
  const [wtiHistory, setWtiHistory] = useState<OilPrice[]>([])
  const [oilPrices, setOilPrices] = useState<{ brent: OilPrice | null; wti: OilPrice | null }>({ brent: null, wti: null })
  const [indicators, setIndicators] = useState<ShippingIndicator[]>([])
  const [oilRange, setOilRange] = useState<OilRange>('1W')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [brent, wti, prices, inds] = await Promise.all([
          getOilPriceHistory('brent', OIL_RANGE_LIMITS['1W']),
          getOilPriceHistory('wti', OIL_RANGE_LIMITS['1W']),
          getLatestOilPrices(),
          getShippingIndicators(),
        ])
        setBrentHistory(brent)
        setWtiHistory(wti)
        setOilPrices(prices)
        setIndicators(inds)
      } catch (err) {
        console.error('Failed to load market impact data:', err)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

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
          {locale === 'en' ? 'Loading market impact...' : '시장 영향 데이터 로딩 중...'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">💹</span>
        <div>
          <h1 className="text-lg font-bold text-t1 tracking-tight">{t.pages.marketImpact.title}</h1>
          <p className="text-sm text-t4">{t.pages.marketImpact.subtitle}</p>
        </div>
      </div>

      {/* Section 1: Oil Price Detail Chart */}
      <section>
        <div className="bg-bg3/80 border border-brd/60 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛢️</span>
              <h2 className="text-[14px] font-bold text-t1">
                {locale === 'en' ? 'Oil Price Detail' : '유가 상세'}
              </h2>
              {oilPrices.brent && (
                <span className="text-[11px] text-t4 ml-2">
                  Brent: <span className="text-gold font-semibold">${oilPrices.brent.price.toFixed(2)}</span>
                  {oilPrices.brent.change_pct != null && (
                    <span className={`ml-1 ${oilPrices.brent.change_pct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ({oilPrices.brent.change_pct >= 0 ? '+' : ''}{oilPrices.brent.change_pct.toFixed(1)}%)
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="flex gap-1">
              {(['1D', '1W', '1M', '3M'] as const).map(range => (
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

      {/* Section 2: Scenario Tracker */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🎯</span>
          <h2 className="text-[14px] font-bold text-t1">{t.pages.marketImpact.scenarios}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WAR_SCENARIOS.map(scenario => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      </section>

      {/* Section 3: KARA Fund Impact Summary */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🏦</span>
          <h2 className="text-[14px] font-bold text-t1">{t.pages.marketImpact.karaFund}</h2>
        </div>
        <div className="bg-bg3/80 border border-brd/60 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-brd/40">
            {/* Status indicators */}
            <div className="p-5 space-y-4">
              <h3 className="text-[13px] font-bold text-t1 mb-3">
                {locale === 'en' ? 'Key Status Indicators' : '주요 상태 지표'}
              </h3>
              <KaraStatusRow
                labelKo="LP Meeting (4/2)"
                labelEn="LP Meeting (4/2)"
                statusKo="예정대로 진행"
                statusEn="On Schedule"
                color="#22c55e"
              />
              <KaraStatusRow
                labelKo="UAE 공항 상태"
                labelEn="UAE Airport Status"
                statusKo="운영 중 (모니터링)"
                statusEn="Operational (Monitoring)"
                color="#eab308"
              />
              <KaraStatusRow
                labelKo="Jebel Ali 항만 상태"
                labelEn="Jebel Ali Port Status"
                statusKo="운영 중 (보험료 인상)"
                statusEn="Operational (Premium Rising)"
                color="#eab308"
              />
              <KaraStatusRow
                labelKo="예상 유가 레인지"
                labelEn="Expected Oil Price Range"
                statusKo="Brent $120-150 (봉쇄 시나리오)"
                statusEn="Brent $120-150 (Blockade Scenario)"
                color="#ef4444"
              />
            </div>

            {/* Market outlook */}
            <div className="p-5 space-y-4">
              <h3 className="text-[13px] font-bold text-t1 mb-3">
                {locale === 'en' ? 'Market Outlook' : '시장 전망'}
              </h3>
              <KaraStatusRow
                labelKo="KOSPI 영향 추정"
                labelEn="KOSPI Impact Estimate"
                statusKo="-3~8% (유가 급등 시)"
                statusEn="-3~8% (on oil spike)"
                color="#ef4444"
              />
              <KaraStatusRow
                labelKo="방산주 전망 (한화에어로)"
                labelEn="Defense Stocks (Hanwha Aero)"
                statusKo="상승 예상 (+10~25%)"
                statusEn="Expected Rise (+10~25%)"
                color="#22c55e"
              />
              <KaraStatusRow
                labelKo="원/달러 환율"
                labelEn="KRW/USD Exchange"
                statusKo="1,450+ 예상 (안전자산 선호)"
                statusEn="1,450+ Expected (Safe Haven)"
                color="#ef4444"
              />
              <KaraStatusRow
                labelKo="UAE 현지 부동산"
                labelEn="UAE Local Real Estate"
                statusKo="단기 조정 후 반등 예상"
                statusEn="Short-term correction, then rebound"
                color="#eab308"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Shipping Market Correlations */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🚢</span>
          <h2 className="text-[14px] font-bold text-t1">
            {locale === 'en' ? 'Shipping Market Correlations' : '해운 시장 상관관계'}
          </h2>
        </div>
        <div className="bg-bg3/80 border border-brd/60 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brd/40">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-t4 uppercase tracking-wide">
                  {locale === 'en' ? 'Indicator' : '지표'}
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-t4 uppercase tracking-wide">
                  {locale === 'en' ? 'Value' : '값'}
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-t4 uppercase tracking-wide">
                  {locale === 'en' ? 'Change' : '변동'}
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-t4 uppercase tracking-wide">
                  {locale === 'en' ? 'Source' : '출처'}
                </th>
              </tr>
            </thead>
            <tbody>
              {indicators.map((ind, i) => (
                <tr
                  key={ind.id}
                  className={`border-b border-brd/20 ${i % 2 === 0 ? 'bg-bg2/30' : ''}`}
                >
                  <td className="px-4 py-3 text-[12px] text-t2 font-medium">
                    {ind.indicator_name ?? ind.indicator_type.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] text-t1 font-semibold">
                    {ind.value.toLocaleString()} {ind.unit ?? ''}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {ind.change_pct != null ? (
                      <span className={`text-[12px] font-semibold ${ind.change_pct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {ind.change_pct >= 0 ? '▲' : '▼'} {Math.abs(ind.change_pct).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-[11px] text-t4">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-[11px] text-t4">
                    {ind.source ?? '—'}
                  </td>
                </tr>
              ))}
              {indicators.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-t4 text-sm">
                    {locale === 'en' ? 'No indicators available' : '지표 데이터 없음'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function KaraStatusRow({
  labelKo,
  labelEn,
  statusKo,
  statusEn,
  color,
}: {
  readonly labelKo: string
  readonly labelEn: string
  readonly statusKo: string
  readonly statusEn: string
  readonly color: string
}) {
  const { locale } = useLocale()

  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-t3">{locale === 'en' ? labelEn : labelKo}</span>
      <span
        className="text-[11px] font-semibold px-2 py-0.5 rounded"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {locale === 'en' ? statusEn : statusKo}
      </span>
    </div>
  )
}
