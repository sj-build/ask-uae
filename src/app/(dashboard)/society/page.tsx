'use client'

import { useState } from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { PopulationStructure } from '@/components/society/PopulationStructure'
import { BusinessCulture } from '@/components/society/BusinessCulture'
import { ReligionSection } from '@/components/society/ReligionSection'
import { EssentialKnowledge } from '@/components/society/EssentialKnowledge'
import { RecentTrends } from '@/components/society/RecentTrends'
import { CulturalInfraGaming } from '@/components/society/CulturalInfraGaming'
import { GenZKWave } from '@/components/society/GenZKWave'
import { WelfareWomenFood } from '@/components/society/WelfareWomenFood'
import { useLocale } from '@/hooks/useLocale'
import { SectionHeader } from '@/components/ui/SectionHeader'

const SECTION_CONTENT = {
  ko: {
    tldr: [
      '인구 1,050만 중 88.5%가 외국인 - 다국적 인력 채용 용이, 에미라티화 정책 강화 추세',
      'Wynn 카지노 2026, Guggenheim Abu Dhabi 2026 개관 - 사회 자유화 가속',
      'K-Pop/K-Beauty 열풍 지속, MZ세대 중심 한류 콘텐츠 소비 급증',
    ],
    investorImplications: [
      '관광/엔터테인먼트 규제 완화로 F&B/호스피탈리티/게이밍 진출 기회 확대',
      '한류 열풍으로 K-콘텐츠/K-Beauty 현지 사업 유망 - 할랄 인증 필수',
    ],
  },
  en: {
    tldr: [
      '88.5% of 10.5M population are expats - easy multinational hiring, but Emiratization intensifying',
      'Wynn Casino 2026, Guggenheim Abu Dhabi 2026 opening - accelerating social liberalization',
      'K-Pop/K-Beauty fever continues, Gen MZ driving Korean content consumption surge',
    ],
    investorImplications: [
      'Tourism/entertainment deregulation expands F&B/hospitality/gaming opportunities',
      'K-Wave opens doors for K-content/K-Beauty local ventures - Halal certification essential',
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
  { id: 'trends', icon: '🔥', label: '최근 트렌드', labelEn: 'Recent Trends' },
  { id: 'culture-gaming', icon: '🏛️', label: '문화 인프라 & 게이밍', labelEn: 'Culture & Gaming' },
  { id: 'genz-kwave', icon: '🧘', label: 'Gen Z & K-Wave', labelEn: 'Gen Z & K-Wave' },
  { id: 'population', icon: '👥', label: '인구구조', labelEn: 'Population' },
  { id: 'business', icon: '🤝', label: '비즈니스 문화', labelEn: 'Business Culture' },
  { id: 'religion', icon: '🕌', label: '종교', labelEn: 'Religion' },
  { id: 'essential', icon: '📋', label: '현지 필수 지식', labelEn: 'Essential Knowledge' },
  { id: 'welfare', icon: '🏥', label: '복지 · 여성 · 음식 · 기후', labelEn: 'Welfare · Women · Food · Climate' },
] as const

export default function SocietyPage() {
  const { t, locale } = useLocale()
  const p = t.pages.society
  const [activeTab, setActiveTab] = useState('trends')

  const renderContent = () => {
    switch (activeTab) {
      case 'trends':
        return <RecentTrends />
      case 'culture-gaming':
        return <CulturalInfraGaming />
      case 'genz-kwave':
        return <GenZKWave />
      case 'population':
        return <PopulationStructure />
      case 'business':
        return <BusinessCulture />
      case 'religion':
        return <ReligionSection />
      case 'essential':
        return <EssentialKnowledge />
      case 'welfare':
        return <WelfareWomenFood />
      default:
        return <RecentTrends />
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
        source={{ sourceName: 'UAE Statistics, Media Reports', asOf: '2025-02', method: 'aggregated' }}
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
