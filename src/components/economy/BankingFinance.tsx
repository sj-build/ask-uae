'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import {
  majorBanks as majorBanksKo,
  islamicBankingInfo as islamicBankingInfoKo,
  financialHubs as financialHubsKo,
  fintechRegulations as fintechRegulationsKo,
  bankingInsights as bankingInsightsKo,
} from '@/data/economy/banking'
import {
  majorBanks as majorBanksEn,
  islamicBankingInfo as islamicBankingInfoEn,
  financialHubs as financialHubsEn,
  fintechRegulations as fintechRegulationsEn,
  bankingInsights as bankingInsightsEn,
} from '@/data/economy/banking.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'

function BankComparisonTable() {
  const majorBanks = useLocalizedData(majorBanksKo, majorBanksEn)
  const [hoveredBank, setHoveredBank] = useState<string | null>(null)

  const getBankTypeLabel = (type: string) => {
    switch (type) {
      case 'conventional':
        return '일반'
      case 'islamic':
        return '이슬람'
      case 'hybrid':
        return '복합'
      default:
        return type
    }
  }

  const getBankTypeColor = (type: string) => {
    switch (type) {
      case 'conventional':
        return '#4a9eff'
      case 'islamic':
        return '#34d399'
      case 'hybrid':
        return '#a78bfa'
      default:
        return '#6b7280'
    }
  }

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          주요 은행 비교
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          UAE 은행 총자산 <span className="text-t2 font-semibold">$1T+</span>
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-brd">
                <th className="text-left py-2 px-2 text-t4 font-semibold">은행</th>
                <th className="text-left py-2 px-2 text-t4 font-semibold">총자산</th>
                <th className="text-left py-2 px-2 text-t4 font-semibold">유형</th>
                <th className="text-left py-2 px-2 text-t4 font-semibold">소유</th>
                <th className="text-left py-2 px-2 text-t4 font-semibold hidden sm:table-cell">본사</th>
              </tr>
            </thead>
            <tbody>
              {majorBanks.map((bank) => (
                <tr
                  key={bank.shortName}
                  className="border-b border-brd/50 transition-colors duration-200"
                  style={{
                    backgroundColor: hoveredBank === bank.shortName ? 'rgba(200, 164, 78, 0.05)' : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredBank(bank.shortName)}
                  onMouseLeave={() => setHoveredBank(null)}
                >
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: bank.color }}
                      />
                      <div>
                        <div className="font-bold text-t1">{bank.shortName}</div>
                        <div className="text-[10px] text-t4">{bank.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 font-mono font-semibold" style={{ color: bank.color }}>
                    {bank.totalAssets}
                  </td>
                  <td className="py-2.5 px-2">
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{
                        backgroundColor: getBankTypeColor(bank.type) + '20',
                        color: getBankTypeColor(bank.type),
                      }}
                    >
                      {getBankTypeLabel(bank.type)}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-t3">{bank.ownership}</td>
                  <td className="py-2.5 px-2 text-t3 hidden sm:table-cell">{bank.headquarters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hoveredBank && (
          <div className="mt-3 p-3 bg-bg rounded-lg border border-brd animate-fade-in">
            <div className="text-[11px] text-t2">
              {majorBanks.find((b) => b.shortName === hoveredBank)?.characteristics.join(' / ')}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

function IslamicBankingSection() {
  const islamicBankingInfo = useLocalizedData(islamicBankingInfoKo, islamicBankingInfoEn)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          이슬람 금융 (Islamic Banking)
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          UAE 은행 자산의 <span className="text-t2 font-semibold">~25%</span> / Sharia 준수 금융
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {islamicBankingInfo.map((info) => (
            <div
              key={info.title}
              className="bg-bg rounded-lg p-3 border border-brd"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{info.icon}</span>
                <span className="text-xs font-bold text-t1">{info.title}</span>
              </div>
              <p className="text-[11px] text-t3 leading-relaxed">{info.content}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function FinancialHubCard({ hub }: { readonly hub: typeof financialHubsKo[number] }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <div
        className="p-5 cursor-pointer"
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
            background: `linear-gradient(90deg, ${hub.color}, transparent)`,
          }}
        />
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-lg font-bold" style={{ color: hub.color }}>
              {hub.name}
            </div>
            <div className="text-[10px] text-t4">{hub.fullName}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-t1">{hub.registeredEntities}</div>
            <div className="text-[10px] text-t4">등록 기업</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
          <div>
            <span className="text-t4">위치: </span>
            <span className="text-t2">{hub.location}</span>
          </div>
          <div>
            <span className="text-t4">설립: </span>
            <span className="text-t2">{hub.founded}</span>
          </div>
        </div>

        <div className="text-[11px] text-t3 mb-3">
          <span className="text-t4">법률 체계: </span>
          {hub.legalSystem}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {hub.keyFeatures.slice(0, isExpanded ? undefined : 2).map((feature) => (
            <span
              key={feature}
              className="text-[10px] px-2 py-0.5 rounded-full bg-bg border border-brd text-t2"
            >
              {feature}
            </span>
          ))}
        </div>

        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: isExpanded ? '150px' : '0px',
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div className="border-t border-brd pt-3 mt-2">
            <div className="text-[10px] text-t4 mb-1">규제 기관</div>
            <div className="text-[11px] text-t2">{hub.regulators.join(', ')}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <span className="text-[10px] font-medium" style={{ color: hub.color }}>
            {isExpanded ? '접기' : '더보기'}
          </span>
          <svg
            className="w-3 h-3 transition-transform duration-300"
            style={{
              color: hub.color,
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

function FinancialHubsSection() {
  const financialHubs = useLocalizedData(financialHubsKo, financialHubsEn)

  return (
    <div>
      <h3 className="text-sm font-bold text-t1 mb-3">금융 허브 (DIFC & ADGM)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {financialHubs.map((hub) => (
          <FinancialHubCard key={hub.name} hub={hub} />
        ))}
      </div>
    </div>
  )
}

function FintechSection() {
  const fintechRegulations = useLocalizedData(fintechRegulationsKo, fintechRegulationsEn)

  const getStatusColor = (status: string) => {
    if (status.includes('확립') || status.includes('established')) return '#34d399'
    if (status.includes('성장') || status.includes('Growing') || status.includes('Rapid')) return '#4a9eff'
    return '#f59e0b'
  }

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          핀테크 & 암호화폐 규제
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          중동 최초 암호화폐 규제 프레임워크 확립 / 핀테크 생태계 급성장
        </p>

        <div className="space-y-3">
          {fintechRegulations.map((reg) => (
            <div key={reg.topic} className="bg-bg rounded-lg p-3 border border-brd">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-t1">{reg.topic}</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: getStatusColor(reg.status) + '20',
                    color: getStatusColor(reg.status),
                  }}
                >
                  {reg.status}
                </span>
              </div>
              <p className="text-[11px] text-t3 leading-relaxed">{reg.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function InsightsSection() {
  const bankingInsights = useLocalizedData(bankingInsightsKo, bankingInsightsEn)

  return (
    <div className="p-3.5 bg-gold/5 border border-gold/15 rounded-lg">
      <div className="text-[11px] font-bold text-gold mb-2">투자자 시사점</div>
      <div className="space-y-1.5">
        {bankingInsights.map((insight) => (
          <div key={insight} className="text-[11px] text-t3 flex gap-2">
            <span className="text-gold shrink-0">&#x2022;</span>
            <span>{insight}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BankingFinance() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BankComparisonTable />
        <IslamicBankingSection />
      </div>

      <FinancialHubsSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FintechSection />
        <div className="flex flex-col justify-end">
          <InsightsSection />
        </div>
      </div>
    </div>
  )
}
