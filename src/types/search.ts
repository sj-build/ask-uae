import { z } from 'zod'

// Message in conversation
export interface ChatMessage {
  readonly role: 'user' | 'assistant'
  readonly content: string
}

// Message schema — tolerant of old localStorage data
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.coerce.string(),
}).passthrough()

// Request schema - supports both single query and conversation
// Pre-filter: drop messages with missing role/content before validation
export const SearchRequestSchema = z.object({
  query: z.string().min(1).max(2000),
  messages: z.preprocess(
    (val) => {
      if (!Array.isArray(val)) return []
      return val.filter((m): m is Record<string, unknown> =>
        m != null &&
        typeof m === 'object' &&
        'role' in m &&
        'content' in m &&
        (m.role === 'user' || m.role === 'assistant') &&
        m.content != null
      )
    },
    z.array(MessageSchema),
  ).optional().default([]),
  stream: z.boolean().optional(),
  continuation: z.boolean().optional(),
})

export type SearchRequest = z.infer<typeof SearchRequestSchema>

export interface SearchResponse {
  readonly success: boolean
  readonly html?: string
  readonly error?: string
  readonly limitReached?: boolean  // Token limit reached
  readonly turnCount?: number      // Current conversation turn
}

// Conversation limits
export const CONVERSATION_LIMITS = {
  MAX_TURNS: 8,           // Max conversation turns
  MAX_CONTEXT_CHARS: 15000, // Max chars in conversation context
  WARNING_TURNS: 6,       // Show warning at this turn
} as const
