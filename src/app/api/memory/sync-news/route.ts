import { NextResponse } from 'next/server'
import { crawlGoogleNews, crawlNaverNews, enrichWithImages } from '@/lib/news/crawler'
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
  // SWF and Investment
  'UAE sovereign wealth fund',
  'Abu Dhabi investment',
  'ADIA Mubadala MGX',
  'ADQ investment',
  'IHC conglomerate UAE',
  'Mubadala portfolio',
  'ADIA global investment',
  // Technology and AI
  'G42 AI UAE',
  'Stargate UAE AI',
  'UAE data center',
  'Microsoft UAE AI',
  'UAE technology hub',
  // Energy
  'ADNOC energy',
  'ADNOC investment',
  'Masdar renewable energy',
  'UAE clean energy',
  'UAE nuclear energy Barakah',
  // Crypto and Fintech
  'UAE stablecoin crypto',
  'Dubai crypto regulation',
  'ADGM fintech',
  'UAE digital assets',
  // Real Estate and Infrastructure
  'Dubai real estate',
  'Abu Dhabi real estate',
  'UAE mega projects',
  'Etihad Rail UAE',
  // Korea-UAE relations
  'Korea UAE partnership',
  'Korea UAE investment',
  'Samsung UAE',
  'Hyundai UAE',
  'Korean companies UAE',
  'Barakah nuclear Korea',
  'Korea UAE CEPA',
  // Economy and Policy
  'UAE economy 2025',
  'UAE economic diversification',
  'UAE foreign investment',
  'UAE business hub',
  'Emirates NBD',
  // Politics and Diplomacy
  'MBZ UAE president',
  'UAE foreign policy',
  'Sheikh Tahnoun',
  'UAE diplomacy',
]

const CRAWL_QUERIES_KO: readonly string[] = [
  // ===== UAE-Korea 양자 협력 (핵심) =====
  '한국 UAE 협력',
  '한국 아부다비',
  '한국 두바이',
  'UAE 한국 기업',
  '한-UAE 관계',
  'UAE 한국 투자',
  '윤석열 UAE',
  '한-UAE 정상회담',
  'UAE 대통령 한국',
  '한국 중동 외교',

  // ===== 한국 대기업 UAE 진출 =====
  // 삼성
  '삼성 UAE',
  '삼성 아부다비',
  '삼성 두바이',
  '삼성전자 중동',
  '삼성물산 UAE',
  '삼성엔지니어링 UAE',
  // SK
  'SK UAE',
  'SK 아부다비',
  'SK하이닉스 중동',
  'SK이노베이션 UAE',
  // 현대
  '현대건설 UAE',
  '현대자동차 UAE',
  '현대엔지니어링 중동',
  // 한화
  '한화 UAE',
  '한화에어로스페이스 중동',
  '한화오션 UAE',
  // 기타 대기업
  '두산 UAE',
  'KEPCO UAE',
  '한전 아부다비',
  '한전 원전',
  'LG UAE',
  'LG전자 중동',
  '포스코 UAE',
  'GS건설 UAE',
  'CJ 중동',
  '롯데 UAE',
  '대우건설 중동',

  // ===== 바라카 원전 (대표 협력 사례) =====
  '바라카 원전',
  '바라카 한국',
  '바라카 원자력',
  'UAE 원전',
  '아부다비 원전',
  'ENEC 한국',

  // ===== 국부펀드/투자 =====
  '무바달라 한국',
  '무바달라 투자',
  'ADIA 한국',
  'ADIA 투자',
  'ADQ 한국',
  'UAE 국부펀드',
  'UAE 투자',
  '아부다비 투자청',
  'IHC 투자',
  '중동 국부펀드 한국',
  '무바달라 스타트업',

  // ===== UAE 경제/산업 전반 =====
  '아부다비 경제',
  '두바이 경제',
  'UAE 부동산',
  'UAE 에너지',
  'UAE AI',
  'UAE 스타트업',
  'UAE 금융',
  'UAE 핀테크',
  'UAE 암호화폐',
  'UAE 스테이블코인',
  'G42 AI',
  'ADNOC 투자',
  'ADNOC 에너지',
  'UAE 신재생에너지',
  '마스다르 에너지',

  // ===== 문화/관광/교류 =====
  'UAE 할랄',
  'UAE 관광',
  'UAE CEPA',
  '두바이 한국인',
  '아부다비 한국인',
  'UAE 한류',
  'UAE K팝',
  'UAE K뷰티',
  '두바이 엑스포',
  'UAE 방산',
  '중동 방위산업',

  // ===== UAE 정치/외교 =====
  'MBZ 대통령',
  'UAE 왕세자',
  '아부다비 통치자',
  '두바이 통치자',
  'UAE 외교',
  'UAE 미국',
  'UAE 중국',
  '에미리트 정책',

  // ===== 프리존/비즈니스 =====
  'ADGM 한국',
  'DIFC 한국',
  '두바이 프리존',
  'UAE 법인설립',
  'UAE 비즈니스',
  'UAE 진출',
  '중동 진출',
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

    // Crawl news from multiple sources
    const [googleEnResults, googleKoResults, naverResults] = await Promise.allSettled([
      crawlGoogleNews(CRAWL_QUERIES_EN, 'en'),
      crawlGoogleNews(CRAWL_QUERIES_KO, 'ko'),
      crawlNaverNews(CRAWL_QUERIES_KO),
    ])

    const allItems: NewsItem[] = []

    if (googleEnResults.status === 'fulfilled') {
      allItems.push(...googleEnResults.value)
    }

    if (googleKoResults.status === 'fulfilled') {
      allItems.push(...googleKoResults.value)
    }

    if (naverResults.status === 'fulfilled') {
      allItems.push(...naverResults.value)
    }

    const deduplicated = deduplicateNews(allItems)

    // Fetch OG images for articles (limit to top 50 for performance)
    const topArticles = deduplicated.slice(0, 50)
    const enrichedTop = await enrichWithImages([...topArticles])
    const enrichedAll = [...enrichedTop, ...deduplicated.slice(50)]

    const tagged = tagNewsBatch(enrichedAll, ALL_KEYWORDS)

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

    // Also upsert to documents table for unified knowledge layer
    const { upsertDocumentFromNews, processDocumentEmbeddings } = await import('@/lib/db')
    const { isEmbeddingConfigured } = await import('@/lib/embeddings')
    let documentsUpserted = 0
    let embeddingsGenerated = 0

    const shouldGenerateEmbeddings = isEmbeddingConfigured()

    for (const article of articles) {
      try {
        const documentId = await upsertDocumentFromNews({
          title: article.title,
          url: article.url,
          summary: article.summary ?? null,
          publisher: article.publisher,
          published_at: article.published_at ?? null,
          tags: [...article.tags],
          category: article.category ?? null,
        })
        documentsUpserted++

        // Generate embeddings if configured and document was created
        if (shouldGenerateEmbeddings && documentId && article.summary) {
          try {
            const content = [article.title, article.summary].filter(Boolean).join('\n\n')
            await processDocumentEmbeddings(documentId, content, article.title)
            embeddingsGenerated++
          } catch (embError) {
            console.warn('Embedding generation failed for:', article.url, embError)
            // Continue - embedding failure shouldn't block sync
          }
        }
      } catch (e) {
        // Continue on individual failures
        console.warn('Document upsert failed for:', article.url, e)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${data?.length ?? 0} news articles to UAE Memory (${documentsUpserted} documents, ${embeddingsGenerated} embeddings)`,
      synced: data?.length ?? 0,
      documents_synced: documentsUpserted,
      embeddings_generated: embeddingsGenerated,
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
