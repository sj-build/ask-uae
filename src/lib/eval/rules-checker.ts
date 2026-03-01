/**
 * Rules Checker
 *
 * Checks claims against source registry for verification
 */

import { getSupabaseAdmin } from '@/lib/supabase'
import type { SourceRegistry, ExtractedClaim, Verdict, Severity } from './types'

/**
 * Get active sources from registry
 */
export async function getActiveSources(): Promise<SourceRegistry[]> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('source_registry')
    .select('*')
    .eq('is_active', true)
    .order('trust_level', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch sources: ${error.message}`)
  }

  return data || []
}

/**
 * Get sources by category
 */
export async function getSourcesByCategory(
  category: SourceRegistry['category']
): Promise<SourceRegistry[]> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('source_registry')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('trust_level', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch sources: ${error.message}`)
  }

  return data || []
}

/**
 * Determine which sources are relevant for a claim
 */
export function getRelevantSources(claim: ExtractedClaim, sources: SourceRegistry[]): SourceRegistry[] {
  const claimLower = claim.claim.toLowerCase()
  const locatorLower = claim.object_locator.toLowerCase()

  // Keywords to source category mapping
  const categoryKeywords: Record<string, string[]> = {
    official: ['government', 'visa', 'law', 'ministry', 'official', 'policy', 'uae', '정부'],
    regulator: ['bank', 'finance', 'tax', 'adgm', 'difc', 'vara', 'cbua', '금융', '은행', '세금'],
    intl_org: ['imf', 'world bank', 'gdp', 'economic', 'growth', 'international'],
    reputable_media: ['news', 'announced', 'reported', 'latest'],
  }

  // Check which categories are relevant
  const relevantCategories = new Set<string>()

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((kw) => claimLower.includes(kw) || locatorLower.includes(kw))) {
      relevantCategories.add(category)
    }
  }

  // If no specific category matched, use high-trust sources
  if (relevantCategories.size === 0) {
    return sources.filter((s) => s.trust_level >= 4)
  }

  return sources.filter((s) => relevantCategories.has(s.category))
}

/**
 * Basic rule-based verification
 * Returns preliminary result before LLM verification
 */
export function checkRules(
  claim: ExtractedClaim,
  sources: SourceRegistry[]
): { needsLLMVerification: boolean; relevantSources: SourceRegistry[]; hints: string[] } {
  const relevantSources = getRelevantSources(claim, sources)
  const hints: string[] = []

  // Check for stale data patterns
  const yearMatch = claim.claim.match(/20(\d{2})/)
  if (yearMatch) {
    const year = parseInt(`20${yearMatch[1]}`, 10)
    const currentYear = new Date().getFullYear()
    if (currentYear - year >= 2) {
      hints.push(`Data from ${year} may be outdated (current year: ${currentYear})`)
    }
  }

  // Check for absolute statements that need verification
  const absolutePatterns = [
    /최초|first|only|largest|biggest|highest|lowest/i,
    /100%|0%/,
    /무조건|always|never/i,
  ]

  if (absolutePatterns.some((p) => p.test(claim.claim))) {
    hints.push('Contains absolute statement that should be verified')
  }

  // Claims that definitely need LLM verification
  const needsLLMVerification =
    claim.claim_type === 'numeric' ||
    claim.claim_type === 'policy' ||
    hints.length > 0 ||
    relevantSources.length > 0

  return {
    needsLLMVerification,
    relevantSources,
    hints,
  }
}

/**
 * Determine severity based on claim type and context
 */
export function determineSeverity(claim: ExtractedClaim, verdict: Verdict): Severity {
  // High severity for contradicted claims in critical areas
  if (verdict === 'contradicted') {
    if (claim.claim_type === 'policy' || claim.claim_type === 'numeric') {
      return 'high'
    }
    if (claim.object_locator.includes('tax') || claim.object_locator.includes('legal')) {
      return 'high'
    }
    return 'med'
  }

  // Medium severity for needs_update
  if (verdict === 'needs_update') {
    if (claim.claim_type === 'numeric') {
      return 'med'
    }
    return 'low'
  }

  // Low severity for unverifiable
  return 'low'
}

/**
 * Quick validation without LLM (for daily rules check)
 */
export async function quickValidate(
  claims: ExtractedClaim[]
): Promise<Map<string, { needsReview: boolean; hints: string[]; sources: SourceRegistry[] }>> {
  const sources = await getActiveSources()
  const results = new Map<string, { needsReview: boolean; hints: string[]; sources: SourceRegistry[] }>()

  for (const claim of claims) {
    const { needsLLMVerification, relevantSources, hints } = checkRules(claim, sources)
    results.set(claim.object_locator, {
      needsReview: needsLLMVerification,
      hints,
      sources: relevantSources,
    })
  }

  return results
}
