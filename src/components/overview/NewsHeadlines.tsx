'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Collapsible } from '@/components/ui/Collapsible'
import { useLocale } from '@/hooks/useLocale'
import type { NewsItem } from '@/types/news'
import type { Translations } from '@/i18n/types'

interface NewsApiResponse {
  readonly success: boolean
  readonly data?: readonly NewsItem[]
  readonly error?: string
}

// Category configuration with colors and placeholder images
const CATEGORY_CONFIG: Record<string, {
  label: string
  labelEn: string
  gradient: string
  icon: string
  keywords: readonly string[]
}> = {
  politics: {
    label: '정치',
    labelEn: 'Politics',
    gradient: 'from-indigo-600 to-purple-700',
    icon: '🏛️',
    keywords: ['정치', '외교', '왕족', '핵심인물', '지정학', 'diplomatic', 'political', 'royal', 'government'],
  },
  economy: {
    label: '경제',
    labelEn: 'Economy',
    gradient: 'from-emerald-600 to-teal-700',
    icon: '📈',
    keywords: ['경제', '금융', '투자', '국부펀드', '거시경제', 'economy', 'finance', 'investment', 'fund'],
  },
  society: {
    label: '사회/문화',
    labelEn: 'Society',
    gradient: 'from-rose-600 to-pink-700',
    icon: '🎭',
    keywords: ['사회', '문화', '관광', '부동산', 'society', 'culture', 'tourism', 'real estate'],
  },
  korea: {
    label: 'UAE-한국',
    labelEn: 'UAE-Korea',
    gradient: 'from-blue-600 to-cyan-700',
    icon: '🇰🇷',
    keywords: ['한국', 'Korea', 'Korean', 'K-', 'Hyundai', 'Samsung', 'LG', 'Hanwha', 'KEPCO', 'Seoul'],
  },
}

const CATEGORY_ORDER = ['politics', 'economy', 'society', 'korea'] as const

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

function categorizeNews(item: NewsItem): string {
  const searchText = `${item.title} ${item.tags.join(' ')}`.toLowerCase()

  for (const [category, config] of Object.entries(CATEGORY_CONFIG)) {
    for (const keyword of config.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return category
      }
    }
  }

  return 'economy' // default
}

function selectNewsPerCategory(items: readonly NewsItem[]): Record<string, NewsItem | null> {
  const result: Record<string, NewsItem | null> = {
    politics: null,
    economy: null,
    society: null,
    korea: null,
  }

  const categorized = items.map(item => ({
    item,
    category: categorizeNews(item),
  }))

  // First pass: assign news to each category
  for (const { item, category } of categorized) {
    if (result[category] === null) {
      result[category] = item
    }
  }

  // Second pass: fill empty categories with remaining news
  const usedIds = new Set(Object.values(result).filter(Boolean).map(item => item!.id))
  const remaining = items.filter(item => !usedIds.has(item.id))

  for (const category of CATEGORY_ORDER) {
    if (result[category] === null && remaining.length > 0) {
      result[category] = remaining.shift()!
    }
  }

  return result
}

function NewsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-[120px] h-[80px] bg-bg4 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-bg4 rounded w-full" />
            <div className="h-4 bg-bg4 rounded w-3/4" />
            <div className="h-3 bg-bg4 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface NewsGridItemProps {
  readonly item: NewsItem
  readonly category: string
  readonly p: Translations['pages']['home']
  readonly locale: 'ko' | 'en'
}

function NewsGridItem({ item, category, p, locale }: NewsGridItemProps) {
  const config = CATEGORY_CONFIG[category]
  const hasImage = item.imageUrl && item.imageUrl.startsWith('http')
  const [imgError, setImgError] = useState(false)

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 group"
    >
      {/* Image/Placeholder */}
      <div className="w-[120px] h-[80px] shrink-0 rounded-lg overflow-hidden relative">
        {hasImage && !imgError ? (
          <Image
            src={item.imageUrl!}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="120px"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
            <span className="text-3xl opacity-80">{config.icon}</span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-sm">
          {locale === 'en' ? config.labelEn : config.label}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="text-[13px] text-t1 font-medium leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-150">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] text-t4 truncate max-w-[80px]">
            {item.publisher}
          </span>
          <span className="text-t4">·</span>
          <span className="text-[11px] text-t4">
            {formatRelativeDate(item.publishedAt, p, locale)}
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
        className="text-[12px] text-t3 hover:text-gold transition-colors duration-150 underline focus-visible:ring-2 focus-visible:ring-gold/50 rounded"
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

      setNewsItems(data.data)
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

  const categorizedNews = selectNewsPerCategory(newsItems)
  const displayNews = CATEGORY_ORDER
    .map(cat => ({ category: cat, item: categorizedNews[cat] }))
    .filter(({ item }) => item !== null) as Array<{ category: string; item: NewsItem }>

  const headerContent = (
    <div className="flex items-center gap-3 flex-1">
      <span className="text-xl">📰</span>
      <div>
        <div className="font-bold text-base text-t1">{p.newsTitle}</div>
        <div className="text-[12px] text-t3">{p.newsSubtitle}</div>
      </div>
      {!isLoading && !error && displayNews.length > 0 && (
        <span className="ml-auto mr-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gold/10 text-gold border border-gold/20">
          {displayNews.length}{p.newsCount}
        </span>
      )}
    </div>
  )

  return (
    <Collapsible header={headerContent} defaultOpen>
      {isLoading && <NewsGridSkeleton />}

      {error && <ErrorDisplay message={error} onRetry={fetchNews} retryLabel={p.newsRetry} />}

      {!isLoading && !error && displayNews.length === 0 && (
        <div className="text-center py-6 text-[13px] text-t3">
          {p.newsEmpty}
        </div>
      )}

      {!isLoading && !error && displayNews.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {displayNews.map(({ category, item }) => (
              <NewsGridItem
                key={item.id}
                item={item}
                category={category}
                p={p}
                locale={locale}
              />
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-brd/30 flex justify-center">
            <Link
              href="/news"
              className="text-[13px] text-gold hover:text-gold3 transition-colors focus-visible:ring-2 focus-visible:ring-gold/50 rounded px-2 py-1"
            >
              {p.newsMore} →
            </Link>
          </div>
        </>
      )}
    </Collapsible>
  )
}
