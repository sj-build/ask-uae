'use client'

import Link from 'next/link'
import { ArrowRight, Zap, TrendingUp, Clock, AlertTriangle } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'
import { macroRisks as macroRisksKo } from '@/data/overview/macro-risks'
import { macroRisks as macroRisksEn } from '@/data/overview/macro-risks.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'

interface StrategicPillar {
  readonly id: string
  readonly icon: string
  readonly nameKo: string
  readonly nameEn: string
  readonly headlineKo: string
  readonly headlineEn: string
  readonly subheadlineKo: string
  readonly subheadlineEn: string
  readonly investment: string
  readonly status: 'launching' | 'accelerating' | 'active'
  readonly color: string
  readonly href: string
  readonly badge?: string
}

// 모든 기회 섹터 (B2B + B2C 통합)
const OPPORTUNITY_PILLARS: readonly StrategicPillar[] = [
  // B2B / Industrial
  {
    id: 'ai-tech',
    icon: '🧠',
    nameKo: 'AI & 데이터센터',
    nameEn: 'AI & Data Centers',
    headlineKo: 'Stargate UAE 5GW 캠퍼스',
    headlineEn: 'Stargate UAE 5GW Campus',
    subheadlineKo: 'Microsoft $15B, G42/MGX 주도',
    subheadlineEn: 'Microsoft $15B, G42/MGX-led',
    investment: '$20B+',
    status: 'accelerating',
    color: '#a78bfa',
    href: '/economy',
    badge: 'HOT',
  },
  {
    id: 'real-estate',
    icon: '🏗️',
    nameKo: '부동산 & 건설',
    nameEn: 'Real Estate & Construction',
    headlineKo: '2024 거래액 $243B',
    headlineEn: '2024 Transactions $243B',
    subheadlineKo: 'Dubai $207B (+36% YoY)',
    subheadlineEn: 'Dubai $207B (+36% YoY)',
    investment: '$243B+',
    status: 'accelerating',
    color: '#f97316',
    href: '/economy',
    badge: 'HOT',
  },
  {
    id: 'energy',
    icon: '⚡',
    nameKo: '에너지 & 탈탄소',
    nameEn: 'Energy & Net Zero',
    headlineKo: 'Barakah 원전 + XRG',
    headlineEn: 'Barakah Nuclear + XRG',
    subheadlineKo: 'KEPCO 5.6GW, 2050 탄소중립',
    subheadlineEn: 'KEPCO 5.6GW, 2050 Net Zero',
    investment: '$80B+',
    status: 'active',
    color: '#f59e0b',
    href: '/economy',
  },
  {
    id: 'finance',
    icon: '💰',
    nameKo: '금융 & 크립토',
    nameEn: 'Finance & Crypto',
    headlineKo: 'AED 스테이블코인 + VARA',
    headlineEn: 'AED Stablecoin + VARA',
    subheadlineKo: 'SWF $2T+, 크립토 허브',
    subheadlineEn: 'SWF $2T+, crypto hub',
    investment: '$2T+ SWF',
    status: 'accelerating',
    color: '#22d3ee',
    href: '/economy',
  },
  // B2C / Consumer
  {
    id: 'entertainment',
    icon: '🎰',
    nameKo: '미디어 & 엔터',
    nameEn: 'Media & Entertainment',
    headlineKo: '카지노 + 박물관 + 영화',
    headlineEn: 'Casino + Museums + Film',
    subheadlineKo: 'Wynn 2026, Guggenheim 2026',
    subheadlineEn: 'Wynn 2026, Guggenheim 2026',
    investment: '$10B+',
    status: 'launching',
    color: '#ef4444',
    href: '/society',
    badge: 'NEW',
  },
  {
    id: 'tourism',
    icon: '✈️',
    nameKo: '관광 & 호스피탈리티',
    nameEn: 'Tourism & Hospitality',
    headlineKo: 'Dubai 연 1,872만 관광객',
    headlineEn: 'Dubai 18.7M Annual Tourists',
    subheadlineKo: '관광수입 $61.3B (2024)',
    subheadlineEn: 'Tourism revenue $61.3B (2024)',
    investment: '$61B+',
    status: 'active',
    color: '#f472b6',
    href: '/industry',
  },
  {
    id: 'consumer',
    icon: '🛍️',
    nameKo: '소비재 & K-Wave',
    nameEn: 'Consumer & K-Wave',
    headlineKo: 'K-Beauty, K-Food, K-Pop',
    headlineEn: 'K-Beauty, K-Food, K-Pop',
    subheadlineKo: '할랄 = 20억 무슬림 시장',
    subheadlineEn: 'Halal = 2B Muslim market',
    investment: 'Growing',
    status: 'accelerating',
    color: '#34d399',
    href: '/society',
  },
]

