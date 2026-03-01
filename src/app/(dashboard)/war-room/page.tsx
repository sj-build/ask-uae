'use client'

import { useState, useEffect, useMemo } from 'react'
import { useLocale } from '@/hooks/useLocale'
import { useHormuzRealtime } from '@/hooks/useHormuzRealtime'
import { getWarNews } from '@/lib/hormuz/queries'
import { NEWS_CATEGORIES } from '@/data/hormuz/scenarios'
import { NewsCard } from '@/components/hormuz/NewsCard'
import type { WarNewsItem, NewsCategory, NewsSeverity } from '@/types/hormuz'

const SEVERITY_OPTIONS: { value: NewsSeverity | 'all'; labelEn: string; labelKo: string }[] = [
  { value: 'all', labelEn: 'All', labelKo: '전체' },
  { value: 'critical', labelEn: 'Critical', labelKo: '긴급' },
  { value: 'high', labelEn: 'High', labelKo: '높음' },
  { value: 'medium', labelEn: 'Medium', labelKo: '중간' },
  { value: 'low', labelEn: 'Low', labelKo: '낮음' },
]

const PAGE_SIZE = 20

export default function WarRoomPage() {
  const { locale, t } = useLocale()
  const realtime = useHormuzRealtime()

  const [news, setNews] = useState<WarNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<NewsCategory | null>(null)
  const [severity, setSeverity] = useState<NewsSeverity | 'all'>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)

  // Fetch initial data
  useEffect(() => {
    async function load() {
      try {
        const data = await getWarNews({ limit: 200 })
        setNews(data)
      } catch (err) {
        console.error('Failed to load war news:', err)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  // Merge realtime news
  const allNews = useMemo(() => {
    const realtimeIds = new Set(realtime.newNews.map(n => n.id))
    const existing = news.filter(n => !realtimeIds.has(n.id))
    return [...realtime.newNews, ...existing]
  }, [news, realtime.newNews])

  // Apply filters
  const filtered = useMemo(() => {
    let result = allNews
    if (category) {
      result = result.filter(n => n.category === category)
    }
    if (severity !== 'all') {
      result = result.filter(n => n.severity === severity)
    }
    if (verifiedOnly) {
      result = result.filter(n => n.is_verified)
    }
    return result
  }, [allNews, category, severity, verifiedOnly])

  const displayed = filtered.slice(0, displayCount)
  const hasMore = displayCount < filtered.length
  const realtimeIds = new Set(realtime.newNews.map(n => n.id))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-t4 text-sm animate-pulse">
          {locale === 'en' ? 'Loading war room...' : '워룸 데이터 로딩 중...'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">📰</span>
        <div>
          <h1 className="text-lg font-bold text-t1 tracking-tight">{t.pages.warRoom.title}</h1>
          <p className="text-sm text-t4">{t.pages.warRoom.subtitle}</p>
        </div>
        {realtime.connected && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      {/* Filter Bar */}
      <div className="space-y-3">
        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
              category === null
                ? 'bg-gold/15 text-gold border border-gold/30'
                : 'text-t4 hover:text-t2 hover:bg-bg3/60 border border-transparent'
            }`}
          >
            {t.pages.warRoom.allCategories}
          </button>
          {Object.entries(NEWS_CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key as NewsCategory)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                category === key
                  ? 'border'
                  : 'text-t4 hover:text-t2 hover:bg-bg3/60 border border-transparent'
              }`}
              style={category === key ? { backgroundColor: `${cat.color}15`, color: cat.color, borderColor: `${cat.color}40` } : {}}
            >
              {locale === 'en' ? cat.labelEn : cat.labelKo}
            </button>
          ))}
        </div>

        {/* Severity + Verified */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1">
            {SEVERITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSeverity(opt.value)}
                className={`px-3 py-1.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  severity === opt.value
                    ? 'bg-gold/15 text-gold'
                    : 'text-t4 hover:text-t2 hover:bg-bg3/60'
                }`}
              >
                {locale === 'en' ? opt.labelEn : opt.labelKo}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={e => setVerifiedOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-brd accent-gold"
            />
            <span className="text-[11px] text-t4 font-medium">{t.pages.warRoom.verifiedOnly}</span>
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="text-[11px] text-t4">
        {filtered.length} {locale === 'en' ? 'articles' : '건'}
        {category && ` · ${locale === 'en' ? NEWS_CATEGORIES[category]?.labelEn : NEWS_CATEGORIES[category]?.labelKo}`}
      </div>

      {/* News Feed */}
      <div className="space-y-3">
        {displayed.length === 0 ? (
          <div className="bg-bg3/80 border border-brd/60 rounded-lg p-8 text-center text-t4 text-sm">
            {locale === 'en' ? 'No news matching filters' : '필터에 맞는 뉴스가 없습니다'}
          </div>
        ) : (
          displayed.map(item => (
            <NewsCard
              key={item.id}
              item={item}
              isNew={realtimeIds.has(item.id)}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setDisplayCount(prev => prev + PAGE_SIZE)}
            className="px-6 py-2.5 rounded-lg bg-bg3/80 border border-brd/60 text-[12px] font-semibold text-t3 hover:text-gold hover:border-gold/40 transition-colors cursor-pointer"
          >
            {locale === 'en' ? 'Load more' : '더 보기'} ({filtered.length - displayCount} {locale === 'en' ? 'remaining' : '건 남음'})
          </button>
        </div>
      )}
    </div>
  )
}
