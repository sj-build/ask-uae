import { NextResponse } from 'next/server'
import { upsertOilPrice } from '@/lib/hormuz/queries'
import type { OilBenchmark, OilPrice } from '@/types/hormuz'

export const maxDuration = 55

function verifyCronSecret(request: Request): boolean {
  const cronSecret = request.headers.get('x-cron-secret')
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET) {
    return process.env.NODE_ENV === 'development'
  }
  return (
    cronSecret === process.env.CRON_SECRET ||
    authHeader === `Bearer ${process.env.CRON_SECRET}`
  )
}

interface YahooChartResult {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number
        previousClose: number
        currency: string
        exchangeTimezoneName: string
        regularMarketVolume?: number
      }
      indicators: {
        quote: Array<{
          open: number[]
          high: number[]
          low: number[]
          close: number[]
          volume: number[]
        }>
      }
      timestamp: number[]
    }> | null
    error: { code: string; description: string } | null
  }
}

interface OilFetchResult {
  benchmark: OilBenchmark
  symbol: string
  data: Omit<OilPrice, 'id' | 'created_at'> | null
  error: string | null
}

async function fetchOilPrice(
  symbol: string,
  benchmark: OilBenchmark
): Promise<OilFetchResult> {
  try {
    // Fetch with 30min interval for spike detection
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=5m&range=2h`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HormuzDashboard/1.0)',
      },
      signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
      return { benchmark, symbol, data: null, error: `Yahoo API ${res.status}` }
    }

    const json = (await res.json()) as YahooChartResult
    const result = json.chart?.result?.[0]
    if (!result) {
      return { benchmark, symbol, data: null, error: 'No chart result' }
    }

    const meta = result.meta
    const quotes = result.indicators?.quote?.[0]
    const timestamps = result.timestamp ?? []

    const currentPrice = meta.regularMarketPrice
    const prevClose = meta.previousClose

    // Get OHLC from latest data points
    const opens = quotes?.open?.filter(Boolean) ?? []
    const highs = quotes?.high?.filter(Boolean) ?? []
    const lows = quotes?.low?.filter(Boolean) ?? []
    const volumes = quotes?.volume?.filter(Boolean) ?? []

    const openPrice = opens[0] ?? null
    const highPrice = highs.length > 0 ? Math.max(...highs) : null
    const lowPrice = lows.length > 0 ? Math.min(...lows) : null
    const volume = volumes.length > 0 ? volumes.reduce((a, b) => a + b, 0) : null

    // Compute changes
    const changePct = prevClose ? ((currentPrice - prevClose) / prevClose) * 100 : null

    // 30min change: compare with price ~6 data points ago (5min intervals)
    const closes = quotes?.close?.filter(Boolean) ?? []
    let change30mPct: number | null = null
    let change1hPct: number | null = null
    let spikeFlag = false

    if (closes.length >= 7) {
      const price30mAgo = closes[Math.max(0, closes.length - 7)]
      change30mPct = ((currentPrice - price30mAgo) / price30mAgo) * 100

      // Spike detection: >$5 in 30min
      if (Math.abs(currentPrice - price30mAgo) > 5) {
        spikeFlag = true
      }
    }

    if (closes.length >= 13) {
      const price1hAgo = closes[Math.max(0, closes.length - 13)]
      change1hPct = ((currentPrice - price1hAgo) / price1hAgo) * 100

      // Spike detection: >$10 in 1h
      if (Math.abs(currentPrice - price1hAgo) > 10) {
        spikeFlag = true
      }
    }

    // Detect if market is open based on recent timestamps
    const lastTimestamp = timestamps[timestamps.length - 1]
    const isMarketOpen = lastTimestamp
      ? Date.now() / 1000 - lastTimestamp < 600 // within 10min
      : false

    return {
      benchmark,
      symbol,
      data: {
        benchmark,
        symbol,
        price: currentPrice,
        open_price: openPrice,
        high_price: highPrice,
        low_price: lowPrice,
        prev_close: prevClose,
        change_pct: changePct ? Math.round(changePct * 100) / 100 : null,
        change_1h_pct: change1hPct ? Math.round(change1hPct * 100) / 100 : null,
        change_30m_pct: change30mPct ? Math.round(change30mPct * 100) / 100 : null,
        volume,
        source: 'yahoo_finance',
        is_market_open: isMarketOpen,
        spike_flag: spikeFlag,
        fetched_at: new Date().toISOString(),
      },
      error: null,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { benchmark, symbol, data: null, error: message }
  }
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [brentResult, wtiResult] = await Promise.all([
      fetchOilPrice('BZ=F', 'brent'),
      fetchOilPrice('CL=F', 'wti'),
    ])

    let upsertCount = 0
    const errors: string[] = []

    if (brentResult.data) {
      const ok = await upsertOilPrice(brentResult.data)
      if (ok) upsertCount++
      else errors.push('Brent upsert failed')
    } else if (brentResult.error) {
      errors.push(`Brent: ${brentResult.error}`)
    }

    if (wtiResult.data) {
      const ok = await upsertOilPrice(wtiResult.data)
      if (ok) upsertCount++
      else errors.push('WTI upsert failed')
    } else if (wtiResult.error) {
      errors.push(`WTI: ${wtiResult.error}`)
    }

    const brentPrice = brentResult.data?.price
    const wtiPrice = wtiResult.data?.price
    const spikes = [brentResult.data, wtiResult.data].filter(d => d?.spike_flag)

    return NextResponse.json({
      success: upsertCount > 0,
      message: `Oil prices: Brent=$${brentPrice ?? 'N/A'}, WTI=$${wtiPrice ?? 'N/A'}${spikes.length > 0 ? ' ⚠️ SPIKE DETECTED' : ''}`,
      count: upsertCount,
      ...(errors.length > 0 ? { errors } : {}),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Oil ingest failed'
    console.error('ingest-oil error:', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
