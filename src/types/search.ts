import { z } from 'zod'

// Message in conversation
export interface ChatMessage {
  readonly role: 'user' | 'assistant'
  readonly content: string
}

// Request schema - supports both single query and conversation
export const SearchRequestSchema = z.object({
  query: z.string().min(1).max(500),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
  stream: z.boolean().optional(),
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
