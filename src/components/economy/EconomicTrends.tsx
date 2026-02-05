'use client'

import { useState } from 'react'
import type { EconomicTrendCategory } from '@/data/economy/trends'

interface EconomicTrendsProps {
  readonly trends: readonly EconomicTrendCategory[]
}

export function EconomicTrends({ trends }: EconomicTrendsProps) {
  const [activeCategory, setActiveCategory] = useState<string>(trends[0]?.id ?? '')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleItem = (itemTitle: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(itemTitle)) {
        next.delete(itemTitle)
      } else {
        next.add(itemTitle)
      }
      return next
    })
  }

  const activeData = trends.find((c) => c.id === activeCategory)

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {trends.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id)
              setExpandedItems(new Set())
            }}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold
              transition-all duration-200
              ${activeCategory === category.id
                ? 'bg-gold/15 text-gold border border-gold/30'
                : 'bg-bg2 text-t3 border border-brd hover:text-t1 hover:border-brd2'
              }
            `}
          >
            <span>{category.icon}</span>
            <span>{category.title}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeData && (
        <div className="bg-bg3 border border-brd rounded-xl p-5 space-y-4">
          <h3 className="font-display text-lg text-gold flex items-center gap-2">
            <span>{activeData.icon}</span>
            <span>{activeData.title}</span>
          </h3>

          <div className="space-y-3">
            {activeData.items.map((item) => {
              const isExpanded = expandedItems.has(item.title)
              return (
                <div
                  key={item.title}
                  className="bg-bg2 border border-brd rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(item.title)}
                    className="w-full px-4 py-3 flex items-start justify-between text-left hover:bg-bg3 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-t1">{item.title}</div>
                      <div className="text-xs text-t3 mt-0.5">{item.description}</div>
                    </div>
                    <span className="text-t4 text-lg ml-2">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-brd">
                      <ul className="space-y-1.5 mb-3">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="text-xs text-t2 flex items-start gap-2">
                            <span className="text-gold mt-0.5">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-gold/10 border border-gold/20 rounded-lg px-3 py-2">
                        <div className="text-xs text-gold font-semibold mb-1">Significance</div>
                        <div className="text-xs text-t2">{item.significance}</div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
