'use client'

import { Card } from '@/components/ui/Card'
import { Collapsible } from '@/components/ui/Collapsible'
import {
  lawComparisons as lawComparisonsKo,
  visaTypes as visaTypesKo,
  goldenVisaInsights as goldenVisaInsightsKo,
  emiratiWelfare as emiratiWelfareKo,
  welfareInsight as welfareInsightKo,
  womenStatus as womenStatusKo,
  womenCaveat as womenCaveatKo,
  womenInsights as womenInsightsKo,
  foodCulture as foodCultureKo,
  climateSeasons as climateSeasonsKo,
  climateInsights as climateInsightsKo,
} from '@/data/society/essential-knowledge'
import {
  lawComparisons as lawComparisonsEn,
  visaTypes as visaTypesEn,
  goldenVisaInsights as goldenVisaInsightsEn,
  emiratiWelfare as emiratiWelfareEn,
  welfareInsight as welfareInsightEn,
  womenStatus as womenStatusEn,
  womenCaveat as womenCaveatEn,
  womenInsights as womenInsightsEn,
  foodCulture as foodCultureEn,
  climateSeasons as climateSeasonsEn,
  climateInsights as climateInsightsEn,
} from '@/data/society/essential-knowledge.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const severityStyles = {
  critical: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  high: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
  medium: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  low: 'bg-accent-green/10 text-accent-green border-accent-green/20',
} as const

const severityLabels = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
} as const

