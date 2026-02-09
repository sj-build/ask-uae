'use client'

import { useState } from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { LegalFramework } from '@/components/legal/LegalFramework'
import { BusinessRegulations } from '@/components/legal/BusinessRegulations'
import { FreeZones } from '@/components/legal/FreeZones'
import { RecentLegalChanges } from '@/components/legal/RecentLegalChanges'
import { useLocale } from '@/hooks/useLocale'
import { SectionHeader } from '@/components/ui/SectionHeader'

const SECTION_CONTENT = {
  ko: {
    tldr: [
      '법인세 9% (2023년 도입), 소득세 0%, VAT 5% - 세금 부담 최소화 가능',
      '50+ 프리존 운영, 100% 외국인 소유 허용 - ADGM/DIFC는 영미법 적용',
      '에미라티화 정책 강화 - 민간기업 자국민 고용 의무 2~4% (업종별 상이)',
    ],
    investorImplications: [
      '프리존 vs 메인랜드 선택이 세금/규제/라이센스에 큰 영향 - 전문가 자문 권장',
      '에미라티화 비용 고려 필수 - 불이행시 벌금, 비자 제한 등 불이익',
    ],
  },
  en: {
    tldr: [
      'Corporate tax 9% (since 2023), income tax 0%, VAT 5% - minimize tax burden',
      '50+ free zones, 100% foreign ownership allowed - ADGM/DIFC apply common law',
      'Emiratization intensifying - private sector quota 2~4% (varies by industry)',
    ],
    investorImplications: [
      'Free zone vs Mainland choice significantly impacts taxes/regulations/licensing - expert advice recommended',
      'Factor in Emiratization costs - non-compliance leads to fines and visa restrictions',
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
        source={{ sourceName: 'UAE Gov, ADGM, DIFC', asOf: '2025-01', method: 'official' }}
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
