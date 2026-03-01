/**
 * KARA Scenario Agent — State Manager
 * Manages scenario state transitions, variable tracking, and transition detection
 */

import {
  getLatestScenarioState,
  insertScenarioState,
  insertVariableChanges,
} from './scenario-queries'
import type {
  ClaudeAnalysisResponse,
  ScenarioId,
  ScenarioStateRow,
  ScenarioUpdate,
} from '@/types/scenario'

/**
 * Detect if a scenario transition has occurred.
 * Returns e.g. "B→C" if primary scenario changed, null otherwise.
 */
export function detectTransition(
  prev: ScenarioStateRow | null,
  updated: ScenarioUpdate
): string | null {
  if (!prev) return null
  if (prev.primary_scenario !== updated.primary_scenario) {
    return `${prev.primary_scenario}→${updated.primary_scenario}`
  }
  return null
}

/**
 * Update scenario state based on Claude's analysis.
 * Inserts new state row and records variable changes.
 */
export async function updateScenarioState(
  analysis: ClaudeAnalysisResponse,
  newsIds: number[],
  analysisId: number
): Promise<void> {
  const prevState = await getLatestScenarioState()
  const { scenario_update, variable_changes } = analysis

  // Build updated variables snapshot
  const prevVariables = prevState?.variables_snapshot ?? {}
  const updatedVariables = { ...prevVariables }
  for (const change of variable_changes) {
    updatedVariables[change.variable] = change.new_value
  }

  // Detect transition
  const transition = detectTransition(prevState, scenario_update)

  // Insert new scenario state
  await insertScenarioState({
    timestamp: new Date().toISOString(),
    scenario_a_pct: scenario_update.updated.A,
    scenario_b_pct: scenario_update.updated.B,
    scenario_c_pct: scenario_update.updated.C,
    scenario_d_pct: scenario_update.updated.D,
    primary_scenario: scenario_update.primary_scenario as ScenarioId,
    primary_sub_scenario: scenario_update.primary_sub_scenario ?? null,
    transition_detected: transition ?? scenario_update.transition_detected ?? null,
    variables_snapshot: updatedVariables,
    reasoning: scenario_update.reasoning_ko,
    trigger_news_ids: newsIds,
  })

  // Insert variable change history
  if (variable_changes.length > 0) {
    await insertVariableChanges(variable_changes, analysisId)
  }
}

/**
 * Get current variable values from latest scenario state.
 */
export async function getCurrentVariables(): Promise<Record<string, string | number>> {
  const state = await getLatestScenarioState()
  return (state?.variables_snapshot as Record<string, string | number>) ?? {}
}
