/**
 * KARA Scenario Agent — Telegram Dispatcher
 * Formats and sends scenario alerts and status reports via Telegram
 */

import { sendMessage } from '../telegram/client'
import {
  SCENARIO_LABELS,
  ALERT_LEVEL_EMOJI,
  KEY_VARIABLES,
  IMPACT_MATRIX,
  VARIABLE_CATEGORY_LABELS,
} from '@/data/hormuz/scenario-config'
import type {
  ClaudeAnalysisResponse,
  ScenarioAlertLevel,
  ScenarioId,
  ScenarioStateRow,
} from '@/types/scenario'

/**
 * Get all Telegram chat IDs from environment
 */
function getChatIds(): string[] {
  const ids = process.env.TELEGRAM_ALLOWED_CHAT_IDS
  if (!ids) return []
  return ids.split(',').map((id) => id.trim()).filter(Boolean)
}

/**
 * Send a message to all authorized Telegram chats
 */
async function broadcast(message: string): Promise<void> {
  const chatIds = getChatIds()
  await Promise.allSettled(
    chatIds.map((chatId) => sendMessage(chatId, message))
  )
}

/**
 * Dispatch scenario alert based on analysis result.
 * Only sends for CRITICAL and HIGH alert levels.
 */
export async function dispatchScenarioAlert(
  analysis: ClaudeAnalysisResponse
): Promise<boolean> {
  const level = analysis.alert_level as ScenarioAlertLevel

  // Only send for CRITICAL and HIGH
  if (level !== 'CRITICAL' && level !== 'HIGH') {
    return false
  }

  // Use Claude's formatted message if available, otherwise build one
  let message = analysis.telegram_message_ko
  if (!message || message.trim().length === 0) {
    message = buildAlertMessage(analysis)
  }

  await broadcast(message)
  return true
}

/**
 * Build alert message from analysis data (fallback if Claude didn't generate one)
 */
function buildAlertMessage(analysis: ClaudeAnalysisResponse): string {
  const emoji = ALERT_LEVEL_EMOJI[analysis.alert_level] ?? '📊'
  const { scenario_update, market_impact, variable_changes } = analysis

  const lines: string[] = []

  // Header
  if (scenario_update.transition_detected) {
    lines.push(`${emoji} <b>시나리오 전환 감지</b>`)
    lines.push('')
    const [from, to] = scenario_update.transition_detected.split('→')
    const fromLabel = SCENARIO_LABELS[from as ScenarioId]?.ko ?? from
    const toLabel = SCENARIO_LABELS[to as ScenarioId]?.ko ?? to
    lines.push(`시나리오 ${from} (${fromLabel}) → ${to} (${toLabel})로 이동 중`)
  } else {
    lines.push(`${emoji} <b>핵심 변수 변화</b>`)
  }
  lines.push('')

  // Summary
  if (analysis.summary_ko) {
    lines.push(`📝 ${analysis.summary_ko}`)
    lines.push('')
  }

  // Probability update
  lines.push('📊 <b>확률 업데이트</b>')
  const scenarioIds: ScenarioId[] = ['A', 'B', 'C', 'D']
  for (const id of scenarioIds) {
    const prev = scenario_update.previous[id]
    const curr = scenario_update.updated[id]
    const diff = curr - prev
    const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '━'
    const label = SCENARIO_LABELS[id]?.ko ?? id
    lines.push(`${SCENARIO_LABELS[id]?.emoji ?? ''} ${id} ${label}: ${prev}% → ${curr}% (${arrow}${diff !== 0 ? Math.abs(diff) : ''})`)
  }
  lines.push('')

  // Variable changes
  if (variable_changes.length > 0) {
    lines.push('🔑 <b>변수 변화</b>')
    for (const change of variable_changes.slice(0, 5)) {
      const desc = KEY_VARIABLES[change.variable]?.description ?? change.variable
      lines.push(`• ${desc}: <code>${change.old_value}</code> → <code>${change.new_value}</code>`)
      if (change.source) lines.push(`  출처: ${change.source} (신뢰도: ${Math.round(change.confidence * 100)}%)`)
    }
    lines.push('')
  }

  // Market impact
  if (market_impact) {
    lines.push('💹 <b>시장 영향 전망</b>')
    if (market_impact.oil?.reasoning_ko) {
      lines.push(`🛢️ 유가: ${market_impact.oil.direction} ${market_impact.oil.target}`)
    }
    if (market_impact.kospi?.sectors_ko) {
      lines.push(`📈 KOSPI: ${market_impact.kospi.direction} ${market_impact.kospi.magnitude}`)
    }
    if (market_impact.kara_fund?.action_ko) {
      lines.push(`🏢 KARA Fund: ${market_impact.kara_fund.action_ko}`)
    }
    lines.push('')
  }

  // Timestamp
  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  lines.push(`🕐 ${now} KST`)

  return lines.join('\n')
}

