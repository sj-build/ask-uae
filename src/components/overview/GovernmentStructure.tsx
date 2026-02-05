'use client'

import { useState } from 'react'
import { ChevronDown, Building2, Users, Crown, Briefcase, Globe, Shield, Home } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'

interface GovEntity {
  readonly id: string
  readonly icon: React.ReactNode
  readonly nameKo: string
  readonly nameEn: string
  readonly roleKo: string
  readonly roleEn: string
  readonly detailsKo: readonly string[]
  readonly detailsEn: readonly string[]
  readonly color: string
  readonly highlight?: boolean
}

const FEDERAL_ENTITIES: readonly GovEntity[] = [
  {
    id: 'president',
    icon: <Crown className="w-5 h-5" />,
    nameKo: '대통령',
    nameEn: 'President',
    roleKo: 'Abu Dhabi 통치자 자동 취임',
    roleEn: 'Abu Dhabi ruler auto-appointed',
    detailsKo: ['국가 대표', '군 통수권자', 'FSC 의장', '현: Sheikh Mohamed bin Zayed (MBZ)'],
    detailsEn: ['Head of State', 'Commander-in-Chief', 'FSC Chairman', 'Current: Sheikh Mohamed bin Zayed (MBZ)'],
    color: '#c8a44e',
  },
  {
    id: 'vp',
    icon: <Briefcase className="w-5 h-5" />,
    nameKo: '부통령 겸 총리',
    nameEn: 'Vice President & PM',
    roleKo: 'Dubai 통치자 자동 취임',
    roleEn: 'Dubai ruler auto-appointed',
    detailsKo: ['정부 수반', '내각 구성', '행정 총괄', '현: Sheikh Mohammed bin Rashid (MBR)'],
    detailsEn: ['Head of Government', 'Cabinet formation', 'Administrative oversight', 'Current: Sheikh Mohammed bin Rashid (MBR)'],
    color: '#ef4444',
  },
  {
    id: 'fsc',
    icon: <Users className="w-5 h-5" />,
    nameKo: '최고연방위원회 (FSC)',
    nameEn: 'Federal Supreme Council',
    roleKo: 'UAE 최고 의사결정 기구',
    roleEn: 'Supreme decision-making body',
    detailsKo: ['7명의 통치자로 구성', '연방 법률/예산/조약 승인', 'Abu Dhabi + Dubai 거부권', '장관 임명 승인'],
    detailsEn: ['7 rulers compose it', 'Approves laws/budget/treaties', 'AD + Dubai have veto power', 'Approves minister appointments'],
    color: '#a78bfa',
    highlight: true,
  },
  {
    id: 'fnc',
    icon: <Building2 className="w-5 h-5" />,
    nameKo: '연방국가평의회 (FNC)',
    nameEn: 'Federal National Council',
    roleKo: '자문 기능만 (거부권 없음)',
    roleEn: 'Advisory only (no veto)',
    detailsKo: ['40명 (20명 임명, 20명 간선)', '법률 제안 가능', '정부 질의권', '실질적 권한 제한'],
    detailsEn: ['40 members (20 appointed, 20 elected)', 'Can propose laws', 'Can question government', 'Limited actual power'],
    color: '#f59e0b',
  },
  {
    id: 'cabinet',
    icon: <Briefcase className="w-5 h-5" />,
    nameKo: '각료회의 (Cabinet)',
    nameEn: 'Cabinet',
    roleKo: '행정 집행 기관',
    roleEn: 'Executive body',
    detailsKo: ['총리가 장관 임명 (FSC 승인)', '외교부, 국방부, 재무부 등', '연방 정책 집행', '부처 간 조정'],
    detailsEn: ['PM appoints ministers (FSC approval)', 'Foreign, Defense, Finance ministries', 'Federal policy execution', 'Inter-ministry coordination'],
    color: '#22d3ee',
  },
]

const LOCAL_ENTITIES: readonly GovEntity[] = [
  {
    id: 'ruler',
    icon: <Crown className="w-5 h-5" />,
    nameKo: '통치자 (Ruler)',
    nameEn: 'Ruler',
    roleKo: '에미리트 최고 권력자',
    roleEn: 'Supreme authority in emirate',
    detailsKo: ['세습 왕정', '종신 통치', '지방 법률 최종 승인', '모든 주요 인사권'],
    detailsEn: ['Hereditary monarchy', 'Lifetime rule', 'Final approval of local laws', 'All major appointments'],
    color: '#c8a44e',
  },
  {
    id: 'cp',
    icon: <Crown className="w-5 h-5" />,
    nameKo: '왕세자 (Crown Prince)',
    nameEn: 'Crown Prince',
    roleKo: '실질적 일상 총괄',
    roleEn: 'Day-to-day management',
    detailsKo: ['통치자 대리 역할', '주요 프로젝트 감독', '해외 투자 유치', '차기 통치자'],
    detailsEn: ['Acts on ruler\'s behalf', 'Oversees major projects', 'Foreign investment', 'Next ruler'],
    color: '#a78bfa',
  },
  {
    id: 'exec',
    icon: <Users className="w-5 h-5" />,
    nameKo: '행정위원회 (Executive Council)',
    nameEn: 'Executive Council',
    roleKo: '지방 정책 결정',
    roleEn: 'Local policy decisions',
    detailsKo: ['왕족 + 고위 관료로 구성', '개발 계획 수립', '예산 배분', '프로젝트 승인'],
    detailsEn: ['Royals + senior officials', 'Development planning', 'Budget allocation', 'Project approvals'],
    color: '#22d3ee',
  },
  {
    id: 'depts',
    icon: <Home className="w-5 h-5" />,
    nameKo: '각 부서',
    nameEn: 'Departments',
    roleKo: '실제 서비스 제공',
    roleEn: 'Actual service delivery',
    detailsKo: ['경제청, 교육청, 보건청', '관광청, 경찰, 토지청', '부동산, 상업 라이센스', '비자/노동허가'],
    detailsEn: ['Economy, Education, Health', 'Tourism, Police, Land', 'Real estate, business licenses', 'Visas/work permits'],
    color: '#34d399',
  },
]

