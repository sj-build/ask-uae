import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { upsertShippingIndicator } from '@/lib/hormuz/queries'
import type { IndicatorType, ShippingIndicator } from '@/types/hormuz'

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

// --- Freight rate extraction from shipping news ---
interface FreightDataPoint {
  indicatorType: IndicatorType
  name: string
  value: number
  unit: string
  source: string
  changePct: number | null
  notes: string | null
}

// --- VLCC TD3C rate extraction from multiple sources ---

/** Parse Hellenic Shipping News RSS for VLCC TD3C rates */
async function scrapeHellenicRSS(): Promise<FreightDataPoint[]> {
  const dataPoints: FreightDataPoint[] = []

  try {
    const res = await fetch('https://www.hellenicshippingnews.com/feed/', {
      headers: { 'User-Agent': 'HormuzDashboard/1.0' },
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) return dataPoints

    const xml = await res.text()

    // Extract TD3C WS rates: "TD3C at WS 145", "TD3C WS105", "TD3C rose to WS 200"
    const wsMatches = xml.matchAll(/TD3C[^W]{0,40}WS\s*(\d+(?:\.\d+)?)/gi)
    for (const m of wsMatches) {
      dataPoints.push({
        indicatorType: 'vlcc_freight_rate',
        name: 'VLCC TD3C Freight Rate',
        value: parseFloat(m[1]),
        unit: 'WS',
        source: 'hellenic_rss',
        changePct: null,
        notes: 'TD3C MEG→China via Hellenic RSS',
      })
      break // take first (most recent)
    }

    // Extract TCE $/day: "$300,000/day", "$117,000 a day", "TCE of $200,000"
    if (dataPoints.length === 0) {
      const tceMatches = xml.matchAll(/(?:VLCC|TD3C)[^$]{0,60}\$(\d{2,3}),?(\d{3})\s*(?:\/|a |per )\s*day/gi)
      for (const m of tceMatches) {
        const tce = parseInt(m[1] + m[2], 10)
        dataPoints.push({
          indicatorType: 'vlcc_freight_rate',
          name: 'VLCC TD3C TCE Rate',
          value: tce,
          unit: '$/day',
          source: 'hellenic_rss',
          changePct: null,
          notes: 'TD3C MEG→China TCE via Hellenic RSS',
        })
        break
      }
    }
  } catch (error) {
    console.warn('Hellenic RSS scrape failed:', error instanceof Error ? error.message : error)
  }

  return dataPoints
}

/** Parse Hellenic Shipping News category page for freight rates */
async function scrapeHellenicPage(): Promise<FreightDataPoint[]> {
  const dataPoints: FreightDataPoint[] = []

  try {
    const url = 'https://www.hellenicshippingnews.com/category/shipping-news/tanker-market/'
    const res = await fetch(url, {
      headers: { 'User-Agent': 'HormuzDashboard/1.0' },
      signal: AbortSignal.timeout(15_000),
    })

    if (res.ok) {
      const html = await res.text()
      const $ = cheerio.load(html)

      $('article, .post-item, .entry-content').each((_, el) => {
        const text = $(el).text()

        // VLCC TD3C WS pattern
        const wsMatch = text.match(/(?:VLCC|TD3C)[^W]{0,40}WS\s*(\d+(?:\.\d+)?)/i)
        if (wsMatch && dataPoints.filter(d => d.indicatorType === 'vlcc_freight_rate').length === 0) {
          dataPoints.push({
            indicatorType: 'vlcc_freight_rate',
            name: 'VLCC TD3C Freight Rate',
            value: parseFloat(wsMatch[1]),
            unit: 'WS',
            source: 'hellenicshippingnews.com',
            changePct: null,
            notes: 'TD3C MEG→China from tanker market page',
          })
        }

        // VLCC TCE $/day pattern
        const tceMatch = text.match(/(?:VLCC|TD3C)[^$]{0,60}\$(\d{2,3}),?(\d{3})\s*(?:\/|a |per )\s*day/i)
        if (tceMatch && dataPoints.filter(d => d.unit === '$/day').length === 0) {
          const tce = parseInt(tceMatch[1] + tceMatch[2], 10)
          dataPoints.push({
            indicatorType: 'vlcc_freight_rate',
            name: 'VLCC TD3C TCE Rate',
            value: tce,
            unit: '$/day',
            source: 'hellenicshippingnews.com',
            changePct: null,
            notes: 'TD3C MEG→China TCE from tanker market page',
          })
        }

        // Suezmax patterns
        const suezmaxMatch = text.match(/suezmax[^W]{0,40}WS\s*(\d+(?:\.\d+)?)/i)
        if (suezmaxMatch && dataPoints.filter(d => d.indicatorType === 'suezmax_freight_rate').length === 0) {
          dataPoints.push({
            indicatorType: 'suezmax_freight_rate',
            name: 'Suezmax Freight Rate',
            value: parseFloat(suezmaxMatch[1]),
            unit: 'WS',
            source: 'hellenicshippingnews.com',
            changePct: null,
            notes: 'Extracted from tanker market page',
          })
        }
      })
    }
  } catch (error) {
    console.warn('Hellenic page scrape failed:', error instanceof Error ? error.message : error)
  }

  return dataPoints
}

/** Scrape Baltic Exchange weekly tanker roundup for official TD3C data */
async function scrapeBalticWeeklyRoundup(): Promise<FreightDataPoint[]> {
  const dataPoints: FreightDataPoint[] = []

  try {
    // Compute ISO week number for URL
    const now = new Date()
    const yearStart = new Date(now.getFullYear(), 0, 1)
    const weekNum = Math.ceil(((now.getTime() - yearStart.getTime()) / 86400000 + yearStart.getDay() + 1) / 7)
    const year = now.getFullYear()

    // Try current and previous week
    for (const w of [weekNum, weekNum - 1]) {
      if (w < 1) continue
      const url = `https://www.balticexchange.com/en/data-services/WeeklyRoundup/tanker/news/${year}/tanker-report-week-${w}.html`

      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'HormuzDashboard/1.0' },
          signal: AbortSignal.timeout(10_000),
        })
        if (!res.ok) continue

        const html = await res.text()

        // TD3C WS rate from Baltic official narrative
        const wsMatch = html.match(/TD3C[^W]{0,60}WS\s*(\d+(?:\.\d+)?)/i)
        if (wsMatch) {
          dataPoints.push({
            indicatorType: 'vlcc_freight_rate',
            name: 'VLCC TD3C Rate (Baltic Exchange)',
            value: parseFloat(wsMatch[1]),
            unit: 'WS',
            source: 'balticexchange.com',
            changePct: null,
            notes: `Baltic weekly roundup week ${w}/${year}`,
          })
          break // found data, no need to check previous week
        }
      } catch {
        // Continue to previous week
      }
    }
  } catch (error) {
    console.warn('Baltic roundup scrape failed:', error instanceof Error ? error.message : error)
  }

  return dataPoints
}

