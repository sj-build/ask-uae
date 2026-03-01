'use client'

import { useState } from 'react'
import type { WarNewsItem, NewsSeverity } from '@/types/hormuz'
import { NEWS_CATEGORIES } from '@/data/hormuz/scenarios'
import { useLocale } from '@/hooks/useLocale'

const SEVERITY_STYLES: Record<NewsSeverity, { dot: string; border: string; label: string }> = {
  critical: { dot: 'bg-red-500', border: 'border-l-red-500', label: 'CRITICAL' },
  high: { dot: 'bg-orange-500', border: 'border-l-orange-500', label: 'HIGH' },
  medium: { dot: 'bg-yellow-500', border: 'border-l-yellow-500', label: 'MEDIUM' },
  low: { dot: 'bg-emerald-500', border: 'border-l-emerald-500', label: 'LOW' },
}

interface NewsCardProps {
  readonly item: WarNewsItem
  readonly isNew?: boolean
}

export function NewsCard({ item, isNew }: NewsCardProps) {
  const { locale } = useLocale()
  const [expanded, setExpanded] = useState(false)
  const severity = item.severity ?? 'low'
  const styles = SEVERITY_STYLES[severity]
  const category = item.category ? NEWS_CATEGORIES[item.category] : null

  const timeAgo = item.published_at
    ? formatTimeAgo(new Date(item.published_at), locale)
    : ''

  function handleAskAbout() {
    const detail = `[War Room] ${item.title}: ${item.summary ?? ''}`
    window.dispatchEvent(new CustomEvent('askme-prefill', { detail }))
  }

  return (
    <div
      className={`
        bg-bg3/80 border border-brd/60 rounded-lg overflow-hidden border-l-[3px]
        ${styles.border} transition-all duration-300
        ${isNew ? 'animate-pulse ring-1 ring-gold/30' : ''}
      `}
    >
      <div className="p-4">
        {/* Header: severity + title */}
        <div className="flex items-start gap-3 mb-2">
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
            <span className="text-[10px] font-bold tracking-wide uppercase text-t4">
              {styles.label}
            </span>
          </div>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-semibold text-t1 leading-snug cursor-pointer hover:text-gold transition-colors flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              {item.title} <span className="text-[10px] text-t4">↗</span>
            </a>
          ) : (
            <h3
              className="text-[13px] font-semibold text-t1 leading-snug cursor-pointer hover:text-gold transition-colors flex-1"
              onClick={() => setExpanded(!expanded)}
            >
              {item.title}
            </h3>
          )}
        </div>

        {/* Summary */}
        <p className={`text-[12px] text-t3 leading-relaxed mb-3 ${expanded ? '' : 'line-clamp-2'}`}>
          {item.summary}
        </p>

        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[10px] text-t4">{item.source_name}</span>
          {category && (
            <span
              className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {locale === 'en' ? category.labelEn : category.labelKo}
            </span>
          )}
          {item.is_verified && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/15 text-emerald-400">
              ✓ {locale === 'en' ? 'Verified' : '검증됨'}
            </span>
          )}
          <span className="text-[10px] text-t4 ml-auto">{timeAgo}</span>
        </div>

        {/* Ask button */}
        <button
          type="button"
          onClick={handleAskAbout}
          className="mt-3 text-[11px] text-t4 hover:text-gold transition-colors cursor-pointer"
        >
          💬 {locale === 'en' ? 'Ask about this' : '이것에 대해 질문하기'}
        </button>
      </div>
    </div>
  )
}

function formatTimeAgo(date: Date, locale: string): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const mins = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (mins < 5) return locale === 'en' ? 'Just now' : '방금 전'
  if (mins < 60) return locale === 'en' ? `${mins}m ago` : `${mins}분 전`
  if (hours < 24) return locale === 'en' ? `${hours}h ago` : `${hours}시간 전`
  return locale === 'en' ? `${days}d ago` : `${days}일 전`
}
