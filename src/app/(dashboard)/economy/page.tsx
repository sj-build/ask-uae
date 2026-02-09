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
import { SectionHeader } from '@/components/ui/SectionHeader'

const SECTION_CONTENT = {
  ko: {
    tldr: [
      'GDP $537B, 1인당 GDP $49,500 - 고소득 시장, 비석유 GDP 비중 70% 돌파',
      'SWF 총자산 $2.5T+ (ADIA $1T, Mubadala $302B, ADQ $200B) - 세계 최대 LP 집단',
      '부동산 $243B(+36% YoY), AI/데이터센터 $20B+, 에너지전환 가속',
    ],
    investorImplications: [
      '고소득 시장으로 프리미엄 가격 책정 가능 - B2C 진출 기회',
      'SWF는 스타트업 투자부터 대형 M&A까지 - LP 접점 확보가 핵심',
    ],
  },
  en: {
    tldr: [
      'GDP $537B, GDP per capita $49,500 - high-income market, non-oil GDP exceeds 70%',
      'SWF total AUM $2.5T+ (ADIA $1T, Mubadala $302B, ADQ $200B) - world\'s largest LP cluster',
      'Real estate $243B (+36% YoY), AI/data centers $20B+, accelerating energy transition',
    ],
    investorImplications: [
      'High-income market enables premium pricing - B2C entry opportunities',
      'SWFs span from startup investments to major M&A - securing LP access is key',
    ],
  },
}

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

  const content = locale === 'en' ? SECTION_CONTENT.en : SECTION_CONTENT.ko

  return (
    <>
      <SectionTitle
        title={p.title}
        subtitle={p.subtitle}
      />

      <SectionHeader
        tldr={content.tldr}
        investorImplications={content.investorImplications}
        source={{ sourceName: 'IMF, World Bank, SWF Institute', asOf: '2024', method: 'aggregated' }}
        locale={locale}
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
