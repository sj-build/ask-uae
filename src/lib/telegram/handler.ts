/**
 * Telegram Message Handler
 *
 * Uses direct Anthropic API call (avoids HTTP self-call timeout on Vercel)
 * Post-response: conversation logging, insight extraction, URL clip saving
 */

import { sendMessage, sendTypingAction } from './client'
import {
  getOrCreateSession,
  updateSessionHistory,
  clearSessionHistory,
  setSessionLanguage,
  checkRateLimit,
  isChatAllowed,
} from './session'
import { getAnthropicClient } from '@/lib/anthropic'
import {
  extractAllUrls,
  extractUserNote,
  fetchPageContent,
  processAndSaveClip,
} from './content-fetcher'
import { logConversation } from './conversation-logger'
import { isCrisisContent, saveCrisisToWarNewsFeed } from './crisis-detector'
import { extractInsightsFromTelegram } from './insight-extractor'
import type { TelegramMessage, TelegramSession, PageContent } from './types'
import {
  getHormuzDashboardData,
  getLatestOilPrices,
  getTrafficStats,
  getHormuzAlerts,
  getWarNews,
} from '@/lib/hormuz/queries'
import { getThreatLabel } from '@/lib/hormuz/threat-level'
import {
  getLatestScenarioState,
  getScenarioHistory,
  getRecentAnalysisLogs,
} from '@/lib/hormuz/scenario-queries'
import {
  formatScenarioStatus,
  formatVariablesStatus,
  formatImpactAnalysis,
} from '@/lib/hormuz/scenario-dispatcher'
import { IMPACT_MATRIX, SCENARIO_LABELS } from '@/data/hormuz/scenario-config'
import type { ScenarioId } from '@/types/scenario'

const TELEGRAM_SYSTEM_PROMPT = `You are the All About UAE AI assistant on Telegram.

RULES:
1. Answer in the SAME LANGUAGE as the user's question.
2. Keep answers concise (under 1500 characters). Telegram messages should be scannable.
3. Formatting: Use ONLY Telegram-safe HTML tags:
   - <b>bold text</b> for emphasis and section headers
   - <i>italic text</i> for supplementary info
   - <code>code</code> for numbers, percentages, or technical terms
   - Line breaks for structure
   - "•" bullets for lists
   - Numbers (1. 2. 3.) for ordered steps
4. NEVER use these HTML tags: <div>, <h1>-<h6>, <table>, <tr>, <td>, <p>, <span>, <ul>, <ol>, <li>, <strong>, <em>, <br>, <a>
5. Use relevant emojis to make the message visually engaging (💡📌🔎✅📊🏢💰🌍🇦🇪 etc.)
6. Structure every answer as:

💡 <b>TL;DR</b>
One sentence summary.

📌 <b>Key Points</b>
• Point 1
• Point 2
• Point 3

🔎 <b>Details</b>
Brief explanation with data/facts.

7. If data has a date, note "as of YYYY" next to it.
8. End with a relevant follow-up suggestion if helpful.`

// Commands
const COMMANDS = {
  START: '/start',
  HELP: '/help',
  CLEAR: '/clear',
  LANG_KO: '/ko',
  LANG_EN: '/en',
} as const

const HORMUZ_COMMANDS = {
  STATUS: '/status',
  OIL: '/oil',
  TRAFFIC: '/traffic',
  ALERTS: '/alerts',
  NEWS: '/news',
  MUTE: '/mute',
  UNMUTE: '/unmute',
} as const

const KARA_COMMANDS = {
  SCENARIO: '/scenario',
  VARIABLES: '/variables',
  IMPACT: '/impact',
  KARA: '/kara',
  HISTORY: '/history',
  FORECAST: '/forecast',
  EXPLAIN: '/explain',
} as const

