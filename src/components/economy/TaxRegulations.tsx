'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import {
  taxTypes as taxTypesKo,
  taxComparison as taxComparisonKo,
  freeZoneBenefits as freeZoneBenefitsKo,
  transferPricingRules as transferPricingRulesKo,
  taxInsights as taxInsightsKo,
  corporateTaxTimeline as corporateTaxTimelineKo,
} from '@/data/economy/tax'
import {
  taxTypes as taxTypesEn,
  taxComparison as taxComparisonEn,
  freeZoneBenefits as freeZoneBenefitsEn,
  transferPricingRules as transferPricingRulesEn,
  taxInsights as taxInsightsEn,
  corporateTaxTimeline as corporateTaxTimelineEn,
} from '@/data/economy/tax.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function TaxOverview() {
  const taxTypes = useLocalizedData(taxTypesKo, taxTypesEn)
  const [expandedTax, setExpandedTax] = useState<string | null>(null)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          UAE 세금 체계
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          2023년 법인세 도입으로 세제 현대화 / 여전히 저세율 국가
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {taxTypes.map((tax) => (
            <div
              key={tax.name}
              className="bg-bg rounded-lg p-3 border border-brd cursor-pointer transition-all duration-200"
              style={{
                borderColor: expandedTax === tax.name ? tax.color + '60' : undefined,
              }}
              onClick={() => setExpandedTax(expandedTax === tax.name ? null : tax.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setExpandedTax(expandedTax === tax.name ? null : tax.name)
                }
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-t3">{tax.name}</span>
                <span className="text-[10px] text-t4">{tax.effectiveDate}</span>
              </div>
              <div
                className="text-2xl font-black font-display"
                style={{ color: tax.color }}
              >
                {tax.rate}
              </div>

              {expandedTax === tax.name && (
                <div className="mt-3 pt-3 border-t border-brd/50 animate-fade-in">
                  <div className="space-y-1 mb-2">
                    {tax.details.map((detail) => (
                      <div key={detail} className="text-[10px] text-t3 flex gap-1.5">
                        <span className="text-t4 shrink-0">-</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                  {tax.exemptions && (
                    <>
                      <div className="text-[10px] text-t4 mt-2 mb-1">면제 사항</div>
                      {tax.exemptions.map((exemption) => (
                        <div key={exemption} className="text-[10px] text-t3 flex gap-1.5">
                          <span style={{ color: tax.color }} className="shrink-0">*</span>
                          <span>{exemption}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function TaxComparisonTable() {
  const taxComparison = useLocalizedData(taxComparisonKo, taxComparisonEn)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          국가별 세율 비교
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          UAE vs 한국 vs 싱가포르 vs 홍콩
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-brd">
                <th className="text-left py-2 px-1.5 text-t4 font-semibold">국가</th>
                <th className="text-center py-2 px-1.5 text-t4 font-semibold">법인세</th>
                <th className="text-center py-2 px-1.5 text-t4 font-semibold">소득세</th>
                <th className="text-center py-2 px-1.5 text-t4 font-semibold">VAT</th>
                <th className="text-center py-2 px-1.5 text-t4 font-semibold">양도세</th>
              </tr>
            </thead>
            <tbody>
              {taxComparison.map((country) => {
                const isUAE = country.country === 'UAE'
                const isHovered = hoveredCountry === country.country

                return (
                  <tr
                    key={country.country}
                    className="border-b border-brd/50 transition-colors duration-200"
                    style={{
                      backgroundColor: isHovered ? 'rgba(200, 164, 78, 0.05)' : isUAE ? 'rgba(200, 164, 78, 0.03)' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredCountry(country.country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  >
                    <td className="py-2.5 px-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{country.flag}</span>
                        <span className={`font-semibold ${isUAE ? 'text-gold' : 'text-t1'}`}>
                          {country.country}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-1.5 text-center font-mono text-t2">{country.corporateTax}</td>
                    <td className="py-2.5 px-1.5 text-center font-mono text-t2">
                      <span className={country.personalIncomeTax === '0%' ? 'text-green-400 font-bold' : ''}>
                        {country.personalIncomeTax}
                      </span>
                    </td>
                    <td className="py-2.5 px-1.5 text-center font-mono text-t2">{country.vat}</td>
                    <td className="py-2.5 px-1.5 text-center font-mono text-t2">
                      <span className={country.capitalGains === '0%' ? 'text-green-400 font-bold' : ''}>
                        {country.capitalGains}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {hoveredCountry && (
          <div className="mt-3 p-2 bg-bg rounded-lg border border-brd text-[10px] text-t3 animate-fade-in">
            {taxComparison.find((c) => c.country === hoveredCountry)?.notes}
          </div>
        )}
      </div>
    </Card>
  )
}

function FreeZoneSection() {
  const freeZoneBenefits = useLocalizedData(freeZoneBenefitsKo, freeZoneBenefitsEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          프리존 세제 혜택
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          40+ 프리존 / 법인세 0% 유지 (적격 소득)
        </p>

        <div className="space-y-2">
          {freeZoneBenefits.map((benefit) => (
            <div key={benefit.benefit} className="flex gap-3 p-2 bg-bg rounded-lg border border-brd">
              <span className="text-lg shrink-0">{benefit.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-t1">{benefit.benefit}</span>
                  <span className="text-[10px] text-gold bg-gold/10 px-1.5 py-0.5 rounded">
                    {benefit.duration}
                  </span>
                </div>
                <p className="text-[11px] text-t3">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function TransferPricingSection() {
  const transferPricingRules = useLocalizedData(transferPricingRulesKo, transferPricingRulesEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          이전가격 (Transfer Pricing)
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          관계사 거래 시 OECD 가이드라인 준수 필요
        </p>

        <div className="space-y-3">
          {transferPricingRules.map((rule) => (
            <div key={rule.title} className="flex gap-3">
              <div className="w-[100px] shrink-0 text-[11px] font-bold text-gold">{rule.title}</div>
              <div className="text-[11px] text-t2 leading-snug">{rule.content}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function TimelineSection() {
  const corporateTaxTimeline = useLocalizedData(corporateTaxTimelineKo, corporateTaxTimelineEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          법인세 도입 타임라인
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          2022년 발표 ~ 2023년 시행
        </p>

        <div className="relative">
          <div className="absolute left-[52px] top-0 bottom-0 w-[2px] bg-gold/20" />
          <div className="space-y-4">
            {corporateTaxTimeline.map((item, index) => (
              <div key={item.year} className="flex gap-3">
                <div className="w-[45px] shrink-0 text-[10px] font-mono text-gold">{item.year}</div>
                <div className="relative">
                  <div
                    className="absolute left-[-8px] top-1 w-3 h-3 rounded-full border-2 border-gold bg-bg3"
                    style={{
                      backgroundColor: index === corporateTaxTimeline.length - 1 ? '#c8a44e' : undefined,
                    }}
                  />
                  <div className="ml-3">
                    <div className="text-xs font-bold text-t1">{item.event}</div>
                    <div className="text-[11px] text-t3">{item.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function InsightsSection() {
  const taxInsights = useLocalizedData(taxInsightsKo, taxInsightsEn)

  return (
    <div className="p-3.5 bg-gold/5 border border-gold/15 rounded-lg">
      <div className="text-[11px] font-bold text-gold mb-2">투자자 시사점</div>
      <div className="space-y-1.5">
        {taxInsights.map((insight) => (
          <div key={insight} className="text-[11px] text-t3 flex gap-2">
            <span className="text-gold shrink-0">&#x2022;</span>
            <span>{insight}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TaxRegulations() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaxOverview />
        <TaxComparisonTable />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FreeZoneSection />
        <div className="space-y-4">
          <TransferPricingSection />
          <TimelineSection />
        </div>
      </div>

      <InsightsSection />
    </div>
  )
}
