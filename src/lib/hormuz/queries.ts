/**
 * Hormuz Crisis Dashboard — Supabase Query Layer
 * Server-side queries using service role, client-side using anon key
 */

import { getSupabaseAdmin, getSupabaseClient } from '../supabase'
import type {
  VesselPosition,
  TrafficSummary,
  OilPrice,
  MaritimeAlert,
  ShippingIndicator,
  WarNewsItem,
  MapEvent,
  TelegramAlertLog,
  NewsCategory,
  NewsSeverity,
  HormuzDashboardData,
  CrisisThreatLevel,
} from '@/types/hormuz'
import { computeThreatLevel } from './threat-level'

// ============================================================================
// Vessel Tracking
// ============================================================================

/** Get latest position for each vessel in the last N hours */
export async function getLatestVessels(hoursBack = 6): Promise<VesselPosition[]> {
  const supabase = getSupabaseClient()
  const since = new Date(Date.now() - hoursBack * 3600_000).toISOString()

  const { data, error } = await supabase
    .from('hormuz_vessel_tracking')
    .select('*')
    .gte('timestamp', since)
    .order('timestamp', { ascending: false })
    .limit(500)

  if (error) {
    console.error('getLatestVessels error:', error)
    return []
  }

  // Deduplicate by MMSI (keep latest)
  const seen = new Set<string>()
  const unique: VesselPosition[] = []
  for (const v of data ?? []) {
    if (!seen.has(v.mmsi)) {
      seen.add(v.mmsi)
      unique.push(v as VesselPosition)
    }
  }
  return unique
}

/** Get traffic stats using RPC */
export async function getTrafficStats(hoursBack = 24) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.rpc('get_hormuz_traffic_stats', {
    hours_back: hoursBack,
  })

  if (error) {
    console.error('getTrafficStats error:', error)
    return null
  }

  return data?.[0] ?? null
}

/** Get traffic summary history for charts */
export async function getTrafficHistory(
  periodType: 'hourly' | 'daily' = 'hourly',
  limit = 72
): Promise<TrafficSummary[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('hormuz_traffic_summary')
    .select('*')
    .eq('period_type', periodType)
    .order('period_start', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getTrafficHistory error:', error)
    return []
  }

  return (data ?? []).reverse() as TrafficSummary[]
}

// ============================================================================
// Oil Prices
// ============================================================================

/** Get latest oil prices for both benchmarks */
export async function getLatestOilPrices(): Promise<{ brent: OilPrice | null; wti: OilPrice | null }> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('oil_price_tracking')
    .select('*')
    .order('fetched_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('getLatestOilPrices error:', error)
    return { brent: null, wti: null }
  }

  const prices = data as OilPrice[]
  return {
    brent: prices.find(p => p.benchmark === 'brent') ?? null,
    wti: prices.find(p => p.benchmark === 'wti') ?? null,
  }
}

/** Get oil price history for charts */
export async function getOilPriceHistory(
  benchmark: 'brent' | 'wti' = 'brent',
  limit = 288 // ~24h at 5min intervals
): Promise<OilPrice[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('oil_price_tracking')
    .select('*')
    .eq('benchmark', benchmark)
    .order('fetched_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getOilPriceHistory error:', error)
    return []
  }

  return (data ?? []).reverse() as OilPrice[]
}

// ============================================================================
// Maritime Security Alerts
// ============================================================================

/** Get active maritime security alerts */
export async function getActiveAlerts(limit = 10): Promise<MaritimeAlert[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('maritime_security_alerts')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getActiveAlerts error:', error)
    return []
  }

  return (data ?? []) as MaritimeAlert[]
}

/** Get Hormuz-affecting alerts only */
export async function getHormuzAlerts(limit = 5): Promise<MaritimeAlert[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('maritime_security_alerts')
    .select('*')
    .eq('affects_hormuz', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getHormuzAlerts error:', error)
    return []
  }

  return (data ?? []) as MaritimeAlert[]
}

// ============================================================================
// War News Feed
// ============================================================================

/** Get war news with optional filters */
export async function getWarNews(options?: {
  category?: NewsCategory
  severity?: NewsSeverity
  verifiedOnly?: boolean
  limit?: number
}): Promise<WarNewsItem[]> {
  const supabase = getSupabaseClient()
  const { category, severity, verifiedOnly, limit = 50 } = options ?? {}

  let query = supabase
    .from('war_news_feed')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (category) query = query.eq('category', category)
  if (severity) query = query.eq('severity', severity)
  if (verifiedOnly) query = query.eq('is_verified', true)

  const { data, error } = await query

  if (error) {
    console.error('getWarNews error:', error)
    return []
  }

  return (data ?? []) as WarNewsItem[]
}

/** Get critical/high severity news only (for ticker/banner) */
export async function getCriticalNews(limit = 10): Promise<WarNewsItem[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('war_news_feed')
    .select('*')
    .in('severity', ['critical', 'high'])
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getCriticalNews error:', error)
    return []
  }

  return (data ?? []) as WarNewsItem[]
}

// ============================================================================
// Map Events
// ============================================================================

/** Get active map events */
export async function getActiveMapEvents(limit = 100): Promise<MapEvent[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('map_events')
    .select('*')
    .eq('is_active', true)
    .order('event_date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getActiveMapEvents error:', error)
    return []
  }

  return (data ?? []) as MapEvent[]
}

// ============================================================================
// Shipping Market Indicators
// ============================================================================