// Response templates
const RESPONSES = {
  ko: {
    welcome: `안녕하세요! UAE 101 봇입니다. 🇦🇪

UAE에 대해 무엇이든 물어보세요!

<b>명령어:</b>
/clear - 대화 초기화
/ko - 한국어 응답
/en - English response
/help - 도움말
/status - 🔴 호르무즈 위기

<i>예: "UAE 법인세율은?", "두바이와 아부다비 차이점"</i>`,
    help: `<b>UAE 101 봇 사용법</b>

질문을 입력하면 UAE 관련 정보를 답변해드립니다.

<b>가능한 질문:</b>
• 경제: 법인세, 은행, 국부펀드
• 사회: 문화, 종교, 비즈니스 에티켓
• 법률: 비자, 회사 설립, 규제
• 정치: 정부 구조, 외교 관계

<b>명령어:</b>
/clear - 대화 기록 삭제
/ko - 한국어로 답변
/en - 영어로 답변

<b>🔴 호르무즈 위기:</b>
/status - 위기 종합 현황
/oil - 유가 정보
/traffic - 선박 통행 현황
/alerts - 해양 경보
/news - 최신 전쟁 뉴스
/mute - 위기 알림 끄기
/unmute - 위기 알림 켜기`,
    cleared: '대화 기록이 초기화되었습니다. 새로운 질문을 해주세요!',
    langSet: '언어가 한국어로 설정되었습니다.',
    rateLimit: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    notAllowed: '죄송합니다. 이 봇을 사용할 권한이 없습니다.',
    error: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    thinking: '🤔 답변을 생성하고 있습니다...',
  },
  en: {
    welcome: `Hello! I'm UAE 101 Bot. 🇦🇪

Ask me anything about the UAE!

<b>Commands:</b>
/clear - Reset conversation
/ko - Korean response
/en - English response
/help - Help
/status - 🔴 Hormuz Crisis

<i>Examples: "What's the corporate tax rate?", "Difference between Dubai and Abu Dhabi"</i>`,
    help: `<b>UAE 101 Bot Help</b>

Ask any question about UAE and I'll provide information.

<b>Topics:</b>
• Economy: Tax, banking, sovereign wealth
• Society: Culture, religion, business etiquette
• Legal: Visas, company setup, regulations
• Politics: Government, foreign relations

<b>Commands:</b>
/clear - Clear conversation history
/ko - Respond in Korean
/en - Respond in English

<b>🔴 Hormuz Crisis:</b>
/status - Crisis overview
/oil - Oil prices
/traffic - Vessel traffic
/alerts - Maritime alerts
/news - Latest war news
/mute - Mute crisis alerts
/unmute - Unmute crisis alerts`,
    cleared: 'Conversation cleared. Feel free to ask a new question!',
    langSet: 'Language set to English.',
    rateLimit: 'Too many requests. Please try again later.',
    notAllowed: 'Sorry, you are not authorized to use this bot.',
    error: 'Sorry, an error occurred. Please try again later.',
    thinking: '🤔 Generating response...',
  },
}

function getResponses(session: TelegramSession): (typeof RESPONSES)['ko'] {
  if (session.language === 'en') return RESPONSES.en
  if (session.language === 'ko') return RESPONSES.ko
  // Auto: default to Korean
  return RESPONSES.ko
}

/**
 * Call Anthropic API directly (avoids serverless self-call timeout)
 */
async function callAnthropicDirect(
  query: string,
  history: TelegramSession['message_history'],
  urlContext?: string
): Promise<string> {
  const client = getAnthropicClient()

  // Build user message with optional URL context
  let userContent = query
  if (urlContext) {
    userContent = `${query}\n\n<url_context>\n${urlContext}\n</url_context>`
  }

  const claudeMessages = [
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: userContent },
  ]

  const message = await client.messages.create(
    {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: TELEGRAM_SYSTEM_PROMPT,
      messages: claudeMessages,
    },
    { signal: AbortSignal.timeout(25000) }
  )

  const text = message.content.reduce<string>((acc, block) => {
    if (block.type === 'text') {
      return acc + block.text
    }
    return acc
  }, '')

  return stripHtmlForTelegram(text)
}

/**
 * Sanitize output to keep only Telegram-safe HTML tags
 */
function stripHtmlForTelegram(text: string): string {
  return text
    // Convert headers to bold
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '<b>$1</b>\n')
    // Convert <strong>/<em> to Telegram equivalents
    .replace(/<strong>(.*?)<\/strong>/gi, '<b>$1</b>')
    .replace(/<em>(.*?)<\/em>/gi, '<i>$1</i>')
    // Convert list items to bullets
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')
    // Convert <br> to newline
    .replace(/<br\s*\/?>/gi, '\n')
    // Convert <p> to double newline
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    // Remove <a> tags but keep text
    .replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')
    // Remove list wrappers, divs, tables, spans, etc.
    .replace(/<\/?(ul|ol|div|table|tr|td|th|thead|tbody|span|section|article|header|footer|nav|main)[^>]*>/gi, '')
    // Preserve Telegram-safe tags: <b>, <i>, <code>, <pre>, <u>, <s>
    // Remove any remaining unsupported HTML tags
    .replace(/<(?!\/?(?:b|i|code|pre|u|s)(?:\s|>))[^>]+>/g, '')
    // Clean up excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    // Telegram message limit
    .slice(0, 4000)
}

