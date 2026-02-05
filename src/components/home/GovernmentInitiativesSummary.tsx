'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { ArrowRight } from 'lucide-react'
import { initiatives as initiativesKo } from '@/data/overview/initiatives'
import { initiatives as initiativesEn } from '@/data/overview/initiatives.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { useLocale } from '@/hooks/useLocale'

interface InitiativeSummary {
  readonly icon: string
  readonly title: string
  readonly titleColor: string
  readonly subtitle: string
  readonly keyPoints: readonly string[]
  readonly status: 'active' | 'upcoming' | 'accelerating'
}

function getInitiativeSummaries(locale: string): InitiativeSummary[] {
  if (locale === 'en') {
    return [
      {
        icon: '🧠',
        title: 'AI / Data Center',
        titleColor: '#a78bfa',
        subtitle: 'National AI Strategy 2031',
        keyPoints: [
          'Stargate UAE: 5GW AI campus (largest outside US)',
          'Microsoft $15.2B investment',
          'Abu Dhabi AED 13B digital strategy',
        ],
        status: 'accelerating',
      },
      {
        icon: '⚡',
        title: 'Energy Transition',
        titleColor: '#f59e0b',
        subtitle: 'Net Zero 2050',
        keyPoints: [
          'Barakah Nuclear 5.6GW (KEPCO)',
          'Masdar 50GW renewables by 2030',
          'XRG $80B energy transition',
        ],
        status: 'active',
      },
      {
        icon: '🎰',
        title: 'Casino Legalization',
        titleColor: '#ef4444',
        subtitle: 'First in Islamic World',
        keyPoints: [
          'Wynn Al Marjan $3.9B (2026)',
          'GCGRA gaming regulator established',
          'Crypto payments planned',
        ],
        status: 'upcoming',
      },
      {
        icon: '💰',
        title: 'Digital Assets',
        titleColor: '#22d3ee',
        subtitle: 'Global Crypto Hub',
        keyPoints: [
          'VARA: world-first crypto regulator',
          'AED Stablecoin (IHC+ADQ+FAB)',
          'MGX $2B Binance investment',
        ],
        status: 'active',
      },
    ]
  }

  return [
    {
      icon: '🧠',
      title: 'AI / 데이터센터',
      titleColor: '#a78bfa',
      subtitle: 'National AI Strategy 2031',
      keyPoints: [
        'Stargate UAE: 5GW AI 캠퍼스 (미국 외 최대)',
        'Microsoft $15.2B 투자',
        'Abu Dhabi AED 13B 디지털 전략',
      ],
      status: 'accelerating',
    },
    {
      icon: '⚡',
      title: '에너지 전환',
      titleColor: '#f59e0b',
      subtitle: 'Net Zero 2050',
      keyPoints: [
        'Barakah 원전 5.6GW (KEPCO 건설)',
        'Masdar 50GW 신재생 (2030 목표)',
        'XRG $80B 에너지 전환 자회사',
      ],
      status: 'active',
    },
    {
      icon: '🎰',
      title: '카지노 합법화',
      titleColor: '#ef4444',
      subtitle: '이슬람권 최초',
      keyPoints: [
        'Wynn Al Marjan $3.9B (2026 오픈)',
        'GCGRA 게이밍 규제청 설립',
        '암호화폐 결제 도입 계획',
      ],
      status: 'upcoming',
    },
    {
      icon: '💰',
      title: '디지털 자산',
      titleColor: '#22d3ee',
      subtitle: '글로벌 크립토 허브',
      keyPoints: [
        'VARA: 세계 최초 가상자산규제청',
        'AED 스테이블코인 (IHC+ADQ+FAB)',
        'MGX $2B Binance 투자',
      ],
      status: 'active',
    },
  ]
}

function StatusBadge({ status, locale }: { readonly status: 'active' | 'upcoming' | 'accelerating'; readonly locale: string }) {
  const labels = {
    active: locale === 'en' ? 'Active' : '진행중',
    upcoming: locale === 'en' ? 'Upcoming' : '예정',
    accelerating: locale === 'en' ? 'Accelerating' : '가속화',
  }

  const colors = {
    active: 'bg-emerald-500/20 text-emerald-400',
    upcoming: 'bg-amber-500/20 text-amber-400',
    accelerating: 'bg-purple-500/20 text-purple-400',
  }

  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  )
}

export function GovernmentInitiativesSummary() {
  const { locale } = useLocale()
  const summaries = getInitiativeSummaries(locale)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {summaries.map((item) => (
          <Card key={item.title} className="group">
            <div
              className="h-[2px] w-full"
              style={{
                background: `linear-gradient(90deg, ${item.titleColor}, ${item.titleColor}60, transparent)`,
              }}
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span
                    className="text-[13px] font-bold"
                    style={{ color: item.titleColor }}
                  >
                    {item.title}
                  </span>
                </div>
                <StatusBadge status={item.status} locale={locale} />
              </div>
              <p className="text-[10px] text-t4 mb-3">{item.subtitle}</p>
              <ul className="space-y-1.5">
                {item.keyPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span
                      className="mt-[5px] w-1 h-1 rounded-full shrink-0"
                      style={{ backgroundColor: item.titleColor }}
                    />
                    <span className="text-[11px] text-t2 leading-snug">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Link
          href="/politics"
          className="flex items-center gap-1 text-[10px] text-t4 transition-colors hover:text-t2"
        >
          {locale === 'en' ? 'More' : '더보기'}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
