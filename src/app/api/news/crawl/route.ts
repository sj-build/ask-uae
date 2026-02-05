import { NextResponse } from 'next/server'
import { crawlGoogleNews, crawlNaverNews } from '@/lib/news/crawler'
import { deduplicateNews } from '@/lib/news/deduplicator'
import { tagNewsBatch } from '@/lib/news/tagger'
import { ALL_KEYWORDS } from '@/data/news/keywords'
import type { NewsItem } from '@/types/news'

const DEFAULT_CRAWL_QUERIES: readonly string[] = [
  'UAE sovereign wealth fund',
  'Abu Dhabi investment',
  'ADIA Mubadala',
  'MGX crypto',
  'G42 AI',
  'ADNOC',
  'UAE stablecoin',
  'Binance UAE',
  'Dubai real estate',
  'Korea UAE',
]

export async function POST(request: Request): Promise<NextResponse> {
  try {
    let queries: readonly string[] = DEFAULT_CRAWL_QUERIES

    try {
      const body: unknown = await request.json()
      if (
        body !== null &&
        typeof body === 'object' &&
        'keywords' in body &&
        Array.isArray((body as { keywords: unknown }).keywords)
      ) {
        const provided = (body as { keywords: unknown[] }).keywords
        const validKeywords = provided.filter(
          (k): k is string => typeof k === 'string' && k.trim().length > 0
        )

        if (validKeywords.length > 0) {
          queries = validKeywords
        }
      }
    } catch {
      // Use default queries if body parsing fails
    }

    const [googleResults, naverResults] = await Promise.allSettled([
      crawlGoogleNews(queries),
      crawlNaverNews(queries),
    ])

    const allItems: NewsItem[] = []

    if (googleResults.status === 'fulfilled') {
      allItems.push(...googleResults.value)
    }

    if (naverResults.status === 'fulfilled') {
      allItems.push(...naverResults.value)
    }

    if (allItems.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        meta: {
          total: 0,
          sources: { google: 0, naver: 0 },
          queries: queries.length,
        },
      })
    }

    const deduplicated = deduplicateNews(allItems)
    const tagged = tagNewsBatch(deduplicated, ALL_KEYWORDS)

    const googleCount = tagged.filter((item) => item.source === 'google').length
    const naverCount = tagged.filter((item) => item.source === 'naver').length

    return NextResponse.json({
      success: true,
      data: tagged,
      meta: {
        total: tagged.length,
        sources: { google: googleCount, naver: naverCount },
        queries: queries.length,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : '뉴스 크롤링 중 오류가 발생했습니다.'

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
