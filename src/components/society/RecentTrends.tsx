'use client'

import { Card } from '@/components/ui/Card'
import { Collapsible } from '@/components/ui/Collapsible'
import {
  casinoDetails as casinoDetailsKo,
  casinoSurveyData as casinoSurveyDataKo,
  casinoInsights as casinoInsightsKo,
  liberalizationTimeline as liberalizationTimelineKo,
  liberalizationDrivers as liberalizationDriversKo,
  liberalizationInsights as liberalizationInsightsKo,
  culturalInfrastructure as culturalInfrastructureKo,
  unescoItems as unescoItemsKo,
  culturalInsights as culturalInsightsKo,
  gamingMetrics as gamingMetricsKo,
  gamingInsights as gamingInsightsKo,
  genZTrends as genZTrendsKo,
  consumptionShifts as consumptionShiftsKo,
  kWaveCategories as kWaveCategoriesKo,
  kWaveInsights as kWaveInsightsKo,
  trendDuality as trendDualityKo,
  dualityInsights as dualityInsightsKo,
} from '@/data/society/trends'
import {
  casinoDetails as casinoDetailsEn,
  casinoSurveyData as casinoSurveyDataEn,
  casinoInsights as casinoInsightsEn,
  liberalizationTimeline as liberalizationTimelineEn,
  liberalizationDrivers as liberalizationDriversEn,
  liberalizationInsights as liberalizationInsightsEn,
  culturalInfrastructure as culturalInfrastructureEn,
  unescoItems as unescoItemsEn,
  culturalInsights as culturalInsightsEn,
  gamingMetrics as gamingMetricsEn,
  gamingInsights as gamingInsightsEn,
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

function CasinoCard() {
  const casinoDetails = useLocalizedData(casinoDetailsKo, casinoDetailsEn)
  const casinoSurveyData = useLocalizedData(casinoSurveyDataKo, casinoSurveyDataEn)
  const casinoInsights = useLocalizedData(casinoInsightsKo, casinoInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🎰</span>
          <h3 className="text-sm font-bold text-t1">카지노/게이밍 합법화 -- 중동 최초</h3>
        </div>
        <p className="text-[10px] text-t4 mb-4 ml-7">UAE가 역사적으로 금지해온 도박을 합법화. 중동 최초.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {casinoDetails.map((detail) => (
            <div key={detail.label} className="flex gap-2 p-2.5 bg-bg/60 border border-brd rounded-lg">
              <div className="w-[110px] shrink-0 text-[10px] font-bold text-accent-green">{detail.label}</div>
              <div className="text-[11px] text-t2 leading-snug">{detail.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="text-[11px] font-semibold text-t2 mb-2">사회적 반응 (설문조사 2,000명)</div>
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

        <InsightBox title="투자자 시사점" insights={casinoInsights} />
      </div>
    </Card>
  )
}

function LiberalizationCard() {
  const liberalizationTimeline = useLocalizedData(liberalizationTimelineKo, liberalizationTimelineEn)
  const liberalizationDrivers = useLocalizedData(liberalizationDriversKo, liberalizationDriversEn)
  const liberalizationInsights = useLocalizedData(liberalizationInsightsKo, liberalizationInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">⚖️</span>
          <h3 className="text-sm font-bold text-t1">사회 자유화 법률 개혁</h3>
        </div>
        <p className="text-[10px] text-t4 mb-4 ml-7">2020년 이후 세계에서 가장 빠른 속도로 사회법 자유화</p>

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
          <div className="text-[11px] font-bold text-accent-blue mb-2">변화의 배경</div>
          <div className="space-y-1.5">
            {liberalizationDrivers.map((driver) => (
              <div key={driver} className="text-[11px] text-t3 flex gap-2">
                <span className="text-accent-blue shrink-0">&#x2022;</span>
                <span>{driver}</span>
              </div>
            ))}
          </div>
        </div>

        <InsightBox title="투자자 시사점" insights={liberalizationInsights} />
      </div>
    </Card>
  )
}

function CulturalInfraCard() {
  const culturalInfrastructure = useLocalizedData(culturalInfrastructureKo, culturalInfrastructureEn)
  const unescoItems = useLocalizedData(unescoItemsKo, unescoItemsEn)
  const culturalInsights = useLocalizedData(culturalInsightsKo, culturalInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🏛️</span>
          <h3 className="text-sm font-bold text-t1">문화 인프라 폭발</h3>
        </div>
        <p className="text-[10px] text-t4 mb-4 ml-7">2025년 = UAE 문화 인프라 역사상 가장 많은 박물관/기관 개관</p>

        <div className="space-y-2.5 mb-4">
          {culturalInfrastructure.map((infra) => (
            <div
              key={infra.name}
              className="p-3 bg-bg/60 border border-brd rounded-lg hover:border-brd2 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-t1">{infra.name}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent-purple/10 text-accent-purple border border-accent-purple/15">
                  {infra.year}
                </span>
              </div>
              <div className="text-[10px] text-t4 mb-0.5">{infra.location}</div>
              <div className="text-[11px] text-t3 leading-snug">{infra.description}</div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-accent-purple/5 border border-accent-purple/15 rounded-lg mb-4">
          <div className="text-[11px] font-bold text-accent-purple mb-2">UNESCO 무형문화유산 (2025, 4건)</div>
          <div className="flex flex-wrap gap-2">
            {unescoItems.map((item) => (
              <span
                key={item.name}
                className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-accent-purple/10 text-accent-purple border border-accent-purple/15"
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>

        <InsightBox title="투자자 시사점" insights={culturalInsights} />
      </div>
    </Card>
  )
}

function GamingCard() {
  const gamingMetrics = useLocalizedData(gamingMetricsKo, gamingMetricsEn)
  const gamingInsights = useLocalizedData(gamingInsightsKo, gamingInsightsEn)

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🎮</span>
          <h3 className="text-sm font-bold text-t1">게이밍/e스포츠 허브 부상</h3>
        </div>
        <p className="text-[10px] text-t4 mb-4 ml-7">UAE+사우디가 중동을 글로벌 게이밍/e스포츠의 새로운 중심지로</p>

        <div className="space-y-2 mb-4">
          {gamingMetrics.map((metric) => (
            <div key={metric.label} className="flex gap-3 p-2.5 bg-bg/60 border border-brd rounded-lg">
              <div className="w-[130px] shrink-0 text-[11px] font-bold text-accent-cyan">{metric.label}</div>
              <div className="text-[11px] text-t2 leading-snug">{metric.value}</div>
            </div>
          ))}
        </div>

        <InsightBox title="투자자 시사점" insights={gamingInsights} />
      </div>
    </Card>
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

export function RecentTrends() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <CasinoCard />
        <LiberalizationCard />
      </div>

      <Collapsible
        header={
          <div className="flex items-center gap-2.5">
            <span className="text-base">🏛️</span>
            <span className="text-sm font-bold text-t1">문화 인프라 & 게이밍/e스포츠</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CulturalInfraCard />
          <GamingCard />
        </div>
      </Collapsible>

      <div className="mt-4">
        <Collapsible
          header={
            <div className="flex items-center gap-2.5">
              <span className="text-base">🧘</span>
              <span className="text-sm font-bold text-t1">Gen Z 트렌드 & K-Wave</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <GenZTrendsCard />
            <KWaveCard />
          </div>
          <TrendSummaryCard />
        </Collapsible>
      </div>
    </div>
  )
}
