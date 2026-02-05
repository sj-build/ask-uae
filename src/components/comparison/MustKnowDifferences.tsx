'use client'

import { useState } from 'react'
import { mustKnowDifferences as mustKnowDifferencesKo } from '@/data/comparison/differences'
import { mustKnowDifferences as mustKnowDifferencesEn } from '@/data/comparison/differences.en'
import type { DifferenceItem } from '@/data/comparison/differences'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function DifferenceCard({ item }: { readonly item: DifferenceItem }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="w-full text-left bg-bg3/80 border border-brd rounded-xl overflow-hidden transition-all duration-300 ease-out hover:border-brd2 hover:bg-bg3 hover:shadow-[0_4px_30px_rgba(0,0,0,0.3),0_0_1px_rgba(200,164,78,0.1)] group"
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 p-5 pb-4">
        <span className="text-2xl shrink-0">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-display text-base font-bold text-t1 group-hover:text-gold transition-colors duration-300">
            {item.title}
          </h4>
        </div>
        <div
          className={`w-6 h-6 rounded-full border border-brd2 flex items-center justify-center transition-transform duration-300 shrink-0 ${
            isExpanded ? 'rotate-180 bg-gold/10' : ''
          }`}
        >
          <svg
            className="w-3 h-3 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-2 gap-0">
        {/* UAE Side */}
        <div className="border-t border-r border-gold/20 bg-gold/[0.03] p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs">&#x1F1E6;&#x1F1EA;</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold">UAE</span>
          </div>
          <div className="text-sm font-bold text-gold mb-1">{item.uae.label}</div>
          <p className="text-xs text-t2 leading-relaxed">{item.uae.description}</p>
        </div>

        {/* Korea Side */}
        <div className="border-t border-accent-blue/20 bg-accent-blue/[0.03] p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs">&#x1F1F0;&#x1F1F7;</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-blue">Korea</span>
          </div>
          <div className="text-sm font-bold text-accent-blue mb-1">{item.korea.label}</div>
          <p className="text-xs text-t2 leading-relaxed">{item.korea.description}</p>
        </div>
      </div>

      {/* Expandable Detail Section */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="grid grid-cols-2 gap-0">
          {/* UAE Detail */}
          <div className="border-t border-gold/10 bg-gold/[0.02] px-4 pb-4 pt-3">
            <p className="text-[11px] text-t3 leading-relaxed">{item.uae.detail}</p>
          </div>

          {/* Korea Detail */}
          <div className="border-t border-accent-blue/10 bg-accent-blue/[0.02] px-4 pb-4 pt-3">
            <p className="text-[11px] text-t3 leading-relaxed">{item.korea.detail}</p>
          </div>
        </div>

        {/* Business Tip */}
        <div className="border-t border-brd/60 bg-bg4/50 px-4 py-3">
          <div className="flex items-start gap-2">
            <span className="text-xs shrink-0 mt-0.5">&#x1F4A1;</span>
            <p className="text-xs text-gold leading-relaxed font-medium">
              {item.businessTip}
            </p>
          </div>
        </div>
      </div>

      {/* Expand hint */}
      <div
        className={`text-center py-2 text-[10px] text-t4 transition-opacity duration-300 ${
          isExpanded ? 'opacity-0 h-0 py-0' : 'opacity-100'
        }`}
      >
        Click to see details
      </div>
    </button>
  )
}

export function MustKnowDifferences() {
  const mustKnowDifferences = useLocalizedData(mustKnowDifferencesKo, mustKnowDifferencesEn)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {mustKnowDifferences.map((item) => (
        <DifferenceCard key={item.id} item={item} />
      ))}
    </div>
  )
}
