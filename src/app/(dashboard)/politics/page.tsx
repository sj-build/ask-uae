'use client'

import { useState } from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { PoliticalSystem } from '@/components/overview/PoliticalSystem'
import { EmiratesCards } from '@/components/overview/EmiratesCards'
import { AbuDhabiVsDubai } from '@/components/overview/AbuDhabiVsDubai'
import { GovernmentStructure } from '@/components/overview/GovernmentStructure'
import { AbuDhabiGovernment } from '@/components/overview/AbuDhabiGovernment'
import { TierSection } from '@/components/power/TierSection'
import { ConnectionBox } from '@/components/connection/ConnectionBox'
import { PoliticalTrends } from '@/components/politics/PoliticalTrends'
import { tiers as tiersKo } from '@/data/power/tiers'
import { tiers as tiersEn } from '@/data/power/tiers.en'
import {
  tahnounTree as tahnounTreeKo,
  mbzTree as mbzTreeKo,
  dubaiTree as dubaiTreeKo,
  darkMatterTree as darkMatterTreeKo,
  swfTree as swfTreeKo,
} from '@/data/connection/trees'
import {
  tahnounTree as tahnounTreeEn,
  mbzTree as mbzTreeEn,
  dubaiTree as dubaiTreeEn,
  darkMatterTree as darkMatterTreeEn,
  swfTree as swfTreeEn,
} from '@/data/connection/trees.en'
import { politicalTrends as trendsKo } from '@/data/politics/trends'
import { politicalTrends as trendsEn } from '@/data/politics/trends.en'
import { useLocale } from '@/hooks/useLocale'
import { useLocalizedData } from '@/hooks/useLocalizedData'

interface TabItem {
  readonly id: string
  readonly icon: string
  readonly label: string
  readonly labelEn: string
}

interface NetworkSubTab {
  readonly id: string
  readonly icon: string
  readonly label: string
  readonly labelEn: string
}

const TABS: readonly TabItem[] = [
  { id: 'trends', icon: '📈', label: '최근 동향', labelEn: 'Political Trends' },
  { id: 'system', icon: '🏛️', label: '정치체제', labelEn: 'Political System' },
  { id: 'emirates', icon: '🗺️', label: '7개 에미레이트', labelEn: '7 Emirates' },
  { id: 'comparison', icon: '⚖️', label: '아부다비 vs 두바이', labelEn: 'Abu Dhabi vs Dubai' },
  { id: 'government', icon: '🏢', label: '정부구조', labelEn: 'Government Structure' },
  { id: 'power', icon: '👑', label: '권력구조', labelEn: 'Power Structure' },
  { id: 'network', icon: '🔗', label: '권력 연결망', labelEn: 'Power Networks' },
] as const

const NETWORK_SUB_TABS: readonly NetworkSubTab[] = [
  { id: 'tahnoun', icon: '🏛️', label: 'Tahnoun 제국', labelEn: 'Tahnoun Empire' },
  { id: 'mbz', icon: '👑', label: 'MBZ-Khaldoon 축', labelEn: 'MBZ-Khaldoon Axis' },
  { id: 'dubai', icon: '🏙️', label: 'Dubai', labelEn: 'Dubai' },
  { id: 'darkmatter', icon: '🛡️', label: 'DarkMatter', labelEn: 'DarkMatter' },
  { id: 'swf', icon: '💰', label: 'SWF 관계', labelEn: 'SWF Relations' },
] as const

export default function PoliticsPage() {
  const { t, locale } = useLocale()
  const p = t.pages.politics
  const [activeTab, setActiveTab] = useState('trends')
  const [activeNetworkSubTab, setActiveNetworkSubTab] = useState('tahnoun')

  const localTiers = useLocalizedData(tiersKo, tiersEn)
  const localTrends = useLocalizedData(trendsKo, trendsEn)

  const localTahnounTree = useLocalizedData(tahnounTreeKo, tahnounTreeEn)
  const localMbzTree = useLocalizedData(mbzTreeKo, mbzTreeEn)
  const localDubaiTree = useLocalizedData(dubaiTreeKo, dubaiTreeEn)
  const localDarkMatterTree = useLocalizedData(darkMatterTreeKo, darkMatterTreeEn)
  const localSwfTree = useLocalizedData(swfTreeKo, swfTreeEn)

  const getNetworkTree = () => {
    switch (activeNetworkSubTab) {
      case 'tahnoun':
        return localTahnounTree
      case 'mbz':
        return localMbzTree
      case 'dubai':
        return localDubaiTree
      case 'darkmatter':
        return localDarkMatterTree
      case 'swf':
        return localSwfTree
      default:
        return localTahnounTree
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'trends':
        return <PoliticalTrends trends={localTrends} />
      case 'system':
        return <PoliticalSystem />
      case 'emirates':
        return <EmiratesCards />
      case 'comparison':
        return <AbuDhabiVsDubai />
      case 'government':
        return (
          <>
            <GovernmentStructure />
            <AbuDhabiGovernment />
          </>
        )
      case 'power':
        return (
          <div className="space-y-2">
            {localTiers.map((tier) => (
              <TierSection key={tier.level} tier={tier} />
            ))}
          </div>
        )
      case 'network':
        return (
          <div className="space-y-4">
            {/* Network Sub-tabs */}
            <div className="flex flex-wrap gap-2">
              {NETWORK_SUB_TABS.map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => setActiveNetworkSubTab(subTab.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold
                    transition-all duration-200
                    ${activeNetworkSubTab === subTab.id
                      ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30'
                      : 'bg-bg2 text-t3 border border-brd hover:text-t1 hover:border-brd2'
                    }
                  `}
                >
                  <span>{subTab.icon}</span>
                  <span>{locale === 'en' ? subTab.labelEn : subTab.label}</span>
                </button>
              ))}
            </div>

            {/* Network Content */}
            <ConnectionBox tree={getNetworkTree()} />
          </div>
        )
      default:
        return <PoliticalTrends trends={localTrends} />
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
