'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Collapsible } from '@/components/ui/Collapsible'
import { useLocale } from '@/hooks/useLocale'
import type { NewsItem } from '@/types/news'
import type { Translations } from '@/i18n/types'

interface NewsApiResponse {
  readonly success: boolean
  readonly data?: readonly NewsItem[]
  readonly error?: string
}

const PUBLISHER_COLORS: Record<string, string> = {
  Reuters: 'bg-accent-orange/15 text-accent-orange border-accent-orange/20',
  Bloomberg: 'bg-accent-purple/15 text-accent-purple border-accent-purple/20',
  'Financial Times': 'bg-accent-orange/15 text-accent-orange border-accent-orange/20',
  'Wall Street Journal': 'bg-accent-orange/15 text-accent-orange border-accent-orange/20',
  'The National': 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  'Khaleej Times': 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  'Arab News': 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  'Gulf News': 'bg-accent-green/15 text-accent-green border-accent-green/20',
  WAM: 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/20',
  'Naver News': 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/20',
}

const CATEGORY_COLORS: Record<string, string> = {
  'AI/테크': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  '에너지': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  '크립토': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  '금융': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  '부동산': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  '관광': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  '국부펀드': 'bg-gold/20 text-gold border-gold/30',
  '투자': 'bg-gold/20 text-gold border-gold/30',
  '왕족': 'bg-gold/20 text-gold border-gold/30',
  '핵심인물': 'bg-gold/20 text-gold border-gold/30',
  '거시경제': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  '지정학': 'bg-red-500/20 text-red-400 border-red-500/30',
  '정책': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  '외교': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
}

const DEFAULT_BADGE_STYLE = 'bg-t4/15 text-t3 border-t4/20'

function getPublisherBadgeStyle(publisher: string): string {
  return PUBLISHER_COLORS[publisher] ?? DEFAULT_BADGE_STYLE
}

function extractCategory(tags: readonly string[]): string | null {
  for (const tag of tags) {
    if (tag.includes(':')) {
      return tag.split(':')[0]
    }
  }
  return null
}

function getCategoryBadgeStyle(category: string): string {
  return CATEGORY_COLORS[category] ?? DEFAULT_BADGE_STYLE
}

function formatRelativeDate(
  dateString: string,
  p: Translations['pages']['home'],
  locale: 'ko' | 'en'
): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return p.timeJustNow
    if (diffHours < 24) return `${diffHours} ${p.timeHoursAgo}`
    if (diffDays < 7) return `${diffDays} ${p.timeDaysAgo}`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${p.timeWeeksAgo}`

    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

function NewsHeadlineSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 animate-pulse">
          <div className="w-16 h-5 bg-bg4 rounded shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-bg4 rounded w-full" />
            <div className="h-3 bg-bg4 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface NewsHeadlineItemProps {
  readonly item: NewsItem
  readonly p: Translations['pages']['home']
  readonly locale: 'ko' | 'en'
}

function NewsHeadlineItem({ item, p, locale }: NewsHeadlineItemProps) {
  const category = extractCategory(item.tags)

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 py-3 px-2 rounded-lg transition-colors duration-150 hover:bg-bg4/50 group border-b border-brd/30 last:border-0"
    >
      {/* Left: Unified badge column */}
      <div className="shrink-0 w-[72px] flex flex-col items-start gap-1">
        <span
          className={`w-full text-center px-2 py-1 rounded text-[11px] font-bold ${item.source === 'naver' ? 'bg-accent-green/15 text-accent-green' : 'bg-accent-blue/15 text-accent-blue'}`}
        >
          {item.publisher.length > 10 ? item.publisher.slice(0, 8) + '..' : item.publisher}
        </span>
        {category && (
          <span
            className={`w-full text-center px-2 py-0.5 rounded text-[10px] font-semibold ${getCategoryBadgeStyle(category)}`}
          >
            {category}
          </span>
        )}
      </div>

      {/* Right: Content */}
      <div className="flex-1 min-w-0">
        <div className="text-[14px] text-t1 font-medium leading-snug group-hover:text-gold transition-colors duration-150 line-clamp-2">
          {item.title}
        </div>

        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[11px] text-t4">
            {formatRelativeDate(item.publishedAt, p, locale)}
          </span>
          <span className="text-t4">·</span>
          <span className={`text-[11px] font-medium ${item.source === 'naver' ? 'text-accent-green' : 'text-accent-blue'}`}>
            {item.source === 'naver' ? 'KR' : 'EN'}
          </span>
        </div>
      </div>
    </a>
  )
}

interface ErrorDisplayProps {
  readonly message: string
  readonly onRetry: () => void
  readonly retryLabel: string
}

function ErrorDisplay({ message, onRetry, retryLabel }: ErrorDisplayProps) {
  return (
    <div className="text-center py-6">
      <div className="text-[13px] text-accent-red mb-2">{message}</div>
      <button
        onClick={onRetry}
        className="text-[12px] text-t3 hover:text-gold transition-colors duration-150 underline"
      >
        {retryLabel}
      </button>
    </div>
  )
}

export function NewsHeadlines() {
  const { t, locale } = useLocale()
  const p = t.pages.home
  const [newsItems, setNewsItems] = useState<readonly NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/news')

      if (!response.ok) {
        throw new Error(`${p.newsLoadError} (${response.status})`)
      }

      const data: NewsApiResponse = await response.json()

      if (!data.success || !data.data) {
        throw new Error(data.error ?? p.newsDataError)
      }

      setNewsItems(data.data.slice(0, 5))
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : p.newsUnknownError
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [p.newsLoadError, p.newsDataError, p.newsUnknownError])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const headerContent = (
    <div className="flex items-center gap-3 flex-1">
      <span className="text-xl">📰</span>
      <div>
        <div className="font-bold text-base text-t1">{p.newsTitle}</div>
        <div className="text-[12px] text-t3">{p.newsSubtitle}</div>
      </div>
      {!isLoading && !error && newsItems.length > 0 && (
        <span className="ml-auto mr-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gold/10 text-gold border border-gold/20">
          {newsItems.length}{p.newsCount}
        </span>
      )}
    </div>
  )

  return (
    <Collapsible header={headerContent} defaultOpen>
      {isLoading && <NewsHeadlineSkeleton />}

      {error && <ErrorDisplay message={error} onRetry={fetchNews} retryLabel={p.newsRetry} />}

      {!isLoading && !error && newsItems.length === 0 && (
        <div className="text-center py-6 text-[13px] text-t3">
          {p.newsEmpty}
        </div>
      )}

      {!isLoading && !error && newsItems.length > 0 && (
        <div className="space-y-0.5">
          {newsItems.map((item) => (
            <NewsHeadlineItem key={item.id} item={item} p={p} locale={locale} />
          ))}

          <div className="pt-3 mt-3 flex justify-end">
            <Link
              href="/news"
              className="flex items-center gap-1 text-[12px] text-t4 transition-colors hover:text-t2"
            >
              {p.newsMore}
              <span>→</span>
            </Link>
          </div>
        </div>
      )}
    </Collapsible>
  )
}
