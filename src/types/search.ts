import { z } from 'zod'

export const SearchRequestSchema = z.object({
  query: z.string().min(1).max(500),
})

export type SearchRequest = z.infer<typeof SearchRequestSchema>

export interface SearchResponse {
  readonly success: boolean
  readonly html?: string
  readonly error?: string
}
