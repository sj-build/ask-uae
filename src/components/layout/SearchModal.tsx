'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { X, Search, Sparkles, Loader2 } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'
import { useSearch } from '@/hooks/useSearch'

const quickTags = [
  'UAE 경제 구조',
  'Abu Dhabi vs Dubai',
  'Sheikh Tahnoun',
  'Mubadala',
  'ADIA',
  'G42',
  'MGX',
  'UAE 크립토 규제',
  'K-Beauty UAE 기회',
  '에너지 전환',
  '에미라티화',
  '골든비자',
  'Wasta 문화',
  '라마단 비즈니스',
  'SWF 투자 현황',
] as const

interface SearchModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useLocale()
  const { isLoading, result, history, search } = useSearch()
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSearch = useCallback(() => {
    const query = inputRef.current?.value.trim()
    if (query) search(query)
  }, [search])

  const handleQuickSearch = useCallback((query: string) => {
    if (inputRef.current) inputRef.current.value = query
    search(query)
  }, [search])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-2xl animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-[850px] mx-auto mt-[50px] px-5 h-[calc(100vh-100px)] flex flex-col">
        {/* Search Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`
            flex-1 relative rounded-2xl transition-all duration-500
            ${isFocused ? 'shadow-[0_0_40px_rgba(200,164,78,0.12)]' : ''}
          `}>
            {/* Animated border */}
            <div className={`
              absolute -inset-[1px] rounded-2xl transition-opacity duration-400
              bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20
              ${isFocused ? 'opacity-100' : 'opacity-30'}
            `} />

            <div className="relative flex items-center bg-bg2 rounded-2xl">
              <Search className="absolute left-5 w-5 h-5 text-t4" />
              <input
                ref={inputRef}
                type="text"
                placeholder={t.search.placeholder}
                className="w-full py-4 px-5 pl-14 bg-transparent text-t1 text-[15px] font-sans outline-none rounded-2xl"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="btn-premium py-4 px-7 rounded-2xl bg-gradient-to-r from-gold to-gold3 text-bg font-bold text-sm whitespace-nowrap"
          >
            {t.search.button}
          </button>

          <button
            onClick={onClose}
            className="py-4 px-4 rounded-2xl border border-brd/80 bg-bg3/60 text-t3 hover:bg-bg3 hover:text-t1 hover:border-brd transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-[11px] text-t4 py-1.5 font-medium">{t.search.quickSearch}</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleQuickSearch(tag)}
              className="px-3.5 py-1.5 rounded-lg border border-brd/80 bg-bg3/50 text-t3 text-[11px] font-medium transition-all duration-200 hover:border-gold/30 hover:text-gold hover:bg-gold/[0.06] hover:-translate-y-0.5"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-brd/60 bg-gradient-to-b from-bg2/95 to-bg2/80 animate-scale-in">
          {!isLoading && !result && (
            <div className="text-center py-20 px-5">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gold/[0.08] flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-gold/60 floating" />
              </div>
              <div className="text-xl font-display font-bold text-t1 mb-3">{t.search.title}</div>
              <div className="text-[13px] text-t3 max-w-[500px] mx-auto leading-relaxed">
                {t.search.description}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              {/* Animated loading spinner */}
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-2 border-gold/10 rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-gold rounded-full animate-spin" />
                <div className="absolute inset-3 border-2 border-transparent border-t-gold3/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-gold/60 floating" />
              </div>
              <div className="text-lg font-semibold text-gold mb-2">{t.search.loading}</div>
              <div className="text-sm text-t3">AI가 대시보드 데이터를 분석하고 있습니다...</div>
              <div className="text-xs text-t4 mt-3 px-4 py-1.5 rounded-full bg-bg3/50">응답까지 5~15초 소요될 수 있습니다</div>
            </div>
          )}

          {result && !result.success && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-accent-red/10 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <div className="text-[15px] font-medium text-accent-red mb-2">{t.search.error}</div>
              <div className="text-xs text-t4 max-w-md mx-auto">{result.error}</div>
            </div>
          )}

          {result && result.success && result.html && (
            <div className="p-8">
              {/* Result header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brd/50">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-t1">AI Answer</div>
                  <div className="text-[10px] text-t4">Powered by Claude</div>
                </div>
              </div>

              <div
                className="search-content text-[13px] leading-[1.8] text-t2
                  [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-gold [&_h2]:mb-4 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-brd/50
                  [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:text-gold3 [&_h3]:mt-6 [&_h3]:mb-3
                  [&_b]:text-gold [&_strong]:text-gold
                  [&_ul]:pl-5 [&_ul]:my-3 [&_ul]:space-y-2
                  [&_li]:text-t2 [&_li]:leading-relaxed [&_li_b]:text-t1 [&_li_strong]:text-t1
                  [&_code]:bg-bg3 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-xs [&_code]:text-accent-cyan [&_code]:border [&_code]:border-brd/50
                  [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-xs [&_table]:rounded-xl [&_table]:overflow-hidden
                  [&_th]:p-3 [&_th]:text-left [&_th]:bg-bg3 [&_th]:text-t2 [&_th]:font-semibold [&_th]:border-b [&_th]:border-brd/50
                  [&_td]:p-3 [&_td]:border-b [&_td]:border-brd/30 [&_td]:text-t2
                  [&_tr:hover_td]:bg-bg3/30
                  [&_blockquote]:border-l-3 [&_blockquote]:border-l-gold [&_blockquote]:pl-4 [&_blockquote]:py-3 [&_blockquote]:my-4 [&_blockquote]:bg-gold/[0.03] [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-t2"
                dangerouslySetInnerHTML={{ __html: result.html }}
              />
            </div>
          )}
        </div>

        {/* Search History */}
        {history.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap items-center">
            <span className="text-[10px] text-t4 font-medium">{t.search.recent}</span>
            {history.map((q) => (
              <button
                key={q}
                onClick={() => handleQuickSearch(q)}
                className="px-2.5 py-1 rounded-lg border border-brd/60 bg-bg3/40 text-t4 text-[10px] font-medium transition-all duration-200 hover:border-gold/20 hover:text-gold hover:bg-gold/5"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
