/**
 * Amazon UAE data fetching via Keepa API
 * Requires: KEEPA_API_KEY in environment
 */

export interface AmazonProduct {
  asin: string
  title: string
  brand: string
  price: number | null
  currency: string
  rating: number | null
  reviewCount: number
  rank: number
  category: string
  imageUrl: string | null
  url: string
}

interface KeepaProduct {
  asin: string
  title?: string
  brand?: string
  csv?: number[][]
  rating?: number
  reviewCount?: number
  salesRank?: number
  categoryTree?: Array<{ name: string }>
  imagesCSV?: string
  manufacturer?: string
}

// Amazon UAE Beauty categories
const UAE_CATEGORIES: Record<string, string> = {
  beauty: '16225024031',
  skincare: '16225036031',
  makeup: '16225028031',
  haircare: '16225016031',
  fragrance: '16225012031',
}

/**
 * Fetch Amazon UAE best sellers for K-Beauty related categories
 */
export async function fetchAmazonUAEProducts(
  query: string,
  limit: number = 10
): Promise<AmazonProduct[]> {
  const apiKey = process.env.KEEPA_API_KEY

  if (!apiKey) {
    console.warn('KEEPA_API_KEY not configured')
    return []
  }

  try {
    // Search for products on Amazon UAE (domain 10 = UAE)
    const searchUrl = `https://api.keepa.com/search?key=${apiKey}&domain=10&type=product&term=${encodeURIComponent(query)}&page=0&perPage=${limit}`

    const searchResponse = await fetch(searchUrl)

    if (!searchResponse.ok) {
      console.error('Keepa search failed:', searchResponse.status)
      return []
    }

    const searchData = await searchResponse.json()

    if (!searchData.products || searchData.products.length === 0) {
      return []
    }

    // Get ASINs from search results
    const asins = searchData.products.slice(0, limit).map((p: KeepaProduct) => p.asin)

    // Get detailed product info
    const productUrl = `https://api.keepa.com/product?key=${apiKey}&domain=10&asin=${asins.join(',')}`

    const productResponse = await fetch(productUrl)

    if (!productResponse.ok) {
      console.error('Keepa product fetch failed:', productResponse.status)
      return []
    }

    const productData = await productResponse.json()

    if (!productData.products) {
      return []
    }

    return productData.products.map((product: KeepaProduct, index: number) =>
      normalizeProduct(product, index + 1)
    )
  } catch (error) {
    console.error('Keepa API error:', error)
    return []
  }
}

/**
 * Fetch best sellers from a specific category
 */
export async function fetchAmazonUAEBestSellers(
  category: keyof typeof UAE_CATEGORIES = 'beauty',
  limit: number = 10
): Promise<AmazonProduct[]> {
  const apiKey = process.env.KEEPA_API_KEY

  if (!apiKey) {
    console.warn('KEEPA_API_KEY not configured')
    return []
  }

  const categoryId = UAE_CATEGORIES[category]

  if (!categoryId) {
    console.warn(`Unknown category: ${category}`)
    return []
  }

  try {
    // Get best sellers for category on Amazon UAE (domain 10)
    const url = `https://api.keepa.com/bestsellers?key=${apiKey}&domain=10&category=${categoryId}`

    const response = await fetch(url)

    if (!response.ok) {
      console.error('Keepa best sellers failed:', response.status)
      return []
    }

    const data = await response.json()

    if (!data.bestSellersList || data.bestSellersList.length === 0) {
      return []
    }

    // Get ASINs
    const asins = data.bestSellersList.slice(0, limit)

    // Get product details
    const productUrl = `https://api.keepa.com/product?key=${apiKey}&domain=10&asin=${asins.join(',')}`

    const productResponse = await fetch(productUrl)

    if (!productResponse.ok) {
      return []
    }

    const productData = await productResponse.json()

    if (!productData.products) {
      return []
    }

    return productData.products.map((product: KeepaProduct, index: number) =>
      normalizeProduct(product, index + 1)
    )
  } catch (error) {
    console.error('Keepa API error:', error)
    return []
  }
}

function normalizeProduct(product: KeepaProduct, rank: number): AmazonProduct {
  // Extract price (Keepa stores in cents)
  let price: number | null = null
  if (product.csv && product.csv[0] && product.csv[0].length > 0) {
    const priceHistory = product.csv[0]
    for (let i = priceHistory.length - 1; i >= 0; i--) {
      if (priceHistory[i] > 0) {
        price = priceHistory[i] / 100
        break
      }
    }
  }

  // Rating is stored * 10
  const rating = product.rating ? product.rating / 10 : null

  // Extract brand from title if not available
  let brand = product.brand || ''
  if (!brand && product.title) {
    brand = product.title.split(' ')[0]
  }

  // Get category name
  const category =
    product.categoryTree && product.categoryTree.length > 0
      ? product.categoryTree[product.categoryTree.length - 1].name
      : ''

  // Get first image
  const imageUrl = product.imagesCSV ? product.imagesCSV.split(',')[0] : null

  return {
    asin: product.asin,
    title: product.title || '',
    brand,
    price,
    currency: 'AED',
    rating,
    reviewCount: product.reviewCount || 0,
    rank,
    category,
    imageUrl: imageUrl
      ? `https://images-na.ssl-images-amazon.com/images/I/${imageUrl}`
      : null,
    url: `https://www.amazon.ae/dp/${product.asin}`,
  }
}

/**
 * Format Amazon results for AI prompt context
 */
export function formatAmazonResults(products: AmazonProduct[]): string {
  if (products.length === 0) {
    return ''
  }

  const lines = ['## Amazon UAE 실시간 검색 결과\n']

  products.forEach((product, index) => {
    lines.push(`### ${index + 1}. ${product.title}`)
    lines.push(`- 브랜드: ${product.brand}`)
    if (product.price) {
      lines.push(`- 가격: ${product.price} ${product.currency}`)
    }
    if (product.rating) {
      lines.push(`- 평점: ${product.rating}/5 (${product.reviewCount}개 리뷰)`)
    }
    lines.push(`- 랭킹: #${product.rank}`)
    lines.push(`- 링크: ${product.url}`)
    lines.push('')
  })

  return lines.join('\n')
}
