'use client'

import Link from 'next/link'
import { BarChart3, Factory, Scale } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'

const QUICK_LINKS = [
  {
    href: '/comparison',
    icon: BarChart3,
    labelKo: 'UAE 한눈에 보기',
    labelEn: 'UAE at a Glance',
    descKo: '아부다비 vs 두바이 핵심 비교',
    descEn: 'Abu Dhabi vs Dubai comparison',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
  },
  {
    href: '/industry',
    icon: Factory,
    labelKo: '유망 섹터 찾기',
    labelEn: 'Find Key Sectors',
    descKo: '산업지도 & 밸류체인 분석',
    descEn: 'Industry map & value chain',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    href: '/legal',
    icon: Scale,
    labelKo: '법인·비자·세금',
    labelEn: 'Legal & Tax Guide',
    descKo: '설립 절차 & 규제 체크리스트',
    descEn: 'Setup process & regulations',
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
  },
]

export function QuickStart() {
  const { locale } = useLocale()

  return (
    <div className="mb-8">
      <div className="text-center mb-4">
        <span className="text-[11px] text-t4 uppercase tracking-widest">
          {locale === 'en' ? 'Quick Start' : '빠른 시작'}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`group relative p-4 rounded-xl border border-brd/50 bg-gradient-to-br ${link.gradient} hover:border-gold/30 hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-bg2/80 ${link.iconColor}`}>
                <link.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[13px] text-t1 group-hover:text-gold transition-colors">
                  {locale === 'en' ? link.labelEn : link.labelKo}
                </div>
                <div className="text-[11px] text-t3 mt-0.5">
                  {locale === 'en' ? link.descEn : link.descKo}
                </div>
              </div>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-t4 group-hover:text-gold group-hover:translate-x-1 transition-all">
              →
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