function LawComparisonCards() {
  const lawComparisons = useLocalizedData(lawComparisonsKo, lawComparisonsEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">⚖️</span>
          법률 & 사회 규범 -- 한국과 다른 것들
        </h3>
        <div className="space-y-3">
          {lawComparisons.map((law) => (
            <div
              key={law.category}
              className="p-3.5 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-t1">{law.category}</span>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${severityStyles[law.severity]}`}>
                  {severityLabels[law.severity]}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-gold/5 rounded-md">
                  <div className="text-[9px] text-gold font-bold mb-1 uppercase tracking-wider">UAE</div>
                  <div className="text-[11px] text-t2 leading-snug">{law.uaeRule}</div>
                </div>
                <div className="p-2.5 bg-accent-blue/5 rounded-md">
                  <div className="text-[9px] text-accent-blue font-bold mb-1 uppercase tracking-wider">한국과의 차이</div>
                  <div className="text-[11px] text-t2 leading-snug">{law.koreaDifference}</div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-accent-red/80 flex gap-1.5 items-center">
                <span>!</span>
                <span>위반 시: {law.violation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function VisaCards() {
  const visaTypes = useLocalizedData(visaTypesKo, visaTypesEn)
  const goldenVisaInsights = useLocalizedData(goldenVisaInsightsKo, goldenVisaInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🛂</span>
          비자 & 거주 -- 외국인으로 사는 법
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visaTypes.map((visa) => (
            <div
              key={visa.name}
              className={`p-3.5 rounded-lg border transition-all duration-200 ${
                visa.highlight
                  ? 'bg-gold/5 border-gold/20 shadow-[0_0_16px_rgba(200,164,78,0.06)]'
                  : 'bg-bg/60 border-brd hover:border-brd2'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${visa.highlight ? 'text-gold' : 'text-t1'}`}>
                  {visa.name}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent-green/10 text-accent-green border border-accent-green/15">
                  {visa.duration}
                </span>
              </div>
              <div className="text-[10px] text-t4 mb-1.5">{visa.target}</div>
              <div className="text-[11px] text-t3 leading-snug">{visa.keyCondition}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-gold/5 border border-gold/15 rounded-lg">
          <div className="text-[11px] font-bold text-gold mb-2">Golden Visa가 게임체인저인 이유</div>
          <div className="space-y-1.5">
            {goldenVisaInsights.map((insight) => (
              <div key={insight} className="text-[11px] text-t3 flex gap-2">
                <span className="text-gold shrink-0">&#x2022;</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function WelfareSection() {
  const emiratiWelfare = useLocalizedData(emiratiWelfareKo, emiratiWelfareEn)
  const welfareInsight = useLocalizedData(welfareInsightKo, welfareInsightEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🏠</span>
          에미라티 시민 복지
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {emiratiWelfare.map((item) => (
            <div
              key={item.category}
              className="flex gap-3 p-3 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              <div>
                <div className="text-xs font-bold text-t1">{item.category}</div>
                <div className="text-[11px] text-t3 mt-0.5 leading-snug">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-gold/5 border border-gold/15 rounded-lg">
          <div className="text-[11px] text-t3 leading-snug">{welfareInsight}</div>
        </div>
      </div>
    </Card>
  )
}

function WomenStatusSection() {
  const womenStatus = useLocalizedData(womenStatusKo, womenStatusEn)
  const womenCaveat = useLocalizedData(womenCaveatKo, womenCaveatEn)
  const womenInsights = useLocalizedData(womenInsightsKo, womenInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">👩</span>
          여성의 지위 -- 빠르게 변화 중
        </h3>
        <div className="space-y-2.5">
          {womenStatus.map((item) => (
            <div key={item.category} className="flex gap-3">
              <div className="w-[80px] shrink-0 text-[11px] font-bold text-accent-pink">{item.category}</div>
              <div className="text-[12px] text-t2 leading-snug">{item.status}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-2.5 bg-accent-orange/5 border border-accent-orange/15 rounded-lg flex gap-2 items-start">
          <span className="text-accent-orange text-xs shrink-0">!</span>
          <span className="text-[11px] text-t3">{womenCaveat}</span>
        </div>
        <div className="mt-3 p-3 bg-gold/5 border border-gold/15 rounded-lg">
          <div className="text-[11px] font-bold text-gold mb-2">비즈니스 시사점</div>
          <div className="space-y-1.5">
            {womenInsights.map((insight) => (
              <div key={insight} className="text-[11px] text-t3 flex gap-2">
                <span className="text-gold shrink-0">&#x2022;</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function FoodCultureSection() {
  const foodCulture = useLocalizedData(foodCultureKo, foodCultureEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🍽️</span>
          음식 & 식문화
        </h3>
        <div className="space-y-2.5">
          {foodCulture.map((item) => (
            <div
              key={item.category}
              className="flex gap-3 p-2.5 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <span className="text-base shrink-0">{item.icon}</span>
              <div>
                <span className="text-[11px] font-bold text-t1">{item.category}: </span>
                <span className="text-[11px] text-t3 leading-snug">{item.content}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function ClimateSection() {
  const climateSeasons = useLocalizedData(climateSeasonsKo, climateSeasonsEn)
  const climateInsights = useLocalizedData(climateInsightsKo, climateInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-t1 mb-4 flex items-center gap-2">
          <span className="text-base">🌡️</span>
          기후 & 생활 패턴
        </h3>
        <div className="space-y-3">
          {climateSeasons.map((season) => (
            <div
              key={season.season}
              className="p-3.5 rounded-lg border transition-all duration-200"
              style={{
                background: `${season.color}06`,
                borderColor: `${season.color}20`,
                borderLeftWidth: '3px',
                borderLeftColor: season.color,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{season.icon}</span>
                <div>
                  <div className="text-xs font-bold text-t1">{season.season}</div>
                  <div className="text-[10px] font-mono" style={{ color: season.color }}>{season.temperature}</div>
                </div>
              </div>
              <div className="text-[11px] text-t3 leading-snug">{season.impact}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-gold/5 border border-gold/15 rounded-lg">
          <div className="text-[11px] font-bold text-gold mb-2">비즈니스 시사점</div>
          <div className="space-y-1.5">
            {climateInsights.map((insight) => (
              <div key={insight} className="text-[11px] text-t3 flex gap-2">
                <span className="text-gold shrink-0">&#x2022;</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export function EssentialKnowledge() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <LawComparisonCards />
        <VisaCards />
      </div>
      <Collapsible
        header={
          <div className="flex items-center gap-2.5">
            <span className="text-base">🏠</span>
            <span className="text-sm font-bold text-t1">복지, 여성, 음식, 기후</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <WelfareSection />
          <WomenStatusSection />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FoodCultureSection />
          <ClimateSection />
        </div>
      </Collapsible>
    </div>
  )
}
