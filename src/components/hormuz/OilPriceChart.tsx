'use client'

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import type { OilPrice } from '@/types/hormuz'
import { useLocale } from '@/hooks/useLocale'

interface OilPriceChartProps {
  readonly brentHistory: OilPrice[]
  readonly wtiHistory: OilPrice[]
}

interface ChartPoint {
  time: string
  brent: number | null
  wti: number | null
}

export function OilPriceChart({ brentHistory, wtiHistory }: OilPriceChartProps) {
  const { locale } = useLocale()

  const data = useMemo(() => {
    const map = new Map<string, ChartPoint>()

    for (const p of brentHistory) {
      const key = p.fetched_at.slice(0, 16) // group to minute
      const existing = map.get(key)
      if (existing) {
        existing.brent = p.price
      } else {
        map.set(key, { time: key, brent: p.price, wti: null })
      }
    }
    for (const p of wtiHistory) {
      const key = p.fetched_at.slice(0, 16)
      const existing = map.get(key)
      if (existing) {
        existing.wti = p.price
      } else {
        map.set(key, { time: key, brent: null, wti: p.price })
      }
    }

    return Array.from(map.values()).sort((a, b) => a.time.localeCompare(b.time))
  }, [brentHistory, wtiHistory])

  function formatXTick(value: string) {
    const d = new Date(value)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
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
            domain={['auto', 'auto']}
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
          <Legend
            wrapperStyle={{ fontSize: '11px' }}
          />
          <Line
            type="monotone"
            dataKey="brent"
            name="Brent"
            stroke="#c8a44e"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="wti"
            name="WTI"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
