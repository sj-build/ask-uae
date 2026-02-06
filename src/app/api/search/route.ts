import { NextResponse } from 'next/server'
import { getAnthropicClient } from '@/lib/anthropic'
import { SEARCH_SYSTEM_PROMPT, createEnhancedPrompt } from '@/lib/search-prompt'
import { SearchRequestSchema } from '@/types/search'
import { logQuestion } from '@/lib/question-logger'
import {
  needsWebSearch,
  needsEcommerceSearch,
  extractBrandName,
} from '@/lib/web-search'
import { searchUAE, formatGoogleResults } from '@/lib/google-search'
import { fetchAmazonUAEProducts, formatAmazonResults } from '@/lib/keepa-amazon'
import type { SearchResponse } from '@/types/search'

// Build e-commerce context with direct links + live Amazon data
async function buildEcommerceContext(query: string, brandName?: string): Promise<string> {
  const brand = brandName || query

  // Try to fetch live Amazon UAE data
  let amazonLiveData = ''
  try {
    const amazonProducts = await fetchAmazonUAEProducts(brand, 5)
    if (amazonProducts.length > 0) {
      amazonLiveData = formatAmazonResults(amazonProducts)
    }
  } catch (error) {
    console.warn('Failed to fetch Amazon data:', error)
  }

  const staticLinks = `
## UAE 이커머스 채널 검색 링크

브랜드/제품 "${brand}"에 대한 UAE 주요 이커머스 채널:

### Amazon UAE
- 검색 링크: https://www.amazon.ae/s?k=${encodeURIComponent(brand)}
- UAE 최대 이커머스 플랫폼, 프라임 배송 지원

### Noon
- 검색 링크: https://www.noon.com/uae-en/search/?q=${encodeURIComponent(brand)}
- 두바이 기반 중동 최대 로컬 이커머스

### Namshi
- 검색 링크: https://www.namshi.com/uae-en/search/${encodeURIComponent(brand)}/
- 패션/뷰티 전문 이커머스

### Carrefour UAE
- 검색 링크: https://www.carrefouruae.com/mafuae/en/search?keyword=${encodeURIComponent(brand)}
- 대형마트 온라인몰
`

  return amazonLiveData + staticLinks
}

export async function POST(request: Request): Promise<NextResponse<SearchResponse>> {
  const startTime = Date.now()
  let query = ''

  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Ask Me 기능을 사용하려면 ANTHROPIC_API_KEY를 .env.local에 설정해주세요.' },
        { status: 503 }
      )
    }

    const body: unknown = await request.json()

    const parseResult = SearchRequestSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 검색어입니다.' },
        { status: 400 }
      )
    }

    query = parseResult.data.query
    const client = getAnthropicClient()

    // Determine if we need enhanced search
    const shouldWebSearch = needsWebSearch(query)
    const shouldEcommerceSearch = needsEcommerceSearch(query)
    const brandName = extractBrandName(query)

    // Build enhanced context (parallel fetching)
    let webSearchResults = ''
    let ecommerceResults = ''

    const searchPromises: Promise<void>[] = []

    if (shouldWebSearch) {
      searchPromises.push(
        searchUAE(query, 5).then((results) => {
          webSearchResults = formatGoogleResults(results)
        }).catch(() => {
          // Silently fail - web search is optional enhancement
        })
      )
    }

    if (shouldEcommerceSearch) {
      searchPromises.push(
        buildEcommerceContext(query, brandName || undefined).then((results) => {
          ecommerceResults = results
        }).catch(() => {
          // Silently fail
        })
      )
    }

    // Wait for all searches to complete
    await Promise.all(searchPromises)

    // Use enhanced prompt if we have additional context
    const systemPrompt = (webSearchResults || ecommerceResults)
      ? createEnhancedPrompt(webSearchResults || undefined, ecommerceResults || undefined)
      : SEARCH_SYSTEM_PROMPT

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: query,
        },
      ],
    })

    const html = message.content
      .reduce<string>((acc, block) => {
        if (block.type === 'text') {
          return acc + block.text
        }
        return acc
      }, '')

    // Log successful question (non-blocking)
    const responseTimeMs = Date.now() - startTime
    logQuestion({
      query,
      success: true,
      responseTimeMs,
      userAgent: request.headers.get('user-agent') || undefined,
    }).catch(() => {
      // Ignore logging errors
    })

    return NextResponse.json({ success: true, html })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: '잘못된 요청 형식입니다.' },
        { status: 400 }
      )
    }

    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'

    const isAuthError =
      error instanceof Error &&
      ('status' in error && (error as { status: number }).status === 401)

    if (isAuthError) {
      return NextResponse.json(
        { success: false, error: 'API 인증에 실패했습니다. API 키를 확인해주세요.' },
        { status: 401 }
      )
    }

    const isRateLimitError =
      error instanceof Error &&
      ('status' in error && (error as { status: number }).status === 429)

    if (isRateLimitError) {
      return NextResponse.json(
        { success: false, error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      )
    }

    console.error('Search API error:', errorMessage)

    // Log failed question (non-blocking)
    if (query) {
      logQuestion({
        query,
        success: false,
        responseTimeMs: Date.now() - startTime,
        userAgent: request.headers.get('user-agent') || undefined,
      }).catch(() => {
        // Ignore logging errors
      })
    }

    return NextResponse.json(
      { success: false, error: '검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}
