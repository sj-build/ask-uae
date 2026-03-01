/**
 * Compute composite threat level for Hormuz Strait
 * Based on: traffic stats, oil prices, security alerts, war news
 */

import type { OilPrice, MaritimeAlert, WarNewsItem, CrisisThreatLevel } from '@/types/hormuz'

interface ThreatLevelInput {
  trafficStats: {
    total_vessels?: number | bigint
    tanker_count?: number | bigint
    stopped_count?: number | bigint
    u_turn_count?: number | bigint
    dark_count?: number | bigint
  } | null
  oilPrices: {
    brent: OilPrice | null
    wti: OilPrice | null
  }
  alerts: MaritimeAlert[]
  news: WarNewsItem[]
}

export function computeThreatLevel(input: ThreatLevelInput): CrisisThreatLevel {
  let score = 0

  // --- Traffic anomalies ---
  if (input.trafficStats) {
    const total = Number(input.trafficStats.total_vessels ?? 0)
    const uTurns = Number(input.trafficStats.u_turn_count ?? 0)
    const dark = Number(input.trafficStats.dark_count ?? 0)
    const stopped = Number(input.trafficStats.stopped_count ?? 0)

    // Baseline: ~114 vessels/day through Hormuz = ~4.75/hour
    if (total < 50) score += 3 // Very low traffic
    else if (total < 80) score += 2 // Below normal
    else if (total < 100) score += 1

    if (uTurns >= 5) score += 3
    else if (uTurns >= 3) score += 2
    else if (uTurns >= 1) score += 1

    if (dark >= 10) score += 2
    else if (dark >= 5) score += 1

    if (stopped >= 10) score += 2
    else if (stopped >= 5) score += 1
  }

  // --- Oil price spikes ---
  const brent = input.oilPrices.brent
  if (brent) {
    const changePct = Math.abs(Number(brent.change_pct ?? 0))
    if (changePct >= 15) score += 3
    else if (changePct >= 10) score += 2
    else if (changePct >= 5) score += 1

    if (brent.spike_flag) score += 2
  }

  // --- Security alerts ---
  const criticalAlerts = input.alerts.filter(a => a.threat_level === 'critical')
  const substantialAlerts = input.alerts.filter(a => a.threat_level === 'substantial')

  if (criticalAlerts.length > 0) score += 3
  if (substantialAlerts.length > 0) score += 2

  const hormuzAlerts = input.alerts.filter(a => a.affects_hormuz)
  if (hormuzAlerts.length >= 3) score += 2
  else if (hormuzAlerts.length >= 1) score += 1

  // --- War news severity ---
  const criticalNews = input.news.filter(n => n.severity === 'critical')
  const highNews = input.news.filter(n => n.severity === 'high')

  if (criticalNews.length >= 3) score += 3
  else if (criticalNews.length >= 1) score += 2

  if (highNews.length >= 5) score += 1

  // --- Hormuz-specific news ---
  const hormuzNews = input.news.filter(n =>
    n.category === 'hormuz_shipping' || n.category === 'insurance_maritime'
  )
  if (hormuzNews.length >= 3) score += 2
  else if (hormuzNews.length >= 1) score += 1

  // --- Score → Level ---
  if (score >= 12) return 'CRITICAL'
  if (score >= 7) return 'HIGH'
  if (score >= 3) return 'ELEVATED'
  return 'LOW'
}

/** Get threat level color */
export function getThreatColor(level: CrisisThreatLevel): string {
  switch (level) {
    case 'CRITICAL': return '#ef4444'
    case 'HIGH': return '#f97316'
    case 'ELEVATED': return '#eab308'
    case 'LOW': return '#22c55e'
  }
}

/** Get threat level label (bilingual) */
export function getThreatLabel(level: CrisisThreatLevel, locale: string): string {
  const labels: Record<CrisisThreatLevel, { ko: string; en: string }> = {
    CRITICAL: { ko: '심각', en: 'CRITICAL' },
    HIGH: { ko: '높음', en: 'HIGH' },
    ELEVATED: { ko: '주의', en: 'ELEVATED' },
    LOW: { ko: '정상', en: 'LOW' },
  }
  return locale === 'en' ? labels[level].en : labels[level].ko
}
