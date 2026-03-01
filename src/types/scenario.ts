// ============================================================================
// KARA Scenario Intelligence Agent — TypeScript Types
// Maps to Supabase tables from migration 016
// ============================================================================

// --- Scenario State (DB row) ---
export interface ScenarioStateRow {
  id: string
  timestamp: string
  scenario_a_pct: number
  scenario_b_pct: number
  scenario_c_pct: number
  scenario_d_pct: number
  primary_scenario: ScenarioId
  primary_sub_scenario: string | null
  transition_detected: string | null
  variables_snapshot: Record<string, string | number> | null
  reasoning: string | null
  trigger_news_ids: number[] | null
  created_at: string
}

// --- Analysis Log (DB row) ---
export interface ScenarioAnalysisLogRow {
  id: string
  timestamp: string
  input_data_summary: string | null
  news_ids_analyzed: number[] | null
  claude_request: Record<string, unknown> | null
  claude_response: ClaudeAnalysisResponse | Record<string, unknown> | null
  alert_level: ScenarioAlertLevel | null
  scenario_changed: boolean
  variables_changed: VariableChange[] | null
  telegram_sent: boolean
  telegram_message_id: string | null
  processing_time_ms: number | null
  token_usage: { input_tokens: number; output_tokens: number } | null
  cost_usd: number | null
  created_at: string
}

// --- Variable History (DB row) ---
export interface ScenarioVariableHistoryRow {
  id: string
  timestamp: string
  variable_name: string
  old_value: string | null
  new_value: string | null
  confidence: number | null
  source: string | null
  analysis_id: number | null
  created_at: string
}

// --- Scenario IDs ---
export type ScenarioId = 'A' | 'B' | 'C' | 'D'
export type SubScenarioId = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'C3' | 'D1' | 'D2' | 'D3'

// --- Alert Levels ---
export type ScenarioAlertLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE'

// --- Scenario Tree Config ---
export interface SubScenario {
  name: string
  description: string
  timeline: string
}

export interface ScenarioDefinition {
  name: string
  description: string
  sub_scenarios: Record<string, SubScenario>
  default_probability: number
}

export type ScenarioTree = Record<ScenarioId, ScenarioDefinition>

// --- Key Variables Config ---
export type VariableCategory = 'military' | 'political' | 'market' | 'diplomatic'

export interface KeyVariableDefinition {
  description: string
  category: VariableCategory
  default_value: string | number
  possible_values?: string[]
  thresholds?: Record<string, string>
  scenario_impact?: Record<string, Partial<Record<ScenarioId, number>>>
}

export type KeyVariablesConfig = Record<string, KeyVariableDefinition>

// --- Impact Matrix Config ---
export interface OilImpact {
  direction: string
  range: string
  timeline: string
  reasoning: string
}

export interface EquityImpact {
  direction: string
  magnitude: string
  timeline: string
  reasoning: string
}

export interface KospiImpact {
  direction: string
  magnitude: string
  timeline: string
  sectors: Record<string, string>
}

export interface KaraFundImpact {
  lp_meeting: string
  thesis_strength: string
  deal_opportunity: string
  action_items: string[]
}

export interface ScenarioImpact {
  oil: OilImpact
  global_equity: EquityImpact
  kospi: KospiImpact
  kara_fund: KaraFundImpact
}

export type ImpactMatrix = Record<ScenarioId, ScenarioImpact>

// --- Claude API Response ---
export interface VariableChange {
  variable: string
  old_value: string | number
  new_value: string | number
  confidence: number
  source: string
}

export interface ScenarioUpdate {
  changed: boolean
  previous: Record<ScenarioId, number>
  updated: Record<ScenarioId, number>
  primary_scenario: ScenarioId
  primary_sub_scenario?: SubScenarioId
  transition_detected: string | null
  reasoning_ko: string
}

export interface MarketImpactAnalysis {
  oil: { direction: string; target: string; reasoning_ko: string }
  global_equity: { direction: string; magnitude: string; reasoning_ko: string }
  kospi: { direction: string; magnitude: string; sectors_ko: string }
  kara_fund: { action_ko: string; lp_meeting_ko: string; urgency: number }
}

export interface ClaudeAnalysisResponse {
  alert_level: ScenarioAlertLevel
  summary_ko: string
  variable_changes: VariableChange[]
  scenario_update: ScenarioUpdate
  market_impact: MarketImpactAnalysis
  telegram_message_ko: string
}

// --- Collector Data Payload ---
export interface CollectedData {
  news: Array<{
    id: string
    title: string
    summary: string | null
    source_name: string
    severity: string | null
    category: string | null
    published_at: string | null
  }>
  oil: {
    brent_price: number | null
    wti_price: number | null
    brent_change_pct: number | null
    wti_change_pct: number | null
  }
  traffic: {
    total_vessels: number
    tanker_count: number
    stopped_count: number
    u_turn_count: number
    dark_vessel_count: number
    traffic_change_pct: number | null
  } | null
  security_alerts: Array<{
    id: string
    title: string
    threat_level: string | null
    source: string
    affects_hormuz: boolean
  }>
  map_events: Array<{
    id: string
    event_type: string
    title: string
    severity: string | null
    location_name: string | null
  }>
  news_count: number
  news_severity_critical: number
  news_severity_high: number
  oil_change_1h_pct: number
  traffic_change_1h_pct: number
  new_security_alerts: number
  new_map_events_critical: number
  minutes_since_last_analysis: number
}

// --- Agent Config ---
export interface ScenarioAgentConfig {
  maxApiCallsPerHour: number
  maxDailyCostUsd: number
  scenarioChangeThreshold: number
  statusReportIntervalHours: number
  forceAnalysisIntervalMinutes: number
  claudeModel: string
  claudeMaxTokens: number
}
