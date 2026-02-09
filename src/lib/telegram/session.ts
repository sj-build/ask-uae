/**
 * Telegram Session Management
 */

import { createClient } from '@supabase/supabase-js'
import type { TelegramSession } from './types'

const MAX_HISTORY_LENGTH = 10
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Supabase configuration missing')
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}

/**
 * Get or create session for a chat
 */
export async function getOrCreateSession(
  chatId: string,
  userName?: string
): Promise<TelegramSession> {
  const supabase = getSupabaseAdmin()

  // Try to get existing session
  const { data: existing } = await supabase
    .from('telegram_sessions')
    .select('*')
    .eq('chat_id', chatId)
    .single()

  if (existing) {
    // Update username if changed
    if (userName && existing.user_name !== userName) {
      await supabase
        .from('telegram_sessions')
        .update({ user_name: userName, updated_at: new Date().toISOString() })
        .eq('chat_id', chatId)
    }
    return existing as TelegramSession
  }

  // Create new session
  const newSession: Omit<TelegramSession, 'created_at' | 'updated_at'> = {
    chat_id: chatId,
    user_name: userName || null,
    language: 'auto',
    message_history: [],
  }

  const { data, error } = await supabase
    .from('telegram_sessions')
    .insert(newSession)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`)
  }

  return data as TelegramSession
}

/**
 * Update session with new message
 */
export async function updateSessionHistory(
  chatId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  const supabase = getSupabaseAdmin()

  // Get current session
  const { data: session } = await supabase
    .from('telegram_sessions')
    .select('message_history')
    .eq('chat_id', chatId)
    .single()

  if (!session) return

  const history = (session.message_history as TelegramSession['message_history']) || []

  // Add new message
  history.push({
    role,
    content: content.slice(0, 2000), // Truncate long messages
    timestamp: new Date().toISOString(),
  })

  // Keep only recent messages
  const trimmedHistory = history.slice(-MAX_HISTORY_LENGTH)

  await supabase
    .from('telegram_sessions')
    .update({
      message_history: trimmedHistory,
      updated_at: new Date().toISOString(),
    })
    .eq('chat_id', chatId)
}

/**
 * Clear session history
 */
export async function clearSessionHistory(chatId: string): Promise<void> {
  const supabase = getSupabaseAdmin()

  await supabase
    .from('telegram_sessions')
    .update({
      message_history: [],
      updated_at: new Date().toISOString(),
    })
    .eq('chat_id', chatId)
}

/**
 * Set session language
 */
export async function setSessionLanguage(
  chatId: string,
  language: 'ko' | 'en' | 'auto'
): Promise<void> {
  const supabase = getSupabaseAdmin()

  await supabase
    .from('telegram_sessions')
    .update({
      language,
      updated_at: new Date().toISOString(),
    })
    .eq('chat_id', chatId)
}

/**
 * Check rate limit for a chat
 */
export async function checkRateLimit(chatId: string): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = getSupabaseAdmin()
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()

  // Get current window count
  const { data: existing } = await supabase
    .from('telegram_rate_limits')
    .select('request_count')
    .eq('chat_id', chatId)
    .gte('window_start', windowStart)
    .single()

  const currentCount = existing?.request_count || 0

  if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  // Increment or create rate limit entry
  const now = new Date()
  const windowKey = new Date(Math.floor(now.getTime() / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS).toISOString()

  await supabase.from('telegram_rate_limits').upsert(
    {
      chat_id: chatId,
      window_start: windowKey,
      request_count: currentCount + 1,
    },
    {
      onConflict: 'chat_id,window_start',
    }
  )

  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - currentCount - 1 }
}

/**
 * Check if chat is allowed
 */
export function isChatAllowed(chatId: string | number): boolean {
  const allowedIds = process.env.TELEGRAM_ALLOWED_CHAT_IDS

  // If not configured, allow all
  if (!allowedIds) {
    return true
  }

  const allowedList = allowedIds.split(',').map((id) => id.trim())
  return allowedList.includes(String(chatId))
}

/**
 * Clean up old rate limit entries
 */
export async function cleanupOldRateLimits(): Promise<number> {
  const supabase = getSupabaseAdmin()
  const threshold = new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago

  const { error, count } = await supabase
    .from('telegram_rate_limits')
    .delete({ count: 'exact' })
    .lt('window_start', threshold)

  if (error) {
    console.error('Failed to cleanup rate limits:', error)
    return 0
  }

  return count || 0
}
