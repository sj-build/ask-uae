/**
 * Knowledge Layer Types
 * For structured insight accumulation and RAG retrieval
 */

export type SourceType = 'insight' | 'document' | 'news' | 'askme'

export interface SourceRef {
  type: SourceType
  id: string
  title: string
  url?: string | null
  as_of?: string | null
  published_at?: string | null
  source_name?: string | null   // publisher or org
  snippet?: string | null       // short excerpt used in prompt
  confidence?: number | null
  tags?: string[] | null
  relevance?: 'high' | 'medium' | 'low' | null
}

export interface InsightUnit {
  id: string
  topic: string
  sector?: string | null
  claim: string
  rationale: string
  evidence_ids: string[]        // document/news/askme IDs
  tags?: string[]
  confidence: number
  as_of?: string | null
  created_at?: string
  updated_at?: string
}

export interface InsightUnitInput {
  topic: string
  sector?: string | null
  claim: string
  rationale: string
  evidence_ids: string[]
  tags?: string[]
  confidence: number
  as_of?: string | null
}

// Taxonomy for insights (used in LLM prompt)
export const INSIGHT_TAXONOMY = [
  'AI',
  'DataCenter',
  'SWF',
  'Energy',
  'Defense',
  'Finance',
  'Crypto',
  'Regulation',
  'FreeZone',
  'RealEstate',
  'Tourism',
  'UAE-Korea',
  'Geopolitics',
  'Healthcare',
  'Logistics',
] as const

export type InsightSector = (typeof INSIGHT_TAXONOMY)[number]
