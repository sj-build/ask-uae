/**
 * KARA Scenario Intelligence Agent — API Route
 * Cron-triggered endpoint that runs the scenario analysis pipeline
 *
 * Pipeline: Collect → Filter → Analyze (Claude) → Update State → Dispatch Alerts
 */

import { NextResponse } from 'next/server'
import { collectNewData } from '@/lib/hormuz/scenario-collector'
import { hasSignificantUpdates, analyzeWithClaude } from '@/lib/hormuz/scenario-analyzer'
import { updateScenarioState } from '@/lib/hormuz/scenario-state'
import { dispatchScenarioAlert } from '@/lib/hormuz/scenario-dispatcher'
import {
  getLatestScenarioState,
  insertAnalysisLog,
  getDailyApiCost,
  getHourlyApiCallCount,
  markAnalysisTelegramSent,
} from '@/lib/hormuz/scenario-queries'
import { AGENT_CONFIG } from '@/data/hormuz/scenario-config'

export const maxDuration = 55

function verifyCronSecret(request: Request): boolean {
  const cronSecret = request.headers.get('x-cron-secret')
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET) {
    return process.env.NODE_ENV === 'development'
  }
  return (
    cronSecret === process.env.CRON_SECRET ||
    authHeader === `Bearer ${process.env.CRON_SECRET}`
  )
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // 1. Cost controls — check limits before doing anything
    const [dailyCost, hourlyCount] = await Promise.all([
      getDailyApiCost(),
      getHourlyApiCallCount(),
    ])

    if (dailyCost >= AGENT_CONFIG.maxDailyCostUsd) {
      return NextResponse.json({
        success: true,
        message: `Daily cost limit reached ($${dailyCost.toFixed(2)} / $${AGENT_CONFIG.maxDailyCostUsd}). Skipping analysis.`,
        skipped: true,
      })
    }

    if (hourlyCount >= AGENT_CONFIG.maxApiCallsPerHour) {
      return NextResponse.json({
        success: true,
        message: `Hourly call limit reached (${hourlyCount} / ${AGENT_CONFIG.maxApiCallsPerHour}). Skipping analysis.`,
        skipped: true,
      })
    }

    // 2. Collect new data from all Hormuz sources
    const newData = await collectNewData()

    // 3. Significance filter — avoid unnecessary Claude API calls
    if (!hasSignificantUpdates(newData)) {
      return NextResponse.json({
        success: true,
        message: `No significant updates. ${newData.news_count} news, oil change ${newData.oil_change_1h_pct.toFixed(1)}%, ${newData.minutes_since_last_analysis}min since last analysis.`,
        skipped: true,
        data_summary: {
          news_count: newData.news_count,
          critical_news: newData.news_severity_critical,
          high_news: newData.news_severity_high,
          oil_change_pct: newData.oil_change_1h_pct,
          traffic_change_pct: newData.traffic_change_1h_pct,
          new_alerts: newData.new_security_alerts,
          minutes_since_last: newData.minutes_since_last_analysis,
        },
      })
    }

    // 4. Load current scenario state
    const currentState = await getLatestScenarioState()

    // 5. Call Claude API for analysis
    const { analysis, tokenUsage, costUsd, processingTimeMs } =
      await analyzeWithClaude(currentState, newData)

    // 6. Log the analysis
    const newsIds = newData.news.map((n) => Number(n.id)).filter((id) => !isNaN(id))
    const analysisId = await insertAnalysisLog({
      timestamp: new Date().toISOString(),
      input_data_summary: `${newData.news_count} news (${newData.news_severity_critical} critical, ${newData.news_severity_high} high), oil Brent $${newData.oil.brent_price ?? 'N/A'}, traffic ${newData.traffic?.total_vessels ?? 0} vessels`,
      news_ids_analyzed: newsIds,
      claude_request: null, // Don't store full prompt to save space
      claude_response: analysis,
      alert_level: analysis.alert_level,
      scenario_changed: analysis.scenario_update.changed,
      variables_changed: analysis.variable_changes,
      telegram_sent: false,
      telegram_message_id: null,
      processing_time_ms: processingTimeMs,
      token_usage: tokenUsage,
      cost_usd: costUsd,
    })

    // 7. Update scenario state if analysis is meaningful
    if (analysis.alert_level !== 'NONE' && analysisId) {
      await updateScenarioState(analysis, newsIds, analysisId)
    }

    // 8. Dispatch Telegram alerts for CRITICAL and HIGH
    let telegramSent = false
    if (analysis.alert_level === 'CRITICAL' || analysis.alert_level === 'HIGH') {
      telegramSent = await dispatchScenarioAlert(analysis)
      if (telegramSent && analysisId) {
        await markAnalysisTelegramSent(analysisId)
      }
    }

    // 9. Return success summary
    return NextResponse.json({
      success: true,
      message: `Analysis complete. Alert: ${analysis.alert_level}, Scenario: ${analysis.scenario_update.primary_scenario} (changed: ${analysis.scenario_update.changed}), Cost: $${costUsd.toFixed(4)}, Time: ${processingTimeMs}ms`,
      alert_level: analysis.alert_level,
      scenario_changed: analysis.scenario_update.changed,
      primary_scenario: analysis.scenario_update.primary_scenario,
      transition: analysis.scenario_update.transition_detected,
      telegram_sent: telegramSent,
      cost_usd: costUsd,
      token_usage: tokenUsage,
      processing_time_ms: processingTimeMs,
      daily_cost_total: dailyCost + costUsd,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Scenario agent failed'
    console.error('scenario-agent error:', error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