/** Get latest shipping market indicators */
export async function getShippingIndicators(): Promise<ShippingIndicator[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('shipping_market_indicators')
    .select('*')
    .order('fetched_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('getShippingIndicators error:', error)
    return []
  }

  // Deduplicate by indicator_type (keep latest)
  const seen = new Set<string>()
  const unique: ShippingIndicator[] = []
  for (const ind of data ?? []) {
    if (!seen.has(ind.indicator_type)) {
      seen.add(ind.indicator_type)
      unique.push(ind as ShippingIndicator)
    }
  }
  return unique
}

// ============================================================================
// Telegram Alert Log (admin only)
// ============================================================================

/** Check if alert is within cooldown period (server-side) */
export async function isAlertInCooldown(
  cooldownKey: string,
  cooldownMinutes: number
): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  const since = new Date(Date.now() - cooldownMinutes * 60_000).toISOString()

  const { data, error } = await supabase
    .from('telegram_alert_log')
    .select('id')
    .eq('cooldown_key', cooldownKey)
    .eq('delivery_status', 'sent')
    .gte('sent_at', since)
    .limit(1)

  if (error) {
    console.error('isAlertInCooldown error:', error)
    return false
  }

  return (data?.length ?? 0) > 0
}

/** Log sent alert (server-side) */
export async function logTelegramAlert(alert: Omit<TelegramAlertLog, 'id' | 'created_at'>) {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('telegram_alert_log')
    .insert(alert)

  if (error) {
    console.error('logTelegramAlert error:', error)
  }
}

// ============================================================================
// Composite Dashboard Query
// ============================================================================

/** Get all data needed for the Hormuz dashboard home section */
export async function getHormuzDashboardData(): Promise<HormuzDashboardData> {
  const [
    trafficStats,
    oilPrices,
    alerts,
    news,
    mapEvents,
    indicators,
    trafficHistory,
  ] = await Promise.all([
    getTrafficStats(24),
    getLatestOilPrices(),
    getHormuzAlerts(5),
    getCriticalNews(5),
    getActiveMapEvents(50),
    getShippingIndicators(),
    getTrafficHistory('hourly', 48),
  ])

  // Compute change pct vs pre-crisis baseline
  // Baseline: ~110 vessels/day through Hormuz (pre-crisis average)
  const BASELINE_DAILY_VESSELS = 110
  const currentTotal = trafficStats?.total_vessels ? Number(trafficStats.total_vessels) : 0
  const changePct = currentTotal > 0
    ? Math.round(((currentTotal - BASELINE_DAILY_VESSELS) / BASELINE_DAILY_VESSELS) * 100)
    : null

  const threatLevel: CrisisThreatLevel = computeThreatLevel({
    trafficStats,
    oilPrices,
    alerts,
    news,
  })

  return {
    threatLevel,
    vessels: {
      total: trafficStats?.total_vessels ? Number(trafficStats.total_vessels) : 0,
      tankers: trafficStats?.tanker_count ? Number(trafficStats.tanker_count) : 0,
      stopped: trafficStats?.stopped_count ? Number(trafficStats.stopped_count) : 0,
      uTurns: trafficStats?.u_turn_count ? Number(trafficStats.u_turn_count) : 0,
      dark: trafficStats?.dark_count ? Number(trafficStats.dark_count) : 0,
      avgSpeed: trafficStats?.avg_speed ? Number(trafficStats.avg_speed) : null,
      changePct,
    },
    oil: oilPrices,
    latestAlerts: alerts,
    latestNews: news,
    mapEvents,
    shippingIndicators: indicators,
  }
}

// ============================================================================
// Server-side upsert helpers (for API route workers)
// ============================================================================

export async function upsertVesselPositions(positions: Omit<VesselPosition, 'id' | 'created_at'>[]) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('hormuz_vessel_tracking')
    .upsert(positions, { onConflict: 'mmsi,timestamp' })

  if (error) console.error('upsertVesselPositions error:', error)
  return !error
}

export async function upsertOilPrice(price: Omit<OilPrice, 'id' | 'created_at'>) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('oil_price_tracking')
    .insert(price)

  if (error) console.error('upsertOilPrice error:', error)
  return !error
}

export async function upsertWarNews(items: Omit<WarNewsItem, 'id' | 'created_at'>[]) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('war_news_feed')
    .upsert(items, { onConflict: 'url', ignoreDuplicates: true })

  if (error) console.error('upsertWarNews error:', error)
  return !error
}

export async function upsertMaritimeAlert(alert: Omit<MaritimeAlert, 'id' | 'created_at'>) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('maritime_security_alerts')
    .upsert(alert, { onConflict: 'content_hash', ignoreDuplicates: true })

  if (error) console.error('upsertMaritimeAlert error:', error)
  return !error
}

export async function upsertMapEvent(event: Omit<MapEvent, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('map_events')
    .upsert({ ...event, updated_at: new Date().toISOString() }, { onConflict: 'content_hash', ignoreDuplicates: true })

  if (error) console.error('upsertMapEvent error:', error)
  return !error
}

export async function upsertShippingIndicator(indicator: Omit<ShippingIndicator, 'id' | 'created_at'>) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('shipping_market_indicators')
    .insert(indicator)

  if (error) console.error('upsertShippingIndicator error:', error)
  return !error
}

export async function upsertTrafficSummary(summary: Omit<TrafficSummary, 'id' | 'created_at'>) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('hormuz_traffic_summary')
    .upsert(summary, { onConflict: 'period_type,period_start,zone' })

  if (error) console.error('upsertTrafficSummary error:', error)
  return !error
}
