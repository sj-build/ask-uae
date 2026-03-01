/**
 * Hormuz Alert Engine — 8 trigger types
 * Evaluates conditions and sends Telegram alerts with cooldown management
 */

import { getSupabaseAdmin } from '@/lib/supabase'
import { isAlertInCooldown, logTelegramAlert } from '@/lib/hormuz/queries'
import type {
  AlertLevel,
  TriggerType,
} from '@/types/hormuz'

// --- Config ---
interface AlertTriggerConfig {
  type: TriggerType
  cooldownMinutes: number
  level: AlertLevel
}

const TRIGGER_CONFIGS: Record<TriggerType, AlertTriggerConfig> = {
  traffic_drop: { type: 'traffic_drop', cooldownMinutes: 120, level: 'critical' },
  oil_spike: { type: 'oil_spike', cooldownMinutes: 30, level: 'warning' },
  vessel_u_turn: { type: 'vessel_u_turn', cooldownMinutes: 60, level: 'warning' },
  dark_vessel_surge: { type: 'dark_vessel_surge', cooldownMinutes: 120, level: 'warning' },
  security_alert_new: { type: 'security_alert_new', cooldownMinutes: 60, level: 'critical' },
  war_news_critical: { type: 'war_news_critical', cooldownMinutes: 30, level: 'warning' },
  insurance_indicator: { type: 'insurance_indicator', cooldownMinutes: 360, level: 'warning' },
  scheduled_status: { type: 'scheduled_status', cooldownMinutes: 360, level: 'status' },
}

// --- Telegram sender ---
async function sendTelegramMessage(
  chatId: string,
  text: string,
  botToken: string,
): Promise<{ ok: boolean; messageId: string | null }> {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error(`Telegram send failed (${res.status}):`, errText)
      return { ok: false, messageId: null }
    }

    const data = await res.json() as { ok: boolean; result?: { message_id: number } }
    return {
      ok: data.ok,
      messageId: data.result?.message_id ? String(data.result.message_id) : null,
    }
  } catch (error) {
    console.error('Telegram send error:', error instanceof Error ? error.message : error)
    return { ok: false, messageId: null }
  }
}

interface AlertResult {
  trigger: TriggerType
  fired: boolean
  level: AlertLevel
  message: string | null
  cooldown: boolean
}

// --- Individual trigger checks ---

async function checkTrafficDrop(): Promise<AlertResult> {
  const trigger: TriggerType = 'traffic_drop'
  const config = TRIGGER_CONFIGS[trigger]

  try {
    const supabase = getSupabaseAdmin()

    // Get latest hourly traffic
    const { data: recent } = await supabase
      .from('hormuz_traffic_summary')
      .select('total_vessels, period_start')
      .eq('period_type', 'hourly')
      .eq('zone', 'hormuz')
      .order('period_start', { ascending: false })
      .limit(25) // ~24h of hourly data

    if (!recent || recent.length < 2) {
      return { trigger, fired: false, level: config.level, message: null, cooldown: false }
    }

    const latestCount = recent[0].total_vessels
    const avg24h = recent.slice(1).reduce((sum, r) => sum + r.total_vessels, 0) / (recent.length - 1)

    if (latestCount < avg24h * 0.5) {
      const inCooldown = await isAlertInCooldown(trigger, config.cooldownMinutes)
      if (inCooldown) {
        return { trigger, fired: false, level: config.level, message: null, cooldown: true }
      }

      const message = `🚨 <b>TRAFFIC DROP — CRITICAL</b>\n\n` +
        `Hourly vessel count: <code>${latestCount}</code>\n` +
        `24h average: <code>${Math.round(avg24h)}</code>\n` +
        `Drop: <code>${Math.round((1 - latestCount / avg24h) * 100)}%</code>\n\n` +
        `<i>Potential Hormuz transit disruption</i>`
      return { trigger, fired: true, level: 'critical', message, cooldown: false }
    }
  } catch (error) {
    console.error('checkTrafficDrop error:', error)
  }

  return { trigger, fired: false, level: config.level, message: null, cooldown: false }
}

