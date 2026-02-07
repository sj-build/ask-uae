import type { NewsItem } from '@/types/news'

const GOOGLE_NEWS_RSS_BASE = 'https://news.google.com/rss/search'
const NAVER_NEWS_API_BASE = 'https://openapi.naver.com/v1/search/news.json'

function generateId(): string {
  return `news-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function parseRssDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return new Date().toISOString()
    }
    return date.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

function extractPublisher(source: string): string {
  const cleaned = source.replace(/<[^>]*>/g, '').trim()
  return cleaned || 'Unknown'
}

function classifyPriority(publisher: string): NewsItem['priority'] {
  const lowered = publisher.toLowerCase()
  if (lowered.includes('reuters')) return 'reuters'
  if (lowered.includes('bloomberg')) return 'bloomberg'
  if (lowered.includes('financial times') || lowered.includes('ft.com')) return 'financial_times'
  if (lowered.includes('wall street journal') || lowered.includes('wsj')) return 'wsj'
  if (lowered.includes('the national')) return 'the_national'
  if (lowered.includes('khaleej times')) return 'khaleej_times'
  if (lowered.includes('arab news')) return 'arab_news'
  if (lowered.includes('gulf news')) return 'gulf_news'
  if (lowered.includes('wam') || lowered.includes('emirates news agency')) return 'wam'
  return 'other'
}

function extractTextBetweenTags(xml: string, tagName: string): string {
  const openTag = `<${tagName}>`
  const closeTag = `</${tagName}>`
  const startIndex = xml.indexOf(openTag)
  const endIndex = xml.indexOf(closeTag)

  if (startIndex === -1 || endIndex === -1) {
    return ''
  }

  const contentStart = startIndex + openTag.length
  const raw = xml.slice(contentStart, endIndex)

  return raw
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/<[^>]*>/g, '')
    .trim()
}

function parseRssItems(xmlText: string): ReadonlyArray<{
  readonly title: string
  readonly link: string
  readonly pubDate: string
  readonly source: string
}> {
  const items: Array<{
    readonly title: string
    readonly link: string
    readonly pubDate: string
    readonly source: string
  }> = []

  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match = itemRegex.exec(xmlText)

  while (match !== null) {
    const itemXml = match[1]
    const title = extractTextBetweenTags(itemXml, 'title')
    const link = extractTextBetweenTags(itemXml, 'link')
    const pubDate = extractTextBetweenTags(itemXml, 'pubDate')

    const sourceMatch = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/)
    const source = sourceMatch
      ? sourceMatch[1].replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').trim()
      : ''

    items.push({ title, link, pubDate, source })
    match = itemRegex.exec(xmlText)
  }

  return items
}

/**
 * Fetch OG image from a news article URL
 */
async function fetchOgImage(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; UAEDashboard/1.0; +https://askuae.vercel.app)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(5000),
      redirect: 'follow',
    })

    if (!response.ok) {
      return undefined
    }

    const html = await response.text()

    // Extract og:image meta tag
    // Patterns: <meta property="og:image" content="..."> or <meta name="og:image" content="...">
    const ogImagePatterns = [
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
      /<meta[^>]*name=["']og:image["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']og:image["']/i,
      // Twitter card image as fallback
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
    ]

    for (const pattern of ogImagePatterns) {
      const match = html.match(pattern)
      if (match?.[1]) {
        let imageUrl = match[1]

        // Handle relative URLs
        if (imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl
        } else if (imageUrl.startsWith('/')) {
          const urlObj = new URL(url)
          imageUrl = urlObj.origin + imageUrl
        }

        // Validate it's a proper URL
        if (imageUrl.startsWith('http')) {
          return imageUrl
        }
      }
    }

    return undefined
  } catch {
    return undefined
  }
}

/**
 * Add OG images to news items in parallel
 */
export async function enrichWithImages(items: NewsItem[]): Promise<NewsItem[]> {
  const enrichedItems = await Promise.all(
    items.map(async (item) => {
      if (item.imageUrl) {
        return item // Already has image
      }

      const imageUrl = await fetchOgImage(item.url)
      return imageUrl ? { ...item, imageUrl } : item
    })
  )

  return enrichedItems
}

export async function crawlGoogleNews(keywords: readonly string[]): Promise<readonly NewsItem[]> {
  const results: NewsItem[] = []

  for (const keyword of keywords) {
    try {
      const encodedQuery = encodeURIComponent(keyword)
      const url = `${GOOGLE_NEWS_RSS_BASE}?q=${encodedQuery}&hl=en&gl=AE&ceid=AE:en`

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; UAEDashboard/1.0)',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        continue
      }

      const xmlText = await response.text()
      const rssItems = parseRssItems(xmlText)

      const newsItems: readonly NewsItem[] = rssItems.slice(0, 5).map((item) => ({
        id: generateId(),
        title: item.title,
        url: item.link,
        source: 'google' as const,
        publisher: extractPublisher(item.source),
        publishedAt: parseRssDate(item.pubDate),
        tags: [keyword],
        priority: classifyPriority(item.source),
      }))

      results.push(...newsItems)
    } catch {
      // Skip failed keyword crawls silently
    }
  }

  return results
}

export async function crawlNaverNews(keywords: readonly string[]): Promise<readonly NewsItem[]> {
  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return []
  }

  const results: NewsItem[] = []

  for (const keyword of keywords) {
    try {
      const encodedQuery = encodeURIComponent(keyword)
      const url = `${NAVER_NEWS_API_BASE}?query=${encodedQuery}&display=5&sort=date`

      const response = await fetch(url, {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        continue
      }

      const data: {
        items: ReadonlyArray<{
          readonly title: string
          readonly originallink: string
          readonly link: string
          readonly pubDate: string
          readonly description: string
        }>
      } = await response.json()

      const newsItems: readonly NewsItem[] = (data.items ?? []).map((item) => ({
        id: generateId(),
        title: item.title.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
        url: item.originallink || item.link,
        source: 'naver' as const,
        publisher: 'Naver News',
        publishedAt: parseRssDate(item.pubDate),
        tags: [keyword],
        summary: item.description.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
        priority: 'other' as const,
      }))

      results.push(...newsItems)
    } catch {
      // Skip failed keyword crawls silently
    }
  }

  return results
}
