'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'

interface UniquenessCardData {
  readonly title: string
  readonly icon: string
  readonly summary: string
  readonly detail: string
  readonly accentColor: string
  readonly gradientFrom: string
}

const uniquenessCards: readonly UniquenessCardData[] = [
  {
    title: '국가 = 기업 = 왕가',
    icon: '👑',
    summary: '삼성이 이재용 소유이고, 이재용이 대통령이며, 삼성 수익이 곧 국가 예산인 구조',
    detail:
      '각 에미리트의 통치 가문이 국가 기업(ADNOC, ICD, Mubadala 등)을 소유하고, 그 수익이 국가 재정으로 직결됩니다. 의사결정 속도가 빠르고, 국가 전략 = 기업 전략 = 통치 가문의 이익이 일치합니다.',
    accentColor: '#c8a44e',
    gradientFrom: 'from-[#c8a44e]/10',
  },
  {
    title: '"국민"의 의미가 다름',
    icon: '👥',
    summary: '에미라티 120만 = 복지 수혜자, 900만 외국인 = 실제 노동력',
    detail:
      '에미라티 국민은 무료 의료, 무료 교육, 주거 보조, 결혼 보조금 등 완전한 복지국가 수혜자입니다. 실제 경제 활동의 대부분은 900만 외국인 노동자가 담당하며, 이들은 시민권 취득이 사실상 불가능합니다.',
    accentColor: '#4a9eff',
    gradientFrom: 'from-[#4a9eff]/10',
  },
  {
    title: '석유가 끝나도 괜찮은 구조',
    icon: '🏦',
    summary: 'SWF 투자 수익으로 국가 운영 가능',
    detail:
      '석유 수입을 국부펀드(SWF)에 투자 → 투자 수익으로 국가 운영. ADIA만 $1.18T이면 연 4% 수익률로 $47B = UAE GDP의 9%에 해당. 석유 없이도 SWF 수익만으로 기본 국가 운영이 가능한 구조입니다.',
    accentColor: '#34d399',
    gradientFrom: 'from-[#34d399]/10',
  },
  {
    title: '세금 없는 대신 수수료',
    icon: '📋',
    summary: '소득세 0%, VAT 5%, 법인세 9% (2023~)',
    detail:
      '개인 소득세 0%, 부가세 5% (2018~), 법인세 9% (2023~, 37.5만 AED 초과분만). 국가 수입의 대부분은 석유 로열티 + SWF 수익 + 부동산/비자 수수료로 구성됩니다. 점진적으로 세원을 확대하는 추세입니다.',
    accentColor: '#a78bfa',
    gradientFrom: 'from-[#a78bfa]/10',
  },
  {
    title: '자유무역지대 모자이크',
    icon: '🏝️',
    summary: '40+ 프리존, 각각 독자 규제 체계',
    detail:
      'DIFC(Dubai 금융), ADGM(Abu Dhabi 금융), JAFZA(물류), DMCC(상품거래) 등 40개 이상의 프리존이 존재합니다. 각 프리존은 독자적 법률, 규제, 세제를 운영하며, 프리존 내에서는 외국인 100% 소유가 가능합니다.',
    accentColor: '#f59e0b',
    gradientFrom: 'from-[#f59e0b]/10',
  },
] as const

function UniquenessCard({ card }: { readonly card: UniquenessCardData }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <div
        className={`relative p-5 bg-gradient-to-br ${card.gradientFrom} to-transparent cursor-pointer transition-all duration-300`}
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
            background: `linear-gradient(90deg, ${card.accentColor}, transparent)`,
          }}
        />
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5 shrink-0">{card.icon}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-t1 mb-1.5">{card.title}</h4>
            <p className="text-xs text-t2 leading-relaxed">{card.summary}</p>
            <div
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{
                maxHeight: isExpanded ? '200px' : '0px',
                opacity: isExpanded ? 1 : 0,
                marginTop: isExpanded ? '12px' : '0px',
              }}
            >
              <div className="text-[11px] text-t3 leading-relaxed border-t border-brd pt-3">
                {card.detail}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span
                className="text-[10px] font-medium transition-colors duration-200"
                style={{ color: card.accentColor }}
              >
                {isExpanded ? '접기' : '자세히 보기'}
              </span>
              <svg
                className="w-3 h-3 transition-transform duration-300"
                style={{
                  color: card.accentColor,
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
        </div>
      </div>
    </Card>
  )
}

export function EconomyUniqueness() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {uniquenessCards.map((card) => (
        <UniquenessCard key={card.title} card={card} />
      ))}
    </div>
  )
}