function StatusBadge({ status, locale }: { readonly status: 'launching' | 'accelerating' | 'active'; readonly locale: string }) {
  const labels = {
    launching: { ko: '론칭', en: 'Launch', icon: <Zap className="w-2.5 h-2.5" /> },
    accelerating: { ko: '가속', en: 'Accel', icon: <TrendingUp className="w-2.5 h-2.5" /> },
    active: { ko: '진행', en: 'Active', icon: <Clock className="w-2.5 h-2.5" /> },
  }

  const colors = {
    launching: 'bg-rose-500/15 text-rose-400',
    accelerating: 'bg-purple-500/15 text-purple-400',
    active: 'bg-emerald-500/15 text-emerald-400',
  }

  return (
    <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wide uppercase ${colors[status]}`}>
      {labels[status].icon}
      {locale === 'en' ? labels[status].en : labels[status].ko}
    </span>
  )
}

function PillarCard({ pillar, locale }: { readonly pillar: StrategicPillar; readonly locale: string }) {
  const name = locale === 'en' ? pillar.nameEn : pillar.nameKo
  const headline = locale === 'en' ? pillar.headlineEn : pillar.headlineKo
  const subheadline = locale === 'en' ? pillar.subheadlineEn : pillar.subheadlineKo

  return (
    <Link
      href={pillar.href}
      className="group relative bg-bg3/80 hover:bg-bg2 border border-brd/60 hover:border-gold/40 rounded-lg overflow-hidden transition-all duration-200"
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ backgroundColor: pillar.color }}
      />

      {/* Badge */}
      {pillar.badge && (
        <div
          className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold text-white tracking-wide"
          style={{ backgroundColor: pillar.color }}
        >
          {pillar.badge}
        </div>
      )}

      <div className="p-3 pl-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-lg">{pillar.icon}</span>
          <span className="text-[12px] font-bold tracking-tight" style={{ color: pillar.color }}>
            {name}
          </span>
          <StatusBadge status={pillar.status} locale={locale} />
        </div>

        {/* Headline */}
        <div className="mb-2">
          <div className="text-[12px] font-medium text-t1 leading-snug group-hover:text-gold transition-colors">
            {headline}
          </div>
          <div className="text-[10px] text-t4 mt-0.5">
            {subheadline}
          </div>
        </div>

        {/* Investment */}
        <div className="flex items-center justify-between pt-1.5 border-t border-brd/40">
          <div className="flex items-baseline gap-1">
            <span className="text-[9px] text-t4 uppercase tracking-wide">
              {locale === 'en' ? 'Inv.' : '투자'}
            </span>
            <span className="font-bold text-[12px]" style={{ color: pillar.color }}>{pillar.investment}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-t4 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  )
}

interface KeyIssue {
  readonly icon: string
  readonly labelKo: string
  readonly labelEn: string
  readonly issueKo: string
  readonly issueEn: string
  readonly tagKo: string
  readonly tagEn: string
  readonly color: string
}

const KEY_ISSUES: readonly KeyIssue[] = [
  {
    icon: '🏛️',
    labelKo: '정치',
    labelEn: 'Politics',
    issueKo: '트럼프 방문 $200B 딜, UAE-사우디 예멘 갈등, 이란 화해 진행',
    issueEn: 'Trump visit $200B deals, UAE-Saudi Yemen clash, Iran rapprochement',
    tagKo: '외교 재편',
    tagEn: 'Diplomacy',
    color: '#ef4444',
  },
  {
    icon: '💰',
    labelKo: '경제',
    labelEn: 'Economy',
    issueKo: '주식시장 $1.06T (+7%), 부동산 $243B (+36%), SWF $2T+',
    issueEn: 'Stock mkt $1.06T (+7%), Real estate $243B (+36%), SWF $2T+',
    tagKo: '자산 급등',
    tagEn: 'Asset Boom',
    color: '#c8a44e',
  },
  {
    icon: '🎭',
    labelKo: '사회/문화',
    labelEn: 'Society',
    issueKo: '카지노 2026, Guggenheim 2026, 사회 자유화 가속',
    issueEn: 'Casino 2026, Guggenheim 2026, social liberalization accelerating',
    tagKo: '개방 가속',
    tagEn: 'Opening Up',
    color: '#34d399',
  },
]

function KeyIssuesSummary({ locale }: { readonly locale: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {KEY_ISSUES.map((issue) => (
        <div
          key={issue.labelKo}
          className="bg-bg3/80 border border-brd/60 rounded-lg p-3 hover:border-gold/40 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{issue.icon}</span>
            <span className="text-[11px] font-bold tracking-tight" style={{ color: issue.color }}>
              {locale === 'en' ? issue.labelEn : issue.labelKo}
            </span>
            <span
              className="ml-auto px-1.5 py-0.5 text-[8px] font-semibold rounded tracking-wide uppercase"
              style={{ backgroundColor: `${issue.color}15`, color: issue.color }}
            >
              {locale === 'en' ? issue.tagEn : issue.tagKo}
            </span>
          </div>
          <p className="text-[10px] text-t3 leading-relaxed">
            {locale === 'en' ? issue.issueEn : issue.issueKo}
          </p>
        </div>
      ))}
    </div>
  )
}

function RiskSection({ locale }: { readonly locale: string }) {
  const macroRisks = useLocalizedData(macroRisksKo, macroRisksEn)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {macroRisks.map((risk) => (
        <div
          key={risk.title}
          className="p-3 bg-bg3/60 rounded-lg border border-brd/40"
          style={{ borderLeftWidth: '3px', borderLeftColor: risk.borderColor }}
        >
          <div className="font-bold text-[11px] mb-1" style={{ color: risk.titleColor }}>{risk.title}</div>
          <div className="text-[10px] text-t3 leading-relaxed">{risk.description}</div>
        </div>
      ))}
    </div>
  )
}

export function UAENowDashboard() {
  const { locale, t } = useLocale()

  return (
    <div className="space-y-6 mb-6">
      {/* Section 1: UAE Now - Key Issues */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🇦🇪</span>
          <h2 className="text-[15px] font-bold text-t1 tracking-tight">UAE Now</h2>
          <span className="text-[10px] text-t4 ml-1">
            {locale === 'en' ? 'Key Issues at a Glance' : '한눈에 보는 핵심 이슈'}
          </span>
        </div>
        <KeyIssuesSummary locale={locale} />
      </section>

      {/* Section 2: UAE 기회 (Opportunity) */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🚀</span>
          <h2 className="text-[15px] font-bold text-t1 tracking-tight">
            {locale === 'en' ? 'UAE Opportunities' : 'UAE 기회'}
          </h2>
          <span className="text-[10px] text-t4 ml-1">
            {locale === 'en' ? 'Investment & Growth Sectors' : '투자 및 성장 섹터'}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {OPPORTUNITY_PILLARS.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} locale={locale} />
          ))}
        </div>
      </section>

      {/* Section 3: UAE Risk */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-accent-red" />
          <h2 className="text-[15px] font-bold text-t1 tracking-tight">
            {locale === 'en' ? 'UAE Risks' : 'UAE 리스크'}
          </h2>
          <span className="text-[10px] text-t4 ml-1">
            {locale === 'en' ? 'Macro Risk Factors' : '거시 리스크 요인'}
          </span>
        </div>
        <RiskSection locale={locale} />
      </section>
    </div>
  )
}
