'use client'

import { ExternalLink } from 'lucide-react'

export interface SourceMetaProps {
  readonly sourceName?: string
  readonly sourceUrl?: string
  readonly asOf?: string // YYYY-MM-DD or YYYY
  readonly lastUpdated?: string
  readonly method?: 'official' | 'estimate' | 'computed' | 'aggregated'
  readonly confidence?: 'high' | 'medium' | 'low'
  readonly compact?: boolean // 더 작은 버전
}

const methodLabels: Record<string, string> = {
  official: '공식',
  estimate: '추정',
  computed: '산출',
  aggregated: '종합',
}

const confidenceColors: Record<string, string> = {
  high: 'text-accent-green',
  medium: 'text-gold',
  low: 'text-accent-red',
}

export function SourceMeta({
  sourceName,
  sourceUrl,
  asOf,
  lastUpdated,
  method,
  confidence,
  compact = false,
}: SourceMetaProps) {
  // 표시할 내용이 없으면 null 반환
  if (!sourceName && !asOf && !lastUpdated) {
    return null
  }

  const formatDate = (date: string) => {
    if (date.length === 4) return date // 연도만
    if (date.length === 7) return date // YYYY-MM
    try {
      const d = new Date(date)
      return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })
    } catch {
      return date
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-[9px] text-t4">
        {sourceName && (
          sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors underline underline-offset-2"
            >
              {sourceName}
            </a>
          ) : (
            <span>{sourceName}</span>
          )
        )}
        {asOf && <span>({formatDate(asOf)})</span>}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-[10px]">
      {/* Source */}
      {sourceName && (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg/60 border border-brd/30">
          <span className="text-t4">출처:</span>
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-t2 hover:text-gold transition-colors flex items-center gap-0.5"
            >
              {sourceName}
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ) : (
            <span className="text-t2">{sourceName}</span>
          )}
        </div>
      )}

      {/* As of date */}
      {asOf && (
        <div className="px-2 py-0.5 rounded-full bg-bg/60 border border-brd/30">
          <span className="text-t4">기준:</span>{' '}
          <span className="text-t2">{formatDate(asOf)}</span>
        </div>
      )}

      {/* Last updated */}
      {lastUpdated && (
        <div className="px-2 py-0.5 rounded-full bg-bg/60 border border-brd/30">
          <span className="text-t4">업데이트:</span>{' '}
          <span className="text-t2">{formatDate(lastUpdated)}</span>
        </div>
      )}

      {/* Method */}
      {method && (
        <div className="px-2 py-0.5 rounded-full bg-bg/60 border border-brd/30">
          <span className="text-t3">{methodLabels[method] || method}</span>
        </div>
      )}

      {/* Confidence */}
      {confidence && (
        <div className={`px-2 py-0.5 rounded-full bg-bg/60 border border-brd/30 ${confidenceColors[confidence]}`}>
          {confidence === 'high' && '신뢰도 높음'}
          {confidence === 'medium' && '신뢰도 중간'}
          {confidence === 'low' && '신뢰도 낮음'}
        </div>
      )}
    </div>
  )
}
