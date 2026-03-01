import { NextResponse } from 'next/server'
import { buildKnowledgeSnapshot } from '@/lib/eval/snapshots'

export const maxDuration = 55

/**
 * Export API: Knowledge Snapshot
 *
 * Returns RAG knowledge base content (documents + insights) for Eval Agent verification.
 * Auth: x-cron-secret header or x-export-token
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const cronSecret = request.headers.get('x-cron-secret')
    const exportToken = request.headers.get('x-export-token')
    const expectedCronSecret = process.env.CRON_SECRET
    const expectedExportToken = process.env.EXPORT_TOKEN

    const isAuthorized =
      (expectedCronSecret && cronSecret === expectedCronSecret) ||
      (expectedExportToken && exportToken === expectedExportToken)

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const since = url.searchParams.get('since') ?? undefined
    const limitParam = url.searchParams.get('limit')
    const includeContent = url.searchParams.get('includeContent') !== 'false'

    let limit = 500
    if (limitParam) {
      const parsed = parseInt(limitParam, 10)
      if (!isNaN(parsed) && parsed > 0) {
        limit = Math.min(parsed, 1000)
      }
    }

    const snapshot = await buildKnowledgeSnapshot({ since, limit, includeContent })

    return NextResponse.json({
      success: true,
      ...snapshot,
      query: {
        since: since ?? null,
        limit,
        includeContent,
      },
    })
  } catch (error) {
    console.error('Knowledge snapshot export error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

export async function HEAD(): Promise<Response> {
  const hasSecret = process.env.CRON_SECRET || process.env.EXPORT_TOKEN
  const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY

  return new Response(null, { status: hasSecret && hasSupabase ? 200 : 503 })
}
