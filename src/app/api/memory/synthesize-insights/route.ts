import { NextResponse } from 'next/server'
import { getAnthropicClient } from '@/lib/anthropic'
import { getSupabaseAdmin } from '@/lib/supabase'
import { upsertInsightUnit, upsertDocumentFromInsight } from '@/lib/db'
import { INSIGHT_TAXONOMY } from '@/lib/types'

const SYNTHESIS_SYSTEM_PROMPT = `You are a UAE market intelligence analyst. Your task is to extract structured "Insight Units" from recent news and Q&A data.

Each Insight Unit must have:
- topic: A clear topic title (e.g., "UAE AI & Data Center Expansion")
- sector: One of these categories: ${INSIGHT_TAXONOMY.join(', ')}
- claim: A single, specific assertion (1 sentence)
- rationale: 2-4 sentences explaining why this matters and the supporting logic
- evidence_ids: Array of document/news IDs that support this insight (use the IDs provided in the data)
- tags: 2-5 relevant tags from the taxonomy
- confidence: 0.5-1.0 (how confident based on evidence quality and recency)
- as_of: The date this insight is valid as of (YYYY-MM-DD format)

Rules:
1. Each insight must cite at least 1 evidence_id
2. Focus on actionable intelligence for investors/businesses
3. Prefer recent information over old
4. Be specific, not generic
5. Output ONLY valid JSON array, no markdown or explanation

Example output format:
[
  {
    "topic": "UAE AI Investment Acceleration",
    "sector": "AI",
    "claim": "UAE sovereign wealth funds increased AI investments by 40% in Q4 2024.",
    "rationale": "Mubadala and ADQ have both announced major AI infrastructure deals. G42's partnership with Microsoft and the Stargate project signal government commitment to AI leadership. This creates opportunities for AI startups seeking regional expansion.",
    "evidence_ids": ["uuid-1", "uuid-2"],
    "tags": ["AI", "SWF", "Investment"],
    "confidence": 0.85,
    "as_of": "2025-01-15"
  }
]`

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET ?? process.env.ADMIN_PASSWORD

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'ANTHROPIC_API_KEY not configured' },
        { status: 503 }
      )
    }

    const supabase = getSupabaseAdmin()

    // 1. Fetch recent news (last 72 hours)
    const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()

    const { data: recentNews } = await supabase
      .from('news_articles')
      .select('id, title, summary, category, tags, published_at, publisher')
      .gte('published_at', threeDaysAgo)
      .order('published_at', { ascending: false })
      .limit(30)

    // 2. Fetch recent AskMe sessions (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: recentAskMe } = await supabase
      .from('askme_sessions')
      .select('id, question, answer, created_at')
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false })
      .limit(20)

    // 3. Fetch recent documents (for reference)
    const { data: recentDocs } = await supabase
      .from('documents')
      .select('id, title, summary, source, tags')
      .gte('last_updated', sevenDaysAgo)
      .order('last_updated', { ascending: false })
      .limit(20)

    // Build context for LLM
    const newsContext = (recentNews ?? []).map(n => ({
      id: n.id,
      type: 'news',
      title: n.title,
      summary: n.summary,
      category: n.category,
      tags: n.tags,
      date: n.published_at,
      publisher: n.publisher,
    }))

    const askmeContext = (recentAskMe ?? []).map(a => ({
      id: a.id,
      type: 'askme',
      question: a.question,
      answer: a.answer?.slice(0, 500),
      date: a.created_at,
    }))

    const docsContext = (recentDocs ?? []).map(d => ({
      id: d.id,
      type: d.source,
      title: d.title,
      summary: d.summary,
      tags: d.tags,
    }))

    const contextData = {
      news: newsContext,
      askme: askmeContext,
      documents: docsContext,
      generated_at: new Date().toISOString(),
    }

    // 4. Call LLM to generate insights
    const client = getAnthropicClient()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYNTHESIS_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze the following UAE market data and generate 5-15 structured Insight Units.

Data:
${JSON.stringify(contextData, null, 2)}

Generate insights as a JSON array. Focus on:
1. Investment opportunities and risks
2. Regulatory changes
3. Market trends
4. UAE-Korea business opportunities
5. Key player movements (SWF, government, major companies)`,
        },
      ],
    })

    // Parse LLM response
    const responseText = message.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('')

    // Extract JSON from response
    let insights: Array<{
      topic: string
      sector?: string
      claim: string
      rationale: string
      evidence_ids: string[]
      tags?: string[]
      confidence: number
      as_of?: string
    }> = []

    try {
      // Try to parse as JSON directly
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error('Failed to parse insights JSON:', parseError)
      return NextResponse.json({
        success: false,
        error: 'Failed to parse LLM response',
        raw_response: responseText.slice(0, 500),
      }, { status: 500 })
    }

    // 5. Save insights to database
    let savedCount = 0
    const errors: string[] = []

    for (const insight of insights) {
      try {
        // Validate required fields
        if (!insight.topic || !insight.claim || !insight.rationale) {
          errors.push(`Invalid insight: missing required fields - ${insight.topic ?? 'no topic'}`)
          continue
        }

        // Save to insights table
        const insightId = await upsertInsightUnit({
          topic: insight.topic,
          sector: insight.sector ?? null,
          claim: insight.claim,
          rationale: insight.rationale,
          evidence_ids: insight.evidence_ids ?? [],
          tags: insight.tags ?? [],
          confidence: insight.confidence ?? 0.6,
          as_of: insight.as_of ?? null,
        })

        // Also save to documents table for RAG
        await upsertDocumentFromInsight({
          id: insightId,
          topic: insight.topic,
          claim: insight.claim,
          rationale: insight.rationale,
          tags: insight.tags ?? [],
          confidence: insight.confidence ?? 0.6,
          as_of: insight.as_of ?? null,
        })

        savedCount++
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : 'Unknown error'
        errors.push(`Failed to save insight "${insight.topic}": ${errorMsg}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${insights.length} insights, saved ${savedCount}`,
      insights_generated: insights.length,
      insights_saved: savedCount,
      errors: errors.length > 0 ? errors : undefined,
      context_stats: {
        news_count: newsContext.length,
        askme_count: askmeContext.length,
        docs_count: docsContext.length,
      },
    })
  } catch (error) {
    console.error('Synthesize insights error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

// GET for manual trigger
export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url)
  const password = url.searchParams.get('password')

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const newRequest = new Request(request.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ADMIN_PASSWORD}`,
    },
  })

  return POST(newRequest)
}
