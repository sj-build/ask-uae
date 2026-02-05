'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface GdpSector {
  readonly label: string
  readonly percentage: number
  readonly value: string
  readonly color: string
}

const gdpSectors: readonly GdpSector[] = [
  { label: '석유/가스', percentage: 24.5, value: '$131.6B', color: '#c8a44e' },
  { label: '무역', percentage: 16.5, value: '$88.6B', color: '#4a9eff' },
  { label: '제조', percentage: 15, value: '$80.6B', color: '#34d399' },
  { label: '금융', percentage: 12.5, value: '$67.1B', color: '#a78bfa' },
  { label: '건설', percentage: 11.6, value: '$62.3B', color: '#f59e0b' },
  { label: '관광/기타', percentage: 19.9, value: '$106.9B', color: '#22d3ee' },
] as const

interface TradeFlowStep {
  readonly label: string
  readonly detail: string
  readonly icon: string
}

const tradeFlow: readonly TradeFlowStep[] = [
  { label: '수입', detail: '인도, 중국, 일본, 사우디', icon: '📥' },
  { label: 'UAE 허브', detail: '물류 가공 + 가치 추가', icon: '🏗️' },
  { label: '재수출', detail: '중동/아프리카/CIS', icon: '📤' },
] as const

interface VisionTarget {
  readonly label: string
  readonly current: string
  readonly target: string
  readonly progress: number
  readonly color: string
}

const visionTargets: readonly VisionTarget[] = [
  {
    label: 'GDP',
    current: 'AED 1.78조',
    target: 'AED 3조',
    progress: 59,
    color: '#c8a44e',
  },
  {
    label: '비석유 수출',
    current: '현재 추진 중',
    target: '$410B',
    progress: 42,
    color: '#4a9eff',
  },
  {
    label: '유니콘 기업',
    current: '~10개',
    target: '30개 (D33)',
    progress: 33,
    color: '#a78bfa',
  },
] as const

function GdpBreakdown() {
  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          GDP 구성 (2024)
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          총 GDP $537B — 비석유 비중 75.5%
        </p>
        <div className="space-y-2.5">
          {gdpSectors.map((sector) => (
            <ProgressBar
              key={sector.label}
              label={sector.label}
              percentage={sector.percentage}
              value={sector.value}
              color={sector.color}
              labelBold={sector.label === '석유/가스'}
            />
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-brd flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gold animate-glow-pulse" />
          <span className="text-[11px] text-t3">
            관광: 연 방문객 <span className="text-t2 font-semibold">1,800만+</span>, 수입 <span className="text-t2 font-semibold">$48B</span>
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full bg-accent-purple animate-glow-pulse" />
          <span className="text-[11px] text-t3">
            부동산: Dubai AED <span className="text-t2 font-semibold">488B</span> 거래 (2024, +30% YoY)
          </span>
        </div>
      </div>
    </Card>
  )
}

function TradeStructure() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          무역 구조
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          총 무역 <span className="text-t2 font-semibold">$1.42T</span> (2024) — 한국보다 큼
        </p>

        <div className="flex items-center gap-1 mb-5">
          {tradeFlow.map((step, index) => (
            <div key={step.label} className="flex items-center flex-1">
              <div
                className="flex-1 bg-bg rounded-lg p-3 text-center transition-all duration-300 cursor-default border border-brd"
                style={{
                  borderColor: hoveredStep === index ? '#c8a44e' : undefined,
                  boxShadow: hoveredStep === index ? '0 0 20px rgba(200, 164, 78, 0.1)' : 'none',
                }}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="text-lg mb-1">{step.icon}</div>
                <div className="text-xs font-bold text-t1">{step.label}</div>
                <div className="text-[10px] text-t3 mt-0.5">{step.detail}</div>
              </div>
              {index < tradeFlow.length - 1 && (
                <div className="text-gold text-xs px-1 shrink-0">{'>'}</div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-bg rounded-lg p-3 border border-brd">
          <div className="text-[11px] text-t3 mb-2 font-semibold text-t2">주요 교역국</div>
          <div className="flex flex-wrap gap-1.5">
            {['인도', '일본', '중국', '사우디', '이라크'].map((country) => (
              <span
                key={country}
                className="text-[10px] px-2 py-0.5 bg-bg3 rounded-full text-t2 border border-brd"
              >
                {country}
              </span>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-t3">
            한국-UAE 교역: <span className="text-gold font-semibold">~$20B/년</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function Vision2031() {
  return (
    <Card>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gold mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          UAE 2031 비전
        </h3>
        <p className="text-[11px] text-t3 mb-4">
          경제 다변화 및 성장 목표 달성 현황
        </p>

        <div className="space-y-4">
          {visionTargets.map((target) => (
            <div key={target.label} className="bg-bg rounded-lg p-3 border border-brd">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-t1">{target.label}</span>
                <span className="text-[10px] text-t3">
                  {target.current} <span className="text-t4 mx-1">/</span>{' '}
                  <span className="font-semibold" style={{ color: target.color }}>
                    {target.target}
                  </span>
                </span>
              </div>
              <div className="h-2 bg-bg3 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${target.progress}%`,
                    background: `linear-gradient(90deg, ${target.color}, ${target.color}88)`,
                  }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-[10px] font-semibold" style={{ color: target.color }}>
                  {target.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export function EconomyStructureDetailed() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
      <GdpBreakdown />
      <TradeStructure />
      <Vision2031 />
    </div>
  )
}
