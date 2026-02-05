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
