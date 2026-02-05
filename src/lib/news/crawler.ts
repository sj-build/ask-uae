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
  if (lowered.includes('gulf news')) return 'gulf_news'
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
