/**
 * KARA Scenario Agent — Claude API Analyzer
 * Core AI analysis engine: significance filter, Claude API call, response parsing
 */

import { getAnthropicClient } from '@/lib/anthropic'
import {
  SCENARIO_TREE,
  KEY_VARIABLES,
  IMPACT_MATRIX,
  AGENT_CONFIG,
} from '@/data/hormuz/scenario-config'
import type {
  ClaudeAnalysisResponse,
  CollectedData,
  ScenarioStateRow,
  ScenarioAlertLevel,
} from '@/types/scenario'

// ============================================================================
// Significance Filter — Determines if Claude API should be called
// ============================================================================

/**
 * Pre-filter to minimize unnecessary Claude API calls.
 * Returns true if the data warrants AI analysis.
 */
export function hasSignificantUpdates(data: CollectedData): boolean {
  // Immediate triggers — any one is enough
  const immediateTriggers = [
    data.news_severity_critical > 0,
    data.oil_change_1h_pct >= 5,
    data.traffic_change_1h_pct <= -30,
    data.new_security_alerts > 0,
    data.new_map_events_critical > 0,
  ]

  if (immediateTriggers.some(Boolean)) {
    return true
  }

  // Accumulation triggers — need 2+ to fire
  const accumulationTriggers = [
    data.news_count >= 10,
    data.news_severity_high >= 3,
    data.minutes_since_last_analysis >= 60,
  ]

  if (accumulationTriggers.filter(Boolean).length >= 2) {
    return true
  }

  return false
}

// ============================================================================
// Claude API System Prompt
// ============================================================================

function buildSystemPrompt(currentState: ScenarioStateRow | null): string {
  const stateJson = currentState
    ? JSON.stringify({
        scenario_a_pct: currentState.scenario_a_pct,
        scenario_b_pct: currentState.scenario_b_pct,
        scenario_c_pct: currentState.scenario_c_pct,
        scenario_d_pct: currentState.scenario_d_pct,
        primary_scenario: currentState.primary_scenario,
        primary_sub_scenario: currentState.primary_sub_scenario,
        variables_snapshot: currentState.variables_snapshot,
      }, null, 2)
    : '{"scenario_a_pct": 25, "scenario_b_pct": 35, "scenario_c_pct": 35, "scenario_d_pct": 5, "primary_scenario": "B"}'

  return `You are the KARA Scenario Intelligence Agent. Your role is to analyze
incoming news and data about the Iran-US war and assess its impact on
predefined geopolitical scenarios.

## Your Current Scenario State
${stateJson}

## Scenario Framework
${JSON.stringify(SCENARIO_TREE, null, 2)}

## Key Variables
${JSON.stringify(KEY_VARIABLES, null, 2)}

## Impact Matrix
${JSON.stringify(IMPACT_MATRIX, null, 2)}

## Your Task
Analyze the new data provided and determine:

1. VARIABLE_CHANGES: Which key variables have changed? What are their new values?
2. SCENARIO_SHIFT: Have scenario probabilities changed? By how much?
3. TRIGGER_DETECTED: Has a major scenario transition trigger been detected?
4. MARKET_IMPACT: What are the immediate implications for:
   - Oil prices (direction, magnitude, reasoning)
   - Global equities (direction, magnitude, reasoning)
   - KOSPI (direction, magnitude, key sectors)
   - KARA Fund (action items, LP meeting implications)
5. ALERT_LEVEL: How important is this update?
   - CRITICAL: Scenario transition detected (e.g., B→C shift)
   - HIGH: Major variable change (e.g., ceasefire talks confirmed)
   - MEDIUM: Notable development (e.g., new IRGC commander appointed)
   - LOW: Incremental update (e.g., oil price gradual change)
   - NONE: No significant change

## CRITICAL RULES
- NEVER create a scenario transition from a single news source — require 2+ independent sources
- Include confidence scores (0.0-1.0) for ALL variable changes
- If you are not sure, say you are not sure — never fabricate analysis
- All probabilities must sum to 100%
- All text fields (summary_ko, reasoning_ko, telegram_message_ko, sectors_ko, action_ko, lp_meeting_ko) MUST be in Korean

## Response Format
Respond ONLY in valid JSON matching this structure exactly:
{
  "alert_level": "CRITICAL|HIGH|MEDIUM|LOW|NONE",
  "summary_ko": "한국어 1~2문장 요약",
  "variable_changes": [
    {
      "variable": "variable_name",
      "old_value": "...",
      "new_value": "...",
      "confidence": 0.0-1.0,
      "source": "news source"
    }
  ],
  "scenario_update": {
    "changed": true/false,
    "previous": {"A": 25, "B": 35, "C": 35, "D": 5},
    "updated": {"A": 30, "B": 25, "C": 40, "D": 5},
    "primary_scenario": "C",
    "primary_sub_scenario": "C1",
    "transition_detected": "B→C" or null,
    "reasoning_ko": "한국어 시나리오 변화 분석"
  },
  "market_impact": {
    "oil": {"direction": "...", "target": "...", "reasoning_ko": "..."},
    "global_equity": {"direction": "...", "magnitude": "...", "reasoning_ko": "..."},
    "kospi": {"direction": "...", "magnitude": "...", "sectors_ko": "..."},
    "kara_fund": {"action_ko": "...", "lp_meeting_ko": "...", "urgency": 1-10}
  },
  "telegram_message_ko": "텔레그램 발송용 한국어 메시지 (HTML 포맷, <b> <i> <code> 태그만 사용)"
}`
}

