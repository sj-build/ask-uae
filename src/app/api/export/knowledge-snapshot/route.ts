import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

interface Document {
  id: string
  type: string
  title: string
  content: string
  source_url: string | null
  category: string | null
  tags: string[] | null
  published_at: string | null
  created_at: string
  updated_at: string
}

interface Insight {
  id: string
  category: string
  subcategory: string | null
  title: string
  content: string
  evidence_refs: string[] | null
  importance: number
  source_type: string
  created_at: string
  updated_at: string
}

interface KnowledgeSnapshot {
  version: string
  exportedAt: string
  contentHash: string
  counts: {
    documents: number
    insights: number
    news: number
    askme: number
  }
  documents: Document[]
  insights: Insight[]
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Supabase configuration missing')
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}

async function buildKnowledgeSnapshot(options: {
  since?: string
  limit?: number
  includeContent?: boolean
}): Promise<KnowledgeSnapshot> {
  const { since, limit = 500, includeContent = true } = options
  const supabase = getSupabaseAdmin()

  // Fetch documents
  let docsQuery = supabase
    .from('documents')
    .select('id, type, title, content, source_url, category, tags, published_at, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (since) {
    docsQuery = docsQuery.gte('updated_at', since)
  }

  const { data: documents, error: docsError } = await docsQuery

  if (docsError) {
    throw new Error(`Failed to fetch documents: ${docsError.message}`)
  }

  // Fetch insights
  let insightsQuery = supabase
    .from('insights')
    .select('id, category, subcategory, title, content, evidence_refs, importance, source_type, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (since) {
    insightsQuery = insightsQuery.gte('updated_at', since)
  }

  const { data: insights, error: insightsError } = await insightsQuery

  if (insightsError) {
    throw new Error(`Failed to fetch insights: ${insightsError.message}`)
  }

  // Get counts by type
  const newsDocs = (documents || []).filter((d) => d.type === 'news').length
  const askmeDocs = (documents || []).filter((d) => d.type === 'askme').length

  // Optionally truncate content for lighter payload
  const processedDocs = (documents || []).map((doc) => ({
    ...doc,
    content: includeContent ? doc.content : doc.content?.slice(0, 500) + '...',
  }))

  const processedInsights = (insights || []).map((insight) => ({
    ...insight,
    content: includeContent ? insight.content : insight.content?.slice(0, 500) + '...',
  }))

  // Generate content hash
  const combinedContent = JSON.stringify({ documents: processedDocs, insights: processedInsights })
  const contentHash = crypto.createHash('sha256').update(combinedContent).digest('hex').slice(0, 16)

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    contentHash,
    counts: {
      documents: processedDocs.length,
      insights: processedInsights.length,
      news: newsDocs,
      askme: askmeDocs,
    },
    documents: processedDocs,
    insights: processedInsights,
  }
}

/**
 * Export API: Knowledge Snapshot
 *
 * Returns RAG knowledge base content (documents + insights) for Eval Agent verification.
 * Used for weekly_factcheck against authoritative sources.
 *
 * Query params:
 * - since: ISO timestamp to filter content updated after this time
 * - limit: Max number of items per type (default 500, max 1000)
 * - includeContent: If 'true', include full content; otherwise truncate (default true)
 *
 * Auth: x-cron-secret header or x-export-token
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Auth check
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

    // Parse query params
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

    const snapshot = await buildKnowledgeSnapshot({
      since,
      limit,
      includeContent,
    })

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

// HEAD for health check
export async function HEAD(): Promise<Response> {
  const hasSecret = process.env.CRON_SECRET || process.env.EXPORT_TOKEN
  const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY

  return new Response(null, { status: hasSecret && hasSupabase ? 200 : 503 })
}
