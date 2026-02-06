// Web search utilities for enhanced AI responses

// Brand/product related keywords that trigger e-commerce search
const BRAND_KEYWORDS = [
  // Korean
  '브랜드', '제품', '화장품', '뷰티', '스킨케어', '메이크업',
  '패션', '의류', '쇼핑', '구매', '판매', '인기', '순위',
  '아마존', '눈', '나마시', '이커머스', '온라인',
  // English
  'brand', 'product', 'cosmetic', 'beauty', 'skincare', 'makeup',
  'fashion', 'clothing', 'shopping', 'buy', 'sell', 'popular', 'ranking',
  'amazon', 'noon', 'namshi', 'ecommerce', 'online',
  // Common brand names
  'samsung', 'lg', 'hyundai', 'kia', 'innisfree', 'laneige', 'sulwhasoo',
  'amorepacific', 'clio', 'etude', 'missha', 'cosrx', 'banila',
]

// Keywords that suggest need for real-time/current information
const REALTIME_KEYWORDS = [
  // Korean
  '최근', '현재', '지금', '오늘', '이번', '최신', '뉴스',
  '업데이트', '변경', '발표', '규제', '법률', '정책',
  // English
  'recent', 'current', 'now', 'today', 'latest', 'news',
  'update', 'change', 'announce', 'regulation', 'law', 'policy',
  // Time-sensitive topics
  '주가', '환율', '금리', '유가', 'stock', 'exchange rate', 'oil price',
]

export function needsWebSearch(query: string): boolean {
  const lowerQuery = query.toLowerCase()
  return REALTIME_KEYWORDS.some(keyword => lowerQuery.includes(keyword.toLowerCase()))
}

export function needsEcommerceSearch(query: string): boolean {
  const lowerQuery = query.toLowerCase()
  return BRAND_KEYWORDS.some(keyword => lowerQuery.includes(keyword.toLowerCase()))
}

export function extractBrandName(query: string): string | null {
  // Common K-beauty brands
  const brands = [
    'innisfree', 'laneige', 'sulwhasoo', 'amorepacific', 'clio', 'etude',
    'missha', 'cosrx', 'banila', 'skin food', 'tonymoly', 'nature republic',
    'the face shop', 'holika holika', 'peripera', 'rom&nd', 'hera', 'iope',
    '이니스프리', '라네즈', '설화수', '아모레퍼시픽', '클리오', '에뛰드',
    '미샤', '코스알엑스', '바닐라코', '스킨푸드', '토니모리', '네이처리퍼블릭',
  ]

  const lowerQuery = query.toLowerCase()
  for (const brand of brands) {
    if (lowerQuery.includes(brand.toLowerCase())) {
      return brand
    }
  }
  return null
}

export function buildWebSearchQuery(query: string): string {
  // Enhance query for UAE-specific results
  if (query.toLowerCase().includes('uae') || query.includes('아랍에미리트')) {
    return query
  }
  return `${query} UAE`
}

export function buildEcommerceSearchQueries(query: string, brandName?: string): string[] {
  const brand = brandName || extractBrandName(query) || query
  return [
    `${brand} Amazon UAE`,
    `${brand} Noon UAE`,
    `${brand} Namshi UAE`,
  ]
}

// Format web search results for the AI prompt
export function formatWebSearchResults(results: Array<{ title: string; url: string; snippet: string }>): string {
  if (!results || results.length === 0) {
    return 'No web search results available.'
  }

  return results.map((r, i) => `
[${i + 1}] ${r.title}
URL: ${r.url}
${r.snippet}
`).join('\n')
}

// Format e-commerce search results
export function formatEcommerceResults(
  amazonResults: string,
  noonResults: string,
  namshiResults: string
): string {
  return `
## Amazon UAE
${amazonResults || 'No results found'}

## Noon
${noonResults || 'No results found'}

## Namshi
${namshiResults || 'No results found'}
`
}
