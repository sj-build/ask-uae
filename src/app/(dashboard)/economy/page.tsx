'use client'

import { useState } from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { EconomicTrends } from '@/components/economy/EconomicTrends'
import { EconomyOverview } from '@/components/economy/EconomyOverview'
import { EconomyStructureDetailed } from '@/components/economy/EconomyStructureDetailed'
import { EconomyUniqueness } from '@/components/economy/EconomyUniqueness'
import { SovereignWealth } from '@/components/economy/SovereignWealth'
import { BankingFinance } from '@/components/economy/BankingFinance'
import { LaborMarket } from '@/components/economy/LaborMarket'
import { TaxRegulations } from '@/components/economy/TaxRegulations'
import { MacroRiskSummary } from '@/components/overview/MacroRiskSummary'
import { useLocale } from '@/hooks/useLocale'
import { economicTrends } from '@/data/economy/trends'
import { economicTrends as economicTrendsEn } from '@/data/economy/trends.en'

interface TabItem {
  readonly id: string
  readonly icon: string
  readonly label: string
  readonly labelEn: string
}

const TABS: readonly TabItem[] = [
  { id: 'trends', icon: '📈', label: '경제 트렌드', labelEn: 'Economic Trends' },
  { id: 'overview', icon: '📊', label: '경제 개요', labelEn: 'Overview' },
  { id: 'structure', icon: '🏗️', label: '경제 구조', labelEn: 'Structure' },
  { id: 'swf', icon: '💰', label: '국부펀드', labelEn: 'Sovereign Wealth' },
  { id: 'banking', icon: '🏦', label: '금융 & 은행', labelEn: 'Banking & Finance' },
  { id: 'labor', icon: '👷', label: '노동 시장', labelEn: 'Labor Market' },
  { id: 'tax', icon: '📋', label: '세금 & 규제', labelEn: 'Tax & Regulations' },
  { id: 'uniqueness', icon: '⭐', label: '경제 특수성', labelEn: 'Uniqueness' },
  { id: 'risk', icon: '⚠️', label: '매크로 리스크', labelEn: 'Macro Risks' },
] as const

export default function EconomyPage() {
  const { t, locale } = useLocale()
  const p = t.pages.economy
  const [activeTab, setActiveTab] = useState('trends')

  const trendsData = locale === 'en' ? economicTrendsEn : economicTrends

  const renderContent = () => {
    switch (activeTab) {
      case 'trends':
        return <EconomicTrends trends={trendsData} />
      case 'overview':
        return <EconomyOverview />
      case 'structure':
        return <EconomyStructureDetailed />
      case 'swf':
        return <SovereignWealth />
      case 'banking':
        return <BankingFinance />
      case 'labor':
        return <LaborMarket />
      case 'tax':
        return <TaxRegulations />
      case 'uniqueness':
        return <EconomyUniqueness />
      case 'risk':
        return <MacroRiskSummary />
      default:
        return <EconomyOverview />
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
