/**
 * Google Custom Search API integration
 *
 * Free tier: 100 queries/day
 *
 * Setup:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a project
 * 3. Enable "Custom Search API"
 * 4. Create API credentials (API key)
 * 5. Go to https://programmablesearchengine.google.com/
 * 6. Create a search engine (select "Search the entire web")
 * 7. Get the Search Engine ID (cx)
 *
 * Environment variables needed:
 * - GOOGLE_SEARCH_API_KEY
 * - GOOGLE_SEARCH_ENGINE_ID
 */

export interface GoogleSearchResult {
  title: string
  link: string
  snippet: string
  displayLink: string
}

interface GoogleSearchResponse {
  items?: Array<{
    title: string
    link: string
    snippet: string
    displayLink: string
  }>
  searchInformation?: {
    totalResults: string
    searchTime: number
  }
  error?: {
    code: number
    message: string
  }
}

/**
 * Perform a Google search using Custom Search API
 */
export async function performGoogleSearch(
  query: string,
  options: {
    limit?: number
    language?: string
    region?: string
  } = {}
): Promise<GoogleSearchResult[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID

  if (!apiKey || !searchEngineId) {
    console.warn('Google Search API not configured (GOOGLE_SEARCH_API_KEY or GOOGLE_SEARCH_ENGINE_ID missing)')
    return []
  }

  const { limit = 10, language = 'ko', region = 'ae' } = options

  try {
    // Build search URL
    const params = new URLSearchParams({
      key: apiKey,
      cx: searchEngineId,
      q: query,
      num: String(Math.min(limit, 10)), // Max 10 per request
      lr: `lang_${language}`, // Language restriction
      gl: region, // Geolocation (UAE)
      safe: 'active',
    })

    const url = `https://www.googleapis.com/customsearch/v1?${params.toString()}`

    const response = await fetch(url)

    if (!response.ok) {
      console.error('Google Search API error:', response.status)
      return []
    }

    const data: GoogleSearchResponse = await response.json()

    if (data.error) {
      console.error('Google Search API error:', data.error.message)
      return []
    }

    if (!data.items || data.items.length === 0) {
      return []
    }

    return data.items.map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
    }))
  } catch (error) {
    console.error('Google Search error:', error)
    return []
  }
}

/**
 * Search with UAE context automatically added
 */
export async function searchUAE(query: string, limit: number = 5): Promise<GoogleSearchResult[]> {
  // Add UAE context if not already present
  const uaeTerms = ['uae', 'dubai', 'abu dhabi', '아랍에미리트', '두바이', '아부다비']
  const lowerQuery = query.toLowerCase()

  const hasUAEContext = uaeTerms.some(term => lowerQuery.includes(term))

  const searchQuery = hasUAEContext ? query : `${query} UAE`

  return performGoogleSearch(searchQuery, { limit })
}

/**
 * Format Google search results for AI prompt context
 */
export function formatGoogleResults(results: GoogleSearchResult[]): string {
  if (results.length === 0) {
    return ''
  }

  const lines = ['## 웹 검색 결과 (Google)\n']

  results.forEach((result, index) => {
    lines.push(`[${index + 1}] ${result.title}`)
    lines.push(`출처: ${result.displayLink}`)
    lines.push(`URL: ${result.link}`)
    lines.push(`${result.snippet}`)
    lines.push('')
  })

  return lines.join('\n')
}