/**
 * Handle incoming message
 */
export async function handleMessage(message: TelegramMessage): Promise<void> {
  const chatId = String(message.chat.id)
  const text = message.text?.trim()
  const userName = message.from?.username || message.from?.first_name

  // Check if chat is allowed
  if (!isChatAllowed(chatId)) {
    await sendMessage(chatId, RESPONSES.ko.notAllowed)
    return
  }

  // Get or create session
  const session = await getOrCreateSession(chatId, userName)
  const responses = getResponses(session)

  // Handle empty message
  if (!text) {
    return
  }

  // Handle commands
  if (text.startsWith('/')) {
    await handleCommand(chatId, text, session)
    return
  }

  // Check rate limit
  const { allowed, remaining } = await checkRateLimit(chatId)
  if (!allowed) {
    await sendMessage(chatId, responses.rateLimit)
    return
  }

  try {
    // Send typing indicator
    await sendTypingAction(chatId)

    // Detect URLs in message
    const urls = extractAllUrls(text)
    const hasUrls = urls.length > 0

    // Fetch URL content in parallel (if any) — limit to 3 URLs
    let urlContext = ''
    const fetchedContents: Map<string, PageContent> = new Map()
    if (hasUrls) {
      const urlsToFetch = urls.slice(0, 3)
      const results = await Promise.allSettled(
        urlsToFetch.map(async (url) => {
          const content = await fetchPageContent(url)
          return { url, content }
        })
      )

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value.content.text) {
          const { url, content } = result.value
          fetchedContents.set(url, content)
          urlContext += `<article url="${url}">\nTitle: ${content.title}\n${content.text.slice(0, 3000)}\n</article>\n\n`
        }
      }
    }

    // Detect crisis-related content (for saving to war_news_feed)
    const combinedText = [text, urlContext].join(' ')
    const crisisDetected = isCrisisContent(combinedText)

    // Save user message to history
    await updateSessionHistory(chatId, 'user', text)

    // Get updated session with history
    const updatedSession = await getOrCreateSession(chatId)

    // Call Anthropic directly (with URL context if available)
    let response: string
    try {
      response = await callAnthropicDirect(
        text,
        updatedSession.message_history,
        urlContext || undefined
      )
    } catch (aiError) {
      console.error('[handler] Claude API error:', aiError instanceof Error ? aiError.message : aiError)
      await sendMessage(chatId, responses.error)
      return
    }

    // Save assistant response to history
    await updateSessionHistory(chatId, 'assistant', response)

    // Send response
    await sendMessage(chatId, response, {
      reply_to_message_id: message.message_id,
    })

    // Post-response tasks (parallel, non-blocking for Telegram response)
    const postTasks: Promise<unknown>[] = [
      logConversation(chatId, message.message_id, text, response, hasUrls),
      extractInsightsFromTelegram(text, response),
    ]

    const clipStartIdx = postTasks.length
    if (hasUrls) {
      const userNote = extractUserNote(text, urls)
      for (const url of urls.slice(0, 3)) {
        postTasks.push(
          processAndSaveClip(chatId, url, userNote || null, fetchedContents.get(url))
        )
      }
    }
    const clipEndIdx = postTasks.length

    // Save crisis-related content to war_news_feed
    if (crisisDetected) {
      const firstContent = fetchedContents.size > 0
        ? Array.from(fetchedContents.values())[0]
        : undefined
      postTasks.push(
        saveCrisisToWarNewsFeed({
          text,
          urls,
          fetchedContent: firstContent,
          chatId,
          messageId: message.message_id,
        })
      )
    }
    const crisisTaskIdx = crisisDetected ? postTasks.length - 1 : -1

    const postResults = await Promise.allSettled(postTasks)

    // Log post-task failures
    for (const [i, result] of postResults.entries()) {
      if (result.status === 'rejected') {
        console.error(`[handler] Post-task ${i} failed:`, result.reason)
      }
    }

    // Send save confirmation if URLs were processed
    if (hasUrls) {
      const clipResults = postResults.slice(clipStartIdx, clipEndIdx)
      const savedCount = clipResults.filter(
        (r) => r.status === 'fulfilled' && r.value !== null
      ).length
      if (savedCount > 0) {
        await sendMessage(chatId, `💾 ${savedCount}개 URL이 저장되었습니다.`)
      }
    }

    // Send crisis intel confirmation
    if (crisisDetected && crisisTaskIdx >= 0) {
      const crisisResult = postResults[crisisTaskIdx]
      if (crisisResult?.status === 'fulfilled' && crisisResult.value === true) {
        await sendMessage(chatId, '🔴 위기 인텔 저장됨 — 시나리오 분석에 반영됩니다.')
      }
    }
  } catch (error) {
    console.error('[handler] Telegram handler error:', {
      chatId,
      messageId: message.message_id,
      error: error instanceof Error ? error.message : String(error),
    })
    await sendMessage(chatId, responses.error)
  }
}

