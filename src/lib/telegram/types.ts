/**
 * Telegram Bot Types
 */

export interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  edited_message?: TelegramMessage
  callback_query?: TelegramCallbackQuery
}

export interface TelegramMessage {
  message_id: number
  from?: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
  entities?: TelegramMessageEntity[]
  reply_to_message?: TelegramMessage
}

export interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TelegramChat {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  title?: string
  username?: string
  first_name?: string
  last_name?: string
}

export interface TelegramMessageEntity {
  type: 'bot_command' | 'mention' | 'hashtag' | 'url' | 'bold' | 'italic' | string
  offset: number
  length: number
}

export interface TelegramCallbackQuery {
  id: string
  from: TelegramUser
  message?: TelegramMessage
  data?: string
}

export interface TelegramSession {
  chat_id: string
  user_name: string | null
  language: 'ko' | 'en' | 'auto'
  message_history: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>
  created_at: string
  updated_at: string
}

export interface SendMessageOptions {
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  disable_web_page_preview?: boolean
  disable_notification?: boolean
  reply_to_message_id?: number
  reply_markup?: TelegramReplyMarkup
}

export type TelegramReplyMarkup =
  | TelegramInlineKeyboardMarkup
  | TelegramReplyKeyboardMarkup
  | TelegramReplyKeyboardRemove

export interface TelegramInlineKeyboardMarkup {
  inline_keyboard: TelegramInlineKeyboardButton[][]
}

export interface TelegramInlineKeyboardButton {
  text: string
  callback_data?: string
  url?: string
}

export interface TelegramReplyKeyboardMarkup {
  keyboard: TelegramKeyboardButton[][]
  resize_keyboard?: boolean
  one_time_keyboard?: boolean
}

export interface TelegramKeyboardButton {
  text: string
}

export interface TelegramReplyKeyboardRemove {
  remove_keyboard: true
}