/**
 * Format probability bar for status report
 */
function probabilityBar(pct: number): string {
  const filled = Math.round(pct / 10)
  return '█'.repeat(filled) + '░'.repeat(10 - filled)
}

/**
 * Dispatch periodic status report (6-hourly)
 */
export async function dispatchStatusReport(
  state: ScenarioStateRow
): Promise<void> {
  const now = new Date()
  const kstTime = now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  const variables = (state.variables_snapshot ?? {}) as Record<string, string | number>

  const lines: string[] = []

  // Header
  lines.push('📊 <b>KARA 시나리오 정기 보고</b>')
  lines.push('')
  lines.push(`🗓️ ${kstTime} KST`)
  lines.push('')

  // Probability bars
  lines.push('━━ <b>시나리오 확률</b> ━━')
  const scenarios: Array<{ id: ScenarioId; pct: number }> = [
    { id: 'A', pct: Number(state.scenario_a_pct) },
    { id: 'B', pct: Number(state.scenario_b_pct) },
    { id: 'C', pct: Number(state.scenario_c_pct) },
    { id: 'D', pct: Number(state.scenario_d_pct) },
  ]

  for (const { id, pct } of scenarios) {
    const label = SCENARIO_LABELS[id]?.ko ?? id
    lines.push(`${SCENARIO_LABELS[id]?.emoji ?? ''} ${id} ${label}: ${probabilityBar(pct)} ${pct}%`)
  }

  const primary = SCENARIO_LABELS[state.primary_scenario as ScenarioId]?.ko ?? state.primary_scenario
  lines.push(`주 시나리오: <b>${state.primary_scenario} ${primary}</b>`)
  lines.push('')

  // Key variables
  lines.push('━━ <b>핵심 변수</b> ━━')
  const variableDisplay: Array<{ key: string; emoji: string }> = [
    { key: 'irgc_command_status', emoji: '🎯' },
    { key: 'hormuz_status', emoji: '🚢' },
    { key: 'oil_price_brent', emoji: '🛢️' },
    { key: 'uae_airport_status', emoji: '✈️' },
    { key: 'ceasefire_talks', emoji: '🕊️' },
    { key: 'iran_military_defections', emoji: '🏳️' },
    { key: 'russia_china_stance', emoji: '🌍' },
  ]

  for (const { key, emoji } of variableDisplay) {
    const desc = KEY_VARIABLES[key]?.description ?? key
    const value = variables[key] ?? 'N/A'
    lines.push(`${emoji} ${desc}: <code>${value}</code>`)
  }
  lines.push('')

  // KARA Fund status
  lines.push('━━ <b>KARA Fund 상태</b> ━━')
  if (state.reasoning) {
    lines.push(`📝 ${state.reasoning.slice(0, 200)}`)
  }
  lines.push('')

  // Footer
  const nextReport = new Date(now.getTime() + 6 * 3600_000)
  const nextKst = nextReport.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
  })
  lines.push('━━━━━━━━━━━━━━━')
  lines.push(`다음 보고: ${nextKst} KST`)

  await broadcast(lines.join('\n'))
}

/**
 * Format scenario state for Telegram command response
 */
