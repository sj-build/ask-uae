'use client'

import { useState } from 'react'
import { ChevronDown, MapPin, Users, Landmark, TrendingUp } from 'lucide-react'
import { emirates as emiratesKo } from '@/data/overview/emirates'
import { emirates as emiratesEn } from '@/data/overview/emirates.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { useLocale } from '@/hooks/useLocale'
import type { EmirateData } from '@/data/overview/emirates'

interface EmirateQuickStat {
  readonly gdpPercent: string
  readonly population: string
  readonly keyFeature: string
  readonly keyFeatureEn: string
}

const EMIRATE_STATS: Record<string, EmirateQuickStat> = {
  'Abu Dhabi': { gdpPercent: '60%', population: '380만', keyFeature: '연방 수도, 석유 96%', keyFeatureEn: 'Federal capital, 96% of oil' },
  'Dubai': { gdpPercent: '26%', population: '381만', keyFeature: '상업 수도, 글로벌 허브', keyFeatureEn: 'Commercial capital, global hub' },
  'Sharjah': { gdpPercent: '8%', population: '180만', keyFeature: '문화 수도, 음주 금지', keyFeatureEn: 'Cultural capital, alcohol-free' },
  'Ras Al Khaimah': { gdpPercent: '3%', population: '40만', keyFeature: '카지노 특구 (Wynn 2026)', keyFeatureEn: 'Casino zone (Wynn 2026)' },
  'Ajman': { gdpPercent: '1.5%', population: '50만', keyFeature: '저렴한 주거, 베드타운', keyFeatureEn: 'Affordable housing, bedroom city' },
  'Fujairah': { gdpPercent: '1%', population: '26만', keyFeature: '동해안 전략항구', keyFeatureEn: 'East coast strategic port' },
  'Umm Al Quwain': { gdpPercent: '0.5%', population: '5만', keyFeature: '가장 조용한 에미리트', keyFeatureEn: 'Quietest emirate' },
}

