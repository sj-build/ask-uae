import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { createHash } from 'crypto'
import { upsertMaritimeAlert } from '@/lib/hormuz/queries'
import type { AlertSource, ThreatLevel, AlertRegion, MaritimeAlert } from '@/types/hormuz'

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

function generateContentHash(url: string, title: string): string {
  return createHash('sha256').update(`${url}|${title}`).digest('hex').slice(0, 32)
}

// --- Threat level classification ---
const THREAT_KEYWORDS: Record<ThreatLevel, string[]> = {
  critical: ['attack', 'seizure', 'explosion', 'blockade', 'mine', 'torpedo', 'hijack'],
  substantial: ['warning', 'heightened', 'threat', 'military activity', 'weapons'],
  elevated: ['caution', 'suspicious', 'advisory', 'increased risk', 'alert'],
  normal: ['routine', 'update', 'information', 'awareness'],
}

function classifyThreatLevel(text: string): ThreatLevel {
  const lower = text.toLowerCase()
  for (const level of ['critical', 'substantial', 'elevated', 'normal'] as ThreatLevel[]) {
    if (THREAT_KEYWORDS[level].some(kw => lower.includes(kw))) return level
  }
  return 'normal'
}

// --- Region classification ---
function classifyRegion(text: string): AlertRegion {
  const lower = text.toLowerCase()
  if (lower.includes('hormuz') || lower.includes('strait')) return 'hormuz'
  if (lower.includes('persian gulf') || lower.includes('arabian gulf')) return 'persian_gulf'
  if (lower.includes('gulf of oman') || lower.includes('oman')) return 'gulf_of_oman'
  if (lower.includes('red sea')) return 'red_sea'
  if (lower.includes('gulf of aden') || lower.includes('aden')) return 'gulf_of_aden'
  if (lower.includes('arabian sea')) return 'arabian_sea'
  return 'persian_gulf'
}

function affectsHormuz(text: string): boolean {
  const lower = text.toLowerCase()
  return (
    lower.includes('hormuz') ||
    lower.includes('strait') ||
    lower.includes('persian gulf') ||
    lower.includes('arabian gulf') ||
    lower.includes('fujairah') ||
    lower.includes('bandar abbas')
  )
}

// --- UKMTO scraper ---
async function scrapeUKMTO(): Promise<Omit<MaritimeAlert, 'id' | 'created_at'>[]> {
  const alerts: Omit<MaritimeAlert, 'id' | 'created_at'>[] = []
  const url = 'https://www.ukmto.org/indian-ocean'

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'HormuzDashboard/1.0' },
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) {
      console.warn(`UKMTO returned ${res.status}`)
      return alerts
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    // Parse advisory entries - UKMTO uses table or list format
    $('table tbody tr, .advisory-item, .report-item, article').each((_, el) => {
      const $el = $(el)
      const title = $el.find('h3, h4, td:first-child, .title').text().trim()
      const summary = $el.find('p, td:nth-child(2), .summary, .description').text().trim()
      const link = $el.find('a').attr('href')

      if (!title || title.length < 10) return

      const fullText = `${title} ${summary}`
      const alertUrl = link
        ? (link.startsWith('http') ? link : `https://www.ukmto.org${link}`)
        : url

      alerts.push({
        source: 'ukmto' as AlertSource,
        alert_id: null,
        title: title.slice(0, 200),
        summary: summary.slice(0, 1000) || null,
        full_text: fullText.slice(0, 5000) || null,
        threat_level: classifyThreatLevel(fullText),
        region: classifyRegion(fullText),
        affects_hormuz: affectsHormuz(fullText),
        key_changes: null,
        url: alertUrl,
        content_hash: generateContentHash(alertUrl, title),
        published_at: new Date().toISOString(),
      })
    })
  } catch (error) {
    console.warn('UKMTO scrape failed:', error instanceof Error ? error.message : error)
  }

  return alerts
}

// --- MARAD scraper ---
async function scrapeMARAD(): Promise<Omit<MaritimeAlert, 'id' | 'created_at'>[]> {
  const alerts: Omit<MaritimeAlert, 'id' | 'created_at'>[] = []
  const url = 'https://www.maritime.dot.gov/msci-advisories'

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'HormuzDashboard/1.0' },
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) {
      console.warn(`MARAD returned ${res.status}`)
      return alerts
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    // MARAD uses a list/table of advisories
    $('table tbody tr, .views-row, .advisory-row, article').each((_, el) => {
      const $el = $(el)
      const title = $el.find('h3, td:first-child a, .views-field-title a, .field-title a').text().trim()
      const summary = $el.find('p, td:nth-child(2), .views-field-body, .field-body').text().trim()
      const dateText = $el.find('.date, td:last-child, .views-field-created').text().trim()
      const link = $el.find('a').attr('href')

      if (!title || title.length < 10) return

      const fullText = `${title} ${summary}`
      const alertUrl = link
        ? (link.startsWith('http') ? link : `https://www.maritime.dot.gov${link}`)
        : url

      // Try to parse date
      let publishedAt: string | null = null
      if (dateText) {
        const parsed = new Date(dateText)
        if (!isNaN(parsed.getTime())) {
          publishedAt = parsed.toISOString()
        }
      }

      alerts.push({
        source: 'marad' as AlertSource,
        alert_id: null,
        title: title.slice(0, 200),
        summary: summary.slice(0, 1000) || null,
        full_text: fullText.slice(0, 5000) || null,
        threat_level: classifyThreatLevel(fullText),
        region: classifyRegion(fullText),
        affects_hormuz: affectsHormuz(fullText),
        key_changes: null,
        url: alertUrl,
        content_hash: generateContentHash(alertUrl, title),
        published_at: publishedAt ?? new Date().toISOString(),
      })
    })
  } catch (error) {
    console.warn('MARAD scrape failed:', error instanceof Error ? error.message : error)
  }

  return alerts
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [ukmtoAlerts, maradAlerts] = await Promise.all([
      scrapeUKMTO(),
      scrapeMARAD(),
    ])

    const allAlerts = [...ukmtoAlerts, ...maradAlerts]
    let upsertCount = 0

    for (const alert of allAlerts) {
      const ok = await upsertMaritimeAlert(alert)
      if (ok) upsertCount++
    }

    return NextResponse.json({
      success: true,
      message: `Advisory ingest: ${ukmtoAlerts.length} UKMTO, ${maradAlerts.length} MARAD, ${upsertCount} upserted`,
      count: upsertCount,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Advisory ingest failed'
    console.error('ingest-advisory error:', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
