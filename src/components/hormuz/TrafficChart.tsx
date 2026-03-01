'use client'

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import type { TrafficSummary } from '@/types/hormuz'
import { useLocale } from '@/hooks/useLocale'

interface TrafficChartProps {
  readonly data: TrafficSummary[]
}

interface ChartPoint {
  time: string
  total: number
  tankers: number
}

export function TrafficChart({ data }: TrafficChartProps) {
  const { locale } = useLocale()

  const chartData = useMemo<ChartPoint[]>(() => {
    return data.map(d => ({
      time: d.period_start,
      total: d.total_vessels,
      tankers: d.tanker_count,
    }))
  }, [data])

  function formatXTick(value: string) {
    const d = new Date(value)
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:00`
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c8a44e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#c8a44e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="tankerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2330" />
          <XAxis
            dataKey="time"
            tickFormatter={formatXTick}
            stroke="#4a5568"
            tick={{ fontSize: 10, fill: '#6b7280' }}
          />
          <YAxis
            stroke="#4a5568"
            tick={{ fontSize: 10, fill: '#6b7280' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0e1017',
              border: '1px solid #2a2f3d',
              borderRadius: '8px',
              fontSize: '11px',
            }}
            labelFormatter={(label) => {
              const d = new Date(label)
              return d.toLocaleString(locale === 'en' ? 'en-US' : 'ko-KR')
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          <Area
            type="monotone"
            dataKey="total"
            name={locale === 'en' ? 'Total Vessels' : '전체 선박'}
            stroke="#c8a44e"
            fill="url(#totalGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="tankers"
            name={locale === 'en' ? 'Tankers' : '유조선'}
            stroke="#3b82f6"
            fill="url(#tankerGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
