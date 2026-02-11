import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { NewsItem, NewsSource, NewsPriority } from '@/types/news'

export const maxDuration = 55
export const revalidate = 1800 // 30 min cache

const TWO_MONTHS_MS = 60 * 24 * 60 * 60 * 1000

interface NewsArticleRow {
  readonly id: string
  readonly title: string
  readonly summary: string | null
  readonly url: string
  readonly publisher: string
  readonly source: string
  readonly language: string
  readonly image_url: string | null
  readonly category: string | null
  readonly tags: readonly string[]
  readonly published_at: string | null
}

function mapToNewsItem(row: NewsArticleRow): NewsItem {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    source: (row.source === 'naver' ? 'naver' : 'google') as NewsSource,
    publisher: row.publisher,
    publishedAt: row.published_at ?? new Date().toISOString(),
    tags: row.tags ?? [],
    summary: row.summary ?? undefined,
    imageUrl: row.image_url ?? undefined,
    priority: 'other' as NewsPriority,
    category: undefined,
    lane: undefined,
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const isConfigured = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    if (!isConfigured) {
      return NextResponse.json({
        success: true,
        data: [],
        meta: { total: 0, page: 1, limit: 100 },
      })
    }

    const { getSupabaseAdmin } = await import('@/lib/supabase')
    const supabase = getSupabaseAdmin()

    const cutoff = new Date(Date.now() - TWO_MONTHS_MS).toISOString()

    const { data, error } = await supabase
      .from('news_articles')
      .select('id, title, summary, url, publisher, source, language, image_url, category, tags, published_at')
      .gte('published_at', cutoff)
      .order('published_at', { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    const items = (data ?? []).map((row: NewsArticleRow) => mapToNewsItem(row))

    return NextResponse.json({
      success: true,
      data: items,
      meta: { total: items.length, page: 1, limit: 100 },
    })
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'Failed to load news'

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

const NewsItemCreateSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  publisher: z.string().min(1),
  publishedAt: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  summary: z.string().optional(),
})

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json()

    const parseResult = NewsItemCreateSchema.safeParse(body)
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]
      const errorMessage = firstIssue
        ? firstIssue.message
        : 'Invalid input'

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
        { success: false, error: 'Invalid JSON' },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error
      ? error.message
      : 'Failed to add news'

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