async function checkOilSpike(): Promise<AlertResult> {
  const trigger: TriggerType = 'oil_spike'
  const config = TRIGGER_CONFIGS[trigger]

  try {
    const supabase = getSupabaseAdmin()

    const { data: prices } = await supabase
      .from('oil_price_tracking')
      .select('benchmark, price, prev_close, change_30m_pct, change_1h_pct, spike_flag')
      .order('fetched_at', { ascending: false })
      .limit(4)

    if (!prices || prices.length === 0) {
      return { trigger, fired: false, level: config.level, message: null, cooldown: false }
    }

    const spikedPrices = prices.filter(p => p.spike_flag)
    if (spikedPrices.length === 0) {
      return { trigger, fired: false, level: config.level, message: null, cooldown: false }
    }

    const inCooldown = await isAlertInCooldown(trigger, config.cooldownMinutes)
    if (inCooldown) {
      return { trigger, fired: false, level: config.level, message: null, cooldown: true }
    }

    // Determine severity
    const has1hSpike = prices.some(p => {
      const change1h = Math.abs(Number(p.change_1h_pct ?? 0))
      const priceDiff = p.prev_close ? Math.abs(p.price - p.prev_close) : 0
      return priceDiff > 10 || change1h > 10
    })

    const level: AlertLevel = has1hSpike ? 'critical' : 'warning'
    const levelEmoji = has1hSpike ? '🔴' : '⚠️'

    const lines = spikedPrices.map(p =>
      `${p.benchmark.toUpperCase()}: <code>$${p.price}</code> (30m: ${p.change_30m_pct ?? 'N/A'}%, 1h: ${p.change_1h_pct ?? 'N/A'}%)`
    )

    const message = `${levelEmoji} <b>OIL PRICE SPIKE — ${level.toUpperCase()}</b>\n\n` +
      lines.join('\n') +
      `\n\n<i>Possible Hormuz supply disruption signal</i>`

    return { trigger, fired: true, level, message, cooldown: false }
  } catch (error) {
    console.error('checkOilSpike error:', error)
  }

  return { trigger, fired: false, level: config.level, message: null, cooldown: false }
}

async function checkVesselUTurn(): Promise<AlertResult> {
  const trigger: TriggerType = 'vessel_u_turn'
  const config = TRIGGER_CONFIGS[trigger]

  try {
    const supabase = getSupabaseAdmin()
    const oneHourAgo = new Date(Date.now() - 3600_000).toISOString()

    const { data: uTurns } = await supabase
      .from('hormuz_vessel_tracking')
      .select('mmsi, vessel_name, zone')
      .eq('status', 'u_turn')
      .gte('timestamp', oneHourAgo)

    if (!uTurns || uTurns.length < 3) {
      return { trigger, fired: false, level: config.level, message: null, cooldown: false }
    }

    const inCooldown = await isAlertInCooldown(trigger, config.cooldownMinutes)
    if (inCooldown) {
      return { trigger, fired: false, level: config.level, message: null, cooldown: true }
    }

    const vesselNames = uTurns.slice(0, 5).map(v =>
      v.vessel_name ? `<code>${v.vessel_name}</code> (${v.zone})` : `MMSI ${v.mmsi}`
    )

    const message = `⚠️ <b>VESSEL U-TURNS DETECTED</b>\n\n` +
      `<code>${uTurns.length}</code> vessels performed u-turns in the last hour:\n` +
      vesselNames.join('\n') +
      (uTurns.length > 5 ? `\n...and ${uTurns.length - 5} more` : '') +
      `\n\n<i>Vessels may be avoiding Hormuz transit</i>`

    return { trigger, fired: true, level: config.level, message, cooldown: false }
  } catch (error) {
    console.error('checkVesselUTurn error:', error)
  }

  return { trigger, fired: false, level: config.level, message: null, cooldown: false }
}

