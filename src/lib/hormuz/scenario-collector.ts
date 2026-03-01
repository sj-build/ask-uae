/**
 * KARA Scenario Agent — Data Collector
 * Reads from existing Hormuz tables to build a CollectedData payload for Claude analysis
 */

import {
  getWarNews,
  getLatestOilPrices,
  getTrafficStats,
  getActiveAlerts,
  getActiveMapEvents,
} from './queries'
import { getLastAnalysisTimestamp } from './scenario-queries'
import type { CollectedData } from '@/types/scenario'

/**
 * Collect new data from all Hormuz sources since the last analysis.
 * Builds the CollectedData payload consumed by the analyzer.
 */
export async function collectNewData(): Promise<CollectedData> {
  const lastAnalysis = await getLastAnalysisTimestamp()
  const lastAnalysisDate = lastAnalysis ? new Date(lastAnalysis) : new Date(0)
  const minutesSinceLast = Math.floor(
    (Date.now() - lastAnalysisDate.getTime()) / 60_000
  )

  // Parallel fetch from all existing Hormuz tables
  const [allNews, oilPrices, trafficStats, alerts, mapEvents] = await Promise.all([
    getWarNews({ limit: 50 }),
    getLatestOilPrices(),
    getTrafficStats(24),
    getActiveAlerts(10),
    getActiveMapEvents(20),
  ])

  // Filter news to only items published AFTER the last analysis
  const newNews = lastAnalysis
    ? allNews.filter((n) => {
        const pubDate = n.published_at ?? n.created_at
        return new Date(pubDate) > lastAnalysisDate
      })
    : allNews

  // Count severity levels
  const criticalCount = newNews.filter((n) => n.severity === 'critical').length
  const highCount = newNews.filter((n) => n.severity === 'high').length

  // Oil price change (use 1h change if available, fallback to daily change)
  const oilChange1h = oilPrices.brent?.change_1h_pct
    ?? oilPrices.brent?.change_pct
    ?? 0

  // Traffic change
  const trafficChangePct = trafficStats?.traffic_change_pct
    ? Number(trafficStats.traffic_change_pct)
    : 0

  // Filter alerts that are new since last analysis
  const newAlerts = lastAnalysis
    ? alerts.filter((a) => {
        const pubDate = a.published_at ?? a.created_at
        return new Date(pubDate) > lastAnalysisDate
      })
    : alerts

  // Filter critical map events
  const newCriticalMapEvents = mapEvents.filter(
    (e) => e.severity === 'critical'
  )

  return {
    news: newNews.map((n) => ({
      id: n.id,
      title: n.title,
      summary: n.summary,
      source_name: n.source_name,
      severity: n.severity,
      category: n.category,
      published_at: n.published_at,
    })),
    oil: {
      brent_price: oilPrices.brent?.price ?? null,
      wti_price: oilPrices.wti?.price ?? null,
      brent_change_pct: oilPrices.brent?.change_pct ?? null,
      wti_change_pct: oilPrices.wti?.change_pct ?? null,
    },
    traffic: trafficStats
      ? {
          total_vessels: Number(trafficStats.total_vessels ?? 0),
          tanker_count: Number(trafficStats.tanker_count ?? 0),
          stopped_count: Number(trafficStats.stopped_count ?? 0),
          u_turn_count: Number(trafficStats.u_turn_count ?? 0),
          dark_vessel_count: Number(trafficStats.dark_count ?? 0),
          traffic_change_pct: trafficChangePct,
        }
      : null,
    security_alerts: newAlerts.map((a) => ({
      id: a.id,
      title: a.title,
      threat_level: a.threat_level,
      source: a.source,
      affects_hormuz: a.affects_hormuz,
    })),
    map_events: mapEvents.slice(0, 10).map((e) => ({
      id: e.id,
      event_type: e.event_type,
      title: e.title,
      severity: e.severity,
      location_name: e.location_name,
    })),
    news_count: newNews.length,
    news_severity_critical: criticalCount,
    news_severity_high: highCount,
    oil_change_1h_pct: Math.abs(oilChange1h),
    traffic_change_1h_pct: trafficChangePct,
    new_security_alerts: newAlerts.length,
    new_map_events_critical: newCriticalMapEvents.length,
    minutes_since_last_analysis: minutesSinceLast,
  }
}
