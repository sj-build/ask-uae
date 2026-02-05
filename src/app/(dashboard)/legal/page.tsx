'use client'

import { useState } from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { LegalFramework } from '@/components/legal/LegalFramework'
import { BusinessRegulations } from '@/components/legal/BusinessRegulations'
import { FreeZones } from '@/components/legal/FreeZones'
import { RecentLegalChanges } from '@/components/legal/RecentLegalChanges'
import { useLocale } from '@/hooks/useLocale'

interface TabItem {
  readonly id: string
  readonly icon: string
  readonly label: string
  readonly labelEn: string
}

const TABS: readonly TabItem[] = [
  { id: 'framework', icon: '⚖️', label: '법체계 개요', labelEn: 'Legal Framework' },
  { id: 'regulations', icon: '📋', label: '기업 규제 환경', labelEn: 'Business Regulations' },
  { id: 'freezones', icon: '🏢', label: '프리존', labelEn: 'Free Zones' },
  { id: 'changes', icon: '📰', label: '최근 법률 변경', labelEn: 'Recent Changes' },
] as const

export default function LegalPage() {
  const { t, locale } = useLocale()
  const p = t.pages.legal
  const [activeTab, setActiveTab] = useState('framework')

  const renderContent = () => {
    switch (activeTab) {
      case 'framework':
        return <LegalFramework />
      case 'regulations':
        return <BusinessRegulations />
      case 'freezones':
        return <FreeZones />
      case 'changes':
        return <RecentLegalChanges />
      default:
        return <LegalFramework />
    }
  }

  return (
    <>
      <SectionTitle
        title={p.title}
        subtitle={p.subtitle}
      />

      {/* Sub-tab Navigation */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold
                transition-all duration-200 whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'bg-bg3 text-t3 border border-brd hover:text-t1 hover:border-brd2'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{locale === 'en' ? tab.labelEn : tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {renderContent()}
      </div>
    </>
  )
}
