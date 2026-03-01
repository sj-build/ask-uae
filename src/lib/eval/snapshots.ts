/**
 * Eval Snapshots
 *
 * Pure data-loading functions extracted from export routes.
 * Used by both the eval runner (direct call) and export API routes.
 */

import crypto from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabase'

// ---------------------------------------------------------------------------
// Site Snapshot (static data files)
// ---------------------------------------------------------------------------

export async function loadSiteData(): Promise<Record<string, unknown>> {
  const [
    homeKo, homeEn,
    taxKo, taxEn,
    bankingKo, bankingEn,
    swfKo, swfEn,
    trendsKo, trendsEn,
    laborKo, laborEn,
    societyTrendsKo, societyTrendsEn,
    religionKo, religionEn,
    businessKo, businessEn,
    populationKo, populationEn,
    essentialKo, essentialEn,
    welfareKo, welfareEn,
    politicsKo, politicsEn,
    powerKo, powerEn,
    industryKo, industryEn,
    connectionKo, connectionEn,
    comparisonKo, comparisonEn,
    legalKo, legalEn,
  ] = await Promise.all([
    import('@/data/home/category-hot-issues'),
    import('@/data/home/category-hot-issues.en'),
    import('@/data/economy/tax'),
    import('@/data/economy/tax.en'),
    import('@/data/economy/banking'),
    import('@/data/economy/banking.en'),
    import('@/data/economy/sovereign-wealth'),
    import('@/data/economy/sovereign-wealth.en'),
    import('@/data/economy/trends'),
    import('@/data/economy/trends.en'),
    import('@/data/economy/labor'),
    import('@/data/economy/labor.en'),
    import('@/data/society/trends'),
    import('@/data/society/trends.en'),
    import('@/data/society/religion'),
    import('@/data/society/religion.en'),
    import('@/data/society/business-culture'),
    import('@/data/society/business-culture.en'),
    import('@/data/society/population'),
    import('@/data/society/population.en'),
    import('@/data/society/essential-knowledge'),
    import('@/data/society/essential-knowledge.en'),
    import('@/data/society/welfare-women-food'),
    import('@/data/society/welfare-women-food.en'),
    import('@/data/politics/trends'),
    import('@/data/politics/trends.en'),
    import('@/data/power/tiers'),
    import('@/data/power/tiers.en'),
    import('@/data/industry/sectors'),
    import('@/data/industry/sectors.en'),
    import('@/data/connection/trees'),
    import('@/data/connection/trees.en'),
    import('@/data/comparison/differences'),
    import('@/data/comparison/differences.en'),
    import('@/data/legal/legal-data'),
    import('@/data/legal/legal-data.en'),
  ])

  return {
    home: { ko: homeKo, en: homeEn },
    economy: {
      ko: { tax: taxKo, banking: bankingKo, sovereignWealth: swfKo, trends: trendsKo, labor: laborKo },
      en: { tax: taxEn, banking: bankingEn, sovereignWealth: swfEn, trends: trendsEn, labor: laborEn },
    },
    society: {
      ko: { trends: societyTrendsKo, religion: religionKo, businessCulture: businessKo, population: populationKo, essential: essentialKo, welfare: welfareKo },
      en: { trends: societyTrendsEn, religion: religionEn, businessCulture: businessEn, population: populationEn, essential: essentialEn, welfare: welfareEn },
    },
    politics: { ko: politicsKo, en: politicsEn },
    power: { ko: powerKo, en: powerEn },
    industry: { ko: industryKo, en: industryEn },
    connection: { ko: connectionKo, en: connectionEn },
    comparison: { ko: comparisonKo, en: comparisonEn },
    legal: { ko: legalKo, en: legalEn },
  }
}

export function hashContent(data: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0, 16)
}

// ---------------------------------------------------------------------------
// Knowledge Snapshot (DB: documents + insights)
// ---------------------------------------------------------------------------

interface KnowledgeDocument {
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

interface KnowledgeInsight {
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

export interface KnowledgeSnapshot {
  version: string
  exportedAt: string
  contentHash: string
  counts: {
    documents: number
    insights: number
    news: number
    askme: number
  }
  documents: KnowledgeDocument[]
  insights: KnowledgeInsight[]
}

export async function buildKnowledgeSnapshot(options: {
  since?: string
  limit?: number
  includeContent?: boolean
}): Promise<KnowledgeSnapshot> {
  const { since, limit = 500, includeContent = true } = options
  const supabase = getSupabaseAdmin()

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

  const newsDocs = (documents || []).filter((d) => d.type === 'news').length
  const askmeDocs = (documents || []).filter((d) => d.type === 'askme').length

  const processedDocs = (documents || []).map((doc) => ({
    ...doc,
    content: includeContent
      ? doc.content
      : doc.content != null
        ? doc.content.slice(0, 500) + '...'
        : null,
  }))

  const processedInsights = (insights || []).map((insight) => ({
    ...insight,
    content: includeContent
      ? insight.content
      : insight.content != null
        ? insight.content.slice(0, 500) + '...'
        : null,
  }))

  const contentHash = hashContent({ documents: processedDocs, insights: processedInsights })

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
