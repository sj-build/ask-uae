/**
 * Content Fetcher for Telegram URL Processing
 *
 * Ported from Nous content-fetcher.ts, adapted for UAE market context.
 * Handles: URL detection → content fetch (direct + Jina parallel) → AI classification → DB save
 */

import { getSupabaseAdmin } from '@/lib/supabase'
import type { PageContent, AiClipResult, SourceType } from './types'

// =============================================================================
// URL Safety
// =============================================================================

const ALLOWED_PROTOCOLS = ['http:', 'https:']
const BLOCKED_HOSTS =
  /^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|0\.|::1|fc00:|fe80:)/i

export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) return false
    if (BLOCKED_HOSTS.test(parsed.hostname)) return false
    return true
  } catch {
    return false
  }
}

// =============================================================================
// URL Detection
// =============================================================================

export function extractAllUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s]+/g)
  return matches || []
}

export function extractUserNote(text: string, urls: string[]): string {
  let note = text
  for (const url of urls) {
    note = note.replaceAll(url, '')
  }
  return note.trim()
}

export function detectSourceType(url: string): SourceType {
  if (/x\.com|twitter\.com/.test(url)) return 'x'
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube'
  if (/threads\.net/.test(url)) return 'thread'
  if (/linkedin\.com/.test(url)) return 'linkedin'
  return 'web'
}

export function isXUrl(url: string): boolean {
  return /^https?:\/\/(x\.com|twitter\.com)\//.test(url)
}

// =============================================================================
// Content Fetching
// =============================================================================

export async function fetchPageContent(url: string): Promise<PageContent> {
  if (!isSafeUrl(url)) {
    return { title: '', text: '', ogImage: null, authorHandle: null }
  }

  try {
    if (isXUrl(url)) {
      return await fetchXContent(url)
    }

    const [directResult, jinaResult] = await Promise.allSettled([
      directFetch(url),
      jinaFetch(url),
    ])

    const direct = directResult.status === 'fulfilled' ? directResult.value : null
    const jina = jinaResult.status === 'fulfilled' ? jinaResult.value : null

    const directLen = direct?.text?.length || 0
    const jinaLen = jina?.text?.length || 0

    if (jinaLen > directLen && jinaLen > 500) {
      return {
        title: jina!.title || direct?.title || '',
        text: jina!.text,
        ogImage: direct?.ogImage || null,
        authorHandle: direct?.authorHandle || null,
      }
    } else if (direct) {
      return direct
    }

    return { title: '', text: '', ogImage: null, authorHandle: null }
  } catch {
    return { title: '', text: '', ogImage: null, authorHandle: null }
  }
}

async function directFetch(url: string): Promise<PageContent> {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,ko;q=0.8',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(10000),
  })

  const html = await res.text()
  return {
    title: extractMetaTag(html, 'og:title') || extractTitle(html) || '',
    text: extractArticleText(html),
    ogImage: extractMetaTag(html, 'og:image'),
    authorHandle: extractMetaTag(html, 'twitter:creator'),
  }
}

