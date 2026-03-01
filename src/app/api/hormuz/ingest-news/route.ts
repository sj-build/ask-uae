import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { upsertWarNews } from '@/lib/hormuz/queries'
import type { NewsCategory, NewsSeverity, NewsSourceType, WarNewsItem } from '@/types/hormuz'

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

// --- Keyword-based classification ---
const CATEGORY_KEYWORDS: Record<NewsCategory, string[]> = {
  hormuz_shipping: ['hormuz', 'strait', 'shipping lane', 'vessel seizure', 'tanker', 'maritime corridor'],
  oil_energy: ['oil price', 'crude', 'brent', 'opec', 'energy market', 'petroleum', 'refinery'],
  military_ops: ['military', 'strike', 'airstrike', 'navy', 'carrier', 'deployment', 'missile'],
  iran_internal: ['iran', 'tehran', 'irgc', 'khamenei', 'raisi', 'sanctions'],
  uae_impact: ['uae', 'dubai', 'abu dhabi', 'emirates', 'fujairah'],
  market_reaction: ['market', 'stocks', 'investor', 'risk', 'volatility', 'hedge'],
  diplomacy: ['diplomacy', 'negotiation', 'treaty', 'agreement', 'un security'],
  insurance_maritime: ['insurance', 'war risk', 'premium', 'p&i', 'underwriter', 'lloyd'],
  casualties: ['casualties', 'killed', 'wounded', 'death toll', 'humanitarian'],
  regime_change: ['regime', 'revolution', 'coup', 'overthrow', 'protest'],
}

const SEVERITY_KEYWORDS: Record<NewsSeverity, string[]> = {
  critical: ['attack', 'strike', 'explosion', 'war', 'blockade', 'closure', 'seizure', 'shot down'],
  high: ['threat', 'warning', 'escalation', 'military', 'sanctions', 'missile'],
  medium: ['tension', 'concern', 'monitor', 'advisory', 'deploy'],
  low: ['talk', 'meeting', 'report', 'analysis', 'review'],
}

function classifyCategory(text: string): NewsCategory {
  const lower = text.toLowerCase()
  let bestCategory: NewsCategory = 'hormuz_shipping'
  let bestScore = 0

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [NewsCategory, string[]][]) {
    const score = keywords.filter(kw => lower.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      bestCategory = category
    }
  }
  return bestCategory
}

function classifySeverity(text: string): NewsSeverity {
  const lower = text.toLowerCase()
  for (const severity of ['critical', 'high', 'medium', 'low'] as NewsSeverity[]) {
    if (SEVERITY_KEYWORDS[severity].some(kw => lower.includes(kw))) {
      return severity
    }
  }
  return 'low'
}

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase()
  const allKeywords = Object.values(CATEGORY_KEYWORDS).flat()
  return allKeywords.filter(kw => lower.includes(kw)).slice(0, 10)
}

// --- NewsAPI fetch ---
interface NewsAPIArticle {
  title: string
  description: string | null
  url: string
  source: { name: string }
  publishedAt: string
}

interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsAPIArticle[]
}

