'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Collapsible } from '@/components/ui/Collapsible'
import { useLocale } from '@/hooks/useLocale'
import type { NewsItem } from '@/types/news'
import type { Translations } from '@/i18n/types'
import { SourceMeta } from '@/components/ui/SourceMeta'

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

const IMPACT_CONFIG = {
  high: { label: 'HIGH', labelKo: '높음', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  medium: { label: 'MED', labelKo: '중간', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  low: { label: 'LOW', labelKo: '낮음', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
}

const SECTION_ROUTES: Record<string, string> = {
  politics: '/politics',
  economy: '/economy',
  society: '/society',
  korea: '/comparison',
  industry: '/industry',
  legal: '/legal',
}

function NewsGridItem({ item, category, p, locale }: NewsGridItemProps) {
  const config = CATEGORY_CONFIG[category]
  const impact = item.impact || 'medium'
  const impactConfig = IMPACT_CONFIG[impact]
  const relatedSection = item.relatedSection || SECTION_ROUTES[category] || '/news'
  const summary = locale === 'ko' ? (item.summaryKo || item.summary) : item.summary
  // Check for valid image URL (only exclude known broken patterns)
  const isPlaceholder = item.imageUrl?.includes('google.com/images/branding')
  const hasImage = item.imageUrl && item.imageUrl.startsWith('http') && !isPlaceholder

  return (
    <div className="flex gap-3 group bg-bg3/40 rounded-lg p-3 border border-brd/30 hover:border-gold/30 transition-colors">
      {/* Article Image or Category Icon */}
      <div className={`${hasImage ? 'w-[100px] h-[70px]' : 'w-[56px] h-[56px]'} shrink-0 rounded-lg overflow-hidden`}>
        {hasImage ? (
          <img
            src={item.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback to icon on image load error
              const target = e.currentTarget
              target.style.display = 'none'
              target.parentElement!.innerHTML = `<div class="w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center"><span class="text-2xl">${config.icon}</span></div>`
            }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
            <span className="text-2xl">{config.icon}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header: Category + Impact */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold bg-gradient-to-r ${config.gradient} text-white`}>
            {locale === 'en' ? config.labelEn : config.label}
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${impactConfig.color}`}>
            {locale === 'en' ? impactConfig.label : impactConfig.labelKo}
          </span>
        </div>

        {/* Title */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h3 className="text-[12px] text-t1 font-medium leading-snug line-clamp-2 group-hover:text-gold transition-colors">
            {item.title}
          </h3>
        </a>

        {/* Summary (if available) */}
        {summary && (
          <p className="text-[10px] text-t3 mt-1 line-clamp-1">{summary}</p>
        )}

        {/* Footer: Publisher + Date + Related Section */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-t4/60 truncate max-w-[80px]">
              {item.publisher}
            </span>
            <span className="text-t4/40">·</span>
            <span className="text-[9px] text-t4/60">
              {formatRelativeDate(item.publishedAt, p, locale)}
            </span>
          </div>
          <Link
            href={relatedSection}
            className="text-[9px] text-t4 hover:text-gold transition-colors"
          >
            {locale === 'en' ? 'Related' : '관련'} →
          </Link>
        </div>
      </div>
    </div>
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
      <div className="ml-auto flex items-center gap-3">
        <SourceMeta
          sourceName="Google/Naver RSS"
          asOf={new Date().toISOString().slice(0, 10)}
          compact
        />
        {!isLoading && !error && displayNews.length > 0 && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gold/10 text-gold border border-gold/20">
            {displayNews.length}{p.newsCount}
          </span>
        )}
      </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
