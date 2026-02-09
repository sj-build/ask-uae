'use client'

import { useState } from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatsComparisonTable } from '@/components/overview/StatsComparisonTable'
import { PopulationDemographics } from '@/components/overview/PopulationDemographics'
import { BilateralRelations } from '@/components/overview/BilateralRelations'
import { GovernanceConcepts } from '@/components/overview/GovernanceConcepts'
import { MustKnowDifferences } from '@/components/comparison/MustKnowDifferences'
import { ComparisonKPIs } from '@/components/comparison/ComparisonKPIs'
import { useLocale } from '@/hooks/useLocale'

const SECTION_CONTENT = {
  ko: {
    tldr: [
      'UAE 인구 1,010만 중 자국민 11%만 - 외국인 89%가 경제 주도',
      '1인당 GDP $55,000 (한국의 1.5배) - 오일머니 + 무관세 기반 고소득 국가',
      '한-UAE 교역 $180억+ (2024) - 에너지/건설/방산 중심, 투자확대 추세',
    ],
    investorImplications: [
      '비즈니스 실무는 외국인(인도/파키스탄/필리핀)이 담당 - 에미라티는 의사결정권자',
      '에미라티 문화(와스타, 체면) 이해 필수 - 관계 중심 비즈니스 문화',
    ],
  },
  en: {
    tldr: [
      'UAE population 10.1M, only 11% nationals - 89% foreigners drive the economy',
      'GDP per capita $55,000 (1.5x Korea) - High-income nation based on oil wealth + no taxes',
      'Korea-UAE trade $18B+ (2024) - Focus on energy/construction/defense, investment growing',
    ],
    investorImplications: [
      'Business operations run by foreigners (Indian/Pakistani/Filipino) - Emiratis are decision-makers',
      'Understanding Emirati culture (Wasta, face) essential - Relationship-driven business culture',
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
  const content = locale === 'en' ? SECTION_CONTENT.en : SECTION_CONTENT.ko

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return (
          <>
            <ComparisonKPIs />
            <StatsComparisonTable />
          </>
        )
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

      <SectionHeader
        tldr={content.tldr}
        investorImplications={content.investorImplications}
        source={{ sourceName: 'World Bank, UAE Gov, KOTRA', asOf: '2024', method: 'official' }}
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