// ============================================================================
// Claude API User Prompt
// ============================================================================

function buildUserPrompt(data: CollectedData, lastCheckTime: string): string {
  return `## New Data Since Last Check (${lastCheckTime})

### New News Articles (${data.news_count} items)
${JSON.stringify(data.news.slice(0, 20), null, 2)}

### Oil Price Update
${JSON.stringify(data.oil, null, 2)}

### Hormuz Traffic Update
${JSON.stringify(data.traffic, null, 2)}

### New Maritime Security Alerts
${JSON.stringify(data.security_alerts, null, 2)}

### New Map Events
${JSON.stringify(data.map_events.slice(0, 10), null, 2)}

Analyze this data and provide your assessment.`
}

// ============================================================================
// Claude API Call
// ============================================================================

const NONE_RESPONSE: ClaudeAnalysisResponse = {
  alert_level: 'NONE',
  summary_ko: '유의미한 변화 없음',
  variable_changes: [],
  scenario_update: {
    changed: false,
    previous: { A: 25, B: 35, C: 35, D: 5 },
    updated: { A: 25, B: 35, C: 35, D: 5 },
    primary_scenario: 'B',
    transition_detected: null,
    reasoning_ko: '데이터에서 시나리오를 변경할 만한 유의미한 변화가 감지되지 않았습니다.',
  },
  market_impact: {
    oil: { direction: '유지', target: '현 수준', reasoning_ko: '변화 없음' },
    global_equity: { direction: '유지', magnitude: '0%', reasoning_ko: '변화 없음' },
    kospi: { direction: '유지', magnitude: '0%', sectors_ko: '변화 없음' },
    kara_fund: { action_ko: '대기', lp_meeting_ko: '기존 일정 유지', urgency: 1 },
  },
  telegram_message_ko: '',
}

interface AnalysisResult {
  analysis: ClaudeAnalysisResponse
  tokenUsage: { input_tokens: number; output_tokens: number }
  costUsd: number
  processingTimeMs: number
}

/**
 * Call Claude API to analyze scenario data.
 * Returns parsed analysis, token usage, cost, and processing time.
 */
export async function analyzeWithClaude(
  currentState: ScenarioStateRow | null,
  newData: CollectedData
): Promise<AnalysisResult> {
  const startTime = Date.now()
  const client = getAnthropicClient()

  const lastCheckTime = currentState?.timestamp
    ? new Date(currentState.timestamp).toISOString()
    : 'initial'

  const systemPrompt = buildSystemPrompt(currentState)
  const userPrompt = buildUserPrompt(newData, lastCheckTime)

  try {
    const message = await client.messages.create(
      {
        model: AGENT_CONFIG.claudeModel,
        max_tokens: AGENT_CONFIG.claudeMaxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      },
      { signal: AbortSignal.timeout(25_000) }
    )

    const processingTimeMs = Date.now() - startTime

    const tokenUsage = {
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
    }

    // Calculate cost: input $3/1M, output $15/1M
    const costUsd =
      (tokenUsage.input_tokens * 3) / 1_000_000 +
      (tokenUsage.output_tokens * 15) / 1_000_000

    // Extract text from response
    const responseText = message.content.reduce<string>((acc, block) => {
      if (block.type === 'text') return acc + block.text
      return acc
    }, '')

    // Parse JSON response
    let analysis: ClaudeAnalysisResponse
    try {
      // Try to extract JSON from response (Claude sometimes wraps in ```json blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error('No JSON found in Claude response')
        return { analysis: NONE_RESPONSE, tokenUsage, costUsd, processingTimeMs }
      }
      analysis = JSON.parse(jsonMatch[0]) as ClaudeAnalysisResponse
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError)
      return { analysis: NONE_RESPONSE, tokenUsage, costUsd, processingTimeMs }
    }

    // Validate required fields
    if (!analysis.alert_level || !analysis.scenario_update) {
      console.error('Invalid analysis response: missing required fields')
      return { analysis: NONE_RESPONSE, tokenUsage, costUsd, processingTimeMs }
    }

    // Ensure alert_level is valid
    const validLevels: ScenarioAlertLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE']
    if (!validLevels.includes(analysis.alert_level)) {
      analysis.alert_level = 'NONE'
    }

    return { analysis, tokenUsage, costUsd, processingTimeMs }
  } catch (error) {
    const processingTimeMs = Date.now() - startTime
    console.error('Claude API call failed:', error)
    return {
      analysis: NONE_RESPONSE,
      tokenUsage: { input_tokens: 0, output_tokens: 0 },
      costUsd: 0,
      processingTimeMs,
    }
  }
}
