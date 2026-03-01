import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { upsertMapEvent } from '@/lib/hormuz/queries'
import type { MapEventType, NewsSeverity, MapEvent } from '@/types/hormuz'

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

// --- GDELT DOC API response types ---
interface GdeltArticle {
  url: string
  url_mobile: string
  title: string
  seendate: string
  socialimage: string
  domain: string
  language: string
  sourcecountry: string
}

interface GdeltResponse {
  articles: GdeltArticle[]
}

// --- Event type classification from title/content ---
const EVENT_TYPE_KEYWORDS: Record<MapEventType, string[]> = {
  airstrike: ['airstrike', 'air strike', 'bombing', 'bombed'],
  missile_launch: ['missile launch', 'rocket', 'ballistic', 'fired missile'],
  missile_intercept: ['intercept', 'shot down', 'iron dome', 'patriot'],
  naval_incident: ['naval', 'warship', 'destroyer', 'frigate', 'patrol'],
  vessel_seizure: ['seize', 'seized', 'capture', 'detained', 'tanker seizure'],
  explosion: ['explosion', 'blast', 'detonation'],
  protest: ['protest', 'demonstration', 'rally', 'unrest'],
  airport_closure: ['airport clos', 'airspace', 'flight cancel', 'no-fly'],
  port_closure: ['port clos', 'harbor clos', 'shipping halt'],
  military_deployment: ['deploy', 'troops', 'carrier group', 'military base'],
  humanitarian: ['humanitarian', 'refugee', 'aid', 'evacuation', 'crisis'],
}

function classifyEventType(text: string): MapEventType {
  const lower = text.toLowerCase()
  for (const [eventType, keywords] of Object.entries(EVENT_TYPE_KEYWORDS) as [MapEventType, string[]][]) {
    if (keywords.some(kw => lower.includes(kw))) return eventType
  }
  return 'naval_incident'
}

function classifyEventSeverity(text: string): NewsSeverity {
  const lower = text.toLowerCase()
  if (['attack', 'explosion', 'strike', 'killed', 'war'].some(kw => lower.includes(kw))) return 'critical'
  if (['military', 'missile', 'threat', 'warning'].some(kw => lower.includes(kw))) return 'high'
  if (['tension', 'deploy', 'concern', 'alert'].some(kw => lower.includes(kw))) return 'medium'
  return 'low'
}

// --- Approximate geolocation for Middle East locations ---
interface GeoPoint {
  lat: number
  lon: number
  name: string
  country: string
}

const LOCATION_GEO: Record<string, GeoPoint> = {
  'strait of hormuz': { lat: 26.6, lon: 56.2, name: 'Strait of Hormuz', country: 'OM' },
  'persian gulf': { lat: 26.0, lon: 52.0, name: 'Persian Gulf', country: 'IR' },
  'tehran': { lat: 35.7, lon: 51.4, name: 'Tehran', country: 'IR' },
  'bandar abbas': { lat: 27.2, lon: 56.3, name: 'Bandar Abbas', country: 'IR' },
  'fujairah': { lat: 25.1, lon: 56.3, name: 'Fujairah', country: 'AE' },
  'dubai': { lat: 25.2, lon: 55.3, name: 'Dubai', country: 'AE' },
  'abu dhabi': { lat: 24.5, lon: 54.7, name: 'Abu Dhabi', country: 'AE' },
  'riyadh': { lat: 24.7, lon: 46.7, name: 'Riyadh', country: 'SA' },
  'doha': { lat: 25.3, lon: 51.5, name: 'Doha', country: 'QA' },
  'muscat': { lat: 23.6, lon: 58.5, name: 'Muscat', country: 'OM' },
  'bahrain': { lat: 26.2, lon: 50.5, name: 'Bahrain', country: 'BH' },
  'kuwait': { lat: 29.4, lon: 47.9, name: 'Kuwait City', country: 'KW' },
  'baghdad': { lat: 33.3, lon: 44.4, name: 'Baghdad', country: 'IQ' },
  'basra': { lat: 30.5, lon: 47.8, name: 'Basra', country: 'IQ' },
  'red sea': { lat: 20.0, lon: 38.0, name: 'Red Sea', country: 'SA' },
  'gulf of aden': { lat: 12.5, lon: 47.0, name: 'Gulf of Aden', country: 'YE' },
  'sanaa': { lat: 15.4, lon: 44.2, name: "Sana'a", country: 'YE' },
  'aden': { lat: 12.8, lon: 45.0, name: 'Aden', country: 'YE' },
  'iran': { lat: 32.4, lon: 53.7, name: 'Iran', country: 'IR' },
  'iraq': { lat: 33.2, lon: 43.7, name: 'Iraq', country: 'IQ' },
}

function extractGeo(text: string): GeoPoint | null {
  const lower = text.toLowerCase()
  for (const [location, geo] of Object.entries(LOCATION_GEO)) {
    if (lower.includes(location)) return geo
  }
  return null
}

function generateContentHash(url: string, title: string): string {
  return createHash('sha256').update(`${url}|${title}`).digest('hex').slice(0, 32)
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // GDELT DOC API queries
    const queries = [
      'Strait of Hormuz',
      'Iran military Persian Gulf',
      'Gulf shipping attack',
      'Middle East war crisis',
    ]

    const allArticles: GdeltArticle[] = []

    for (const query of queries) {
      try {
        const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=25&format=json&timespan=24h`
        const res = await fetch(url, { signal: AbortSignal.timeout(15_000) })

        if (!res.ok) {
          console.warn(`GDELT query "${query}" returned ${res.status}`)
          continue
        }

        const text = await res.text()
        if (!text.trim()) continue

        const data = JSON.parse(text) as GdeltResponse
        if (data.articles) {
          allArticles.push(...data.articles)
        }
      } catch (error) {
        console.warn(`GDELT query "${query}" failed:`, error instanceof Error ? error.message : error)
      }
    }

    // Deduplicate by URL
    const seenUrls = new Set<string>()
    const uniqueArticles: GdeltArticle[] = []
    for (const article of allArticles) {
      if (!seenUrls.has(article.url)) {
        seenUrls.add(article.url)
        uniqueArticles.push(article)
      }
    }

    let upsertCount = 0

    for (const article of uniqueArticles) {
      const geo = extractGeo(article.title)
      if (!geo) continue // Skip articles without identifiable location

      const eventDate = article.seendate
        ? new Date(article.seendate.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z'))
        : new Date()

      const expiresAt = new Date(eventDate.getTime() + 72 * 3600_000)

      const event: Omit<MapEvent, 'id' | 'created_at' | 'updated_at'> = {
        event_type: classifyEventType(article.title),
        title: article.title.slice(0, 200),
        description: null,
        latitude: geo.lat,
        longitude: geo.lon,
        location_name: geo.name,
        country: geo.country,
        source_name: article.domain,
        source_url: article.url,
        severity: classifyEventSeverity(article.title),
        is_verified: false,
        is_active: true,
        content_hash: generateContentHash(article.url, article.title),
        icon_type: null,
        media_url: article.socialimage || null,
        event_date: eventDate.toISOString(),
        expires_at: expiresAt.toISOString(),
      }

      const ok = await upsertMapEvent(event)
      if (ok) upsertCount++
    }

    return NextResponse.json({
      success: true,
      message: `GDELT ingest: ${uniqueArticles.length} articles, ${upsertCount} map events created`,
      count: upsertCount,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'GDELT ingest failed'
    console.error('ingest-gdelt error:', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
