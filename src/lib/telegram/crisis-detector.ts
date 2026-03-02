/**
 * Crisis Content Detector for Telegram Bot
 *
 * Detects Iran/Hormuz crisis-related content in Telegram messages
 * and saves to war_news_feed table for scenario analysis.
 */

import { upsertWarNews } from '@/lib/hormuz/queries'
import type { PageContent } from './types'
import type { NewsCategory, NewsSeverity } from '@/types/hormuz'

// =============================================================================
// Crisis Detection
// =============================================================================

const CRISIS_KEYWORDS =
  /이란|호르무즈|hormuz|iran|persian\s*gulf|tehran|irgc|hezbollah|houthi|gulf.*(?:strike|war|crisis|attack)|oil.*(?:blockade|embargo)|tanker.*(?:attack|seize)|missile.*(?:strike|launch)|drone.*(?:attack|strike)|naval.*(?:confrontation|deployment)|중동.*위기|유가.*급등|원유.*차단|해협.*봉쇄|carrier.*(?:group|strike)/i

export function isCrisisContent(text: string): boolean {
  return CRISIS_KEYWORDS.test(text)
}

// =============================================================================
// Category Classification
// =============================================================================

const CATEGORY_PATTERNS: [NewsCategory, RegExp][] = [
  ['hormuz_shipping', /hormuz|strait|해협|선박|vessel|tanker|shipping|maritime|해상|통행|suez|해운/i],
  ['oil_energy', /oil|crude|brent|wti|opec|유가|원유|에너지|lng|natural\s*gas|pipeline|정유/i],
  ['military_ops', /military|strike|missile|drone|attack|bomb|naval|군사|미사일|공격|폭격|전투|carrier|destroyer|submarine/i],
  ['iran_internal', /tehran|irgc|ayatollah|iran.*govern|이란.*정부|이란.*내부|혁명수비대|khamenei/i],
  ['uae_impact', /uae|dubai|abu\s*dhabi|emirates|두바이|아부다비|에미리트/i],
  ['market_reaction', /market|stock|index|kospi|s&p|treasury|bond|시장|주식|채권|금리|inflation|인플레/i],
  ['diplomacy', /diplomacy|sanction|negotiat|un.*security|ceasefire|외교|제재|협상|휴전/i],
  ['insurance_maritime', /insurance|p&i|premium|보험|할증|war\s*risk/i],
  ['casualties', /casualt|dead|killed|injur|사망|부상|피해자/i],
  ['regime_change', /regime|coup|overthrow|revolution|정권|쿠데타|혁명/i],
]

function detectCategory(text: string): NewsCategory {
  for (const [category, pattern] of CATEGORY_PATTERNS) {
    if (pattern.test(text)) return category
  }
  return 'military_ops'
}

// =============================================================================
// Severity Estimation
// =============================================================================

function estimateSeverity(text: string): NewsSeverity {
  if (/전쟁.*선포|war\s+declar|nuclear|blockade|봉쇄|해협.*폐쇄|closure|strait.*closed|invasion/i.test(text)) {
    return 'critical'
  }
  if (/attack|strike|missile|explosion|공격|미사일|폭발|casualties|sinking|격침/i.test(text)) {
    return 'high'
  }
  if (/sanction|threat|escalat|tension|제재|위협|긴장|확전|deployment|배치/i.test(text)) {
    return 'medium'
  }
  return 'low'
}

// =============================================================================
// Keyword Extraction
// =============================================================================

const KEYWORD_MAP: [RegExp, string][] = [
  [/이란|iran/i, 'iran'],
  [/호르무즈|hormuz/i, 'hormuz'],
  [/유가|oil|crude/i, 'oil'],
  [/미사일|missile/i, 'missile'],
  [/드론|drone/i, 'drone'],
  [/공격|attack|strike/i, 'attack'],
  [/해협|strait/i, 'strait'],
  [/선박|vessel|tanker|ship/i, 'vessel'],
  [/hezbollah|헤즈볼라/i, 'hezbollah'],
  [/houthi|후티/i, 'houthi'],
  [/irgc|혁명수비대/i, 'irgc'],
  [/uae|두바이|아부다비/i, 'uae'],
  [/중동|middle\s*east/i, 'middle_east'],
  [/봉쇄|blockade/i, 'blockade'],
  [/제재|sanction/i, 'sanctions'],
  [/lng/i, 'lng'],
  [/opec/i, 'opec'],
  [/carrier|항모/i, 'carrier'],
]

function extractKeywords(text: string): string[] {
  const keywords: string[] = []
  for (const [re, kw] of KEYWORD_MAP) {
    if (re.test(text)) keywords.push(kw)
  }
  return keywords
}

// =============================================================================
// Save to war_news_feed
// =============================================================================

export async function saveCrisisToWarNewsFeed(params: {
  text: string
  urls: string[]
  fetchedContent?: PageContent
  chatId: string
  messageId?: number
}): Promise<boolean> {
  try {
    const { text, urls, fetchedContent, chatId, messageId } = params
    const combinedText = [text, fetchedContent?.text || ''].join(' ')

    if (!isCrisisContent(combinedText)) return false

    const title = fetchedContent?.title?.trim() || text.slice(0, 200)
    const summary = fetchedContent?.text?.slice(0, 500) || text.slice(0, 500)
    const category = detectCategory(combinedText)
    const severity = estimateSeverity(combinedText)
    const keywords = extractKeywords(combinedText)

    // Use article URL if available, otherwise generate unique Telegram URL
    const url = urls[0] || `telegram://${chatId}/msg/${messageId || Date.now()}`

    const success = await upsertWarNews([
      {
        title,
        summary,
        url,
        source_name: 'telegram',
        source_type: 'social',
        category,
        severity,
        keywords,
        sentiment: null,
        is_verified: false,
        related_alert_id: null,
        published_at: new Date().toISOString(),
        fetched_at: new Date().toISOString(),
      },
    ])

    if (success) {
      console.log(`[crisis-detector] Saved crisis content: "${title.slice(0, 80)}" [${severity}/${category}]`)
    }

    return success
  } catch (error) {
    console.error('[crisis-detector] Save to war_news_feed failed:', error)
    return false
  }
}