function EntityCard({ entity, isExpanded, onToggle, locale }: {
  readonly entity: GovEntity
  readonly isExpanded: boolean
  readonly onToggle: () => void
  readonly locale: string
}) {
  const name = locale === 'en' ? entity.nameEn : entity.nameKo
  const role = locale === 'en' ? entity.roleEn : entity.roleKo
  const details = locale === 'en' ? entity.detailsEn : entity.detailsKo

  return (
    <div
      className={`
        group relative rounded-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden
        ${isExpanded
          ? 'shadow-lg'
          : 'hover:shadow-md'
        }
        ${entity.highlight ? 'ring-2 ring-gold/30' : ''}
      `}
      style={{
        borderColor: isExpanded ? entity.color : 'transparent',
        backgroundColor: isExpanded ? `${entity.color}10` : 'var(--bg3)',
      }}
      onClick={onToggle}
    >
      {/* Top accent */}
      <div className="h-1 w-full" style={{ backgroundColor: entity.color }} />

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${entity.color}20`, color: entity.color }}
            >
              {entity.icon}
            </div>
            <div>
              <h4 className="text-[14px] font-bold" style={{ color: isExpanded ? entity.color : 'var(--t1)' }}>
                {name}
              </h4>
              <p className="text-[11px] text-t4">{role}</p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            style={{ color: isExpanded ? entity.color : 'var(--t4)' }}
          />
        </div>

        {/* Expanded Content */}
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-2 pt-3 border-t" style={{ borderColor: `${entity.color}30` }}>
            {details.map((detail, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: entity.color }} />
                <span className="text-[13px] text-t2">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlight badge for FSC */}
      {entity.highlight && (
        <div className="absolute -top-1 -right-1 px-2 py-0.5 bg-gold text-bg1 text-[9px] font-bold rounded-full">
          {locale === 'en' ? 'SUPREME' : '최고권력'}
        </div>
      )}
    </div>
  )
}

export function GovernmentStructure() {
  const { locale } = useLocale()
  const [expandedFederal, setExpandedFederal] = useState<string | null>(null)
  const [expandedLocal, setExpandedLocal] = useState<string | null>(null)

  return (
    <div className="space-y-6 mb-6">
      {/* Federal Government */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-gold" />
          <h3 className="text-[15px] font-bold text-t1">
            {locale === 'en' ? 'Federal Government' : '연방 정부 (Federal Government)'}
          </h3>
          <span className="text-[11px] text-t4 ml-2">
            {locale === 'en' ? '— Foreign affairs, defense, immigration, currency' : '— 외교, 국방, 이민, 화폐'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEDERAL_ENTITIES.map((entity) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              isExpanded={expandedFederal === entity.id}
              onToggle={() => setExpandedFederal(expandedFederal === entity.id ? null : entity.id)}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* Local Government */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-5 h-5 text-accent-cyan" />
          <h3 className="text-[15px] font-bold text-t1">
            {locale === 'en' ? 'Emirate Government (Local)' : '에미리트 정부 (지방)'}
          </h3>
          <span className="text-[11px] text-t4 ml-2">
            {locale === 'en' ? '— Real estate, police, health, education, tourism' : '— 부동산, 경찰, 보건, 교육, 관광'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LOCAL_ENTITIES.map((entity) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              isExpanded={expandedLocal === entity.id}
              onToggle={() => setExpandedLocal(expandedLocal === entity.id ? null : entity.id)}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-gold/10 via-bg2 to-accent-cyan/10 border border-gold/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[14px] font-bold text-gold mb-2">
              {locale === 'en' ? 'Key Point for Business' : '비즈니스 핵심 포인트'}
            </h4>
            <p className="text-[13px] text-t2 leading-relaxed">
              {locale === 'en'
                ? 'Federal government handles big picture (foreign policy, defense). Daily business dealings are with Emirate governments. Always check BOTH federal law AND emirate regulations. Free zones have their own rules on top of these.'
                : '연방 정부는 큰 그림 (외교, 국방). 일상적 비즈니스는 에미리트 정부와 진행. 연방법과 에미리트 규정 둘 다 확인 필수. 프리존은 또 별도 규정이 있다.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
