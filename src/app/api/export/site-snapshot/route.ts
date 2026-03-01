import { NextResponse } from 'next/server'
import { loadSiteData, hashContent } from '@/lib/eval/snapshots'

export const maxDuration = 55

/**
 * Export API: Site Snapshot
 *
 * Returns complete static site content for Eval Agent verification.
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

    const pages = await loadSiteData()
    const contentHash = hashContent(pages)

    return NextResponse.json({
      success: true,
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      contentHash,
      pages,
    })
  } catch (error) {
    console.error('Site snapshot export error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

export async function HEAD(): Promise<Response> {
  const hasSecret = process.env.CRON_SECRET || process.env.EXPORT_TOKEN
  return new Response(null, { status: hasSecret ? 200 : 503 })
}
