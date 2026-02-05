'use client'

import { useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
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
      className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-xl animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="max-w-[800px] mx-auto mt-[60px] px-5 h-[calc(100vh-120px)] flex flex-col">
        {/* Search Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={t.search.placeholder}
              className="w-full py-3.5 px-5 pl-11 rounded-xl border border-gold/20 bg-bg3/90 text-t1 text-[15px] font-sans outline-none focus:border-gold/40 focus:shadow-[0_0_20px_rgba(200,164,78,0.1)] transition-all duration-250"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40">🔍</span>
          </div>
          <button
            onClick={handleSearch}
            className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold to-gold3 text-bg font-bold text-sm cursor-pointer font-sans whitespace-nowrap hover:shadow-[0_0_24px_rgba(200,164,78,0.25)] transition-all duration-250"
          >
            {t.search.button}
          </button>
          <button
            onClick={onClose}
            className="py-3.5 px-4 rounded-xl border border-brd bg-bg3/80 text-t2 text-sm cursor-pointer hover:bg-bg4 hover:text-t1 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[11px] text-t3 py-1">{t.search.quickSearch}</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleQuickSearch(tag)}
              className="px-3 py-1 rounded-md border border-brd bg-bg3 text-t2 text-[11px] cursor-pointer font-sans transition-colors hover:border-brd2 hover:text-gold hover:bg-gold/8"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-brd bg-bg2 p-6">
          {!isLoading && !result && (
            <div className="text-center py-[60px] px-5">
              <div className="text-5xl mb-4 opacity-30">🕵️</div>
              <div className="text-lg font-semibold text-t2 mb-2">{t.search.title}</div>
              <div className="text-[13px] text-t3 max-w-[500px] mx-auto leading-relaxed">
                {t.search.description}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-3 border-brd border-t-gold rounded-full animate-spin mx-auto" />
              <div className="text-sm text-t2 mt-4">{t.search.loading}</div>
            </div>
          )}

          {result && !result.success && (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">⚠️</div>
              <div className="text-[15px] text-accent-red mb-2">{t.search.error}</div>
              <div className="text-xs text-t3">{result.error}</div>
            </div>
          )}

          {result && result.success && result.html && (
            <div
              className="search-content text-[13px] leading-relaxed text-t1 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-gold [&_h2]:mb-3 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-brd [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:text-gold3 [&_h3]:mt-5 [&_h3]:mb-2 [&_b]:text-gold [&_strong]:text-gold [&_ul]:pl-5 [&_ul]:my-2 [&_li]:my-1 [&_li]:text-t2 [&_li_b]:text-t1 [&_li_strong]:text-t1 [&_code]:bg-bg3 [&_code]:px-1.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:text-accent-cyan [&_table]:w-full [&_table]:border-collapse [&_table]:my-3 [&_table]:text-xs [&_th]:p-2 [&_th]:px-3 [&_th]:text-left [&_th]:bg-bg3 [&_th]:text-t3 [&_th]:font-semibold [&_th]:border-b [&_th]:border-brd [&_td]:p-2 [&_td]:px-3 [&_td]:border-b [&_td]:border-brd/40 [&_blockquote]:border-l-3 [&_blockquote]:border-l-gold [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-3 [&_blockquote]:bg-gold/5 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-t2"
              dangerouslySetInnerHTML={{ __html: result.html }}
            />
          )}
        </div>

        {/* Search History */}
        {history.length > 0 && (
          <div className="mt-3 flex gap-1.5 flex-wrap items-center">
            <span className="text-[10px] text-t4">{t.search.recent}</span>
            {history.map((q) => (
              <button
                key={q}
                onClick={() => handleQuickSearch(q)}
                className="px-2 py-0.5 rounded border border-brd bg-bg3 text-t3 text-[10px] font-sans transition-colors hover:border-brd2 hover:text-gold"
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
