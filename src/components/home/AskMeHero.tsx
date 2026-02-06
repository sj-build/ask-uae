'use client'

import { useState, useCallback, useRef } from 'react'
import { Send, X, Sparkles, Loader2 } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'
import { useSearch } from '@/hooks/useSearch'

const QUICK_QUESTIONS_KO = [
  'ADIA vs Mubadala 차이',
  'Sheikh Tahnoun 권력 구조',
  'UAE 크립토 규제',
  'K-Beauty 진출 전략',
  '골든비자 조건',
] as const

const QUICK_QUESTIONS_EN = [
  'ADIA vs Mubadala difference',
  'Sheikh Tahnoun power structure',
  'UAE crypto regulation',
  'K-Beauty market entry',
  'Golden Visa requirements',
] as const

export function AskMeHero() {
  const { locale } = useLocale()
  const { isLoading, result, search } = useSearch()
  const [query, setQuery] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const quickQuestions = locale === 'en' ? QUICK_QUESTIONS_EN : QUICK_QUESTIONS_KO

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      search(query.trim())
      setShowResult(true)
    }
  }, [query, search])

  const handleQuickQuestion = useCallback((q: string) => {
    setQuery(q)
    search(q)
    setShowResult(true)
  }, [search])

  const handleClear = useCallback(() => {
    setQuery('')
    setShowResult(false)
    inputRef.current?.focus()
  }, [])

  return (
    <div className="mb-10 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-8 relative">
        {/* Decorative background glow */}
        <div className="absolute inset-0 -top-20 bg-gradient-to-b from-gold/[0.03] via-gold/[0.02] to-transparent blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2.5 mb-4 px-4 py-2 rounded-full bg-gold/[0.08] border border-gold/15">
            <Sparkles className="w-4 h-4 text-gold floating" />
            <span className="text-[11px] font-bold text-gold uppercase tracking-[0.2em]">AI Assistant</span>
          </div>

          <h1 className="text-[28px] md:text-[34px] font-display font-bold text-t1 mb-3 tracking-tight">
            {locale === 'en' ? (
              <>What would you like to know about <span className="text-gradient-gold">UAE</span>?</>
            ) : (
              <><span className="text-gradient-gold">UAE</span>에 대해 무엇이 궁금하신가요?</>
            )}
          </h1>

          <p className="text-sm text-t3 max-w-lg mx-auto leading-relaxed">
            {locale === 'en'
              ? 'Ask anything — politics, economy, society, industry, investment opportunities'
              : '정치, 경제, 사회, 산업, 투자 기회 등 무엇이든 물어보세요'}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-5">
        <div className={`
          relative rounded-2xl transition-all duration-500
          ${isFocused ? 'shadow-[0_0_50px_rgba(200,164,78,0.12)]' : ''}
        `}>
          {/* Animated border gradient */}
          <div className={`
            absolute -inset-[1px] rounded-2xl transition-opacity duration-500
            bg-gradient-to-r from-gold/30 via-gold/50 to-gold/30
            ${isFocused ? 'opacity-100' : 'opacity-40'}
          `} />

          <div className="relative bg-bg2 rounded-2xl">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={locale === 'en' ? 'e.g., How does UAE sovereign wealth fund work?' : '예: UAE 국부펀드는 어떻게 운영되나요?'}
              className="w-full py-5 px-6 pr-28 bg-transparent text-t1 text-[15px] placeholder:text-t4/70 outline-none"
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {query && (
                <button
                  onClick={handleClear}
                  className="p-2 text-t4 hover:text-t2 hover:bg-bg3/50 rounded-lg transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleSearch}
                disabled={!query.trim() || isLoading}
                className="btn-premium px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold3 text-bg font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">{locale === 'en' ? 'Ask' : '질문'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      {!showResult && (
        <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto stagger-fade">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleQuickQuestion(q)}
              className="px-4 py-2 rounded-xl border border-brd/80 bg-bg3/40 text-t3 text-xs font-medium hover:border-gold/30 hover:text-gold hover:bg-gold/[0.06] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Results Area */}
      {showResult && (
        <div className="max-w-3xl mx-auto mt-8 animate-scale-in">
          {isLoading && (
            <div className="flex flex-col items-center py-16 bg-gradient-to-b from-bg2/80 to-bg2/50 rounded-2xl border border-brd/60">
              <div className="relative w-16 h-16 mb-5">
                <div className="absolute inset-0 border-2 border-gold/10 rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-gold rounded-full animate-spin" />
                <div className="absolute inset-2 border-2 border-transparent border-t-gold3/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-gold/60 floating" />
              </div>
              <div className="text-sm font-semibold text-gold mb-1.5">
                {locale === 'en' ? 'Analyzing...' : '분석 중...'}
              </div>
              <div className="text-xs text-t4">
                {locale === 'en' ? 'AI is analyzing dashboard data' : 'AI가 대시보드 데이터를 분석하고 있습니다'}
              </div>
            </div>
          )}

          {result && !result.success && (
            <div className="text-center py-12 bg-gradient-to-b from-bg2/80 to-bg2/50 rounded-2xl border border-brd/60">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-red/10 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="text-sm font-medium text-accent-red mb-1.5">
                {locale === 'en' ? 'An error occurred' : '오류가 발생했습니다'}
              </div>
              <div className="text-xs text-t4 mb-4 max-w-sm mx-auto">{result.error}</div>
              <button
                onClick={handleClear}
                className="text-xs font-medium text-gold hover:text-gold3 transition-colors"
              >
                {locale === 'en' ? '← Try again' : '← 다시 시도'}
              </button>
            </div>
          )}

          {result && result.success && result.html && (
            <div className="bg-gradient-to-b from-bg2/90 to-bg2/60 rounded-2xl border border-brd/60 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-brd/50 bg-bg3/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-t1">AI Answer</span>
                    <span className="text-[10px] text-t4 ml-2">Powered by Claude</span>
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-t3 hover:text-t1 hover:bg-bg3 transition-all duration-200"
                >
                  {locale === 'en' ? 'New question →' : '새 질문 →'}
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div
                  className="search-content text-[13px] leading-[1.8] text-t2
                    [&_h2]:font-display [&_h2]:text-lg [&_h2]:text-gold [&_h2]:mb-4 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-brd/50
                    [&_h3]:text-[14px] [&_h3]:font-bold [&_h3]:text-gold3 [&_h3]:mt-6 [&_h3]:mb-3
                    [&_b]:text-gold [&_strong]:text-gold
                    [&_ul]:pl-5 [&_ul]:my-3 [&_ul]:space-y-2
                    [&_li]:text-t2 [&_li]:leading-relaxed [&_li_b]:text-t1 [&_li_strong]:text-t1
                    [&_code]:bg-bg3 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-xs [&_code]:text-accent-cyan [&_code]:border [&_code]:border-brd/50
                    [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-xs [&_table]:rounded-lg [&_table]:overflow-hidden
                    [&_th]:p-3 [&_th]:text-left [&_th]:bg-bg3 [&_th]:text-t2 [&_th]:font-semibold [&_th]:border-b [&_th]:border-brd/50
                    [&_td]:p-3 [&_td]:border-b [&_td]:border-brd/30 [&_td]:text-t2
                    [&_tr:hover_td]:bg-bg3/30"
                  dangerouslySetInnerHTML={{ __html: result.html }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
