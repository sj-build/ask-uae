// ============================================================================
// Hormuz Crisis Dashboard — TypeScript Types
// Maps to Supabase tables from migration 015
// ============================================================================

// --- Vessel Tracking ---
export type VesselType = 'tanker' | 'container' | 'lng_carrier' | 'bulk' | 'cargo' | 'passenger' | 'military' | 'other'
export type VesselStatus = 'transiting' | 'stopped' | 'u_turn' | 'dark'
export type HormuzZone = 'hormuz' | 'persian_gulf' | 'gulf_of_oman' | 'red_sea' | 'gulf_of_aden'

export interface VesselPosition {
  id: string
  mmsi: string
  vessel_name: string | null
  vessel_type: VesselType | null
  imo: string | null
  flag: string | null
  latitude: number
  longitude: number
  speed_knots: number | null
  heading: number | null
  course: number | null
  nav_status: string | null
  status: VesselStatus | null
  destination: string | null
  draught: number | null
  cargo_type: string | null
  estimated_cargo_volume_barrels: number | null
  zone: HormuzZone | null
  timestamp: string
  created_at: string
}

// --- Traffic Summary ---
export type PeriodType = 'hourly' | 'daily'

export interface TrafficSummary {
  id: string
  period_type: PeriodType
  period_start: string
  zone: string
  total_vessels: number
  tanker_count: number
  lng_carrier_count: number
  container_count: number
  other_count: number
  transiting_count: number
  stopped_count: number
  u_turn_count: number
  dark_vessel_count: number
  eastbound_count: number
  westbound_count: number
  avg_speed_knots: number | null
  estimated_crude_barrels: number | null
  estimated_lng_tonnes: number | null
  traffic_change_pct: number | null
  anomaly_flag: boolean
  anomaly_description: string | null
  created_at: string
}

// --- Oil Price ---
export type OilBenchmark = 'brent' | 'wti'

export interface OilPrice {
  id: string
  benchmark: OilBenchmark
  symbol: string
  price: number
  open_price: number | null
  high_price: number | null
  low_price: number | null
  prev_close: number | null
  change_pct: number | null
  change_1h_pct: number | null
  change_30m_pct: number | null
  volume: number | null
  source: string
  is_market_open: boolean
  spike_flag: boolean
  fetched_at: string
  created_at: string
}

// --- Maritime Security Alerts ---
export type AlertSource = 'ukmto' | 'marad' | 'jmic' | 'jwc' | 'uk_mod' | 'other'
export type ThreatLevel = 'normal' | 'elevated' | 'substantial' | 'critical'
export type AlertRegion = 'hormuz' | 'persian_gulf' | 'gulf_of_oman' | 'red_sea' | 'gulf_of_aden' | 'arabian_sea'

export interface MaritimeAlert {
  id: string
  source: AlertSource
  alert_id: string | null
  title: string
  summary: string | null
  full_text: string | null
  threat_level: ThreatLevel | null
  region: AlertRegion | null
  affects_hormuz: boolean
  key_changes: string | null
  url: string | null
  content_hash: string | null
  published_at: string | null
  created_at: string
}

// --- Shipping Market Indicators ---
export type IndicatorType =
  | 'vlcc_freight_rate'
  | 'suezmax_freight_rate'
  | 'war_risk_premium'
  | 'container_freight_index'
  | 'bunker_price'
  | 'hormuz_shipping_cost'
  | 'insurance_proxy_score'

export interface ShippingIndicator {
  id: string
  indicator_type: IndicatorType
  indicator_name: string | null
  value: number
  unit: string | null
  change_pct: number | null
  source: string | null
  notes: string | null
  fetched_at: string
  created_at: string
}

// --- War News Feed ---
export type NewsCategory =
  | 'hormuz_shipping'
  | 'oil_energy'
  | 'military_ops'
  | 'iran_internal'
  | 'uae_impact'
  | 'market_reaction'
  | 'diplomacy'
  | 'insurance_maritime'
  | 'casualties'
  | 'regime_change'

export type NewsSeverity = 'critical' | 'high' | 'medium' | 'low'
export type NewsSourceType = 'wire' | 'broadcast' | 'osint' | 'official' | 'social' | 'rss'

export interface WarNewsItem {
  id: string
  title: string
  summary: string | null
  url: string | null
  source_name: string
  source_type: NewsSourceType | null
  category: NewsCategory | null
  severity: NewsSeverity | null
  keywords: string[]
  sentiment: number | null
  is_verified: boolean
  related_alert_id: string | null
  published_at: string | null
  fetched_at: string
  created_at: string
}

// --- Telegram Alert Log ---
export type AlertLevel = 'critical' | 'warning' | 'status'
export type TriggerType =
  | 'traffic_drop'
  | 'oil_spike'
  | 'vessel_u_turn'
  | 'dark_vessel_surge'
  | 'security_alert_new'
  | 'war_news_critical'
  | 'insurance_indicator'
  | 'scheduled_status'

export interface TelegramAlertLog {
  id: string
  alert_level: AlertLevel
  trigger_type: TriggerType
  title: string | null
  message: string
  chat_id: string | null
  message_id: string | null
  delivery_status: 'sent' | 'failed' | 'retry'
  cooldown_key: string | null
  related_data: Record<string, unknown> | null
  sent_at: string
  created_at: string
}

// --- Map Events ---
export type MapEventType =
  | 'airstrike'
  | 'missile_launch'
  | 'missile_intercept'
  | 'naval_incident'
  | 'vessel_seizure'
  | 'explosion'
  | 'protest'
  | 'airport_closure'
  | 'port_closure'
  | 'military_deployment'
  | 'humanitarian'

export interface MapEvent {
  id: string
  event_type: MapEventType
  title: string
  description: string | null
  latitude: number
  longitude: number
  location_name: string | null
  country: string | null
  source_name: string | null
  source_url: string | null
  severity: NewsSeverity | null
  is_verified: boolean
  is_active: boolean
  content_hash: string | null
  icon_type: string | null
  media_url: string | null
  event_date: string
  expires_at: string | null
  created_at: string
  updated_at: string
}

// --- Composite Types (for dashboard) ---

export type CrisisThreatLevel = 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL'

export interface HormuzDashboardData {
  threatLevel: CrisisThreatLevel
  vessels: {
    total: number
    tankers: number
    stopped: number
    uTurns: number
    dark: number
    avgSpeed: number | null
    changePct: number | null
  }
  oil: {
    brent: OilPrice | null
    wti: OilPrice | null
  }
  latestAlerts: MaritimeAlert[]
  latestNews: WarNewsItem[]
  mapEvents: MapEvent[]
  shippingIndicators: ShippingIndicator[]
}

// --- Map Layer Config ---
export interface MapLayerConfig {
  vessels: boolean
  warEvents: boolean
  securityZones: boolean
  infrastructure: boolean
}

// --- Key Locations ---
export interface KeyLocation {
  name: string
  nameKo: string
  lat: number
  lon: number
  type: 'military_base' | 'oil_infrastructure' | 'port' | 'nuclear_site' | 'city'
  country: string
  icon: string
}

// --- Scenario Tracking ---
export interface WarScenario {
  id: string
  nameEn: string
  nameKo: string
  descriptionEn: string
  descriptionKo: string
  probability: number
  oilImpactEn: string
  oilImpactKo: string
  isActive: boolean
}
