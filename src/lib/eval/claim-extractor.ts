/**
 * Claim Extraction using LLM
 *
 * Extracts atomic, verifiable claims from site content
 */

import { getAnthropicClient } from '@/lib/anthropic'
import type { ExtractedClaim, ClaimType } from './types'

const CLAIM_EXTRACTION_PROMPT = `You are an expert fact-checker. Extract atomic, verifiable claims from the following content.

Focus on claims that can be verified against authoritative sources:
- **numeric**: Statistics, percentages, monetary values, dates, rankings
- **definition**: Legal definitions, policy terminology, official classifications
- **policy**: Laws, regulations, government policies, requirements
- **timeline**: Historical events, effective dates, deadlines
- **comparison**: Relative statements between entities/countries

For each claim, provide:
1. claim: The exact claim statement (verbatim or minimally paraphrased)
2. claim_type: One of [numeric, definition, policy, timeline, comparison]
3. object_locator: A dot-notation path to locate this claim (e.g., "economy.tax.corporateTax.rate")
4. current_text: The original text containing this claim

Return as JSON array. Only include claims that:
- Are specific and verifiable
- Contain factual assertions (not opinions)
- Would benefit from periodic verification

Example output:
[
  {
    "claim": "UAE corporate tax rate is 9% on taxable income exceeding AED 375,000",
    "claim_type": "numeric",
    "object_locator": "economy.tax.corporateTax",
    "current_text": "연 과세소득 AED 375,000 초과분에 9% 적용"
  }
]

If no verifiable claims found, return empty array: []`

export async function extractClaims(
  content: string,
  context: {
    page?: string
    section?: string
    locale?: 'ko' | 'en'
  } = {}
): Promise<ExtractedClaim[]> {
  const client = getAnthropicClient()

  const contextInfo = [
    context.page ? `Page: ${context.page}` : null,
    context.section ? `Section: ${context.section}` : null,
    context.locale ? `Language: ${context.locale}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: CLAIM_EXTRACTION_PROMPT,
      messages: [
        {
          role: 'user',
          content: `${contextInfo ? `Context:\n${contextInfo}\n\n` : ''}Content to analyze:\n\n${content}`,
        },
      ],
    })

    const responseText = response.content
      .filter((block) => block.type === 'text')
      .map((block) => 'text' in block ? block.text : '')
      .join('')

    // Parse JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return []
    }

    const claims = JSON.parse(jsonMatch[0]) as ExtractedClaim[]

    // Validate claim types
    const validTypes: ClaimType[] = ['numeric', 'definition', 'policy', 'timeline', 'comparison']
    return claims.filter(
      (claim) =>
        typeof claim.claim === 'string' &&
        validTypes.includes(claim.claim_type) &&
        typeof claim.object_locator === 'string'
    )
  } catch (error) {
    console.error('Claim extraction failed:', error)
    return []
  }
}

/**
 * Extract claims from structured site data
 */
export function extractClaimsFromObject(
  obj: unknown,
  path: string = '',
  claims: ExtractedClaim[] = []
): ExtractedClaim[] {
  if (obj === null || obj === undefined) {
    return claims
  }

  if (typeof obj === 'string') {
    // Check if string contains potential numeric claims
    const numericPatterns = [
      /\d+%/,
      /AED\s*[\d,]+/,
      /\$[\d,]+[BMK]?/,
      /\d{4}년/,
      /\d{4}\.\d{2}/,
      /\d+위/,
    ]

    if (numericPatterns.some((p) => p.test(obj))) {
      claims.push({
        claim: obj,
        claim_type: 'numeric',
        object_locator: path,
        current_text: obj,
      })
    }
    return claims
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      extractClaimsFromObject(item, `${path}[${index}]`, claims)
    })
    return claims
  }

  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = path ? `${path}.${key}` : key
      extractClaimsFromObject(value, newPath, claims)
    }
  }

  return claims
}

/**
 * Batch extract claims from multiple content items
 */
export async function extractClaimsBatch(
  items: Array<{ content: string; context?: { page?: string; section?: string; locale?: 'ko' | 'en' } }>
): Promise<Map<number, ExtractedClaim[]>> {
  const results = new Map<number, ExtractedClaim[]>()

  // Process in batches of 5 to avoid rate limits
  const batchSize = 5
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const promises = batch.map((item, idx) => extractClaims(item.content, item.context).then((claims) => ({ index: i + idx, claims })))

    const batchResults = await Promise.all(promises)
    batchResults.forEach(({ index, claims }) => {
      results.set(index, claims)
    })
  }

  return results
}
