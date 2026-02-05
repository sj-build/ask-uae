'use client'

import { Card } from '@/components/ui/Card'
import {
  genZTrends as genZTrendsKo,
  consumptionShifts as consumptionShiftsKo,
  kWaveCategories as kWaveCategoriesKo,
  kWaveInsights as kWaveInsightsKo,
  trendDuality as trendDualityKo,
  dualityInsights as dualityInsightsKo,
} from '@/data/society/trends'
import {
  genZTrends as genZTrendsEn,
  consumptionShifts as consumptionShiftsEn,
  kWaveCategories as kWaveCategoriesEn,
  kWaveInsights as kWaveInsightsEn,
  trendDuality as trendDualityEn,
  dualityInsights as dualityInsightsEn,
} from '@/data/society/trends.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'

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

function GenZTrendsCard() {
  const genZTrends = useLocalizedData(genZTrendsKo, genZTrendsEn)
  const consumptionShifts = useLocalizedData(consumptionShiftsKo, consumptionShiftsEn)

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🧘</span>
          <h3 className="text-sm font-bold text-t1">Gen Z 웰니스/지속가능 소비</h3>
        </div>
        <p className="text-[10px] text-t4 mb-4 ml-7">럭셔리 = 물건 -&gt; 경험, 몰 -&gt; 자연, 과시 -&gt; 웰빙</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          {genZTrends.map((trend) => (
            <div
              key={trend.trend}
              className="p-3 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">{trend.icon}</span>
                <span className="text-[11px] font-bold text-t1">{trend.trend}</span>
              </div>
              <div className="text-[10px] text-t3 mb-1.5 leading-snug">{trend.description}</div>
              <div className="text-[10px] text-gold">
                <span className="font-semibold">기회:</span> {trend.opportunity}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-accent-cyan/5 border border-accent-cyan/15 rounded-lg">
          <div className="text-[11px] font-bold text-accent-cyan mb-2">소비 패턴 변화</div>
          <div className="space-y-1.5">
            {consumptionShifts.map((shift) => (
              <div key={shift} className="text-[11px] text-t3 flex gap-2">
                <span className="text-accent-cyan shrink-0">&#x2022;</span>
                <span>{shift}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function KWaveCard() {
  const kWaveCategories = useLocalizedData(kWaveCategoriesKo, kWaveCategoriesEn)
  const kWaveInsights = useLocalizedData(kWaveInsightsKo, kWaveInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🇰🇷</span>
          <h3 className="text-sm font-bold text-t1">K-Wave in UAE -- 한류의 중동 침투</h3>
        </div>
        <p className="text-[10px] text-t4 mb-4 ml-7">K-Pop, K-Beauty, K-Food가 UAE에서 가시적 영향력 형성 중</p>

        <div className="space-y-4 mb-4">
          {kWaveCategories.map((cat) => (
            <div
              key={cat.category}
              className="p-3.5 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-xs font-bold text-t1">{cat.category}</span>
              </div>
              <div className="space-y-1.5 mb-2.5">
                {cat.items.map((item) => (
                  <div key={item} className="text-[11px] text-t3 flex gap-2">
                    <span className="text-accent-blue shrink-0">&#x2022;</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="p-2 bg-accent-orange/5 border border-accent-orange/15 rounded-md flex gap-2 items-start">
                <span className="text-accent-orange text-[10px] shrink-0">!</span>
                <span className="text-[10px] text-t3">
                  <span className="font-semibold text-accent-orange">과제: </span>
                  {cat.challenge}
                </span>
              </div>
            </div>
          ))}
        </div>

        <InsightBox title="투자자 시사점" insights={kWaveInsights} />
      </div>
    </Card>
  )
}

function TrendSummaryCard() {
  const trendDuality = useLocalizedData(trendDualityKo, trendDualityEn)
  const dualityInsights = useLocalizedData(dualityInsightsKo, dualityInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📊</span>
          <h3 className="text-sm font-bold text-t1">트렌드 종합: &ldquo;전통과 혁신의 동시 가속&rdquo;</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-gold/5 border border-gold/20 rounded-lg">
            <div className="text-xs font-bold text-gold mb-3 text-center">{trendDuality.tradition.direction}</div>
            <div className="space-y-2">
              {trendDuality.tradition.items.map((item) => (
                <div key={item} className="text-[10px] text-t3 flex gap-2">
                  <span className="text-gold shrink-0">&#x25C0;</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-lg">
            <div className="text-xs font-bold text-accent-blue mb-3 text-center">{trendDuality.innovation.direction}</div>
            <div className="space-y-2">
              {trendDuality.innovation.items.map((item) => (
                <div key={item} className="text-[10px] text-t3 flex gap-2">
                  <span className="text-accent-blue shrink-0">&#x25B6;</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center p-3 bg-bg3/60 border border-brd rounded-lg mb-4">
          <div className="text-xs font-bold text-t1">UAE</div>
          <div className="text-[10px] text-t3 mt-1">전통을 존중하면서 혁신을 추진하는 정부 주도형 사회 변화</div>
        </div>

        <InsightBox title="투자자에게 의미하는 바" insights={dualityInsights} />
      </div>
    </Card>
  )
}

export function GenZKWave() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <GenZTrendsCard />
        <KWaveCard />
      </div>
      <TrendSummaryCard />
    </div>
  )
}