async function checkDarkVesselSurge(): Promise<AlertResult> {
  const trigger: TriggerType = 'dark_vessel_surge'
  const config = TRIGGER_CONFIGS[trigger]

  try {
    const supabase = getSupabaseAdmin()

    // Get latest and baseline dark counts
    const { data: summaries } = await supabase
      .from('hormuz_traffic_summary')
      .select('dark_vessel_count, period_start')
      .eq('period_type', 'hourly')
      .eq('zone', 'hormuz')
      .order('period_start', { ascending: false })
      .limit(25)

    if (!summaries || summaries.length < 2) {
      return { trigger, fired: false, level: config.level, message: null, cooldown: false }
    }

    const latestDark = summaries[0].dark_vessel_count
    const baselineDark = summaries.slice(1).reduce((sum, s) => sum + s.dark_vessel_count, 0) / (summaries.length - 1)

    if (baselineDark > 0 && latestDark > baselineDark * 2) {
      const inCooldown = await isAlertInCooldown(trigger, config.cooldownMinutes)
      if (inCooldown) {
        return { trigger, fired: false, level: config.level, message: null, cooldown: true }
      }

      const message = `⚠️ <b>DARK VESSEL SURGE</b>\n\n` +
        `Current dark vessels: <code>${latestDark}</code>\n` +
        `Baseline average: <code>${Math.round(baselineDark)}</code>\n` +
        `Increase: <code>${Math.round((latestDark / baselineDark - 1) * 100)}%</code>\n\n` +
        `<i>Possible AIS transponder shutoffs — sanctions evasion or threat</i>`

      return { trigger, fired: true, level: config.level, message, cooldown: false }
    }
  } catch (error) {
    console.error('checkDarkVesselSurge error:', error)
  }

  return { trigger, fired: false, level: config.level, message: null, cooldown: false }
}

async function checkSecurityAlert(): Promise<AlertResult> {
  const trigger: TriggerType = 'security_alert_new'
  const config = TRIGGER_CONFIGS[trigger]

  try {
    const supabase = getSupabaseAdmin()
    const oneHourAgo = new Date(Date.now() - 3600_000).toISOString()

    const { data: alerts } = await supabase
      .from('maritime_security_alerts')
      .select('title, source, threat_level, region, affects_hormuz')
      .eq('threat_level', 'critical')
      .gte('created_at', oneHourAgo)

    if (!alerts || alerts.length === 0) {
      return { trigger, fired: false, level: config.level, message: null, cooldown: false }
    }

    const inCooldown = await isAlertInCooldown(trigger, config.cooldownMinutes)
    if (inCooldown) {
      return { trigger, fired: false, level: config.level, message: null, cooldown: true }
    }

    const alertLines = alerts.slice(0, 3).map(a =>
      `• <b>${a.source.toUpperCase()}</b>: ${a.title}${a.affects_hormuz ? ' 🎯' : ''}`
    )

    const message = `🔴 <b>CRITICAL SECURITY ALERT</b>\n\n` +
      alertLines.join('\n') +
      `\n\nRegion: <code>${alerts[0].region ?? 'Unknown'}</code>` +
      `\n\n<i>New critical maritime security advisory issued</i>`

    return { trigger, fired: true, level: 'critical', message, cooldown: false }
  } catch (error) {
    console.error('checkSecurityAlert error:', error)
  }

  return { trigger, fired: false, level: config.level, message: null, cooldown: false }
}

