'use client'

import { useState } from 'react'
import { ChevronRight, Building, Plane, DollarSign, Shield, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'

interface ComparisonMetric {
  readonly id: string
  readonly labelKo: string
  readonly labelEn: string
  readonly abuDhabi: string
  readonly dubai: string
  readonly winner: 'ad' | 'dubai' | 'tie'
  readonly icon: React.ReactNode
}

const METRICS: readonly ComparisonMetric[] = [
  {
    id: 'gdp',
    labelKo: 'GDP 비중',
    labelEn: 'GDP Share',
    abuDhabi: '60%',
    dubai: '26%',
    winner: 'ad',
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    id: 'area',
    labelKo: '면적',
    labelEn: 'Area',
    abuDhabi: '87%',
    dubai: '5%',
    winner: 'ad',
    icon: <Building className="w-4 h-4" />,
  },
  {
    id: 'oil',
    labelKo: '석유 매장량',
    labelEn: 'Oil Reserves',
    abuDhabi: '96%',
    dubai: '~0%',
    winner: 'ad',
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: 'swf',
    labelKo: 'SWF 자산',
    labelEn: 'SWF Assets',
    abuDhabi: '$2T+',
    dubai: '$429B',
    winner: 'ad',
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    id: 'brand',
    labelKo: '글로벌 인지도',
    labelEn: 'Global Brand',
    abuDhabi: '★★☆',
    dubai: '★★★',
    winner: 'dubai',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'tourism',
    labelKo: '관광객 수',
    labelEn: 'Tourists',
    abuDhabi: '~5M',
    dubai: '~17M',
    winner: 'dubai',
    icon: <Plane className="w-4 h-4" />,
  },
  {
    id: 'security',
    labelKo: '안보/군사',
    labelEn: 'Security/Military',
    abuDhabi: '100%',
    dubai: '0%',
    winner: 'ad',
    icon: <Shield className="w-4 h-4" />,
  },
]

interface CharacteristicItem {
  readonly textKo: string
  readonly textEn: string
  readonly highlight?: boolean
}

const AD_CHARACTERISTICS: readonly CharacteristicItem[] = [
  { textKo: '연방 예산의 ~70% 부담', textEn: 'Bears ~70% of federal budget' },
  { textKo: '군사/안보/외교 장악', textEn: 'Controls military/security/diplomacy' },
  { textKo: '전략: 느리지만 확실한 장기 투자', textEn: 'Strategy: Slow but steady long-term' },
  { textKo: '성격: 보수적, 프라이빗, 석유 기반', textEn: 'Character: Conservative, private, oil-based' },
  { textKo: '약점: 글로벌 브랜딩, 관광', textEn: 'Weakness: Global branding, tourism', highlight: true },
]

const DUBAI_CHARACTERISTICS: readonly CharacteristicItem[] = [
  { textKo: '석유 없이 관광/금융/물류로 성장', textEn: 'Grew via tourism/finance/logistics (no oil)' },
  { textKo: 'Emirates 항공 = 도시 마케팅 도구', textEn: 'Emirates airline = city marketing tool' },
  { textKo: '"최초, 최대, 최고" 마케팅 전략', textEn: '"First, biggest, best" marketing' },
  { textKo: '성격: 공격적, 화려, PR 중심', textEn: 'Character: Aggressive, flashy, PR-focused' },
  { textKo: '2009 부채위기 후 AD에 종속', textEn: '2009 debt crisis → dependent on AD', highlight: true },
]

export function AbuDhabiVsDubai() {
  const { locale } = useLocale()
  const [activeTab, setActiveTab] = useState<'comparison' | 'characteristics'>('comparison')

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            activeTab === 'comparison'
              ? 'bg-gold/15 text-gold border border-gold/30'
              : 'bg-bg3 text-t3 border border-brd hover:border-brd2'
          }`}
        >
          {locale === 'en' ? '📊 Head-to-Head' : '📊 수치 비교'}
        </button>
        <button
          onClick={() => setActiveTab('characteristics')}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            activeTab === 'characteristics'
              ? 'bg-gold/15 text-gold border border-gold/30'
              : 'bg-bg3 text-t3 border border-brd hover:border-brd2'
          }`}
        >
          {locale === 'en' ? '⚡ Characteristics' : '⚡ 특성 비교'}
        </button>
      </div>

      {activeTab === 'comparison' ? (
        /* Head-to-Head Comparison */
        <div className="bg-bg2 border border-brd rounded-xl overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-bg3 border-b border-brd">
            <div className="p-3 text-center">
              <span className="text-[13px] font-bold text-gold">🏛️ Abu Dhabi</span>
              <p className="text-[10px] text-t4">{locale === 'en' ? '"Silent Power"' : '"조용한 권력"'}</p>
            </div>
            <div className="p-3 text-center border-x border-brd">
              <span className="text-[13px] font-bold text-t2">{locale === 'en' ? 'Metric' : '지표'}</span>
            </div>
            <div className="p-3 text-center">
              <span className="text-[13px] font-bold text-accent-red">✨ Dubai</span>
              <p className="text-[10px] text-t4">{locale === 'en' ? '"Flashy Execution"' : '"화려한 집행"'}</p>
            </div>
          </div>

          {/* Comparison Rows */}
          {METRICS.map((metric, idx) => (
            <div
              key={metric.id}
              className={`grid grid-cols-3 ${idx !== METRICS.length - 1 ? 'border-b border-brd/50' : ''}`}
            >
              {/* Abu Dhabi Value */}
              <div className={`p-3 text-center ${metric.winner === 'ad' ? 'bg-gold/10' : ''}`}>
                <span className={`text-[15px] font-bold ${metric.winner === 'ad' ? 'text-gold' : 'text-t2'}`}>
                  {metric.abuDhabi}
                </span>
                {metric.winner === 'ad' && <span className="ml-1 text-gold">👑</span>}
              </div>

              {/* Metric Label */}
              <div className="p-3 text-center border-x border-brd/30 flex items-center justify-center gap-2">
                <span className="text-t4">{metric.icon}</span>
                <span className="text-[12px] text-t3">
                  {locale === 'en' ? metric.labelEn : metric.labelKo}
                </span>
              </div>

              {/* Dubai Value */}
              <div className={`p-3 text-center ${metric.winner === 'dubai' ? 'bg-accent-red/10' : ''}`}>
                <span className={`text-[15px] font-bold ${metric.winner === 'dubai' ? 'text-accent-red' : 'text-t2'}`}>
                  {metric.dubai}
                </span>
                {metric.winner === 'dubai' && <span className="ml-1 text-accent-red">👑</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Characteristics View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Abu Dhabi Card */}
          <div className="bg-bg2 border-2 border-gold/30 rounded-xl overflow-hidden">
            <div className="bg-gold/15 p-4 border-b border-gold/20">
              <h3 className="text-[15px] font-bold text-gold flex items-center gap-2">
                🏛️ Abu Dhabi
                <span className="text-[11px] font-normal text-t3">
                  {locale === 'en' ? '"The Vault"' : '"금고"'}
                </span>
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {AD_CHARACTERISTICS.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${item.highlight ? 'text-amber-400' : 'text-gold'}`} />
                  <span className={`text-[13px] leading-relaxed ${item.highlight ? 'text-amber-400' : 'text-t2'}`}>
                    {locale === 'en' ? item.textEn : item.textKo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dubai Card */}
          <div className="bg-bg2 border-2 border-accent-red/30 rounded-xl overflow-hidden">
            <div className="bg-accent-red/15 p-4 border-b border-accent-red/20">
              <h3 className="text-[15px] font-bold text-accent-red flex items-center gap-2">
                ✨ Dubai
                <span className="text-[11px] font-normal text-t3">
                  {locale === 'en' ? '"The Showroom"' : '"쇼윈도"'}
                </span>
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {DUBAI_CHARACTERISTICS.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${item.highlight ? 'text-amber-400' : 'text-accent-red'}`} />
                  <span className={`text-[13px] leading-relaxed ${item.highlight ? 'text-amber-400' : 'text-t2'}`}>
                    {locale === 'en' ? item.textEn : item.textKo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Key Insight Box */}
      <div className="bg-gradient-to-r from-gold/15 via-bg2 to-accent-red/15 border border-gold/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[13px] font-bold text-gold mb-2">
              {locale === 'en' ? 'Critical Insight for Investors' : '투자자 필수 인사이트'}
            </h4>
            <p className="text-[13px] text-t2 leading-relaxed">
              {locale === 'en'
                ? 'Dubai is easy to access and glamorous, but the real money is in Abu Dhabi. Dubai ICD $429B vs Abu Dhabi SWF $2T+. For serious capital deployment, connect with Abu Dhabi. Use Dubai for market entry and brand visibility.'
                : 'Dubai는 접근하기 쉽고 화려하지만, 진짜 자금은 Abu Dhabi에 있다. Dubai ICD $429B vs Abu Dhabi SWF $2T+. 대규모 자금은 Abu Dhabi, 시장 진입과 브랜드는 Dubai를 활용하라.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
