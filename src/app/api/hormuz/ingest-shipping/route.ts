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

async function scrapeFreightRates(): Promise<FreightDataPoint[]> {
  const dataPoints: FreightDataPoint[] = []

  // Scrape Hellenic Shipping News for freight rates
  try {
    const url = 'https://www.hellenicshippingnews.com/category/shipping-news/tanker-market/'
    const res = await fetch(url, {
      headers: { 'User-Agent': 'HormuzDashboard/1.0' },
      signal: AbortSignal.timeout(15_000),
    })

    if (res.ok) {
      const html = await res.text()
      const $ = cheerio.load(html)

      // Extract VLCC mentions and rate data from article excerpts
      $('article, .post-item, .entry-content').each((_, el) => {
        const text = $(el).text()
        const lower = text.toLowerCase()

        // VLCC freight rate patterns: "VLCC rates at WS 45" or "$25,000/day"
        const wsMatch = lower.match(/vlcc.*?ws\s*(\d+(?:\.\d+)?)/i)
        if (wsMatch) {
          dataPoints.push({
            indicatorType: 'vlcc_freight_rate',
            name: 'VLCC Freight Rate (Worldscale)',
            value: parseFloat(wsMatch[1]),
            unit: 'WS',
            source: 'hellenicshippingnews.com',
            changePct: null,
            notes: 'Extracted from shipping news',
          })
        }

        // Suezmax patterns
        const suezmaxMatch = lower.match(/suezmax.*?ws\s*(\d+(?:\.\d+)?)/i)
        if (suezmaxMatch) {
          dataPoints.push({
            indicatorType: 'suezmax_freight_rate',
            name: 'Suezmax Freight Rate (Worldscale)',
            value: parseFloat(suezmaxMatch[1]),
            unit: 'WS',
            source: 'hellenicshippingnews.com',
            changePct: null,
            notes: 'Extracted from shipping news',
          })
        }
      })
    }
  } catch (error) {
    console.warn('Hellenic scrape failed:', error instanceof Error ? error.message : error)
  }

  return dataPoints
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