/** Aggregate freight rates from all sources with priority */
async function scrapeFreightRates(): Promise<FreightDataPoint[]> {
  const [rssData, pageData, balticData] = await Promise.all([
    scrapeHellenicRSS(),
    scrapeHellenicPage(),
    scrapeBalticWeeklyRoundup(),
  ])

  // Priority: Baltic Exchange > Hellenic RSS > Hellenic Page
  const vlccRates: FreightDataPoint[] = []
  const otherRates: FreightDataPoint[] = []

  for (const dp of [...balticData, ...rssData, ...pageData]) {
    if (dp.indicatorType === 'vlcc_freight_rate') {
      // Only keep the first (highest priority) VLCC rate per unit
      if (!vlccRates.find(r => r.unit === dp.unit)) {
        vlccRates.push(dp)
      }
    } else {
      if (!otherRates.find(r => r.indicatorType === dp.indicatorType)) {
        otherRates.push(dp)
      }
    }
  }

  return [...vlccRates, ...otherRates]
}

// --- War risk premium monitoring ---
async function monitorWarRiskPremium(): Promise<FreightDataPoint[]> {
  const dataPoints: FreightDataPoint[] = []

  // Scrape for war risk premium mentions
  const sources = [
    'https://gcaptain.com/feed/',
    'https://www.seatrade-maritime.com/rss.xml',
  ]

  let warRiskMentions = 0
  let premiumValue: number | null = null

  for (const feedUrl of sources) {
    try {
      const res = await fetch(feedUrl, {
        headers: { 'User-Agent': 'HormuzDashboard/1.0' },
        signal: AbortSignal.timeout(10_000),
      })
      if (!res.ok) continue

      const text = await res.text()
      const lower = text.toLowerCase()

      // Count war risk mentions
      const matches = lower.match(/war risk/gi)
      if (matches) warRiskMentions += matches.length

      // Extract premium percentage: "war risk premium of 0.5%", "premium at 0.75%"
      const premiumMatch = text.match(/(?:war risk|gulf)\s*premium\s*(?:of|at|to)?\s*(\d+(?:\.\d+)?)\s*%/i)
      if (premiumMatch) {
        premiumValue = parseFloat(premiumMatch[1])
      }
    } catch {
      // Continue to next source
    }
  }

  if (premiumValue !== null) {
    dataPoints.push({
      indicatorType: 'war_risk_premium',
      name: 'Persian Gulf War Risk Premium',
      value: premiumValue,
      unit: '%',
      source: 'shipping_news_aggregate',
      changePct: null,
      notes: `Based on ${warRiskMentions} mentions across shipping news`,
    })
  }

  return dataPoints
}

