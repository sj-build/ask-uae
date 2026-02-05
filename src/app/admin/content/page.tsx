'use client'

import { useState, useCallback } from 'react'
import type { ContentSection } from '@/types/admin'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'power', label: 'Power' },
  { id: 'connection', label: 'Connection' },
  { id: 'industry', label: 'Industry' },
  { id: 'network', label: 'Network' },
  { id: 'strategy', label: 'Strategy' },
] as const

type TabId = typeof TABS[number]['id']

const INITIAL_SECTIONS: readonly ContentSection[] = [
  {
    id: 'overview-main',
    tab: 'overview',
    sectionKey: 'main',
    content: '# Overview\n\nUAE consists of 7 emirates, each with distinct economic strategies and power structures.\n\nThis section provides a comparative analysis of key political and economic indicators.',
    updatedAt: '2025-01-27T10:00:00Z',
  },
  {
    id: 'power-main',
    tab: 'power',
    sectionKey: 'main',
    content: '# Power Structure\n\nThe Al Nahyan family of Abu Dhabi holds the presidency, while the Al Maktoum family of Dubai holds the prime ministership.\n\nKey positions and their holders are mapped in this section.',
    updatedAt: '2025-01-26T08:00:00Z',
  },
  {
    id: 'connection-main',
    tab: 'connection',
    sectionKey: 'main',
    content: '# Connection Network\n\nMapping relationships between royal families, sovereign wealth funds, and key economic actors.\n\nVisualize the flow of influence and capital.',
    updatedAt: '2025-01-25T12:00:00Z',
  },
  {
    id: 'industry-main',
    tab: 'industry',
    sectionKey: 'main',
    content: '# Industry Map\n\nUAE strategic sectors include energy, AI/tech, defense, real estate, and financial services.\n\nEach sector has designated champions and investment vehicles.',
    updatedAt: '2025-01-24T14:00:00Z',
  },
  {
    id: 'network-main',
    tab: 'network',
    sectionKey: 'main',
    content: '# Network Gap Analysis\n\nIdentifying gaps in Korea-UAE business networks.\n\nOpportunities for new connections and partnerships.',
    updatedAt: '2025-01-23T16:00:00Z',
  },
  {
    id: 'strategy-main',
    tab: 'strategy',
    sectionKey: 'main',
    content: '# Strategy Recommendations\n\nActionable strategies for Korean investors and companies entering the UAE market.\n\nPhased approach with risk mitigation.',
    updatedAt: '2025-01-22T18:00:00Z',
  },
] as const

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function handleSave(section: ContentSection) {
  alert(`Save "${section.tab}" section — Persistence will be implemented in Phase 3`)
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [sections, setSections] = useState<readonly ContentSection[]>(INITIAL_SECTIONS)

  const activeSection = sections.find((s) => s.tab === activeTab)

  const handleContentChange = useCallback((sectionId: string, newContent: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, content: newContent, updatedAt: new Date().toISOString() }
          : s
      )
    )
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-xl font-bold text-t1 tracking-wide">
          Content Editor
        </h1>
        <p className="text-t3 text-sm mt-1">
          Edit dashboard section content (placeholder — full CMS in Phase 3)
        </p>
      </div>

      <div className="flex gap-1 mb-6 bg-bg2 border border-brd rounded-lg p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gold/15 text-gold border border-gold/25'
                : 'text-t3 hover:text-t2 hover:bg-bg3 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSection && (
        <div className="bg-bg2 border border-brd rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-t1">
                {TABS.find((t) => t.id === activeTab)?.label} — Main Section
              </h2>
              <p className="text-[11px] text-t4 mt-0.5">
                Last updated: {formatDateTime(activeSection.updatedAt)}
              </p>
            </div>
            <button
              onClick={() => handleSave(activeSection)}
              className="px-4 py-2 text-xs font-semibold text-gold bg-gold/10 border border-gold/20 rounded-lg hover:bg-gold/20 transition-all duration-200"
            >
              Save Changes
            </button>
          </div>

          <textarea
            value={activeSection.content}
            onChange={(e) => handleContentChange(activeSection.id, e.target.value)}
            className="w-full h-80 px-4 py-3 bg-bg3 border border-brd rounded-lg text-sm text-t1 font-mono leading-relaxed placeholder:text-t4 focus:outline-none focus:border-gold/30 resize-y transition-colors duration-200"
            placeholder="Enter content in Markdown format..."
          />

          <div className="mt-3 flex items-center gap-4">
            <span className="text-[10px] text-t4">
              Section: {activeSection.sectionKey}
            </span>
            <span className="text-[10px] text-t4">
              ID: {activeSection.id}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