async function checkWarNewsCritical(): Promise<AlertResult> {
  const trigger: TriggerType = 'war_news_critical'
  const config = TRIGGER_CONFIGS[trigger]

  try {
    const supabase = getSupabaseAdmin()
    const thirtyMinAgo = new Date(Date.now() - 30 * 60_000).toISOString()

    const { data: news } = await supabase
      .from('war_news_feed')
      .select('title, source_name, severity, category')
      .eq('severity', 'critical')
      .gte('fetched_at', thirtyMinAgo)

    if (!news || news.length === 0) {
      return { trigger, fired: false, level: config.level, message: null, cooldown: false }
    }

    const inCooldown = await isAlertInCooldown(trigger, config.cooldownMinutes)
    if (inCooldown) {
      return { trigger, fired: false, level: config.level, message: null, cooldown: true }
    }

    const newsLines = news.slice(0, 3).map(n =>
      `• <b>${n.source_name}</b>: ${n.title}`
    )

    const message = `⚠️ <b>CRITICAL WAR NEWS</b>\n\n` +
      newsLines.join('\n') +
      `\n\nCategory: <code>${news[0].category ?? 'Unknown'}</code>` +
      `\n\n<i>Breaking: critical severity news detected</i>`

    return { trigger, fired: true, level: config.level, message, cooldown: false }
  } catch (error) {
    console.error('checkWarNewsCritical error:', error)
  }

  return { trigger, fired: false, level: config.level, message: null, cooldown: false }
}

async function checkInsuranceIndicator(): Promise<AlertResult> {
  const trigger: TriggerType = 'insurance_indicator'
  const config = TRIGGER_CONFIGS[trigger]

  try {
    const supabase = getSupabaseAdmin()

    const { data: indicators } = await supabase
      .from('shipping_market_indicators')
      .select('value, fetched_at')
      .eq('indicator_type', 'insurance_proxy_score')
      .order('fetched_at', { ascending: false })
      .limit(2)

    if (!indicators || indicators.length < 2) {
      return { trigger, fired: false, level: config.level, message: null, cooldown: false }
    }

    const current = indicators[0].value
    const previous = indicators[1].value
    const change = current - previous

    if (Math.abs(change) >= 2) {
      const inCooldown = await isAlertInCooldown(trigger, config.cooldownMinutes)
      if (inCooldown) {
        return { trigger, fired: false, level: config.level, message: null, cooldown: true }
      }

      const direction = change > 0 ? '📈' : '📉'
      const message = `${direction} <b>INSURANCE RISK SCORE CHANGE</b>\n\n` +
        `Current score: <code>${current}/10</code>\n` +
        `Previous: <code>${previous}/10</code>\n` +
        `Change: <code>${change > 0 ? '+' : ''}${change}</code>\n\n` +
        `<i>Significant shift in maritime insurance risk perception</i>`

      return { trigger, fired: true, level: config.level, message, cooldown: false }
    }
  } catch (error) {
    console.error('checkInsuranceIndicator error:', error)
  }

  return { trigger, fired: false, level: config.level, message: null, cooldown: false }
}

