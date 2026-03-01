/**
 * KARA Scenario Intelligence Agent — Supabase Query Layer
 * CRUD operations for scenario_state, scenario_analysis_log, scenario_variable_history
 */

import { getSupabaseAdmin, getSupabaseClient } from '../supabase'
import type {
  ScenarioStateRow,
  ScenarioAnalysisLogRow,
  ScenarioVariableHistoryRow,
  VariableChange,
} from '@/types/scenario'

// ============================================================================
// Scenario State
// ============================================================================

/** Get the latest scenario state */
export async function getLatestScenarioState(): Promise<ScenarioStateRow | null> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('scenario_state')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No rows
    console.error('getLatestScenarioState error:', error)
    return null
  }

  return data as ScenarioStateRow
}

/** Insert a new scenario state snapshot */
export async function insertScenarioState(
  state: Omit<ScenarioStateRow, 'id' | 'created_at'>
): Promise<boolean> {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('scenario_state')
    .insert(state)

  if (error) {
    console.error('insertScenarioState error:', error)
    return false
  }
  return true
}

/** Get scenario state history */
export async function getScenarioHistory(limit = 20): Promise<ScenarioStateRow[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('scenario_state')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getScenarioHistory error:', error)
    return []
  }

  return (data ?? []) as ScenarioStateRow[]
}

// ============================================================================
// Analysis Log
// ============================================================================

/** Insert analysis log and return the inserted id */
export async function insertAnalysisLog(
  log: Omit<ScenarioAnalysisLogRow, 'id' | 'created_at'>
): Promise<number | null> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('scenario_analysis_log')
    .insert(log)
    .select('id')
    .single()

  if (error) {
    console.error('insertAnalysisLog error:', error)
    return null
  }

  return Number(data.id)
}

/** Get recent analysis logs */
export async function getRecentAnalysisLogs(limit = 10): Promise<ScenarioAnalysisLogRow[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('scenario_analysis_log')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getRecentAnalysisLogs error:', error)
    return []
  }

  return (data ?? []) as ScenarioAnalysisLogRow[]
}

/** Get ISO timestamp of last analysis */
export async function getLastAnalysisTimestamp(): Promise<string | null> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('scenario_analysis_log')
    .select('timestamp')
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()

  if (error) return null
  return data?.timestamp ?? null
}

// ============================================================================
// Variable History
// ============================================================================

/** Insert variable changes in bulk */
export async function insertVariableChanges(
  changes: VariableChange[],
  analysisId: number
): Promise<boolean> {
  if (changes.length === 0) return true

  const supabase = getSupabaseAdmin()

  const rows = changes.map((c) => ({
    timestamp: new Date().toISOString(),
    variable_name: c.variable,
    old_value: String(c.old_value),
    new_value: String(c.new_value),
    confidence: c.confidence,
    source: c.source,
    analysis_id: analysisId,
  }))

  const { error } = await supabase
    .from('scenario_variable_history')
    .insert(rows)

  if (error) {
    console.error('insertVariableChanges error:', error)
    return false
  }
  return true
}

/** Get variable change history */
export async function getVariableHistory(
  variableName: string,
  limit = 20
): Promise<ScenarioVariableHistoryRow[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('scenario_variable_history')
    .select('*')
    .eq('variable_name', variableName)
    .order('timestamp', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getVariableHistory error:', error)
    return []
  }

  return (data ?? []) as ScenarioVariableHistoryRow[]
}

// ============================================================================
// Cost Controls
// ============================================================================

/** Get total API cost for today (UTC) */
export async function getDailyApiCost(): Promise<number> {
  const supabase = getSupabaseClient()
  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('scenario_analysis_log')
    .select('cost_usd')
    .gte('timestamp', todayStart.toISOString())

  if (error) {
    console.error('getDailyApiCost error:', error)
    return 0
  }

  return (data ?? []).reduce((sum, row) => sum + (Number(row.cost_usd) || 0), 0)
}

/** Get number of API calls in the last hour */
export async function getHourlyApiCallCount(): Promise<number> {
  const supabase = getSupabaseClient()
  const oneHourAgo = new Date(Date.now() - 3600_000).toISOString()

  const { data, error } = await supabase
    .from('scenario_analysis_log')
    .select('id')
    .gte('timestamp', oneHourAgo)

  if (error) {
    console.error('getHourlyApiCallCount error:', error)
    return 0
  }

  return data?.length ?? 0
}

/** Update analysis log to mark Telegram as sent */
export async function markAnalysisTelegramSent(
  analysisId: number,
  messageId?: string
): Promise<void> {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('scenario_analysis_log')
    .update({
      telegram_sent: true,
      telegram_message_id: messageId ?? null,
    })
    .eq('id', analysisId)

  if (error) {
    console.error('markAnalysisTelegramSent error:', error)
  }
}
