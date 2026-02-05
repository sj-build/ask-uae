'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Crown, Building2, Users, Scale, Newspaper, Timer } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'

interface ComparisonItem {
  readonly id: string
  readonly icon: React.ReactNode
  readonly titleKo: string
  readonly titleEn: string
  readonly koreaKo: string
  readonly koreaEn: string
  readonly uaeKo: string
  readonly uaeEn: string
  readonly insightKo: string
  readonly insightEn: string
}

const COMPARISONS: readonly ComparisonItem[] = [
  {
    id: 'leadership',
    icon: <Crown className="w-5 h-5" />,
    titleKo: '권력 구조',
    titleEn: 'Power Structure',
    koreaKo: '삼권분립, 직선제, 5년 단임',
    koreaEn: 'Separation of powers, direct election, 5-year single term',
    uaeKo: '왕정 세습, 종신 통치',
    uaeEn: 'Hereditary monarchy, lifetime rule',
    insightKo: '50년 단위 정책 일관성 → 장기 투자에 유리',
    insightEn: '50-year policy consistency → favorable for long-term investment',
  },
  {
    id: 'business',
    icon: <Building2 className="w-5 h-5" />,
    titleKo: '정부-기업 관계',
    titleEn: 'Gov-Business Relations',
    koreaKo: '재벌과 정부는 견제 관계',
    koreaEn: 'Chaebols and government check each other',
    uaeKo: '왕족 = 정부 = 기업 오너',
    uaeEn: 'Royal family = Government = Business owner',
    insightKo: '이해충돌 개념 없음 → 빠른 의사결정',
    insightEn: 'No conflict of interest concept → rapid decisions',
  },
  {
    id: 'citizens',
    icon: <Users className="w-5 h-5" />,
    titleKo: '국민 지위',
    titleEn: 'Citizen Status',
    koreaKo: '국민이 주권자, 평등한 권리',
    koreaEn: 'Citizens are sovereign, equal rights',
    uaeKo: '120만 자국민 = "주주", 900만 외국인 = "직원"',
    uaeEn: '1.2M nationals = "shareholders", 9M expats = "employees"',
    insightKo: '외국인은 투표권 없음, 노동력 제공자',
    insightEn: 'Expats have no voting rights, labor providers',
  },
  {
    id: 'legislature',
    icon: <Scale className="w-5 h-5" />,
    titleKo: '입법부',
    titleEn: 'Legislature',
    koreaKo: '국회가 법률 제정, 대통령 견제',
    koreaEn: 'National Assembly legislates, checks president',
    uaeKo: 'FNC는 자문기관일 뿐, 거부권 없음',
    uaeEn: 'FNC is advisory only, no veto power',
    insightKo: '실질 결정은 7명의 왕이 하는 FSC에서',
    insightEn: 'Real decisions made by 7 rulers in FSC',
  },
  {
    id: 'media',
    icon: <Newspaper className="w-5 h-5" />,
    titleKo: '언론',
    titleEn: 'Media',
    koreaKo: '언론 자유, 정부 비판 가능',
    koreaEn: 'Press freedom, can criticize government',
    uaeKo: '언론 통제, 왕실 비판 금지',
    uaeEn: 'Media control, criticism of royals prohibited',
    insightKo: 'SNS 발언도 주의 필요',
    insightEn: 'Social media posts require caution',
  },
  {
    id: 'policy',
    icon: <Timer className="w-5 h-5" />,
    titleKo: '정책 연속성',
    titleEn: 'Policy Continuity',
    koreaKo: '정권 교체 시 정책 급변 가능',
    koreaEn: 'Policy changes with administration',
    uaeKo: '통치자 불변 → 장기 비전 실행',
    uaeEn: 'Ruler unchanged → long-term vision execution',
    insightKo: 'Vision 2030, 2050 계획 신뢰도 높음',
    insightEn: 'Vision 2030, 2050 plans highly credible',
  },
]

