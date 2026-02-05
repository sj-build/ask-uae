'use client'

import { Card } from '@/components/ui/Card'
import {
  casinoDetails as casinoDetailsKo,
  casinoSurveyData as casinoSurveyDataKo,
  casinoInsights as casinoInsightsKo,
  liberalizationTimeline as liberalizationTimelineKo,
  liberalizationDrivers as liberalizationDriversKo,
  liberalizationInsights as liberalizationInsightsKo,
} from '@/data/society/trends'
import {
  casinoDetails as casinoDetailsEn,
  casinoSurveyData as casinoSurveyDataEn,
  casinoInsights as casinoInsightsEn,
  liberalizationTimeline as liberalizationTimelineEn,
  liberalizationDrivers as liberalizationDriversEn,
  liberalizationInsights as liberalizationInsightsEn,
} from '@/data/society/trends.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { useLocale } from '@/hooks/useLocale'

function InsightBox({ title, insights }: { readonly title: string; readonly insights: readonly string[] }) {
  return (
    <div className="mt-4 p-3.5 bg-gold/5 border border-gold/15 rounded-lg">
      <div className="text-[11px] font-bold text-gold mb-2">{title}</div>
      <div className="space-y-1.5">
        {insights.map((insight) => (
          <div key={insight} className="text-[11px] text-t3 flex gap-2">
            <span className="text-gold shrink-0">&#x2022;</span>
            <span>{insight}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CasinoCard() {
  const { locale } = useLocale()
  const casinoDetails = useLocalizedData(casinoDetailsKo, casinoDetailsEn)
  const casinoSurveyData = useLocalizedData(casinoSurveyDataKo, casinoSurveyDataEn)
  const casinoInsights = useLocalizedData(casinoInsightsKo, casinoInsightsEn)

  const title = locale === 'en' ? 'Casino/Gaming Legalization — First in Middle East' : '카지노/게이밍 합법화 — 중동 최초'
  const subtitle = locale === 'en' ? 'UAE legalizes gambling, historically banned. First in the Middle East.' : 'UAE가 역사적으로 금지해온 도박을 합법화. 중동 최초.'
  const surveyTitle = locale === 'en' ? 'Public Response (Survey of 2,000)' : '사회적 반응 (설문조사 2,000명)'
  const insightTitle = locale === 'en' ? 'Investor Implications' : '투자자 시사점'

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🎰</span>
          <h3 className="text-sm font-bold text-t1">{title}</h3>
        </div>
        <p className="text-[10px] text-t4 mb-4 ml-7">{subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {casinoDetails.map((detail) => (
            <div key={detail.label} className="flex gap-2 p-2.5 bg-bg/60 border border-brd rounded-lg">
              <div className="w-[110px] shrink-0 text-[10px] font-bold text-accent-green">{detail.label}</div>
              <div className="text-[11px] text-t2 leading-snug">{detail.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="text-[11px] font-semibold text-t2 mb-2">{surveyTitle}</div>
          <div className="space-y-2">
            {casinoSurveyData.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-[150px] shrink-0 text-[11px] text-t3">{item.label}</div>
                <div className="flex-1 h-[20px] bg-bg rounded overflow-hidden">
                  <div
                    className="h-full rounded flex items-center pl-2 text-[9px] font-bold text-black/80 transition-all duration-500"
                    style={{ width: `${item.percentage}%`, background: item.color }}
                  >
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <InsightBox title={insightTitle} insights={casinoInsights} />
      </div>
    </Card>
  )
}

function LiberalizationCard() {
  const { locale } = useLocale()
  const liberalizationTimeline = useLocalizedData(liberalizationTimelineKo, liberalizationTimelineEn)
  const liberalizationDrivers = useLocalizedData(liberalizationDriversKo, liberalizationDriversEn)
  const liberalizationInsights = useLocalizedData(liberalizationInsightsKo, liberalizationInsightsEn)

  const title = locale === 'en' ? 'Social Liberalization Legal Reforms' : '사회 자유화 법률 개혁'
  const subtitle = locale === 'en' ? 'Fastest social law liberalization in the world since 2020' : '2020년 이후 세계에서 가장 빠른 속도로 사회법 자유화'
  const driversTitle = locale === 'en' ? 'Drivers of Change' : '변화의 배경'
  const insightTitle = locale === 'en' ? 'Investor Implications' : '투자자 시사점'

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">⚖️</span>
          <h3 className="text-sm font-bold text-t1">{title}</h3>
        </div>
        <p className="text-[10px] text-t4 mb-4 ml-7">{subtitle}</p>

        <div className="relative pl-5 border-l-2 border-gold/20 space-y-3 mb-4">
          {liberalizationTimeline.map((event) => (
            <div key={`${event.date}-${event.change}`} className="relative">
              <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-gold border-2 border-bg" />
              <div className="p-3 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-gold font-bold">{event.date}</span>
                  <span className="text-[11px] font-bold text-t1">{event.change}</span>
                </div>
                <div className="text-[10px] text-t3 leading-snug">{event.significance}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-accent-blue/5 border border-accent-blue/15 rounded-lg mb-4">
          <div className="text-[11px] font-bold text-accent-blue mb-2">{driversTitle}</div>
          <div className="space-y-1.5">
            {liberalizationDrivers.map((driver) => (
              <div key={driver} className="text-[11px] text-t3 flex gap-2">
                <span className="text-accent-blue shrink-0">&#x2022;</span>
                <span>{driver}</span>
              </div>
            ))}
          </div>
        </div>

        <InsightBox title={insightTitle} insights={liberalizationInsights} />
      </div>
    </Card>
  )
}

export function RecentTrends() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CasinoCard />
      <LiberalizationCard />
    </div>
  )
}