// --- Insurance proxy score ---
function computeInsuranceProxyScore(
  warRiskMentions: number,
  premiumValue: number | null,
): FreightDataPoint {
  // Score 1-10 based on war risk premium + mention frequency
  let score = 1

  if (premiumValue !== null) {
    if (premiumValue >= 2.0) score = 10
    else if (premiumValue >= 1.5) score = 8
    else if (premiumValue >= 1.0) score = 6
    else if (premiumValue >= 0.5) score = 4
    else if (premiumValue >= 0.25) score = 3
    else score = 2
  }

  // Boost by mention frequency (>10 mentions = high concern)
  if (warRiskMentions > 10) score = Math.min(10, score + 2)
  else if (warRiskMentions > 5) score = Math.min(10, score + 1)

  return {
    indicatorType: 'insurance_proxy_score',
    name: 'Hormuz Insurance Proxy Score',
    value: score,
    unit: 'score (1-10)',
    source: 'computed',
    changePct: null,
    notes: `Premium: ${premiumValue ?? 'N/A'}%, Mentions: ${warRiskMentions}`,
  }
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [freightData, warRiskData] = await Promise.all([
      scrapeFreightRates(),
      monitorWarRiskPremium(),
    ])

    // Compute insurance proxy
    const allData = [...freightData, ...warRiskData]
    const warRiskEntry = warRiskData.find(d => d.indicatorType === 'war_risk_premium')
    const warRiskMentionCount = warRiskEntry
      ? parseInt(warRiskEntry.notes?.match(/(\d+)\s*mentions/)?.[1] ?? '0', 10)
      : 0
    const premiumValue = warRiskEntry?.value ?? null

    const insuranceProxy = computeInsuranceProxyScore(warRiskMentionCount, premiumValue)
    allData.push(insuranceProxy)

    let upsertCount = 0
    const now = new Date().toISOString()

    for (const dp of allData) {
      const indicator: Omit<ShippingIndicator, 'id' | 'created_at'> = {
        indicator_type: dp.indicatorType,
        indicator_name: dp.name,
        value: dp.value,
        unit: dp.unit,
        change_pct: dp.changePct,
        source: dp.source,
        notes: dp.notes,
        fetched_at: now,
      }

      const ok = await upsertShippingIndicator(indicator)
      if (ok) upsertCount++
    }

    return NextResponse.json({
      success: true,
      message: `Shipping ingest: ${freightData.length} freight rates, ${warRiskData.length} war risk data, insurance proxy score=${insuranceProxy.value}`,
      count: upsertCount,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Shipping ingest failed'
    console.error('ingest-shipping error:', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
