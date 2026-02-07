import { NextResponse } from 'next/server'
import { crawlGoogleNews, crawlNaverNews } from '@/lib/news/crawler'
import { deduplicateNews } from '@/lib/news/deduplicator'
import { tagNewsBatch } from '@/lib/news/tagger'
import { ALL_KEYWORDS } from '@/data/news/keywords'
import type { NewsItem } from '@/types/news'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

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

// Categorize news based on content
function categorizeNews(item: NewsItem): string {
  const text = `${item.title} ${item.tags.join(' ')}`.toLowerCase()

  // Korea-related first (highest priority)
  if (/korea|korean|한국|kepco|samsung|삼성|sk|hanwha|한화|hyundai|현대|k-beauty|k-pop|hallyu|한류|cepa|barakah|바라카|lg|posco|포스코|doosan|두산/i.test(text)) {
    return 'uae-korea'
  }

  // Investment & SWF
  if (/mubadala|adia|adq|ihc|mgx|lunate|sovereign wealth|private equity|venture|fund|acquisition|stake|portfolio|asset|investment/i.test(text)) {
    return 'investment'
  }

  // Industry specific
  if (/adnoc|masdar|nuclear|oil|gas|renewable|energy|ai|g42|data center|stargate|technology|real estate|construction|infrastructure|tourism|aviation|emirates|etihad|logistics|port|dp world|fintech|healthcare|pharma/i.test(text)) {
    return 'industry'
  }

  // Politics
  if (/정치|외교|왕족|diplomatic|political|royal|government|mbz|sheikh|tahnoun/i.test(text)) {
    return 'politics'
  }

  // Economy
  if (/경제|금융|gdp|economy|finance|trade|inflation|currency/i.test(text)) {
    return 'economy'
  }

  return 'general'
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Verify authorization (simple check for now)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET ?? process.env.ADMIN_PASSWORD

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check Supabase configuration
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'Supabase not configured, skipping sync',
        synced: 0,
      })
    }

    // Import Supabase only if configured
    const { getSupabaseAdmin } = await import('@/lib/supabase')
    const supabase = getSupabaseAdmin()

    // Crawl news
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

    // Transform to Supabase format
    const articles = tagged.map((item) => ({
      title: item.title,
      summary: item.summary ?? null,
      url: item.url,
      publisher: item.publisher,
      source: item.source === 'naver' ? 'naver' : 'google',
      language: item.source === 'naver' ? 'ko' : 'en',
      image_url: item.imageUrl ?? null,
      category: categorizeNews(item),
      tags: item.tags,
      published_at: item.publishedAt,
    }))

    // Upsert to Supabase (ignore duplicates based on URL)
    const { data, error } = await supabase
      .from('news_articles')
      .upsert(articles, {
        onConflict: 'url',
        ignoreDuplicates: true,
      })
      .select('id')

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${data?.length ?? 0} news articles to UAE Memory`,
      synced: data?.length ?? 0,
      total_crawled: allItems.length,
    })
  } catch (error) {
    console.error('Sync error:', error)
    const errorMessage = error instanceof Error
      ? error.message
      : 'Unknown error during sync'

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

// GET for manual trigger (with password)
export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url)
  const password = url.searchParams.get('password')

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Forward to POST handler
  const newRequest = new Request(request.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ADMIN_PASSWORD}`,
    },
  })

  return POST(newRequest)
}
