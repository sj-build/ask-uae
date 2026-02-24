/**
 * Conversation Logger
 *
 * Permanently saves all Telegram messages to telegram_messages table.
 * Separate from session history (which is rolling window for Claude context).
 */

import { getSupabaseAdmin } from '@/lib/supabase'

export async function logConversation(
  chatId: string,
  messageId: number | undefined,
  userText: string,
  assistantText: string,
  hasUrl: boolean
): Promise<void> {
  const db = getSupabaseAdmin()

  const { error } = await db.from('telegram_messages').insert([
    {
      chat_id: chatId,
      message_id: messageId,
      role: 'user',
      content: userText,
      has_url: hasUrl,
    },
    {
      chat_id: chatId,
      role: 'assistant',
      content: assistantText,
      has_url: false,
    },
  ])

  if (error) {
    console.error('[conversation-logger] Failed to log:', error)
  }
}
