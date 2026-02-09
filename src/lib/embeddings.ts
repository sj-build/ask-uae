/**
 * Embedding generation utility for RAG pipeline
 * Uses OpenAI text-embedding-3-small by default
 */

export interface EmbeddingConfig {
  readonly provider: 'openai'
  readonly model: string
  readonly dimensions: number
  readonly apiKey: string
}

export interface EmbeddingResult {
  readonly embedding: number[]
  readonly tokenCount: number
}

export interface BatchEmbeddingResult {
  readonly embeddings: readonly EmbeddingResult[]
  readonly totalTokens: number
}

const MAX_BATCH_SIZE = 100 // OpenAI limit
const MAX_TOKENS_PER_REQUEST = 8191 // text-embedding-3-small limit
const DEFAULT_TIMEOUT_MS = 30000 // 30 second timeout for embedding API
const MAX_RETRIES = 2

/**
 * Get embedding configuration from environment
 */
export function getEmbeddingConfig(): EmbeddingConfig {
  const provider = process.env.EMBEDDING_PROVIDER || 'openai'

  if (provider !== 'openai') {
    throw new Error(`Unsupported embedding provider: ${provider}`)
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }

  return {
    provider: 'openai',
    model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    dimensions: parseInt(process.env.OPENAI_EMBEDDING_DIM || '1536', 10),
    apiKey,
  }
}

/**
 * Check if embeddings are configured
 */
export function isEmbeddingConfigured(): boolean {
  return !!(
    process.env.OPENAI_API_KEY &&
    process.env.EMBEDDING_PROVIDER === 'openai'
  )
}

/**
 * Generate embedding for a single text with retry and timeout
 */
export async function generateEmbedding(
  text: string,
  options?: { timeout?: number; retries?: number }
): Promise<EmbeddingResult> {
  const config = getEmbeddingConfig()
  const timeout = options?.timeout ?? DEFAULT_TIMEOUT_MS
  const maxRetries = options?.retries ?? MAX_RETRIES

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          input: text,
          dimensions: config.dimensions,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.text()

        // Don't retry on auth errors or bad requests
        if (response.status === 401 || response.status === 400) {
          throw new Error(`OpenAI embedding API error: ${response.status} - ${error}`)
        }

        // Retry on rate limit (429) or server errors (5xx)
        if (response.status === 429 || response.status >= 500) {
          lastError = new Error(`OpenAI embedding API error: ${response.status} - ${error}`)
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
          continue
        }

        throw new Error(`OpenAI embedding API error: ${response.status} - ${error}`)
      }

      const data = await response.json() as {
        data: Array<{ embedding: number[]; index: number }>
        usage: { prompt_tokens: number; total_tokens: number }
      }

      return {
        embedding: data.data[0].embedding,
        tokenCount: data.usage.prompt_tokens,
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        lastError = new Error(`Embedding generation timed out after ${timeout}ms`)
      } else {
        lastError = error as Error
      }

      // Don't retry on abort
      if (error instanceof Error && error.name === 'AbortError') {
        break
      }

      // Add delay before retry
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500))
      }
    }
  }

  throw lastError ?? new Error('Embedding generation failed')
}

/**
 * Generate embeddings for multiple texts in batch
 * Handles batching and rate limits automatically
 */
export async function generateEmbeddingsBatch(
  texts: readonly string[]
): Promise<BatchEmbeddingResult> {
  if (texts.length === 0) {
    return { embeddings: [], totalTokens: 0 }
  }

  const config = getEmbeddingConfig()
  const allResults: EmbeddingResult[] = []
  let totalTokens = 0

  // Process in batches
  for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
    const batch = texts.slice(i, i + MAX_BATCH_SIZE)

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        input: batch,
        dimensions: config.dimensions,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI embedding API error: ${response.status} - ${error}`)
    }

    const data = await response.json() as {
      data: Array<{ embedding: number[]; index: number }>
      usage: { prompt_tokens: number; total_tokens: number }
    }

    // Sort by index to maintain order
    const sortedData = [...data.data].sort((a, b) => a.index - b.index)

    for (const item of sortedData) {
      allResults.push({
        embedding: item.embedding,
        tokenCount: Math.floor(data.usage.prompt_tokens / batch.length), // Approximate per-item
      })
    }

    totalTokens += data.usage.total_tokens

    // Rate limit protection: small delay between batches
    if (i + MAX_BATCH_SIZE < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return {
    embeddings: allResults,
    totalTokens,
  }
}

/**
 * Format embedding array for Supabase pgvector storage
 * pgvector expects format: '[0.1,0.2,0.3,...]'
 */
export function formatEmbeddingForPgvector(embedding: readonly number[]): string {
  return `[${embedding.join(',')}]`
}

/**
 * Parse embedding string from Supabase back to array
 */
export function parseEmbeddingFromPgvector(embeddingStr: string): number[] {
  return JSON.parse(embeddingStr.replace(/^\[/, '[').replace(/\]$/, ']'))
}