async function jinaFetch(url: string): Promise<{ title: string; text: string }> {
  try {
    const jinaUrl = `https://r.jina.ai/${url}`
    const res = await fetch(jinaUrl, {
      headers: {
        Accept: 'text/plain',
        'X-Return-Format': 'text',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      return { title: '', text: '' }
    }

    const text = await res.text()
    const lines = text.split('\n')
    let title = ''
    let startIdx = 0

    if (lines[0]?.startsWith('Title:')) {
      title = lines[0].replace('Title:', '').trim()
      startIdx = 1
    } else if (lines[0]?.startsWith('# ')) {
      title = lines[0].replace(/^#+\s*/, '').trim()
      startIdx = 1
    }

    const bodyText = lines.slice(startIdx).join('\n').trim()
    return { title, text: bodyText.slice(0, 8000) }
  } catch {
    return { title: '', text: '' }
  }
}

async function fetchXContent(url: string): Promise<PageContent> {
  const match = url.match(/(?:x\.com|twitter\.com)\/(@?\w+)\/status\/(\d+)/)
  const handle = match ? `@${match[1]}` : null

  const grokKey = process.env.GROK_API_KEY
  if (grokKey) {
    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${grokKey}`,
        },
        body: JSON.stringify({
          model: 'grok-4-1-fast-non-reasoning',
          messages: [
            {
              role: 'user',
              content: `Find this X post and return its full text content: ${url}\n\nReturn JSON: {"author": "@handle", "text": "full tweet text", "likes": number}`,
            },
          ],
          tools: [{ type: 'x_search' }],
          temperature: 0,
        }),
        signal: AbortSignal.timeout(15000),
      })

      const data = await res.json()
      const content = data.choices?.[0]?.message?.content || ''
      try {
        const parsed = JSON.parse(content.replace(/```json\n?|```\n?/g, '').trim())
        return {
          title: parsed.text?.slice(0, 200) || '',
          text: parsed.text || '',
          ogImage: null,
          authorHandle: parsed.author || handle,
        }
      } catch {
        /* fall through */
      }
    } catch {
      /* fall through */
    }
  }

  return {
    title: `X post by ${handle || 'unknown'}`,
    text: '',
    ogImage: null,
    authorHandle: handle,
  }
}

// =============================================================================
// AI Processing (Haiku — UAE sectors)
// =============================================================================

export async function aiProcessClip(
  url: string,
  title: string,
  text: string
): Promise<AiClipResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return {
      summary: title || url,
      sectors: [],
      tags: ['unsorted'],
      importance: 2,
      investment_implication: null,
    }
  }

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
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `Analyze this saved article/post for a UAE-focused investment researcher.

URL: ${url}
Title: ${title}
Content: ${text.slice(0, 3000)}

Return JSON only:
{
  "summary": "한국어 2-3문장 요약",
  "sectors": ["ONLY if directly relevant: AI, DataCenter, SWF, Energy, Defense, Finance, Crypto, Regulation, FreeZone, RealEstate, Tourism, UAE_Korea, Geopolitics, Healthcare, Logistics — leave EMPTY [] if not clearly about these sectors"],
  "tags": ["3-5 descriptive tags in Korean"],
  "importance": 1-5,
  "investment_implication": "투자 시사점 1문장 (null if not investment-relevant)"
}

IMPORTANT: sectors should be empty [] for most saves.`,
          },
        ],
      }),
      signal: AbortSignal.timeout(10000),
    })

    const data = await res.json()
    const content = data.content?.[0]?.text || '{}'
    const clean = content.replace(/```json\n?|```\n?/g, '').trim()
    const raw = JSON.parse(clean)

    return {
      summary: typeof raw.summary === 'string' ? raw.summary : title || url,
      sectors: Array.isArray(raw.sectors)
        ? raw.sectors.filter((s: unknown): s is string => typeof s === 'string')
        : [],
      tags: Array.isArray(raw.tags)
        ? raw.tags.filter((t: unknown): t is string => typeof t === 'string')
        : ['unsorted'],
      importance:
        typeof raw.importance === 'number'
          ? Math.min(5, Math.max(1, Math.round(raw.importance)))
          : 2,
      investment_implication:
        typeof raw.investment_implication === 'string' ? raw.investment_implication : null,
    }
  } catch {
    return {
      summary: title || url,
      sectors: [],
      tags: ['unsorted'],
      importance: 2,
      investment_implication: null,
    }
  }
}

// =============================================================================
// DB Save
// =============================================================================

export async function saveClipToDb(clip: {
  chatId: string
  url: string
  title: string
  originalText: string
  thumbnailUrl: string | null
  sourceType: string
  authorHandle: string | null
  userNote: string | null
  aiResult: AiClipResult
}): Promise<void> {
  const db = getSupabaseAdmin()

  const { error } = await db.from('telegram_saved_clips').upsert(
    {
      chat_id: clip.chatId,
      url: clip.url,
      title: clip.title,
      original_text: clip.originalText.slice(0, 10000),
      thumbnail_url: clip.thumbnailUrl,
      source_type: clip.sourceType,
      author_handle: clip.authorHandle,
      user_note: clip.userNote,
      ai_summary: clip.aiResult.summary,
      sectors: clip.aiResult.sectors,
      tags: clip.aiResult.tags,
      importance: clip.aiResult.importance,
      investment_implication: clip.aiResult.investment_implication,
      saved_at: new Date().toISOString(),
    },
    { onConflict: 'url' }
  )

  if (error) {
    console.error('[content-fetcher] Save clip failed:', error)
  }
}

/**
 * Full pipeline: fetch → AI process → save → return result
 */
export async function processAndSaveClip(
  chatId: string,
  url: string,
  userNote: string | null,
  fetchedContent?: PageContent
): Promise<AiClipResult | null> {
  try {
    const content = fetchedContent || (await fetchPageContent(url))
    const sourceType = detectSourceType(url)
    const aiResult = await aiProcessClip(url, content.title, content.text)

    await saveClipToDb({
      chatId,
      url,
      title: content.title || url,
      originalText: content.text,
      thumbnailUrl: content.ogImage,
      sourceType,
      authorHandle: content.authorHandle,
      userNote,
      aiResult,
    })

    return aiResult
  } catch {
    return null
  }
}

// =============================================================================
// HTML Helpers
// =============================================================================

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return match ? match[1].trim() : ''
}

function extractMetaTag(html: string, property: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
    'i'
  )
  const match = html.match(re)
  if (match) return match[1]

  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
    'i'
  )
  const match2 = html.match(re2)
  return match2 ? match2[1] : null
}

function extractArticleText(html: string): string {
  let clean = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')

  const articleMatch = clean.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
  const contentHtml = articleMatch ? articleMatch[1] : clean

  const textBlocks: string[] = []
  const blockRegex =
    /<(?:p|li|h[1-6]|blockquote|div[^>]*class="[^"]*(?:content|article|body|text)[^"]*")[^>]*>([\s\S]*?)<\/(?:p|li|h[1-6]|blockquote|div)>/gi
  let match: RegExpExecArray | null
  while ((match = blockRegex.exec(contentHtml)) !== null) {
    const stripped = match[1].replace(/<[^>]+>/g, '').trim()
    if (stripped.length > 30) textBlocks.push(stripped)
  }

  if (textBlocks.join(' ').length > 200) {
    return textBlocks.join('\n\n').slice(0, 5000)
  }

  const allText = contentHtml
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (allText.length > 200) {
    return allText.slice(0, 5000)
  }

  const ogDesc = extractMetaTag(html, 'og:description')
  const desc = extractMetaTag(html, 'description')
  return ogDesc || desc || allText.slice(0, 5000)
}