/**
 * Time ago formatter for Telegram messages
 */
function timeAgo(dateStr: string, lang: 'ko' | 'en'): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return lang === 'en' ? 'just now' : '방금'
  if (diff < 3600) {
    const m = Math.floor(diff / 60)
    return lang === 'en' ? `${m}m ago` : `${m}분 전`
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600)
    return lang === 'en' ? `${h}h ago` : `${h}시간 전`
  }
  const d = Math.floor(diff / 86400)
  return lang === 'en' ? `${d}d ago` : `${d}일 전`
}

/**
 * Handle Hormuz crisis commands
 */
async function handleHormuzCommand(
  chatId: string,
  command: string,
  session: TelegramSession
): Promise<void> {
  const lang: 'ko' | 'en' = session.language === 'en' ? 'en' : 'ko'

  try {
    switch (command) {
      case HORMUZ_COMMANDS.STATUS:
        await handleHormuzStatus(chatId, lang)
        break
      case HORMUZ_COMMANDS.OIL:
        await handleHormuzOil(chatId, lang)
        break
      case HORMUZ_COMMANDS.TRAFFIC:
        await handleHormuzTraffic(chatId, lang)
        break
      case HORMUZ_COMMANDS.ALERTS:
        await handleHormuzAlertsList(chatId, lang)
        break
      case HORMUZ_COMMANDS.NEWS:
        await handleHormuzNewsList(chatId, lang)
        break
      case HORMUZ_COMMANDS.MUTE:
        await handleHormuzMuteToggle(chatId, lang, true)
        break
      case HORMUZ_COMMANDS.UNMUTE:
        await handleHormuzMuteToggle(chatId, lang, false)
        break
      // KARA Scenario commands
      case KARA_COMMANDS.SCENARIO:
        await handleKaraScenario(chatId, lang)
        break
      case KARA_COMMANDS.VARIABLES:
        await handleKaraVariables(chatId, lang)
        break
      case KARA_COMMANDS.IMPACT:
        await handleKaraImpact(chatId, lang)
        break
      case KARA_COMMANDS.KARA:
        await handleKaraFund(chatId, lang)
        break
      case KARA_COMMANDS.HISTORY:
        await handleKaraHistory(chatId, lang)
        break
      case KARA_COMMANDS.FORECAST:
        await handleKaraForecast(chatId, lang)
        break
      case KARA_COMMANDS.EXPLAIN:
        await handleKaraExplain(chatId, lang)
        break
    }
  } catch (error) {
    console.error('Hormuz command error:', error)
    await sendMessage(
      chatId,
      lang === 'en' ? '❌ Failed to fetch crisis data.' : '❌ 위기 데이터 조회에 실패했습니다.'
    )
  }
}

