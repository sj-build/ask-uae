'use client'

import { Lightbulb, TrendingUp } from 'lucide-react'
import { SourceMeta, type SourceMetaProps } from './SourceMeta'

interface SectionHeaderProps {
  readonly tldr: readonly string[]
  readonly investorImplications: readonly string[]
  readonly source?: SourceMetaProps
  readonly locale?: 'ko' | 'en'
}

export function SectionHeader({
  tldr,
  investorImplications,
  source,
  locale = 'ko',
}: SectionHeaderProps) {
  return (
    <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-bg3/80 to-bg2/60 border border-brd/50">
      <div className="grid md:grid-cols-2 gap-4">
        {/* TL;DR */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-gold" />
            <span className="text-[11px] font-bold text-gold uppercase tracking-wide">
              TL;DR
            </span>
          </div>
          <ul className="space-y-1.5">
            {tldr.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[12px] text-t2 leading-relaxed">
                <span className="text-gold/60 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Investor Implications */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent-green" />
            <span className="text-[11px] font-bold text-accent-green uppercase tracking-wide">
              {locale === 'en' ? 'Investor Implications' : '투자자 시사점'}
            </span>
          </div>
          <ul className="space-y-1.5">
            {investorImplications.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[12px] text-t2 leading-relaxed">
                <span className="text-accent-green/60 mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Source */}
      {source && (
        <div className="mt-3 pt-3 border-t border-brd/30 flex justify-end">
          <SourceMeta {...source} compact />
        </div>
      )}
    </div>
  )
}
