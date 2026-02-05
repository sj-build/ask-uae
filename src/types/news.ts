export type NewsSource = 'google' | 'naver' | 'manual'
export type NewsPriority = 'reuters' | 'bloomberg' | 'gulf_news' | 'other'

export interface NewsItem {
  readonly id: string
  readonly title: string
  readonly url: string
  readonly source: NewsSource
  readonly publisher: string
  readonly publishedAt: string
  readonly tags: readonly string[]
  readonly summary?: string
  readonly priority: NewsPriority
}

export interface Keyword {
  readonly id: string
  readonly en: string
  readonly ko: string
  readonly category: string
  readonly active: boolean
}

export interface KeywordLayer {
  readonly layer: 1 | 2 | 3 | 4
  readonly label: string
  readonly keywords: readonly Keyword[]
}
