/**
 * Telegram Bot Client
 */

import type { SendMessageOptions } from './types'

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot'

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured')
  }
  return token
}

function getApiUrl(method: string): string {
  return `${TELEGRAM_API_BASE}${getBotToken()}/${method}`
}

/**
 * Send a message to a Telegram chat
 */
export async function sendMessage(
  chatId: string | number,
  text: string,
  options: SendMessageOptions = {}
): Promise<boolean> {
  try {
    const response = await fetch(getApiUrl('sendMessage'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options.parse_mode || 'HTML',
        disable_web_page_preview: options.disable_web_page_preview ?? true,
        disable_notification: options.disable_notification,
        reply_to_message_id: options.reply_to_message_id,
        reply_markup: options.reply_markup,
      }),
    })

    const result = await response.json()

    if (!result.ok) {
      console.error('Telegram sendMessage failed:', result.description)
      return false
    }

    return true
  } catch (error) {
    console.error('Telegram sendMessage error:', error)
    return false
  }
}

/**
 * Send typing indicator
 */
export async function sendTypingAction(chatId: string | number): Promise<void> {
  try {
    await fetch(getApiUrl('sendChatAction'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        action: 'typing',
      }),
    })
  } catch {
    // Ignore typing action errors
  }
}

/**
 * Set webhook URL
 */
export async function setWebhook(
  url: string,
  options: { secret_token?: string; allowed_updates?: string[] } = {}
): Promise<boolean> {
  try {
    const response = await fetch(getApiUrl('setWebhook'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        secret_token: options.secret_token,
        allowed_updates: options.allowed_updates || ['message', 'callback_query'],
      }),
    })

    const result = await response.json()

    if (!result.ok) {
      console.error('Telegram setWebhook failed:', result.description)
      return false
    }

    return true
  } catch (error) {
    console.error('Telegram setWebhook error:', error)
    return false
  }
}

/**
 * Delete webhook
 */
export async function deleteWebhook(): Promise<boolean> {
  try {
    const response = await fetch(getApiUrl('deleteWebhook'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drop_pending_updates: false }),
    })

    const result = await response.json()
    return result.ok
  } catch {
    return false
  }
}

/**
 * Get webhook info
 */
export async function getWebhookInfo(): Promise<{
  url: string
  has_custom_certificate: boolean
  pending_update_count: number
  last_error_date?: number
  last_error_message?: string
} | null> {
  try {
    const response = await fetch(getApiUrl('getWebhookInfo'))
    const result = await response.json()

    if (!result.ok) {
      return null
    }

    return result.result
  } catch {
    return null
  }
}

/**
 * Answer callback query
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  options: { text?: string; show_alert?: boolean } = {}
): Promise<boolean> {
  try {
    const response = await fetch(getApiUrl('answerCallbackQuery'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: options.text,
        show_alert: options.show_alert,
      }),
    })

    const result = await response.json()
    return result.ok
  } catch {
    return false
  }
}

/**
 * Edit message text
 */
export async function editMessageText(
  chatId: string | number,
  messageId: number,
  text: string,
  options: SendMessageOptions = {}
): Promise<boolean> {
  try {
    const response = await fetch(getApiUrl('editMessageText'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: options.parse_mode || 'HTML',
        disable_web_page_preview: options.disable_web_page_preview ?? true,
        reply_markup: options.reply_markup,
      }),
    })

    const result = await response.json()
    return result.ok
  } catch {
    return false
  }
}

/**
 * Get bot info
 */
export async function getMe(): Promise<{
  id: number
  is_bot: boolean
  first_name: string
  username: string
} | null> {
  try {
    const response = await fetch(getApiUrl('getMe'))
    const result = await response.json()

    if (!result.ok) {
      return null
    }

    return result.result
  } catch {
    return null
  }
}
