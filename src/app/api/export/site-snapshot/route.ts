import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Dynamic imports for all data files
async function loadAllData() {
  const [
    // Home
    homeKo,
    homeEn,
    // Economy
    taxKo,
    taxEn,
    bankingKo,
    bankingEn,
    swfKo,
    swfEn,
    trendsKo,
    trendsEn,
    laborKo,
    laborEn,
    // Society
    societyTrendsKo,
    societyTrendsEn,
    religionKo,
    religionEn,
    businessKo,
    businessEn,
    populationKo,
    populationEn,
    essentialKo,
    essentialEn,
    welfareKo,
    welfareEn,
    // Politics
    politicsKo,
    politicsEn,
    // Power
    powerKo,
    powerEn,
    // Industry
    industryKo,
    industryEn,
    // Connection
    connectionKo,
    connectionEn,
    // Comparison
    comparisonKo,
    comparisonEn,
    // Legal
    legalKo,
    legalEn,
  ] = await Promise.all([
    // Home
    import('@/data/home/category-hot-issues'),
    import('@/data/home/category-hot-issues.en'),
    // Economy
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
    // Society
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
    // Politics
    import('@/data/politics/trends'),
    import('@/data/politics/trends.en'),
    // Power
    import('@/data/power/tiers'),
    import('@/data/power/tiers.en'),
    // Industry
    import('@/data/industry/sectors'),
    import('@/data/industry/sectors.en'),
    // Connection
    import('@/data/connection/trees'),
    import('@/data/connection/trees.en'),
    // Comparison
    import('@/data/comparison/differences'),
    import('@/data/comparison/differences.en'),
    // Legal
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

/**
 * Export API: Site Snapshot
 *
 * Returns complete static site content for Eval Agent verification.
 * Used for daily_rules checks against source_registry.
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

    const pages = await loadAllData()

    const pagesJson = JSON.stringify(pages)
    const contentHash = crypto.createHash('sha256').update(pagesJson).digest('hex').slice(0, 16)

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

// HEAD for health check
export async function HEAD(): Promise<Response> {
  const hasSecret = process.env.CRON_SECRET || process.env.EXPORT_TOKEN
  return new Response(null, { status: hasSecret ? 200 : 503 })
}