export function formatScenarioStatus(state: ScenarioStateRow, lang: 'ko' | 'en'): string {
  const scenarios: Array<{ id: ScenarioId; pct: number }> = [
    { id: 'A', pct: Number(state.scenario_a_pct) },
    { id: 'B', pct: Number(state.scenario_b_pct) },
    { id: 'C', pct: Number(state.scenario_c_pct) },
    { id: 'D', pct: Number(state.scenario_d_pct) },
  ]

  const lines: string[] = []
  const isKo = lang === 'ko'

  lines.push(isKo ? '🧠 <b>KARA 시나리오 현황</b>' : '🧠 <b>KARA Scenario Status</b>')
  lines.push('')

  for (const { id, pct } of scenarios) {
    const label = isKo ? SCENARIO_LABELS[id]?.ko : SCENARIO_LABELS[id]?.en
    lines.push(`${SCENARIO_LABELS[id]?.emoji ?? ''} ${id} ${label}: ${probabilityBar(pct)} <code>${pct}%</code>`)
  }

  const primaryLabel = isKo
    ? SCENARIO_LABELS[state.primary_scenario as ScenarioId]?.ko
    : SCENARIO_LABELS[state.primary_scenario as ScenarioId]?.en
  lines.push('')
  lines.push(isKo
    ? `주 시나리오: <b>${state.primary_scenario} ${primaryLabel}</b>`
    : `Primary: <b>${state.primary_scenario} ${primaryLabel}</b>`
  )

  if (state.transition_detected) {
    lines.push('')
    lines.push(isKo
      ? `⚠️ 최근 전환: <b>${state.transition_detected}</b>`
      : `⚠️ Recent transition: <b>${state.transition_detected}</b>`
    )
  }

  if (state.reasoning) {
    lines.push('')
    lines.push(`📝 ${state.reasoning.slice(0, 300)}`)
  }

  const timestamp = new Date(state.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  lines.push('')
  lines.push(`🕐 ${timestamp} KST`)

  return lines.join('\n')
}

/**
 * Format variables status for Telegram command response
 */
export function formatVariablesStatus(
  variables: Record<string, string | number>,
  lang: 'ko' | 'en'
): string {
  const isKo = lang === 'ko'
  const lines: string[] = []

  lines.push(isKo ? '📊 <b>핵심 변수 현황</b>' : '📊 <b>Key Variables Status</b>')
  lines.push('')

  // Group by category
  const categories = ['military', 'political', 'market', 'diplomatic'] as const
  for (const cat of categories) {
    const catLabel = isKo ? VARIABLE_CATEGORY_LABELS[cat]?.ko : VARIABLE_CATEGORY_LABELS[cat]?.en
    const catEmoji = VARIABLE_CATEGORY_LABELS[cat]?.emoji ?? ''
    lines.push(`${catEmoji} <b>${catLabel}</b>`)

    for (const [key, def] of Object.entries(KEY_VARIABLES)) {
      if (def.category !== cat) continue
      const value = variables[key] ?? def.default_value
      lines.push(`  • ${def.description}: <code>${value}</code>`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Format impact analysis for Telegram command response
 */
export function formatImpactAnalysis(
  state: ScenarioStateRow,
  lang: 'ko' | 'en'
): string {
  const isKo = lang === 'ko'
  const lines: string[] = []

  const primary = state.primary_scenario as ScenarioId
  const impact = IMPACT_MATRIX[primary]

  if (!impact) {
    return isKo ? '❌ 시나리오 영향 데이터가 없습니다.' : '❌ No impact data for current scenario.'
  }

  const label = isKo ? SCENARIO_LABELS[primary]?.ko : SCENARIO_LABELS[primary]?.en
  lines.push(isKo ? `💹 <b>시나리오 ${primary} (${label}) 시장 영향</b>` : `💹 <b>Scenario ${primary} (${label}) Market Impact</b>`)
  lines.push('')

  lines.push(`🛢️ <b>${isKo ? '유가' : 'Oil'}</b>`)
  lines.push(`  ${impact.oil.direction} ${impact.oil.range} (${impact.oil.timeline})`)
  lines.push(`  ${impact.oil.reasoning}`)
  lines.push('')

  lines.push(`📈 <b>KOSPI</b>`)
  lines.push(`  ${impact.kospi.direction} ${impact.kospi.magnitude} (${impact.kospi.timeline})`)
  for (const [sector, desc] of Object.entries(impact.kospi.sectors)) {
    lines.push(`  • ${sector}: ${desc}`)
  }
  lines.push('')

  lines.push(`🏢 <b>KARA Fund</b>`)
  lines.push(`  LP 미팅: ${impact.kara_fund.lp_meeting}`)
  lines.push(`  테제: ${impact.kara_fund.thesis_strength}`)
  for (const action of impact.kara_fund.action_items) {
    lines.push(`  • ${action}`)
  }

  return lines.join('\n')
}
