/**
 * Number and date formatting utilities for consistent display across the dashboard
 */

export type Currency = 'USD' | 'AED' | 'KRW'

interface FormatNumberOptions {
  currency?: Currency
  compact?: boolean // Use B/T/M abbreviations
  decimals?: number
  locale?: 'ko' | 'en'
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  AED: 'AED ',
  KRW: '₩',
}

/**
 * Format large numbers with abbreviations (B, T, M)
 */
export function formatNumber(
  value: number,
  options: FormatNumberOptions = {}
): string {
  const { currency, compact = true, decimals = 1, locale = 'ko' } = options

  let formattedValue: string
  let suffix = ''

  if (compact) {
    if (value >= 1_000_000_000_000) {
      formattedValue = (value / 1_000_000_000_000).toFixed(decimals)
      suffix = 'T'
    } else if (value >= 1_000_000_000) {
      formattedValue = (value / 1_000_000_000).toFixed(decimals)
      suffix = 'B'
    } else if (value >= 1_000_000) {
      formattedValue = (value / 1_000_000).toFixed(decimals)
      suffix = 'M'
    } else if (value >= 1_000) {
      formattedValue = (value / 1_000).toFixed(decimals)
      suffix = 'K'
    } else {
      formattedValue = value.toFixed(decimals)
    }
    // Remove trailing zeros after decimal
    formattedValue = formattedValue.replace(/\.?0+$/, '')
  } else {
    formattedValue = value.toLocaleString(locale === 'en' ? 'en-US' : 'ko-KR')
  }

  const prefix = currency ? CURRENCY_SYMBOLS[currency] : ''
  return `${prefix}${formattedValue}${suffix}`
}

/**
 * Format percentage with + sign for positive values
 */
export function formatPercent(
  value: number,
  options: { showSign?: boolean; decimals?: number } = {}
): string {
  const { showSign = false, decimals = 1 } = options
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * Format date consistently
 */
export function formatDate(
  date: string | Date,
  options: { locale?: 'ko' | 'en'; format?: 'short' | 'long' | 'year-month' } = {}
): string {
  const { locale = 'ko', format = 'short' } = options
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'year-month') {
    return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: 'short',
    })
  }

  if (format === 'long') {
    return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Parse string like "$280B" or "2.5T" into number
 */
export function parseCompactNumber(value: string): number {
  const cleaned = value.replace(/[^0-9.BTMK]/gi, '')
  const numMatch = cleaned.match(/[\d.]+/)
  const suffixMatch = cleaned.match(/[BTMK]/i)

  if (!numMatch) return 0

  const num = parseFloat(numMatch[0])
  const suffix = suffixMatch ? suffixMatch[0].toUpperCase() : ''

  const multipliers: Record<string, number> = {
    K: 1_000,
    M: 1_000_000,
    B: 1_000_000_000,
    T: 1_000_000_000_000,
  }

  return num * (multipliers[suffix] || 1)
}
