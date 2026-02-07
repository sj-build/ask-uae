import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client for browser (limited access)
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server client with full access (for API routes)
export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin environment variables')
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// =============================================================================
// Types
// =============================================================================

export interface Document {
  id: string
  content: string
  title?: string
  summary?: string
  source: 'news' | 'dashboard' | 'askme' | 'research' | 'manual'
  category?: string
  tags: string[]
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface NewsArticle {
  id: string
  title: string
  summary?: string
  content?: string
  url: string
  publisher: string
  source: 'google' | 'naver'
  language: 'en' | 'ko'
  image_url?: string
  category?: string
  tags: string[]
  published_at?: string
  crawled_at: string
  view_count: number
  is_featured: boolean
}

export interface AskMeSession {
  id: string
  question: string
  answer: string
  sources_used: unknown[]
  model: string
  rating?: number
  feedback?: string
  locale: 'ko' | 'en'
  session_id?: string
  created_at: string
}

// =============================================================================
// Helper Functions
// =============================================================================

export async function saveNewsArticles(articles: Omit<NewsArticle, 'id' | 'crawled_at' | 'view_count' | 'is_featured'>[]) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('news_articles')
    .upsert(
      articles.map((article) => ({
        ...article,
        crawled_at: new Date().toISOString(),
      })),
      { onConflict: 'url', ignoreDuplicates: true }
    )
    .select()

  if (error) {
    console.error('Error saving news articles:', error)
    throw error
  }

  return data
}

export async function saveAskMeSession(session: Omit<AskMeSession, 'id' | 'created_at'>) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('askme_sessions')
    .insert(session)
    .select()
    .single()

  if (error) {
    console.error('Error saving AskMe session:', error)
    throw error
  }

  return data
}

export async function getRecentNews(options?: {
  category?: string
  limit?: number
  source?: 'google' | 'naver'
}) {
  const supabase = getSupabaseClient()
  const { category, limit = 20, source } = options ?? {}

  let query = supabase
    .from('news_articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (category) {
    query = query.eq('category', category)
  }
  if (source) {
    query = query.eq('source', source)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching news:', error)
    throw error
  }

  return data as NewsArticle[]
}

export async function searchDocuments(searchTerm: string, options?: {
  source?: string
  category?: string
  limit?: number
}) {
  const supabase = getSupabaseClient()
  const { source, category, limit = 10 } = options ?? {}

  let query = supabase
    .from('documents')
    .select('*')
    .textSearch('content', searchTerm)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (source) {
    query = query.eq('source', source)
  }
  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error searching documents:', error)
    throw error
  }

  return data as Document[]
}
