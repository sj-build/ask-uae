'use client'

import { useState, useCallback } from 'react'
import type { KeywordLayer, Keyword } from '@/types/news'

const INITIAL_KEYWORD_LAYERS: readonly KeywordLayer[] = [
  {
    layer: 1,
    label: 'Core Entities (Royal Family & Key Figures)',
    keywords: [
      { id: 'k1-1', en: 'Sheikh Mohammed bin Zayed', ko: '무함마드 빈 자이드', category: 'person', active: true },
      { id: 'k1-2', en: 'Sheikh Tahnoun bin Zayed', ko: '타흐눈 빈 자이드', category: 'person', active: true },
      { id: 'k1-3', en: 'Mansour bin Zayed', ko: '만수르 빈 자이드', category: 'person', active: true },
      { id: 'k1-4', en: 'Khaldoon Al Mubarak', ko: '칼둔 알 무바라크', category: 'person', active: true },
    ],
  },
  {
    layer: 2,
    label: 'Sovereign Wealth & Investment Vehicles',
    keywords: [
      { id: 'k2-1', en: 'ADIA', ko: '아부다비투자청', category: 'organization', active: true },
      { id: 'k2-2', en: 'Mubadala', ko: '무바달라', category: 'organization', active: true },
      { id: 'k2-3', en: 'ADQ', ko: 'ADQ', category: 'organization', active: true },
      { id: 'k2-4', en: 'IHC', ko: 'IHC', category: 'organization', active: true },
      { id: 'k2-5', en: 'Dubai Holding', ko: '두바이홀딩', category: 'organization', active: true },
    ],
  },
  {
    layer: 3,
    label: 'Sector Keywords',
    keywords: [
      { id: 'k3-1', en: 'UAE energy policy', ko: 'UAE 에너지 정책', category: 'sector', active: true },
      { id: 'k3-2', en: 'Abu Dhabi AI', ko: '아부다비 AI', category: 'sector', active: true },
      { id: 'k3-3', en: 'UAE defense industry', ko: 'UAE 방위산업', category: 'sector', active: true },
      { id: 'k3-4', en: 'NEOM partnership', ko: 'NEOM 파트너십', category: 'sector', active: false },
    ],
  },
  {
    layer: 4,
    label: 'Korea-UAE Relations',
    keywords: [
      { id: 'k4-1', en: 'Korea UAE investment', ko: '한국 UAE 투자', category: 'relation', active: true },
      { id: 'k4-2', en: 'Korean companies Abu Dhabi', ko: '한국 기업 아부다비', category: 'relation', active: true },
      { id: 'k4-3', en: 'Barakah nuclear', ko: '바라카 원전', category: 'relation', active: true },
    ],
  },
] as const

interface CollapsibleLayerProps {
  readonly layer: KeywordLayer
  readonly isExpanded: boolean
  readonly onToggle: () => void
}

function handleAddKeyword(layerNum: number) {
  alert(`Add keyword to Layer ${layerNum} — Form will be implemented in Phase 3`)
}

function handleEditKeyword(keyword: Keyword) {
  alert(`Edit keyword: ${keyword.en} — Editor will be implemented in Phase 3`)
}

function handleDeleteKeyword(keyword: Keyword) {
  alert(`Delete keyword: ${keyword.en} — Confirmation dialog will be implemented in Phase 3`)
}

function CollapsibleLayer({ layer, isExpanded, onToggle }: CollapsibleLayerProps) {
  return (
    <div className="bg-bg2 border border-brd rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg3/50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gold bg-gold/10 px-2 py-0.5 rounded">
            L{layer.layer}
          </span>
          <span className="text-sm font-semibold text-t1">{layer.label}</span>
          <span className="text-xs text-t3">({layer.keywords.length})</span>
        </div>
        <span className={`text-t3 text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-brd">
          <div className="px-5 py-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-t3 font-medium uppercase tracking-wider">
                Keywords
              </span>
              <button
                onClick={() => handleAddKeyword(layer.layer)}
                className="px-3 py-1 text-[11px] font-medium text-gold hover:text-gold3 bg-gold/8 hover:bg-gold/15 border border-gold/20 rounded-md transition-all duration-200"
              >
                + Add Keyword
              </button>
            </div>

            <div className="space-y-1.5">
              {layer.keywords.map((keyword) => (
                <div
                  key={keyword.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg3/50 transition-colors duration-150 group"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      keyword.active ? 'bg-accent-green' : 'bg-t4'
                    }`}
                  />
                  <span className="text-sm text-t1 min-w-[200px]">{keyword.en}</span>
                  <span className="text-sm text-t3">{keyword.ko}</span>
                  <span className="text-[10px] text-t4 bg-bg3 px-1.5 py-0.5 rounded ml-auto">
                    {keyword.category}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => handleEditKeyword(keyword)}
                      className="px-2 py-0.5 text-[10px] text-accent-blue hover:bg-accent-blue/10 rounded transition-colors duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteKeyword(keyword)}
                      className="px-2 py-0.5 text-[10px] text-accent-red hover:bg-accent-red/10 rounded transition-colors duration-150"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminKeywordsPage() {
  const [expandedLayers, setExpandedLayers] = useState<ReadonlySet<number>>(
    new Set([1, 2, 3, 4])
  )

  const toggleLayer = useCallback((layerNum: number) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev)
      if (next.has(layerNum)) {
        next.delete(layerNum)
      } else {
        next.add(layerNum)
      }
      return next
    })
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-xl font-bold text-t1 tracking-wide">
          Keyword Management
        </h1>
        <p className="text-t3 text-sm mt-1">
          Manage crawl keywords organized by intelligence layer
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setExpandedLayers(new Set([1, 2, 3, 4]))}
          className="px-3 py-1.5 text-[11px] font-medium text-t2 hover:text-t1 bg-bg3 hover:bg-bg4 border border-brd rounded-md transition-all duration-200"
        >
          Expand All
        </button>
        <button
          onClick={() => setExpandedLayers(new Set())}
          className="px-3 py-1.5 text-[11px] font-medium text-t2 hover:text-t1 bg-bg3 hover:bg-bg4 border border-brd rounded-md transition-all duration-200"
        >
          Collapse All
        </button>
      </div>

      <div className="space-y-4">
        {INITIAL_KEYWORD_LAYERS.map((layer) => (
          <CollapsibleLayer
            key={layer.layer}
            layer={layer}
            isExpanded={expandedLayers.has(layer.layer)}
            onToggle={() => toggleLayer(layer.layer)}
          />
        ))}
      </div>
    </div>
  )
}
