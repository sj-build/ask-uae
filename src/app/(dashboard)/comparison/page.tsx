'use client'

import { useState } from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { StatsComparisonTable } from '@/components/overview/StatsComparisonTable'
import { PopulationDemographics } from '@/components/overview/PopulationDemographics'
import { BilateralRelations } from '@/components/overview/BilateralRelations'
import { GovernanceConcepts } from '@/components/overview/GovernanceConcepts'
import { MustKnowDifferences } from '@/components/comparison/MustKnowDifferences'
import { useLocale } from '@/hooks/useLocale'

interface TabItem {
  readonly id: string
  readonly icon: string
  readonly label: string
  readonly labelEn: string
}

const TABS: readonly TabItem[] = [
  { id: 'stats', icon: '📊', label: '핵심 비교표', labelEn: 'Key Comparison' },
  { id: 'population', icon: '👥', label: '인구구조 비교', labelEn: 'Population' },
  { id: 'bilateral', icon: '🤝', label: '한국-UAE 관계', labelEn: 'Bilateral Relations' },
  { id: 'governance', icon: '🏛️', label: 'UAE 핵심 통치 개념', labelEn: 'Governance' },
  { id: 'must-know', icon: '⚠️', label: '반드시 알아야 할 차이', labelEn: 'Must-Know Differences' },
] as const

export default function ComparisonPage() {
  const { t, locale } = useLocale()
  const p = t.pages.comparison
  const [activeTab, setActiveTab] = useState('stats')

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <StatsComparisonTable />
      case 'population':
        return <PopulationDemographics />
      case 'bilateral':
        return <BilateralRelations />
      case 'governance':
        return <GovernanceConcepts />
      case 'must-know':
        return <MustKnowDifferences />
      default:
        return <StatsComparisonTable />
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