async function generateScheduledStatus(): Promise<AlertResult> {
  const trigger: TriggerType = 'scheduled_status'
  const config = TRIGGER_CONFIGS[trigger]

  const inCooldown = await isAlertInCooldown(trigger, config.cooldownMinutes)
  if (inCooldown) {
    return { trigger, fired: false, level: config.level, message: null, cooldown: true }
  }

  try {
    const supabase = getSupabaseAdmin()

    // Gather latest stats
    const [trafficRes, oilRes, alertRes, newsRes] = await Promise.all([
      supabase
        .from('hormuz_traffic_summary')
        .select('total_vessels, tanker_count, u_turn_count, dark_vessel_count')
        .eq('period_type', 'hourly')
        .eq('zone', 'hormuz')
        .order('period_start', { ascending: false })
        .limit(1),
      supabase
        .from('oil_price_tracking')
        .select('benchmark, price, change_pct, spike_flag')
        .order('fetched_at', { ascending: false })
        .limit(2),
      supabase
        .from('maritime_security_alerts')
        .select('id')
        .eq('threat_level', 'critical')
        .gte('created_at', new Date(Date.now() - 6 * 3600_000).toISOString()),
      supabase
        .from('war_news_feed')
        .select('id')
        .in('severity', ['critical', 'high'])
        .gte('fetched_at', new Date(Date.now() - 6 * 3600_000).toISOString()),
    ])

    const traffic = trafficRes.data?.[0]
    const oils = oilRes.data ?? []
    const brent = oils.find(p => p.benchmark === 'brent')
    const wti = oils.find(p => p.benchmark === 'wti')
    const critAlerts = alertRes.data?.length ?? 0
    const critNews = newsRes.data?.length ?? 0

    const now = new Date()
    const timeStr = now.toLocaleString('en-US', { timeZone: 'Asia/Dubai', hour12: false })

    const message = `📊 <b>HORMUZ STATUS UPDATE</b>\n` +
      `<i>${timeStr} (GST)</i>\n\n` +
      `<b>Traffic:</b>\n` +
      `  Vessels: <code>${traffic?.total_vessels ?? 'N/A'}</code>\n` +
      `  Tankers: <code>${traffic?.tanker_count ?? 'N/A'}</code>\n` +
      `  U-turns: <code>${traffic?.u_turn_count ?? 0}</code>\n` +
      `  Dark: <code>${traffic?.dark_vessel_count ?? 0}</code>\n\n` +
      `<b>Oil Prices:</b>\n` +
      `  Brent: <code>$${brent?.price ?? 'N/A'}</code> (${brent?.change_pct ?? 0}%)${brent?.spike_flag ? ' ⚠️' : ''}\n` +
      `  WTI: <code>$${wti?.price ?? 'N/A'}</code> (${wti?.change_pct ?? 0}%)\n\n` +
      `<b>Alerts (6h):</b> ${critAlerts} critical security, ${critNews} critical/high news`

    return { trigger, fired: true, level: 'status', message, cooldown: false }
  } catch (error) {
    console.error('generateScheduledStatus error:', error)
  }

  return { trigger, fired: false, level: config.level, message: null, cooldown: false }
}

// --- Main evaluator ---
export interface EvaluationResult {
  totalChecked: number
  alertsFired: number
  alertsSent: number
  cooldownSkipped: number
  details: AlertResult[]
}

export async function evaluateAlerts(): Promise<EvaluationResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatIds = process.env.TELEGRAM_ALLOWED_CHAT_IDS?.split(',').map(s => s.trim()).filter(Boolean) ?? []

  if (!botToken || chatIds.length === 0) {
    console.warn('Telegram not configured: TELEGRAM_BOT_TOKEN or TELEGRAM_ALLOWED_CHAT_IDS missing')
    return { totalChecked: 0, alertsFired: 0, alertsSent: 0, cooldownSkipped: 0, details: [] }
  }

  // Run all checks in parallel
  const results = await Promise.all([
    checkTrafficDrop(),
    checkOilSpike(),
    checkVesselUTurn(),
    checkDarkVesselSurge(),
    checkSecurityAlert(),
    checkWarNewsCritical(),
    checkInsuranceIndicator(),
    generateScheduledStatus(),
  ])

  let alertsFired = 0
  let alertsSent = 0
  let cooldownSkipped = 0

  for (const result of results) {
    if (result.cooldown) {
      cooldownSkipped++
      continue
    }

    if (!result.fired || !result.message) continue
    alertsFired++

    // Send to all configured chat IDs
    for (const chatId of chatIds) {
      const sendResult = await sendTelegramMessage(chatId, result.message, botToken)

      await logTelegramAlert({
        alert_level: result.level,
        trigger_type: result.trigger,
        title: null,
        message: result.message,
        chat_id: chatId,
        message_id: sendResult.messageId,
        delivery_status: sendResult.ok ? 'sent' : 'failed',
        cooldown_key: result.trigger,
        related_data: null,
        sent_at: new Date().toISOString(),
      })

      if (sendResult.ok) alertsSent++
    }
  }

  return {
    totalChecked: results.length,
    alertsFired,
    alertsSent,
    cooldownSkipped,
    details: results,
  }
}