async function handleHormuzStatus(chatId: string, lang: 'ko' | 'en'): Promise<void> {
  const data = await getHormuzDashboardData()
  const threat = data.threatLevel

  const levelMap: Record<string, number> = { LOW: 1, ELEVATED: 2, HIGH: 3, CRITICAL: 4 }
  const dots = Array.from({ length: 4 }, (_, i) =>
    i < (levelMap[threat] ?? 0) ? '●' : '○'
  ).join(' ')

  const brent = data.oil.brent
  const wti = data.oil.wti
  const vesselCount = data.vessels.total
  const alertCount = data.latestAlerts.length
  const latestNews = data.latestNews[0]
  const threatLabel = getThreatLabel(threat, lang)

  const fmtPct = (pct: number | null | undefined) => {
    if (pct == null) return ''
    return ` (${pct > 0 ? '▲' : '▼'} ${Math.abs(pct).toFixed(1)}%)`
  }

  const lines = lang === 'en'
    ? [
        '🔴 <b>Hormuz Crisis Status</b>',
        '',
        `⚠️ Threat: <b>${threatLabel}</b> (${dots})`,
        '',
        '📊 <b>Key Indicators</b>',
        `• 🚢 Vessels (24h): <code>${vesselCount}</code>${data.vessels.changePct != null ? fmtPct(data.vessels.changePct) : ''}`,
        `• 🛢️ Brent: <code>$${brent?.price?.toFixed(2) ?? 'N/A'}</code>${fmtPct(brent?.change_pct)}`,
        `• 🛢️ WTI: <code>$${wti?.price?.toFixed(2) ?? 'N/A'}</code>${fmtPct(wti?.change_pct)}`,
        `• ⚠️ Alerts: <code>${alertCount}</code>`,
        ...(latestNews ? ['', `📰 Latest: <i>${latestNews.title}</i>`] : []),
        '',
        '🔗 https://askuae.vercel.app/hormuz',
      ]
    : [
        '🔴 <b>호르무즈 위기 현황</b>',
        '',
        `⚠️ 위협: <b>${threatLabel}</b> (${dots})`,
        '',
        '📊 <b>주요 지표</b>',
        `• 🚢 선박 (24h): <code>${vesselCount}</code>${data.vessels.changePct != null ? fmtPct(data.vessels.changePct) : ''}`,
        `• 🛢️ 브렌트: <code>$${brent?.price?.toFixed(2) ?? 'N/A'}</code>${fmtPct(brent?.change_pct)}`,
        `• 🛢️ WTI: <code>$${wti?.price?.toFixed(2) ?? 'N/A'}</code>${fmtPct(wti?.change_pct)}`,
        `• ⚠️ 경보: <code>${alertCount}</code>`,
        ...(latestNews ? ['', `📰 최신: <i>${latestNews.title}</i>`] : []),
        '',
        '🔗 https://askuae.vercel.app/hormuz',
      ]

  await sendMessage(chatId, lines.join('\n'))
}

async function handleHormuzOil(chatId: string, lang: 'ko' | 'en'): Promise<void> {
  const prices = await getLatestOilPrices()
  const brent = prices.brent
  const wti = prices.wti

  const fmtPrice = (p: typeof brent, name: string) => {
    if (!p) return `<b>${name}</b>\n• ${lang === 'en' ? 'No data' : '데이터 없음'}`
    const arrow = (p.change_pct ?? 0) >= 0 ? '▲' : '▼'
    const parts = [
      `<b>${name}</b>`,
      `• ${lang === 'en' ? 'Price' : '가격'}: <code>$${p.price.toFixed(2)}</code>${p.change_pct != null ? ` ${arrow} ${Math.abs(p.change_pct).toFixed(1)}%` : ''}`,
    ]
    if (p.prev_close != null) parts.push(`• ${lang === 'en' ? 'Prev' : '전일'}: <code>$${p.prev_close.toFixed(2)}</code>`)
    if (p.low_price != null && p.high_price != null) parts.push(`• ${lang === 'en' ? 'Range' : '범위'}: $${p.low_price.toFixed(2)} - $${p.high_price.toFixed(2)}`)
    if (p.spike_flag) parts.push(`• ⚠️ ${lang === 'en' ? 'SPIKE DETECTED' : '급등 감지'}`)
    return parts.join('\n')
  }

  const msg = [
    lang === 'en' ? '🛢️ <b>Oil Prices</b>' : '🛢️ <b>유가 현황</b>',
    '',
    fmtPrice(brent, lang === 'en' ? 'Brent Crude' : '브렌트유'),
    '',
    fmtPrice(wti, 'WTI'),
    '',
    '🔗 https://askuae.vercel.app/market-impact',
  ].join('\n')

  await sendMessage(chatId, msg)
}