function EmirateVisualCard({
  emirate,
  isExpanded,
  onToggle,
  locale,
}: {
  readonly emirate: EmirateData
  readonly isExpanded: boolean
  readonly onToggle: () => void
  readonly locale: string
}) {
  const stats = EMIRATE_STATS[emirate.name]
  const isMajor = emirate.badgeLevel === 'S' || emirate.badgeLevel === 'A'

  const badgeColors: Record<string, string> = {
    S: 'bg-gold text-bg1',
    A: 'bg-accent-red text-white',
    B: 'bg-accent-blue text-white',
    C: 'bg-t4 text-bg1',
  }

  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300
        ${isExpanded
          ? 'bg-bg2 shadow-xl'
          : 'bg-bg3 hover:bg-bg2'
        }
        ${isMajor ? 'md:col-span-2' : ''}
      `}
      style={{
        borderColor: isExpanded ? emirate.borderColor : 'transparent',
        borderLeftColor: emirate.borderColor,
        borderLeftWidth: '4px',
      }}
      onClick={onToggle}
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
        style={{
          background: `linear-gradient(135deg, ${emirate.borderColor}10 0%, transparent 50%)`
        }}
      />

      {/* Header */}
      <div className="relative p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emirate.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-[15px] transition-colors duration-300 ${isExpanded ? 'text-gold' : 'text-t1'}`}>
                  {emirate.name}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${badgeColors[emirate.badgeLevel]}`}>
                  GDP {stats.gdpPercent}
                </span>
              </div>
              <p className="text-[10px] text-t4 mt-0.5">{emirate.nameAr}</p>
            </div>
          </div>
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className={`w-5 h-5 ${isExpanded ? 'text-gold' : 'text-t4'}`} />
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="flex items-center gap-4 mt-3 text-[10px]">
          <span className="flex items-center gap-1 text-t3">
            <Users className="w-3 h-3" />
            {stats.population}
          </span>
          <span className="flex items-center gap-1 text-t3">
            <TrendingUp className="w-3 h-3" />
            {locale === 'en' ? stats.keyFeatureEn : stats.keyFeature}
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 space-y-3 border-t border-brd/50 pt-3">
          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-2">
            {emirate.details.slice(0, 6).map((detail, idx) => {
              const [label, ...valueParts] = detail.split(':')
              const value = valueParts.join(':').trim()

              return (
                <div
                  key={idx}
                  className="bg-bg4/50 rounded-lg p-2.5 border border-brd/30"
                >
                  <div className="text-[9px] text-t4 uppercase tracking-wide mb-1">{label}</div>
                  <div className="text-[11px] text-t2 leading-snug">{value}</div>
                </div>
              )
            })}
          </div>

          {/* Additional Details */}
          {emirate.details.length > 6 && (
            <div className="space-y-2 pt-2">
              {emirate.details.slice(6).map((detail, idx) => {
                const [label, ...valueParts] = detail.split(':')
                const value = valueParts.join(':').trim()

                return (
                  <div key={idx} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: emirate.borderColor }}
                    />
                    <div>
                      <span className="text-[10px] font-semibold text-t3">{label}:</span>
                      <span className="text-[10px] text-t2 ml-1">{value}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Korea Comparison - if present */}
          {emirate.details.some(d => d.includes('한국 비유')) && (
            <div
              className="flex items-start gap-2 rounded-lg p-3 mt-2"
              style={{ backgroundColor: `${emirate.borderColor}15`, borderColor: `${emirate.borderColor}30` }}
            >
              <span className="text-sm">🇰🇷</span>
              <div>
                <span className="text-[10px] font-bold" style={{ color: emirate.borderColor }}>
                  {locale === 'en' ? 'Korea Equivalent' : '한국 비유'}
                </span>
                <p className="text-[11px] text-t2 mt-0.5">
                  {emirate.details.find(d => d.includes('한국 비유'))?.split(':')[1]?.trim()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmiratesMap({ locale }: { readonly locale: string }) {
  return (
    <div className="bg-bg2 border border-brd rounded-xl p-5 mb-4">
      <h4 className="text-[13px] font-bold text-t1 mb-4 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gold" />
        {locale === 'en' ? 'UAE at a Glance' : 'UAE 한눈에 보기'}
      </h4>

      {/* Visual Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gold/10 border border-gold/20 rounded-lg p-3 text-center">
          <div className="text-[20px] font-bold text-gold">7</div>
          <div className="text-[10px] text-t3">{locale === 'en' ? 'Emirates' : '개 에미리트'}</div>
        </div>
        <div className="bg-accent-purple/10 border border-accent-purple/20 rounded-lg p-3 text-center">
          <div className="text-[20px] font-bold text-accent-purple">2</div>
          <div className="text-[10px] text-t3">{locale === 'en' ? 'Major Powers' : '양대 강자'}</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
          <div className="text-[20px] font-bold text-emerald-400">86%</div>
          <div className="text-[10px] text-t3">{locale === 'en' ? 'GDP (AD+Dubai)' : 'GDP (AD+Dubai)'}</div>
        </div>
        <div className="bg-accent-cyan/10 border border-accent-cyan/20 rounded-lg p-3 text-center">
          <div className="text-[20px] font-bold text-accent-cyan">96%</div>
          <div className="text-[10px] text-t3">{locale === 'en' ? 'Oil (Abu Dhabi)' : '석유 (Abu Dhabi)'}</div>
        </div>
      </div>

      {/* Power Hierarchy Visual */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 px-3 py-1.5 bg-gold/20 border border-gold/30 rounded-full">
          <span className="w-2 h-2 rounded-full bg-gold" />
          <span className="text-[10px] font-bold text-gold">Abu Dhabi</span>
          <span className="text-[9px] text-t4">(60%)</span>
        </div>
        <span className="text-t4">{'>'}</span>
        <div className="flex items-center gap-1 px-3 py-1.5 bg-accent-red/20 border border-accent-red/30 rounded-full">
          <span className="w-2 h-2 rounded-full bg-accent-red" />
          <span className="text-[10px] font-bold text-accent-red">Dubai</span>
          <span className="text-[9px] text-t4">(26%)</span>
        </div>
        <span className="text-t4">{'>'}</span>
        <div className="flex items-center gap-1 px-3 py-1.5 bg-bg4 border border-brd rounded-full">
          <span className="text-[10px] font-medium text-t3">{locale === 'en' ? '5 Others' : '나머지 5개'}</span>
          <span className="text-[9px] text-t4">(14%)</span>
        </div>
      </div>
    </div>
  )
}

export function EmiratesCards() {
  const { locale } = useLocale()
  const emirates = useLocalizedData(emiratesKo, emiratesEn)
  const [expandedName, setExpandedName] = useState<string | null>(null)

  const handleToggle = (name: string) => {
    setExpandedName(expandedName === name ? null : name)
  }

  // Separate major (Abu Dhabi, Dubai) and minor emirates
  const majorEmirates = emirates.filter(e => e.badgeLevel === 'S' || e.badgeLevel === 'A')
  const minorEmirates = emirates.filter(e => e.badgeLevel !== 'S' && e.badgeLevel !== 'A')

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <EmiratesMap locale={locale} />

      {/* Major Emirates */}
      <div>
        <h4 className="text-[12px] font-bold text-t1 mb-3 flex items-center gap-2">
          <Landmark className="w-4 h-4 text-gold" />
          {locale === 'en' ? 'Major Emirates (86% of GDP)' : '양대 에미리트 (GDP 86%)'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {majorEmirates.map((emirate) => (
            <EmirateVisualCard
              key={emirate.name}
              emirate={emirate}
              isExpanded={expandedName === emirate.name}
              onToggle={() => handleToggle(emirate.name)}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* Minor Emirates */}
      <div>
        <h4 className="text-[12px] font-bold text-t1 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-t3" />
          {locale === 'en' ? 'Other Emirates (14% of GDP)' : '기타 에미리트 (GDP 14%)'}
          <span className="text-[10px] font-normal text-t4">
            {locale === 'en' ? '(Click to expand)' : '(클릭하여 펼치기)'}
          </span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {minorEmirates.map((emirate) => (
            <EmirateVisualCard
              key={emirate.name}
              emirate={emirate}
              isExpanded={expandedName === emirate.name}
              onToggle={() => handleToggle(emirate.name)}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-gold/10 via-bg2 to-accent-red/10 border border-gold/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div>
            <h4 className="text-[12px] font-bold text-gold mb-1">
              {locale === 'en' ? 'Key Business Insight' : '비즈니스 핵심 포인트'}
            </h4>
            <p className="text-[11px] text-t2 leading-relaxed">
              {locale === 'en'
                ? 'Abu Dhabi holds the real power (capital, oil, SWF). Dubai is the "face" (brand, marketing, tourism). For serious investment deals, connect with Abu Dhabi. For market entry and visibility, leverage Dubai.'
                : 'Abu Dhabi가 실권 (수도, 석유, SWF). Dubai는 "얼굴" (브랜드, 마케팅, 관광). 대형 투자 딜은 Abu Dhabi, 시장 진입과 인지도는 Dubai를 활용.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