function ComparisonCard({ item, isExpanded, onToggle, locale }: {
  readonly item: ComparisonItem
  readonly isExpanded: boolean
  readonly onToggle: () => void
  readonly locale: string
}) {
  const title = locale === 'en' ? item.titleEn : item.titleKo
  const korea = locale === 'en' ? item.koreaEn : item.koreaKo
  const uae = locale === 'en' ? item.uaeEn : item.uaeKo
  const insight = locale === 'en' ? item.insightEn : item.insightKo

  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer
        ${isExpanded
          ? 'bg-bg2 border-gold/40 shadow-lg shadow-gold/5'
          : 'bg-bg3 border-brd hover:border-gold/30 hover:bg-bg2'
        }
      `}
      onClick={onToggle}
    >
      {/* Accent line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold/40 via-gold/20 to-transparent" />

      {/* Content */}
      <div className="p-4">
        {/* Header with icon and title */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold/15 text-gold">
              {item.icon}
            </div>
            <span className="font-bold text-[13px] text-gold">{title}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-t4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Always visible: Korea vs UAE comparison */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs">🇰🇷</span>
              <span className="text-[9px] font-bold text-accent-blue">KOREA</span>
            </div>
            <p className="text-[11px] text-t2 leading-snug">{korea}</p>
          </div>
          <div className="bg-gold/10 border border-gold/20 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs">🇦🇪</span>
              <span className="text-[9px] font-bold text-gold">UAE</span>
            </div>
            <p className="text-[11px] text-t2 leading-snug">{uae}</p>
          </div>
        </div>

        {/* Expandable: Insight */}
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
            <span className="text-xs">💡</span>
            <p className="text-[11px] text-emerald-400 leading-snug font-medium">{insight}</p>
          </div>
        </div>

        {/* Collapsed hint */}
        {!isExpanded && (
          <div className="text-[10px] text-t4 text-center mt-1">
            {locale === 'en' ? 'Click for insight' : '클릭하여 시사점 보기'}
          </div>
        )}
      </div>
    </div>
  )
}

function StructureDiagram({ locale }: { readonly locale: string }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const nodes = {
    fsc: {
      titleKo: '최고위원회 (FSC)',
      titleEn: 'Federal Supreme Council',
      descKo: '7명의 통치자, 실질 최고 권력',
      descEn: '7 Rulers, ultimate power',
    },
    president: {
      titleKo: '대통령',
      titleEn: 'President',
      descKo: 'Abu Dhabi 통치자가 자동 선출',
      descEn: 'Auto-elected Abu Dhabi ruler',
    },
    vp: {
      titleKo: '부통령 겸 총리',
      titleEn: 'VP & Prime Minister',
      descKo: 'Dubai 통치자가 자동 선출',
      descEn: 'Auto-elected Dubai ruler',
    },
    cabinet: {
      titleKo: '내각',
      titleEn: 'Cabinet',
      descKo: '총리가 임명, 행정 집행',
      descEn: 'Appointed by PM, execution',
    },
    fnc: {
      titleKo: '연방국가평의회 (FNC)',
      titleEn: 'Federal National Council',
      descKo: '40명 자문기관, 거부권 없음',
      descEn: '40 members, advisory only',
    },
  }

  return (
    <div className="bg-bg2 border border-brd rounded-xl p-6 mb-6">
      <h4 className="text-[13px] font-bold text-t1 mb-6 text-center">
        {locale === 'en' ? '🏛️ Federal Structure' : '🏛️ 연방 구조'}
      </h4>

      {/* Visual Hierarchy */}
      <div className="flex flex-col items-center gap-4">
        {/* FSC - Top */}
        <div
          className={`
            relative px-6 py-4 rounded-xl border-2 cursor-pointer transition-all duration-300 w-full max-w-md
            ${hoveredNode === 'fsc'
              ? 'bg-gold/20 border-gold shadow-lg shadow-gold/20 scale-105'
              : 'bg-gold/10 border-gold/40 hover:bg-gold/15'
            }
          `}
          onMouseEnter={() => setHoveredNode('fsc')}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <div className="flex items-center justify-center gap-2">
            <Crown className="w-5 h-5 text-gold" />
            <span className="font-bold text-gold">{locale === 'en' ? nodes.fsc.titleEn : nodes.fsc.titleKo}</span>
          </div>
          <p className="text-[10px] text-center text-t3 mt-1">
            {locale === 'en' ? nodes.fsc.descEn : nodes.fsc.descKo}
          </p>
          {/* Veto badge */}
          <div className="absolute -right-2 -top-2 px-2 py-0.5 bg-accent-red text-white text-[9px] font-bold rounded-full">
            {locale === 'en' ? 'VETO POWER' : '거부권'}
          </div>
        </div>

        {/* Connecting line */}
        <div className="w-px h-4 bg-gradient-to-b from-gold/40 to-t4/40" />

        {/* President & VP - Middle */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          <div
            className={`
              px-4 py-3 rounded-xl border cursor-pointer transition-all duration-300 text-center
              ${hoveredNode === 'president'
                ? 'bg-accent-purple/20 border-accent-purple shadow-lg scale-105'
                : 'bg-accent-purple/10 border-accent-purple/30 hover:bg-accent-purple/15'
              }
            `}
            onMouseEnter={() => setHoveredNode('president')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div className="text-[12px] font-bold text-accent-purple">
              {locale === 'en' ? nodes.president.titleEn : nodes.president.titleKo}
            </div>
            <p className="text-[9px] text-t4 mt-1">{locale === 'en' ? nodes.president.descEn : nodes.president.descKo}</p>
            <div className="mt-2 text-[10px] text-accent-purple/80">🇦🇪 Abu Dhabi</div>
          </div>

          <div
            className={`
              px-4 py-3 rounded-xl border cursor-pointer transition-all duration-300 text-center
              ${hoveredNode === 'vp'
                ? 'bg-accent-cyan/20 border-accent-cyan shadow-lg scale-105'
                : 'bg-accent-cyan/10 border-accent-cyan/30 hover:bg-accent-cyan/15'
              }
            `}
            onMouseEnter={() => setHoveredNode('vp')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div className="text-[12px] font-bold text-accent-cyan">
              {locale === 'en' ? nodes.vp.titleEn : nodes.vp.titleKo}
            </div>
            <p className="text-[9px] text-t4 mt-1">{locale === 'en' ? nodes.vp.descEn : nodes.vp.descKo}</p>
            <div className="mt-2 text-[10px] text-accent-cyan/80">🏙️ Dubai</div>
          </div>
        </div>

        {/* Connecting lines */}
        <div className="flex items-center gap-8">
          <div className="w-px h-4 bg-t4/40" />
          <div className="w-px h-4 bg-t4/40" />
        </div>

        {/* Cabinet & FNC - Bottom */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          <div
            className={`
              px-4 py-3 rounded-xl border cursor-pointer transition-all duration-300 text-center
              ${hoveredNode === 'cabinet'
                ? 'bg-emerald-500/20 border-emerald-500 shadow-lg scale-105'
                : 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15'
              }
            `}
            onMouseEnter={() => setHoveredNode('cabinet')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div className="text-[12px] font-bold text-emerald-400">
              {locale === 'en' ? nodes.cabinet.titleEn : nodes.cabinet.titleKo}
            </div>
            <p className="text-[9px] text-t4 mt-1">{locale === 'en' ? nodes.cabinet.descEn : nodes.cabinet.descKo}</p>
          </div>

          <div
            className={`
              relative px-4 py-3 rounded-xl border cursor-pointer transition-all duration-300 text-center
              ${hoveredNode === 'fnc'
                ? 'bg-amber-500/20 border-amber-500 shadow-lg scale-105'
                : 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15'
              }
            `}
            onMouseEnter={() => setHoveredNode('fnc')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div className="text-[12px] font-bold text-amber-400">
              {locale === 'en' ? nodes.fnc.titleEn : nodes.fnc.titleKo}
            </div>
            <p className="text-[9px] text-t4 mt-1">{locale === 'en' ? nodes.fnc.descEn : nodes.fnc.descKo}</p>
            {/* Advisory badge */}
            <div className="absolute -right-2 -top-2 px-2 py-0.5 bg-amber-500/80 text-white text-[8px] font-bold rounded-full">
              {locale === 'en' ? 'ADVISORY' : '자문'}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-brd flex flex-wrap justify-center gap-4 text-[10px] text-t4">
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gold/30" />
          {locale === 'en' ? 'Supreme Authority' : '최고 권력'}
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-accent-purple/30" />
          Abu Dhabi
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-accent-cyan/30" />
          Dubai
        </span>
      </div>
    </div>
  )
}

function QuickComparisonHeader({ locale }: { readonly locale: string }) {
  return (
    <div className="bg-bg2 border border-brd rounded-xl p-5 mb-4">
      <h4 className="text-[14px] font-bold text-t1 mb-4 text-center">
        {locale === 'en' ? '🇰🇷 Korea vs UAE 🇦🇪 — At a Glance' : '🇰🇷 한국 vs UAE 🇦🇪 — 한눈에 비교'}
      </h4>
      <div className="grid grid-cols-3 gap-4 text-center">
        {/* Korea Column */}
        <div className="space-y-3">
          <div className="bg-accent-blue/15 border border-accent-blue/30 rounded-lg p-3">
            <div className="text-[20px] font-bold text-accent-blue">5</div>
            <div className="text-[10px] text-t3">{locale === 'en' ? 'Year Term' : '년 임기'}</div>
          </div>
          <div className="bg-accent-blue/15 border border-accent-blue/30 rounded-lg p-3">
            <div className="text-[16px] font-bold text-accent-blue">{locale === 'en' ? 'Direct' : '직선제'}</div>
            <div className="text-[10px] text-t3">{locale === 'en' ? 'Election' : '선거'}</div>
          </div>
          <div className="bg-accent-blue/15 border border-accent-blue/30 rounded-lg p-3">
            <div className="text-[16px] font-bold text-accent-blue">{locale === 'en' ? 'Parties' : '정당'}</div>
            <div className="text-[10px] text-t3">{locale === 'en' ? 'Multiple' : '다당제'}</div>
          </div>
        </div>

        {/* VS Column */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-[10px] text-t4 mb-2">{locale === 'en' ? 'vs' : 'vs'}</div>
          <div className="space-y-3 text-[11px] text-t3">
            <div className="py-2">{locale === 'en' ? 'Leadership' : '권력구조'}</div>
            <div className="py-2">{locale === 'en' ? 'Election' : '선거방식'}</div>
            <div className="py-2">{locale === 'en' ? 'Politics' : '정당제도'}</div>
          </div>
        </div>

        {/* UAE Column */}
        <div className="space-y-3">
          <div className="bg-gold/15 border border-gold/30 rounded-lg p-3">
            <div className="text-[20px] font-bold text-gold">∞</div>
            <div className="text-[10px] text-t3">{locale === 'en' ? 'Lifetime' : '종신'}</div>
          </div>
          <div className="bg-gold/15 border border-gold/30 rounded-lg p-3">
            <div className="text-[16px] font-bold text-gold">{locale === 'en' ? 'Hereditary' : '세습'}</div>
            <div className="text-[10px] text-t3">{locale === 'en' ? 'Succession' : '왕위계승'}</div>
          </div>
          <div className="bg-gold/15 border border-gold/30 rounded-lg p-3">
            <div className="text-[16px] font-bold text-gold">{locale === 'en' ? 'None' : '없음'}</div>
            <div className="text-[10px] text-t3">{locale === 'en' ? 'Banned' : '정당 금지'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PoliticalSystem() {
  const { locale } = useLocale()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* Structure Diagram */}
      <StructureDiagram locale={locale} />

      {/* Comparison Section */}
      <div>
        <h4 className="text-[14px] font-bold text-t1 mb-4 flex items-center gap-2">
          <span>⚖️</span>
          {locale === 'en' ? 'Korea vs UAE — Key Differences' : '한국 vs UAE — 핵심 차이'}
        </h4>

        {/* Quick Visual Comparison */}
        <QuickComparisonHeader locale={locale} />

        {/* Detailed Comparison Cards */}
        <p className="text-[12px] text-t4 mb-3">
          {locale === 'en' ? 'Click each card for details and business insights:' : '각 카드를 클릭하여 상세 내용과 비즈니스 시사점 확인:'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMPARISONS.map((item) => (
            <ComparisonCard
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() => handleToggle(item.id)}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* Quick Summary Box */}
      <div className="bg-gradient-to-br from-gold/10 via-bg2 to-accent-purple/10 border border-gold/20 rounded-xl p-5">
        <h4 className="text-[14px] font-bold text-gold mb-4 flex items-center gap-2">
          <span>💡</span>
          {locale === 'en' ? 'Key Takeaways for Business' : '비즈니스 핵심 시사점'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg">✓</span>
              <div>
                <div className="text-[13px] font-semibold text-t1">
                  {locale === 'en' ? 'Policy Stability' : '정책 안정성'}
                </div>
                <div className="text-[12px] text-t3">
                  {locale === 'en'
                    ? '50+ year consistent direction — Vision 2030/2050 credible'
                    : '50년 이상 일관된 방향 — Vision 2030/2050 신뢰도 높음'}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg">✓</span>
              <div>
                <div className="text-[13px] font-semibold text-t1">
                  {locale === 'en' ? 'Fast Decisions' : '빠른 의사결정'}
                </div>
                <div className="text-[12px] text-t3">
                  {locale === 'en'
                    ? 'Top-down structure enables rapid execution'
                    : '탑다운 구조로 빠른 실행 가능'}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 text-lg">✓</span>
              <div>
                <div className="text-[13px] font-semibold text-t1">
                  {locale === 'en' ? 'Royal = Business' : '왕실 = 비즈니스'}
                </div>
                <div className="text-[12px] text-t3">
                  {locale === 'en'
                    ? 'Government, business, investment all intertwined'
                    : '정부, 기업, 투자가 모두 연결'}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-amber-400 text-lg">⚠</span>
              <div>
                <div className="text-[13px] font-semibold text-t1">
                  {locale === 'en' ? 'Watch Your Words' : '발언 주의'}
                </div>
                <div className="text-[12px] text-t3">
                  {locale === 'en'
                    ? 'No criticism of royals — even on social media'
                    : '왕실 비판 금지 — SNS 포함'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
