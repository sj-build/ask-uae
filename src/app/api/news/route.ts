import { NextResponse } from 'next/server'
import { z } from 'zod'
import { crawlGoogleNews, crawlNaverNews, enrichWithImages } from '@/lib/news/crawler'
import { deduplicateNews } from '@/lib/news/deduplicator'
import { tagNewsBatch } from '@/lib/news/tagger'
import { ALL_KEYWORDS } from '@/data/news/keywords'
import type { NewsItem } from '@/types/news'

const CRAWL_QUERIES_EN: readonly string[] = [
  'UAE sovereign wealth fund',
  'Abu Dhabi investment',
  'ADIA Mubadala MGX',
  'G42 AI UAE',
  'ADNOC energy',
  'UAE stablecoin crypto',
  'Dubai real estate',
  'Korea UAE partnership',
  'UAE economy 2025',
  'Stargate UAE AI',
]

const CRAWL_QUERIES_KO: readonly string[] = [
  'UAE 투자',
  '아부다비 경제',
  '한국 UAE 협력',
  'UAE 부동산',
  'UAE 크립토',
  'UAE AI',
]

const TWO_MONTHS_MS = 60 * 24 * 60 * 60 * 1000

function filterByDate(items: readonly NewsItem[]): readonly NewsItem[] {
  const cutoff = Date.now() - TWO_MONTHS_MS
  return items.filter((item) => {
    const publishedTime = new Date(item.publishedAt).getTime()
    return !isNaN(publishedTime) && publishedTime >= cutoff
  })
}

const NewsItemCreateSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  publisher: z.string().min(1),
  publishedAt: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  summary: z.string().optional(),
})

export const revalidate = 3600

export async function GET(): Promise<NextResponse> {
  try {
    const [googleResults, naverResults] = await Promise.allSettled([
      crawlGoogleNews(CRAWL_QUERIES_EN),
      crawlNaverNews(CRAWL_QUERIES_KO),
    ])

    const allItems: NewsItem[] = []

    if (googleResults.status === 'fulfilled') {
      allItems.push(...googleResults.value)
    }

    if (naverResults.status === 'fulfilled') {
      allItems.push(...naverResults.value)
    }

    const deduplicated = deduplicateNews(allItems)
    const tagged = tagNewsBatch(deduplicated, ALL_KEYWORDS)
    const filtered = filterByDate(tagged)

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime()
      const dateB = new Date(b.publishedAt).getTime()
      return dateB - dateA
    })

    // Enrich top 10 items with OG images (limit to reduce latency)
    const topItems = sorted.slice(0, 10)
    const remainingItems = sorted.slice(10, 30)
    const enrichedTop = await enrichWithImages([...topItems])
    const finalData = [...enrichedTop, ...remainingItems]

    return NextResponse.json({
      success: true,
      data: finalData,
      meta: {
        total: sorted.length,
        page: 1,
        limit: 30,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : '뉴스를 불러오는 중 오류가 발생했습니다.'

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json()

    const parseResult = NewsItemCreateSchema.safeParse(body)
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]
      const errorMessage = firstIssue
        ? firstIssue.message
        : '유효하지 않은 입력입니다.'

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      )
    }

    const validated = parseResult.data

    const newItem: NewsItem = {
      id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: validated.title,
      url: validated.url,
      source: 'manual',
      publisher: validated.publisher,
      publishedAt: validated.publishedAt ?? new Date().toISOString(),
      tags: validated.tags ?? [],
      summary: validated.summary,
      priority: 'other',
    }

    return NextResponse.json({
      success: true,
      data: newItem,
    })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: '잘못된 JSON 형식입니다.' },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error
      ? error.message
      : '뉴스 추가 중 오류가 발생했습니다.'

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
