/**
 * Insight Extractor for Telegram Conversations
 *
 * Uses Haiku to extract 0-3 UAE investment insights from Q&A pairs.
 * Saves to existing `insights` table with source_type='telegram'.
 */

import { getSupabaseAdmin } from '@/lib/supabase'

export async function extractInsightsFromTelegram(
  userMessage: string,
  assistantMessage: string
): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        messages: [
          {
            role: 'user',
            content: `Extract 0-3 UAE investment insights from this conversation.
Only extract genuine investment-relevant observations, not generic info.

User: ${userMessage}
Assistant: ${assistantMessage.slice(0, 2000)}

Return JSON array ONLY (empty [] if no insights):
[{
  "topic": "Short topic name",
  "sector": "AI|DataCenter|SWF|Energy|Defense|Finance|Crypto|Regulation|FreeZone|RealEstate|Tourism|Healthcare|Logistics|null",
  "claim": "One sentence insight in Korean",
  "rationale": "2-3 sentence rationale in Korean",
  "tags": ["tag1", "tag2"],
  "confidence": 0.5-0.9
}]`,
          },
        ],
      }),
      signal: AbortSignal.timeout(10000),
    })

    const data = await res.json()
    const text = data.content?.[0]?.text || ''
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return

    const insights = JSON.parse(jsonMatch[0]) as Array<{
      topic: string
      sector: string | null
      claim: string
      rationale: string
      tags: string[]
      confidence: number
    }>

    if (insights.length === 0) return

    const db = getSupabaseAdmin()
    const crypto = await import('crypto')

    const rows = insights.map((insight) => {
      const contentHash = crypto.createHash('md5').update(insight.claim).digest('hex')
      return {
        topic: insight.topic,
        sector: insight.sector,
        claim: insight.claim,
        rationale: insight.rationale,
        tags: insight.tags || [],
        confidence: Math.min(1, Math.max(0, insight.confidence || 0.6)),
        source_type: 'telegram',
        content_hash: contentHash,
      }
    })

    const { error } = await db
      .from('insights')
      .upsert(rows, { onConflict: 'content_hash' })

    if (error) {
      console.error('[insight-extractor] Insert failed:', error)
    }
  } catch (err) {
    console.error('[insight-extractor] Extraction failed:', err)
  }
}
