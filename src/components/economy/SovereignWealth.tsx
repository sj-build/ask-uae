'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import {
  sovereignWealthFunds as sovereignWealthFundsKo,
  swfInsights as swfInsightsKo,
  governanceStructure as governanceStructureKo,
  investorTips as investorTipsKo,
} from '@/data/economy/sovereign-wealth'
import {
  sovereignWealthFunds as sovereignWealthFundsEn,
  swfInsights as swfInsightsEn,
  governanceStructure as governanceStructureEn,
  investorTips as investorTipsEn,
} from '@/data/economy/sovereign-wealth.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function AUMComparisonChart() {
  const sovereignWealthFunds = useLocalizedData(sovereignWealthFundsKo, sovereignWealthFundsEn)
  const maxAum = Math.max(...sovereignWealthFunds.map((f) => f.aumValue))
  const [hoveredFund, setHoveredFund] = useState<string | null>(null)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          AUM 규모 비교
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          총 SWF 자산 <span className="text-t2 font-semibold">$2.5T+</span> (한국 GDP의 약 1.5배)
        </p>
        <div className="space-y-3">
          {sovereignWealthFunds.map((fund) => {
            const barWidth = (fund.aumValue / maxAum) * 100
            const isHovered = hoveredFund === fund.shortName

            return (
              <div
                key={fund.shortName}
                onMouseEnter={() => setHoveredFund(fund.shortName)}
                onMouseLeave={() => setHoveredFund(null)}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-[80px] shrink-0">
                    <div className="text-xs font-bold text-t1">{fund.shortName}</div>
                    <div className="text-[10px] text-t4">{fund.location}</div>
                  </div>
                  <div className="flex-1 h-[28px] bg-bg rounded-md overflow-hidden relative">
                    <div
                      className="h-full rounded-md flex items-center px-3 transition-all duration-500 ease-out"
                      style={{
                        width: `${barWidth}%`,
                        background: `linear-gradient(90deg, ${fund.color}, ${fund.color}88)`,
                        opacity: isHovered ? 1 : 0.85,
                        boxShadow: isHovered ? `0 0 20px ${fund.color}50` : 'none',
                      }}
                    >
                      <span className="text-[11px] font-bold text-black/80">{fund.aum}</span>
                    </div>
                  </div>
                  <div className="w-[70px] text-right text-[11px] text-t3 shrink-0">
                    {fund.globalRank}
                  </div>
                </div>
                {isHovered && (
                  <div className="ml-[92px] mb-1 text-[10px] text-t3 animate-fade-in">
                    {fund.focusAreas.slice(0, 3).join(' / ')}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

function FundDetailCard({ fund }: { readonly fund: typeof sovereignWealthFundsKo[number] }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <div
        className="p-5 cursor-pointer transition-all duration-300"
        onClick={() => setIsExpanded((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsExpanded((prev) => !prev)
          }
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-[2px]"
          style={{
            background: `linear-gradient(90deg, ${fund.color}, transparent)`,
          }}
        />
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-sm font-bold text-t1">{fund.shortName}</div>
            <div className="text-[10px] text-t4">{fund.name}</div>
          </div>
          <div
            className="text-lg font-bold"
            style={{ color: fund.color }}
          >
            {fund.aum}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {fund.focusAreas.map((area) => (
            <span
              key={area}
              className="text-[10px] px-2 py-0.5 rounded-full border"
              style={{ borderColor: fund.color + '40', color: fund.color }}
            >
              {area}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-t4">설립: </span>
            <span className="text-t2">{fund.founded}</span>
          </div>
          <div>
            <span className="text-t4">순위: </span>
            <span className="text-t2">{fund.globalRank}</span>
          </div>
        </div>

        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: isExpanded ? '200px' : '0px',
            opacity: isExpanded ? 1 : 0,
            marginTop: isExpanded ? '12px' : '0px',
          }}
        >
          <div className="border-t border-brd pt-3 space-y-2">
            <div>
              <div className="text-[10px] text-t4 mb-1">주요 투자</div>
              <div className="text-[11px] text-t2">{fund.keyInvestments.join(', ')}</div>
            </div>
            <div>
              <div className="text-[10px] text-t4 mb-1">거버넌스</div>
              <div className="text-[11px] text-t3">{fund.governance}</div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1">
          <span className="text-[10px] font-medium" style={{ color: fund.color }}>
            {isExpanded ? '접기' : '자세히 보기'}
          </span>
          <svg
            className="w-3 h-3 transition-transform duration-300"
            style={{
              color: fund.color,
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </Card>
  )
}

function InsightsSection() {
  const swfInsights = useLocalizedData(swfInsightsKo, swfInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          SWF 핵심 이해
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {swfInsights.map((insight) => (
            <div
              key={insight.title}
              className="bg-bg rounded-lg p-3 border border-brd"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{insight.icon}</span>
                <span className="text-xs font-bold text-t1">{insight.title}</span>
              </div>
              <p className="text-[11px] text-t3 leading-relaxed">{insight.content}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function GovernanceSection() {
  const governanceStructure = useLocalizedData(governanceStructureKo, governanceStructureEn)
  const investorTips = useLocalizedData(investorTipsKo, investorTipsEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          거버넌스 구조
        </h3>
        <div className="space-y-3 mb-4">
          {governanceStructure.map((item) => (
            <div key={item.label} className="flex gap-3">
              <div className="w-[100px] shrink-0 text-[11px] font-bold text-gold">{item.label}</div>
              <div className="text-[12px] text-t2 leading-snug">{item.content}</div>
            </div>
          ))}
        </div>

        <div className="p-3.5 bg-gold/5 border border-gold/15 rounded-lg">
          <div className="text-[11px] font-bold text-gold mb-2">투자자 시사점</div>
          <div className="space-y-1.5">
            {investorTips.map((tip) => (
              <div key={tip} className="text-[11px] text-t3 flex gap-2">
                <span className="text-gold shrink-0">&#x2022;</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export function SovereignWealth() {
  const sovereignWealthFunds = useLocalizedData(sovereignWealthFundsKo, sovereignWealthFundsEn)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AUMComparisonChart />
        <InsightsSection />
      </div>

      <div>
        <h3 className="text-sm font-bold text-t1 mb-3">주요 국부펀드 상세</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sovereignWealthFunds.map((fund) => (
            <FundDetailCard key={fund.shortName} fund={fund} />
          ))}
        </div>
      </div>

      <GovernanceSection />
    </div>
  )
}
