import { NextResponse } from 'next/server'
import { getInsightsForExport } from '@/lib/db'

/**
 * Export API for Hashed Agent (one-way pull)
 *
 * Security: Requires x-export-token header matching EXPORT_TOKEN env var
 * This endpoint provides read-only access to public insights
 * for the Hashed internal agent to consume.
 *
 * Query params:
 * - since: ISO timestamp to filter insights created after this time
 * - limit: Max number of insights to return (default 50, max 200)
 * - includeEvidence: If 'true', enrich with evidence metadata
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    // 1. Token authentication
    const exportToken = request.headers.get('x-export-token')
    const expectedToken = process.env.EXPORT_TOKEN

    if (!expectedToken) {
      console.error('EXPORT_TOKEN not configured')
      return NextResponse.json(
        { success: false, error: 'Export not configured' },
        { status: 503 }
      )
    }

    if (!exportToken || exportToken !== expectedToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Parse query parameters
    const url = new URL(request.url)
    const since = url.searchParams.get('since') ?? undefined
    const limitParam = url.searchParams.get('limit')
    const includeEvidence = url.searchParams.get('includeEvidence') === 'true'

    let limit = 50
    if (limitParam) {
      const parsed = parseInt(limitParam, 10)
      if (!isNaN(parsed) && parsed > 0) {
        limit = Math.min(parsed, 200) // Cap at 200
      }
    }

    // 3. Fetch insights
    const result = await getInsightsForExport({
      since,
      limit,
      includeEvidence,
    })

    // 4. Return response
    return NextResponse.json({
      success: true,
      ...result,
      query: {
        since: since ?? null,
        limit,
        includeEvidence,
      },
    })
  } catch (error) {
    console.error('Export insights error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

// HEAD for health check
export async function HEAD(): Promise<Response> {
  const exportToken = process.env.EXPORT_TOKEN

  if (!exportToken) {
    return new Response(null, { status: 503 })
  }

  return new Response(null, { status: 200 })
}