async function handleHormuzTraffic(chatId: string, lang: 'ko' | 'en'): Promise<void> {
  const stats = await getTrafficStats()

  if (!stats) {
    await sendMessage(chatId, lang === 'en' ? '🚢 No traffic data available.' : '🚢 통행 데이터가 없습니다.')
    return
  }

  const msg = [
    lang === 'en' ? '🚢 <b>Hormuz Vessel Traffic</b>' : '🚢 <b>호르무즈 선박 통행</b>',
    '',
    `• ${lang === 'en' ? 'Total (24h)' : '총 선박 (24h)'}: <code>${stats.total_vessels}</code>`,
    `• ${lang === 'en' ? 'Tankers' : '유조선'}: <code>${stats.tanker_count}</code>`,
    `• ${lang === 'en' ? 'Cargo' : '화물선'}: <code>${stats.cargo_count}</code>`,
    `• LNG: <code>${stats.lng_count}</code>`,
    `• ${lang === 'en' ? 'Stopped' : '정지'}: <code>${stats.stopped_count}</code>`,
    `• ${lang === 'en' ? 'U-turns' : 'U턴'}: <code>${stats.u_turn_count}</code>`,
    `• ${lang === 'en' ? 'Dark vessels' : '미식별'}: <code>${stats.dark_vessel_count}</code>`,
    '',
    '🔗 https://askuae.vercel.app/crisis-map',
  ].join('\n')

  await sendMessage(chatId, msg)
}

async function handleHormuzAlertsList(chatId: string, lang: 'ko' | 'en'): Promise<void> {
  const alerts = await getHormuzAlerts()

  if (alerts.length === 0) {
    await sendMessage(chatId, lang === 'en' ? '✅ No active maritime alerts.' : '✅ 활성 해양 경보가 없습니다.')
    return
  }

  const emoji: Record<string, string> = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' }
  const items = alerts.slice(0, 5).map((a, i) => {
    const e = emoji[a.threat_level ?? ''] ?? '⚪'
    return `${i + 1}. ${e} <b>${a.title}</b>\n   ${a.source}${a.alert_id ? ` ${a.alert_id}` : ''} | ${timeAgo(a.published_at ?? a.created_at, lang)}`
  }).join('\n\n')

  const msg = [
    lang === 'en' ? `⚠️ <b>Maritime Alerts (${alerts.length})</b>` : `⚠️ <b>해양 경보 (${alerts.length}건)</b>`,
    '',
    items,
    '',
    '🔗 https://askuae.vercel.app/hormuz',
  ].join('\n')

  await sendMessage(chatId, msg)
}

async function handleHormuzNewsList(chatId: string, lang: 'ko' | 'en'): Promise<void> {
  const news = await getWarNews({ limit: 5 })

  if (news.length === 0) {
    await sendMessage(chatId, lang === 'en' ? '📰 No recent war news.' : '📰 최근 전쟁 뉴스가 없습니다.')
    return
  }

  const emoji: Record<string, string> = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' }
  const items = news.map((n, i) => {
    const e = emoji[n.severity ?? ''] ?? '⚪'
    return `${i + 1}. ${e} <b>${n.title}</b>\n   ${n.source_name} | ${timeAgo(n.published_at ?? n.created_at, lang)}`
  }).join('\n\n')

  const msg = [
    lang === 'en' ? '📰 <b>Latest War News</b>' : '📰 <b>최신 전쟁 뉴스</b>',
    '',
    items,
    '',
    '🔗 https://askuae.vercel.app/war-room',
  ].join('\n')

  await sendMessage(chatId, msg)
}

async function handleHormuzMuteToggle(chatId: string, lang: 'ko' | 'en', mute: boolean): Promise<void> {
  // TODO: Persist mute preference in a dedicated table for full mute support
  const msg = mute
    ? (lang === 'en' ? '🔇 Crisis alerts muted for this chat.\nUse /unmute to resume.' : '🔇 위기 알림이 꺼졌습니다.\n/unmute로 다시 켤 수 있습니다.')
    : (lang === 'en' ? '🔔 Crisis alerts resumed.' : '🔔 위기 알림이 켜졌습니다.')

  await sendMessage(chatId, msg)
}

// ============================================================================
// KARA Scenario Command Handlers
// ============================================================================

async function handleKaraScenario(chatId: string, lang: 'ko' | 'en'): Promise<void> {
  const state = await getLatestScenarioState()
  if (!state) {
    await sendMessage(chatId, lang === 'en' ? '🧠 No scenario data yet.' : '🧠 시나리오 데이터가 아직 없습니다.')
    return
  }
  await sendMessage(chatId, formatScenarioStatus(state, lang))
}

