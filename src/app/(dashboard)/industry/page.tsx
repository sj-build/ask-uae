'use client'

import { SectionTitle } from '@/components/ui/SectionTitle'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SectorGrid } from '@/components/industry/SectorGrid'
import { sectors as sectorsKo } from '@/data/industry/sectors'
import { sectors as sectorsEn } from '@/data/industry/sectors.en'
import { useLocale } from '@/hooks/useLocale'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const SECTION_CONTENT = {
  ko: {
    tldr: [
      'AI/데이터센터 CAGR 28% - G42(Tahnoun)가 UAE AI 전략 주도, Falcon LLM 개발',
      '크립토 허브 부상 - VARA(두바이), ADGM(아부다비) 글로벌 규제 선도, Binance 본사 유치',
      '관광/부동산 호황 - 2024 방문객 2,900만+, 두바이 부동산 외국인 투자 $20B+',
    ],
    investorImplications: [
      'IHC/Mubadala/ADIA 지분구조 파악 필수 - 대부분 핵심 산업이 국부펀드 연결',
      '섹터별 라이선스/규제 상이 - 프리존 vs 메인랜드 선택이 진입전략 결정',
    ],
  },
  en: {
    tldr: [
      'AI/Data Center CAGR 28% - G42 (Tahnoun) leads UAE AI strategy, developed Falcon LLM',
      'Crypto hub rising - VARA (Dubai), ADGM (Abu Dhabi) lead global regulation, Binance HQ',
      'Tourism/Real Estate boom - 2024 visitors 29M+, Dubai foreign real estate investment $20B+',
    ],
    investorImplications: [
      'Understanding IHC/Mubadala/ADIA ownership structure essential - most key industries connected to sovereign wealth',
      'Licensing/regulations differ by sector - Free Zone vs Mainland choice determines entry strategy',
    ],
  },
}

export default function IndustryPage() {
  const { t, locale } = useLocale()
  const p = t.pages.industry
  const localSectors = useLocalizedData(sectorsKo, sectorsEn)
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
        source={{ sourceName: 'Statista, Mordor Intelligence, UAE Gov', asOf: '2024-12', method: 'official' }}
        locale={locale}
      />

      <SectorGrid sectors={localSectors} />
    </>
  )
}