async function fetchNewsAPI(): Promise<Omit<WarNewsItem, 'id' | 'created_at'>[]> {
  const apiKey = process.env.NEWSAPI_KEY
  if (!apiKey) return []

  const queries = [
    '"Strait of Hormuz"',
    '"Iran war" OR "IRGC"',
    '"Persian Gulf shipping"',
    '"Iran military" OR "Iran navy"',
  ]

  const items: Omit<WarNewsItem, 'id' | 'created_at'>[] = []

  for (const q of queries) {
    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&pageSize=10&language=en&apiKey=${apiKey}`
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
      if (!res.ok) continue

      const data = (await res.json()) as NewsAPIResponse
      for (const article of data.articles ?? []) {
        const fullText = `${article.title} ${article.description ?? ''}`
        items.push({
          title: article.title,
          summary: article.description?.slice(0, 500) ?? null,
          url: article.url,
          source_name: article.source.name,
          source_type: 'wire' as NewsSourceType,
          category: classifyCategory(fullText),
          severity: classifySeverity(fullText),
          keywords: extractKeywords(fullText),
          sentiment: null,
          is_verified: false,
          related_alert_id: null,
          published_at: article.publishedAt,
          fetched_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.warn(`NewsAPI query "${q}" failed:`, error instanceof Error ? error.message : error)
    }
  }

  return items
}

// --- RSS feed fetch ---
const RSS_FEEDS: Array<{ url: string; name: string; category?: string }> = [
  // === Tier 1: Confirmed working RSS feeds ===
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera', category: 'mideast-news' },
  { url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', name: 'BBC Middle East', category: 'mideast-news' },
  { url: 'https://gcaptain.com/feed/', name: 'gCaptain', category: 'maritime' },
  { url: 'https://theloadstar.com/feed/', name: 'The Loadstar', category: 'maritime' },
  { url: 'https://www.thenationalnews.com/arc/outboundfeeds/rss/?outputType=xml', name: 'The National (UAE)', category: 'uae-news' },
  // === Tier 2: Google News proxies for sources without native RSS ===
  { url: 'https://news.google.com/rss/search?q=site:gulfnews.com+Hormuz+OR+Iran+OR+UAE&hl=en-US&gl=US&ceid=US:en', name: 'Gulf News (via Google)', category: 'uae-news' },
  { url: 'https://news.google.com/rss/search?q=site:khaleejtimes.com+Hormuz+OR+Iran+OR+Gulf&hl=en-US&gl=US&ceid=US:en', name: 'Khaleej Times (via Google)', category: 'uae-news' },
  { url: 'https://news.google.com/rss/search?q=site:english.alarabiya.net+Iran+OR+Hormuz+OR+Gulf&hl=en-US&gl=US&ceid=US:en', name: 'Al Arabiya (via Google)', category: 'mideast-news' },
  { url: 'https://news.google.com/rss/search?q=site:reuters.com+Hormuz+OR+Iran+war+OR+Persian+Gulf&hl=en-US&gl=US&ceid=US:en', name: 'Reuters (via Google)', category: 'wire' },
  { url: 'https://news.google.com/rss/search?q=site:apnews.com+Iran+OR+Hormuz+OR+Middle+East+war&hl=en-US&gl=US&ceid=US:en', name: 'AP News (via Google)', category: 'wire' },
  { url: 'https://news.google.com/rss/search?q=site:cnn.com+Iran+war+OR+Hormuz+OR+Persian+Gulf&hl=en-US&gl=US&ceid=US:en', name: 'CNN (via Google)', category: 'mideast-news' },
  // === Tier 3: Topic-based Google News feeds ===
  { url: 'https://news.google.com/rss/search?q=Strait+of+Hormuz+shipping&hl=en-US&gl=US&ceid=US:en', name: 'Google News: Hormuz Shipping', category: 'maritime' },
  { url: 'https://news.google.com/rss/search?q=Iran+war+oil+price&hl=en-US&gl=US&ceid=US:en', name: 'Google News: Iran Oil', category: 'oil-energy' },
  { url: 'https://news.google.com/rss/search?q=UAE+war+impact+OR+Dubai+security&hl=en-US&gl=US&ceid=US:en', name: 'Google News: UAE Impact', category: 'uae-news' },
]

async function fetchRSSFeeds(): Promise<Omit<WarNewsItem, 'id' | 'created_at'>[]> {
  const parser = new Parser({
    timeout: 10_000,
    headers: {
      'User-Agent': 'HormuzDashboard/1.0',
    },
  })
  const items: Omit<WarNewsItem, 'id' | 'created_at'>[] = []
  const relevantTerms = [
    'hormuz', 'iran', 'persian gulf', 'tanker', 'oil',
    'irgc', 'navy', 'shipping', 'maritime', 'strait',
  ]

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url)

      for (const entry of parsed.items ?? []) {
        const fullText = `${entry.title ?? ''} ${entry.contentSnippet ?? ''}`
        const lower = fullText.toLowerCase()

        // Filter only relevant articles
        if (!relevantTerms.some(term => lower.includes(term))) continue

        items.push({
          title: entry.title ?? 'Untitled',
          summary: entry.contentSnippet?.slice(0, 500) ?? null,
          url: entry.link ?? null,
          source_name: feed.name,
          source_type: 'rss' as NewsSourceType,
          category: classifyCategory(fullText),
          severity: classifySeverity(fullText),
          keywords: extractKeywords(fullText),
          sentiment: null,
          is_verified: false,
          related_alert_id: null,
          published_at: entry.isoDate ?? entry.pubDate ?? null,
          fetched_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.warn(`RSS feed "${feed.name}" failed:`, error instanceof Error ? error.message : error)
    }
  }

  return items
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [newsAPIItems, rssItems] = await Promise.all([
      fetchNewsAPI(),
      fetchRSSFeeds(),
    ])

    // Deduplicate by URL
    const seenUrls = new Set<string>()
    const allItems: Omit<WarNewsItem, 'id' | 'created_at'>[] = []

    for (const item of [...newsAPIItems, ...rssItems]) {
      if (item.url && seenUrls.has(item.url)) continue
      if (item.url) seenUrls.add(item.url)
      allItems.push(item)
    }

    let success = true
    if (allItems.length > 0) {
      success = await upsertWarNews(allItems)
    }

    return NextResponse.json({
      success,
      message: `News ingest: ${newsAPIItems.length} from NewsAPI, ${rssItems.length} from RSS, ${allItems.length} unique`,
      count: allItems.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'News ingest failed'
    console.error('ingest-news error:', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
