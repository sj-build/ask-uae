'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { ArrowRight } from 'lucide-react'
import { politicalTrends } from '@/data/politics/trends'
import { useLocale } from '@/hooks/useLocale'

interface TrendCardProps {
  readonly icon: string
  readonly category: string
  readonly categoryEn: string
  readonly color: string
  readonly items: readonly { readonly title: string; readonly subtitle: string }[]
  readonly href: string
  readonly linkText: string
}

function TrendCard({ icon, category, categoryEn, color, items, href, linkText }: TrendCardProps) {
  const { locale } = useLocale()
  const displayCategory = locale === 'en' ? categoryEn : category

  return (
    <Card className="group">
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}80, transparent)`,
        }}
      />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{icon}</span>
          <h3
            className="font-display text-[14px] font-bold"
            style={{ color }}
          >
            {displayCategory}
          </h3>
        </div>

        <ul className="space-y-2 mb-3">
          {items.map((item) => (
            <li key={item.title} className="flex items-start gap-2">
              <span
                className="mt-[6px] w-1 h-1 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <div>
                <div className="text-[12px] font-semibold text-t1 leading-tight">
                  {item.title}
                </div>
                <div className="text-[10px] text-t4 leading-snug">
                  {item.subtitle}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <Link
            href={href}
            className="flex items-center gap-1 text-[10px] text-t4 transition-colors hover:text-t2"
          >
            {linkText}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </Card>
  )
}

// Extract key trends from each category
function getPoliticsTrends(locale: string) {
  const succession = politicalTrends.find(t => t.id === 'succession')
  const saudiRelations = politicalTrends.find(t => t.id === 'saudi-relations')
  const economicDiplomacy = politicalTrends.find(t => t.id === 'economic-diplomacy')

  if (locale === 'en') {
    return [
      {
        title: 'MBZ Succession Planning',
        subtitle: 'Sheikh Khaled Crown Prince, Tahnoun consolidating power',
      },
      {
        title: 'UAE-Saudi Competition',
        subtitle: 'Vision 2030 rivalry, talent & HQ competition',
      },
      {
        title: 'AI Infrastructure Hub',
        subtitle: 'Stargate $500B, pivoting from oil to tech',
      },
    ]
  }

  return [
    {
      title: succession?.items[0]?.title || 'MBZ 승계 계획',
      subtitle: 'Khaled 왕세자 부상, Tahnoun 권한 강화',
    },
    {
      title: saudiRelations?.items[0]?.title || 'UAE-사우디 경쟁',
      subtitle: 'Vision 2030 경쟁, 인재/HQ 유치전',
    },
    {
      title: economicDiplomacy?.items[0]?.title || 'AI 인프라 허브',
      subtitle: 'Stargate $500B, 석유→테크 전환',
    },
  ]
}

function getEconomyTrends(locale: string) {
  if (locale === 'en') {
    return [
      {
        title: 'SWF Global Deployment',
        subtitle: '$2T+ AUM expanding tech, crypto, AI',
      },
      {
        title: '9% Corporate Tax Era',
        subtitle: 'Business restructuring in progress',
      },
      {
        title: 'Crypto Capital Ambition',
        subtitle: 'AED Stablecoin, MGX $2B Binance',
      },
    ]
  }

  return [
    {
      title: 'SWF 글로벌 투자',
      subtitle: '$2T+ AUM, 테크/크립토/AI 확대',
    },
    {
      title: '법인세 9% 시대',
      subtitle: '2023 도입, 기업 구조조정 진행',
    },
    {
      title: '크립토 수도 야심',
      subtitle: 'AED 스테이블코인, MGX $2B Binance',
    },
  ]
}

function getSocietyTrends(locale: string) {
  if (locale === 'en') {
    return [
      {
        title: 'Casino Legalization',
        subtitle: 'Wynn 2026, first in Islamic world',
      },
      {
        title: 'Social Liberalization',
        subtitle: 'Cohabitation, alcohol, divorce reforms',
      },
      {
        title: 'K-Wave Expansion',
        subtitle: 'K-Beauty, K-Pop, K-Food boom',
      },
    ]
  }

  return [
    {
      title: '카지노 합법화',
      subtitle: 'Wynn 2026 오픈, 이슬람권 최초',
    },
    {
      title: '사회 자유화 가속',
      subtitle: '동거 허용, 음주, 이혼법 개혁',
    },
    {
      title: 'K-Wave 확산',
      subtitle: 'K-뷰티, K-팝, K-푸드 열풍',
    },
  ]
}

export function TrendsSummary() {
  const { locale } = useLocale()

  const politicsTrends = getPoliticsTrends(locale)
  const economyTrends = getEconomyTrends(locale)
  const societyTrends = getSocietyTrends(locale)

  const moreText = locale === 'en' ? 'More' : '더보기'

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <TrendCard
          icon="🏛️"
          category="정치"
          categoryEn="Politics"
          color="#ef4444"
          items={politicsTrends}
          href="/politics"
          linkText={moreText}
        />
        <TrendCard
          icon="💰"
          category="경제"
          categoryEn="Economy"
          color="#c8a44e"
          items={economyTrends}
          href="/economy"
          linkText={moreText}
        />
        <TrendCard
          icon="🕌"
          category="사회·문화"
          categoryEn="Society"
          color="#34d399"
          items={societyTrends}
          href="/society"
          linkText={moreText}
        />
      </div>
    </div>
  )
}
