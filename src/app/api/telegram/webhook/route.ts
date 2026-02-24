import { NextResponse } from 'next/server'
import { z } from 'zod'
import { handleMessage, type TelegramUpdate } from '@/lib/telegram'

// Allow up to 55 seconds for Anthropic API calls (Telegram timeout is 60s)
export const maxDuration = 55

// In-memory dedup for Telegram retries (update_id → timestamp)
const processedUpdates = new Map<number, number>()
const DEDUP_TTL_MS = 2 * 60 * 1000 // 2 minutes

function isDuplicate(updateId: number): boolean {
  const now = Date.now()
  // Cleanup expired entries
  for (const [id, ts] of processedUpdates) {
    if (now - ts > DEDUP_TTL_MS) processedUpdates.delete(id)
  }
  if (processedUpdates.has(updateId)) return true
  processedUpdates.set(updateId, now)
  return false
}

// Telegram Update schema validation
const TelegramUpdateSchema = z.object({
  update_id: z.number(),
  message: z
    .object({
      message_id: z.number(),
      from: z
        .object({
          id: z.number(),
          is_bot: z.boolean(),
          first_name: z.string(),
          last_name: z.string().optional(),
          username: z.string().optional(),
          language_code: z.string().optional(),
        })
        .optional(),
      chat: z.object({
        id: z.number(),
        type: z.enum(['private', 'group', 'supergroup', 'channel']),
        title: z.string().optional(),
        username: z.string().optional(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
      }),
      date: z.number(),
      text: z.string().optional(),
      entities: z
        .array(
          z.object({
            type: z.string(),
            offset: z.number(),
            length: z.number(),
          })
        )
        .optional(),
    })
    .optional(),
  callback_query: z
    .object({
      id: z.string(),
      from: z.object({
        id: z.number(),
        is_bot: z.boolean(),
        first_name: z.string(),
        last_name: z.string().optional(),
        username: z.string().optional(),
      }),
      message: z.unknown().optional(),
      data: z.string().optional(),
    })
    .optional(),
})

/**
 * Verify webhook secret
 */
function verifyWebhookSecret(request: Request): boolean {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (!secret) {
    // If no secret configured, allow all (for development)
    return true
  }

  const headerSecret = request.headers.get('x-telegram-bot-api-secret-token')
  return headerSecret === secret
}

/**
 * POST /api/telegram/webhook
 *
 * Telegram webhook endpoint
 * Receives updates from Telegram and processes them
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Verify webhook secret
    if (!verifyWebhookSecret(request)) {
      console.warn('Telegram webhook: Invalid secret token')
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate update
    const body = await request.json()
    const parseResult = TelegramUpdateSchema.safeParse(body)

    if (!parseResult.success) {
      console.warn('Telegram webhook: Invalid update format', parseResult.error.issues)
      // Return 200 to prevent Telegram from retrying
      return NextResponse.json({ ok: true })
    }

    const update = parseResult.data as TelegramUpdate

    // Dedup: skip if this update_id was already processed (Telegram retries on timeout)
    if (isDuplicate(update.update_id)) {
      return NextResponse.json({ ok: true })
    }

    // Process message (must await in serverless environment)
    if (update.message) {
      try {
        await handleMessage(update.message)
      } catch (error) {
        console.error('Telegram message handler error:', error)
      }
    }

    // TODO: Handle callback_query for inline buttons

    // Always return 200 to Telegram
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    // Return 200 even on error to prevent Telegram retries
    return NextResponse.json({ ok: true })
  }
}

/**
 * GET /api/telegram/webhook
 *
 * Health check and webhook info
 */
export async function GET(request: Request): Promise<NextResponse> {
  // Check if this is an admin request
  const cronSecret = request.headers.get('x-cron-secret')
  const expectedSecret = process.env.CRON_SECRET

  if (!expectedSecret || cronSecret !== expectedSecret) {
    return NextResponse.json({ ok: true, message: 'Telegram webhook endpoint' })
  }

  // Return configuration info for admin
  const isConfigured = Boolean(process.env.TELEGRAM_BOT_TOKEN)
  const hasWebhookSecret = Boolean(process.env.TELEGRAM_WEBHOOK_SECRET)
  const hasAllowedChats = Boolean(process.env.TELEGRAM_ALLOWED_CHAT_IDS)

  return NextResponse.json({
    ok: true,
    configured: isConfigured,
    hasWebhookSecret,
    hasAllowedChats,
    allowedChatsCount: process.env.TELEGRAM_ALLOWED_CHAT_IDS?.split(',').length || 0,
  })
}
