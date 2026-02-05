'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import {
  workforceComposition as workforceCompositionKo,
  sectorEmployment as sectorEmploymentKo,
  emiratizationRules as emiratizationRulesKo,
  laborLawUpdates as laborLawUpdatesKo,
  wpsInfo as wpsInfoKo,
  laborInsights as laborInsightsKo,
} from '@/data/economy/labor'
import {
  workforceComposition as workforceCompositionEn,
  sectorEmployment as sectorEmploymentEn,
  emiratizationRules as emiratizationRulesEn,
  laborLawUpdates as laborLawUpdatesEn,
  wpsInfo as wpsInfoEn,
  laborInsights as laborInsightsEn,
} from '@/data/economy/labor.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function WorkforceBreakdownChart() {
  const workforceComposition = useLocalizedData(workforceCompositionKo, workforceCompositionEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          노동력 구성
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          총 노동인구 <span className="text-t2 font-semibold">~6M</span> / 외국인 비율 세계 3위
        </p>

        <div className="flex gap-2 mb-4">
          {workforceComposition.map((item) => (
            <div
              key={item.category}
              className="flex-1 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
              style={{
                backgroundColor: item.color,
                width: `${item.percentage}%`,
                color: item.percentage > 50 ? 'white' : 'black',
              }}
            >
              {item.percentage}%
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {workforceComposition.map((item) => (
            <div key={item.category} className="flex items-start gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0 mt-0.5"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <div className="text-xs font-bold text-t1">{item.category}</div>
                <div className="text-[11px] text-t3 mt-0.5">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function SectorEmploymentTable() {
  const sectorEmployment = useLocalizedData(sectorEmploymentKo, sectorEmploymentEn)
  const [hoveredSector, setHoveredSector] = useState<string | null>(null)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          업종별 고용 & 급여
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          업종별 고용 비중 및 평균 급여 범위 (AED/월)
        </p>

        <div className="space-y-2">
          {sectorEmployment.map((sector) => {
            const isHovered = hoveredSector === sector.sector

            return (
              <div
                key={sector.sector}
                className="bg-bg rounded-lg p-3 border border-brd transition-all duration-200"
                style={{
                  borderColor: isHovered ? sector.color + '60' : undefined,
                  boxShadow: isHovered ? `0 0 15px ${sector.color}20` : 'none',
                }}
                onMouseEnter={() => setHoveredSector(sector.sector)}
                onMouseLeave={() => setHoveredSector(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: sector.color }}
                    />
                    <span className="text-xs font-bold text-t1">{sector.sector}</span>
                  </div>
                  <span className="text-[10px] text-t4">{sector.employmentShare}% 고용</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-t4">평균 급여: </span>
                    <span className="text-t2 font-mono">{sector.averageSalary}</span>
                  </div>
                  <div>
                    <span className="text-t4">에미라티화: </span>
                    <span
                      className="font-semibold"
                      style={{ color: sector.emiratizationRate === '90%+' ? '#c8a44e' : sector.color }}
                    >
                      {sector.emiratizationRate}
                    </span>
                  </div>
                </div>

                {isHovered && (
                  <div className="mt-2 pt-2 border-t border-brd/50 animate-fade-in">
                    <div className="text-[10px] text-t4">주요 직종</div>
                    <div className="text-[11px] text-t3">{sector.keyRoles.join(', ')}</div>
                    <div className="text-[10px] text-t4 mt-1">시니어 급여</div>
                    <div className="text-[11px] text-t2 font-mono">{sector.salaryRangeAED}</div>
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

function EmiraitizationSection() {
  const emiratizationRules = useLocalizedData(emiratizationRulesKo, emiratizationRulesEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          에미라티화 (Emiratization)
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          민간 기업 에미라티 고용 의무화 정책
        </p>

        <div className="space-y-3">
          {emiratizationRules.map((rule) => (
            <div key={rule.title} className="bg-bg rounded-lg p-3 border border-brd">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-t1">{rule.title}</span>
              </div>
              <p className="text-[11px] text-t2 leading-relaxed">{rule.content}</p>
              {rule.penalty && (
                <div className="mt-2 text-[10px] text-accent-orange bg-accent-orange/10 px-2 py-1 rounded inline-block">
                  {rule.penalty}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-gold/5 border border-gold/15 rounded-lg">
          <div className="text-[11px] font-bold text-gold mb-1">2026년 목표</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-gold/60"
                style={{ width: '60%' }}
              />
            </div>
            <span className="text-[11px] text-gold font-semibold">10%</span>
          </div>
          <div className="text-[10px] text-t4 mt-1">50인+ 기업 숙련노동자 기준</div>
        </div>
      </div>
    </Card>
  )
}

function LaborLawsSection() {
  const laborLawUpdates = useLocalizedData(laborLawUpdatesKo, laborLawUpdatesEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          노동법 주요 업데이트
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          2021년 대폭 개정, 지속적 현대화 진행 중
        </p>

        <div className="space-y-3">
          {laborLawUpdates.map((law) => (
            <div key={law.topic} className="flex gap-3">
              <span className="text-lg shrink-0">{law.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-t1">{law.topic}</span>
                  <span className="text-[10px] text-gold bg-gold/10 px-2 py-0.5 rounded">
                    {law.effectiveDate}
                  </span>
                </div>
                <p className="text-[11px] text-t3 leading-relaxed">{law.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function WPSSection() {
  const wpsInfo = useLocalizedData(wpsInfoKo, wpsInfoEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          WPS (임금보호시스템)
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          모든 급여 지급 의무 등록 시스템
        </p>

        <div className="space-y-2">
          {wpsInfo.map((item) => (
            <div key={item.label} className="flex gap-3">
              <div className="w-[80px] shrink-0 text-[11px] font-bold text-gold">{item.label}</div>
              <div className="text-[11px] text-t2 leading-snug">{item.content}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function InsightsSection() {
  const laborInsights = useLocalizedData(laborInsightsKo, laborInsightsEn)

  return (
    <div className="p-3.5 bg-gold/5 border border-gold/15 rounded-lg">
      <div className="text-[11px] font-bold text-gold mb-2">투자자 시사점</div>
      <div className="space-y-1.5">
        {laborInsights.map((insight) => (
          <div key={insight} className="text-[11px] text-t3 flex gap-2">
            <span className="text-gold shrink-0">&#x2022;</span>
            <span>{insight}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LaborMarket() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WorkforceBreakdownChart />
        <EmiraitizationSection />
      </div>

      <SectorEmploymentTable />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LaborLawsSection />
        <WPSSection />
      </div>

      <InsightsSection />
    </div>
  )
}