async function handleKaraVariables(chatId: string, lang: 'ko' | 'en'): Promise<void> {
  const state = await getLatestScenarioState()
  if (!state || !state.variables_snapshot) {
    await sendMessage(chatId, lang === 'en' ? '📊 No variable data yet.' : '📊 변수 데이터가 아직 없습니다.')
    return
  }
  await sendMessage(chatId, formatVariablesStatus(state.variables_snapshot as Record<string, string | number>, lang))
}

async function handleKaraImpact(chatId: string, lang: 'ko' | 'en'): Promise<void> {
  const state = await getLatestScenarioState()
  if (!state) {
    await sendMessage(chatId, lang === 'en' ? '💹 No scenario data yet.' : '💹 시나리오 데이터가 아직 없습니다.')
    return
  }
  await sendMessage(chatId, formatImpactAnalysis(state, lang))
}

async function handleKaraFund(chatId: string, lang: 'ko' | 'en'): Promise<void> {
  const state = await getLatestScenarioState()
  if (!state) {
    await sendMessage(chatId, lang === 'en' ? '🏢 No scenario data yet.' : '🏢 시나리오 데이터가 아직 없습니다.')
    return
  }
  const isKo = lang === 'ko'
  const primary = state.primary_scenario as ScenarioId
  const impact = IMPACT_MATRIX[primary]
  if (!impact) {
    await sendMessage(chatId, isKo ? '❌ 현재 시나리오의 KARA 데이터가 없습니다.' : '❌ No KARA data for current scenario.')
    return
  }
  const label = isKo ? SCENARIO_LABELS[primary]?.ko : SCENARIO_LABELS[primary]?.en
  const lines = [
    isKo ? `🏢 <b>KARA Fund 현황 (시나리오 ${primary}: ${label})</b>` : `🏢 <b>KARA Fund Status (Scenario ${primary}: ${label})</b>`,
    '',
    `📅 LP 미팅: ${impact.kara_fund.lp_meeting}`,
    `📈 테제: ${impact.kara_fund.thesis_strength}`,
    `💼 딜 기회: ${impact.kara_fund.deal_opportunity}`,
    '',
    isKo ? '<b>액션 아이템</b>' : '<b>Action Items</b>',
    ...impact.kara_fund.action_items.map((a: string) => `• ${a}`),
  ]
  await sendMessage(chatId, lines.join('\n'))
}

