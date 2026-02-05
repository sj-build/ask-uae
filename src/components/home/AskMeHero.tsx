'use client'

import { useState, useCallback, useRef } from 'react'
import { Send, X, Sparkles } from 'lucide-react'
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
    <div className="mb-8">
      {/* Hero Question */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-gold" />
          <span className="text-xs font-semibold text-gold uppercase tracking-wider">AI Assistant</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-t1 mb-2">
          {locale === 'en' ? 'What would you like to know about UAE?' : 'UAE에 대해 무엇이 궁금하신가요?'}
        </h1>
        <p className="text-sm text-t3">
          {locale === 'en'
            ? 'Ask anything — politics, economy, society, industry, investment opportunities'
            : '정치, 경제, 사회, 산업, 투자 기회 등 무엇이든 물어보세요'}
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
            placeholder={locale === 'en' ? 'e.g., How does UAE sovereign wealth fund work?' : '예: UAE 국부펀드는 어떻게 운영되나요?'}
            className="w-full py-4 px-5 pr-24 rounded-xl border border-gold/30 bg-bg2/80 text-t1 text-[15px] placeholder:text-t4 outline-none focus:border-gold/60 focus:shadow-[0_0_30px_rgba(200,164,78,0.15)] transition-all duration-300"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                onClick={handleClear}
                className="p-2 text-t4 hover:text-t2 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleSearch}
              disabled={!query.trim() || isLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-gold3 text-bg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(200,164,78,0.3)] transition-all duration-300"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      {!showResult && (
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleQuickQuestion(q)}
              className="px-3 py-1.5 rounded-lg border border-brd bg-bg3/50 text-t3 text-xs hover:border-gold/40 hover:text-gold hover:bg-gold/5 transition-all duration-200"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Results Area */}
      {showResult && (
        <div className="max-w-3xl mx-auto mt-6">
          {isLoading && (
            <div className="flex flex-col items-center py-12 bg-bg2/50 rounded-xl border border-brd">
              <div className="relative w-12 h-12 mb-4">
                <div className="absolute inset-0 border-3 border-gold/20 rounded-full" />
                <div className="absolute inset-0 border-3 border-transparent border-t-gold rounded-full animate-spin" />
              </div>
              <div className="text-sm font-medium text-gold mb-1">
                {locale === 'en' ? 'Analyzing...' : '분석 중...'}
              </div>
              <div className="text-xs text-t4">
                {locale === 'en' ? 'AI is analyzing dashboard data' : 'AI가 대시보드 데이터를 분석하고 있습니다'}
              </div>
            </div>
          )}

          {result && !result.success && (
            <div className="text-center py-8 bg-bg2/50 rounded-xl border border-brd">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-sm text-accent-red mb-1">
                {locale === 'en' ? 'An error occurred' : '오류가 발생했습니다'}
              </div>
              <div className="text-xs text-t4">{result.error}</div>
              <button
                onClick={handleClear}
                className="mt-4 text-xs text-gold hover:underline"
              >
                {locale === 'en' ? 'Try again' : '다시 시도'}
              </button>
            </div>
          )}

          {result && result.success && result.html && (
            <div className="bg-bg2/50 rounded-xl border border-brd p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-brd">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-xs font-semibold text-gold">AI Answer</span>
                </div>
                <button
                  onClick={handleClear}
                  className="text-xs text-t4 hover:text-t2 transition-colors"
                >
                  {locale === 'en' ? 'New question' : '새 질문'}
                </button>
              </div>
              <div
                className="search-content text-[13px] leading-relaxed text-t1 [&_h2]:font-display [&_h2]:text-lg [&_h2]:text-gold [&_h2]:mb-3 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-brd [&_h3]:text-[14px] [&_h3]:font-bold [&_h3]:text-gold3 [&_h3]:mt-4 [&_h3]:mb-2 [&_b]:text-gold [&_strong]:text-gold [&_ul]:pl-5 [&_ul]:my-2 [&_li]:my-1 [&_li]:text-t2 [&_li_b]:text-t1 [&_li_strong]:text-t1 [&_code]:bg-bg3 [&_code]:px-1.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:text-accent-cyan [&_table]:w-full [&_table]:border-collapse [&_table]:my-3 [&_table]:text-xs [&_th]:p-2 [&_th]:px-3 [&_th]:text-left [&_th]:bg-bg3 [&_th]:text-t3 [&_th]:font-semibold [&_th]:border-b [&_th]:border-brd [&_td]:p-2 [&_td]:px-3 [&_td]:border-b [&_td]:border-brd/40"
                dangerouslySetInnerHTML={{ __html: result.html }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