async function handleKaraHistory(chatId: string, lang: 'ko' | 'en'): Promise<void> {
  const history = await getScenarioHistory(5)
  if (history.length === 0) {
    await sendMessage(chatId, lang === 'en' ? '📜 No scenario history yet.' : '📜 시나리오 이력이 아직 없습니다.')
    return
  }
  const isKo = lang === 'ko'
  const lines = [isKo ? '📜 <b>시나리오 변화 이력 (최근 5건)</b>' : '📜 <b>Scenario History (Last 5)</b>', '']
  for (const s of history) {
    const time = new Date(s.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    const label = isKo ? SCENARIO_LABELS[s.primary_scenario as ScenarioId]?.ko : SCENARIO_LABELS[s.primary_scenario as ScenarioId]?.en
    lines.push(`<b>${time}</b> — ${s.primary_scenario} ${label} (A:${s.scenario_a_pct}% B:${s.scenario_b_pct}% C:${s.scenario_c_pct}% D:${s.scenario_d_pct}%)`)
    if (s.transition_detected) lines.push(`  ⚡ ${isKo ? '전환' : 'Transition'}: ${s.transition_detected}`)
    lines.push('')
  }
  await sendMessage(chatId, lines.join('\n'))
}

async function handleKaraForecast(chatId: string, lang: 'ko' | 'en'): Promise<void> {
  const state = await getLatestScenarioState()
  if (!state) {
    await sendMessage(chatId, lang === 'en' ? '🔮 No forecast data yet.' : '🔮 예측 데이터가 아직 없습니다.')
    return
  }
  const isKo = lang === 'ko'
  const primary = state.primary_scenario as ScenarioId
  const impact = IMPACT_MATRIX[primary]
  const label = isKo ? SCENARIO_LABELS[primary]?.ko : SCENARIO_LABELS[primary]?.en
  const lines = [
    isKo ? `🔮 <b>48시간 전망 (주 시나리오: ${primary} ${label})</b>` : `🔮 <b>48h Forecast (Primary: ${primary} ${label})</b>`,
    '',
    `🛢️ ${isKo ? '유가' : 'Oil'}: ${impact.oil.direction} ${impact.oil.range} (${impact.oil.timeline})`,
    `📈 KOSPI: ${impact.kospi.direction} ${impact.kospi.magnitude}`,
    `🌍 ${isKo ? '글로벌' : 'Global'}: ${impact.global_equity.direction} ${impact.global_equity.magnitude}`,
    '',
    `📝 ${impact.oil.reasoning}`,
  ]
  await sendMessage(chatId, lines.join('\n'))
}

async function handleKaraExplain(chatId: string, lang: 'ko' | 'en'): Promise<void> {
  const logs = await getRecentAnalysisLogs(1)
  if (logs.length === 0) {
    await sendMessage(chatId, lang === 'en' ? '📝 No analysis logs yet.' : '📝 분석 이력이 아직 없습니다.')
    return
  }
  const log = logs[0]
  const isKo = lang === 'ko'
  const time = new Date(log.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  const lines = [
    isKo ? `📝 <b>마지막 시나리오 분석</b>` : `📝 <b>Last Scenario Analysis</b>`,
    `🕐 ${time} KST`,
    '',
    `${isKo ? '레벨' : 'Level'}: <code>${log.alert_level ?? 'N/A'}</code>`,
    `${isKo ? '시나리오 변화' : 'Scenario changed'}: <code>${log.scenario_changed ? 'Yes' : 'No'}</code>`,
    `${isKo ? '처리 시간' : 'Processing'}: <code>${log.processing_time_ms ?? 'N/A'}ms</code>`,
    `${isKo ? '비용' : 'Cost'}: <code>$${Number(log.cost_usd ?? 0).toFixed(4)}</code>`,
  ]
  if (log.claude_response && typeof log.claude_response === 'object' && 'summary_ko' in log.claude_response) {
    lines.push('', `📝 ${(log.claude_response as Record<string, string>).summary_ko}`)
  }
  if (log.claude_response && typeof log.claude_response === 'object' && 'scenario_update' in log.claude_response) {
    const update = (log.claude_response as Record<string, Record<string, string>>).scenario_update
    if (update?.reasoning_ko) {
      lines.push('', `🔍 ${update.reasoning_ko}`)
    }
  }
  await sendMessage(chatId, lines.join('\n'))
}

/**
 * Handle bot commands
 */
async function handleCommand(
  chatId: string,
  command: string,
  session: TelegramSession
): Promise<void> {
  const responses = getResponses(session)
  const cmd = command.split(' ')[0].toLowerCase()

  switch (cmd) {
    case COMMANDS.START:
      await sendMessage(chatId, responses.welcome)
      break

    case COMMANDS.HELP:
      await sendMessage(chatId, responses.help)
      break

    case COMMANDS.CLEAR:
      await clearSessionHistory(chatId)
      await sendMessage(chatId, responses.cleared)
      break

    case COMMANDS.LANG_KO:
      await setSessionLanguage(chatId, 'ko')
      await sendMessage(chatId, RESPONSES.ko.langSet)
      break

    case COMMANDS.LANG_EN:
      await setSessionLanguage(chatId, 'en')
      await sendMessage(chatId, RESPONSES.en.langSet)
      break

    case HORMUZ_COMMANDS.STATUS:
    case HORMUZ_COMMANDS.OIL:
    case HORMUZ_COMMANDS.TRAFFIC:
    case HORMUZ_COMMANDS.ALERTS:
    case HORMUZ_COMMANDS.NEWS:
    case HORMUZ_COMMANDS.MUTE:
    case HORMUZ_COMMANDS.UNMUTE:
      await handleHormuzCommand(chatId, cmd, session)
      break

    case KARA_COMMANDS.SCENARIO:
    case KARA_COMMANDS.VARIABLES:
    case KARA_COMMANDS.IMPACT:
    case KARA_COMMANDS.KARA:
    case KARA_COMMANDS.HISTORY:
    case KARA_COMMANDS.FORECAST:
    case KARA_COMMANDS.EXPLAIN:
      await handleHormuzCommand(chatId, cmd, session)
      break

    default: {
      // Unknown command - strip slash prefix and treat as question
      const questionText = command.replace(/^\/\w+\s*/, '').trim()
      if (!questionText) {
        await sendMessage(chatId, responses.help)
        return
      }
      await handleMessage({
        message_id: 0,
        chat: { id: parseInt(chatId, 10), type: 'private' },
        date: Date.now() / 1000,
        text: questionText,
      } as TelegramMessage)
    }
  }
}
