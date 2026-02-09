'use client'

import { useState } from 'react'
import type { Sector } from '@/types/sector'
import { PlayerRow } from './PlayerRow'
import { ValueChain } from './ValueChain'

interface SectorCardProps {
  readonly sector: Sector
  readonly locale?: 'ko' | 'en'
}

interface MarketSize {
  readonly current: number
  readonly currentYear: string
  readonly future: number
  readonly futureYear: string
  readonly unit: string
  readonly label?: string
}

function parseMarketSize(sizeString: string): MarketSize | null {
  // Parse patterns like "AI $950M (2024) → $4.3B (2030E)" or "$4.2B (2024)" or "$1.1T (2024)"
  const match = sizeString.match(/\$?([\d.]+)([TBM])\s*\((\d{4})[E]?\)\s*→?\s*\$?([\d.]+)?([TBM])?\s*\(?(\d{4})?[E]?\)?/)

  if (!match) return null

  const currentVal = parseFloat(match[1])
  const currentUnit = match[2]
  const currentYear = match[3]
  const futureVal = match[4] ? parseFloat(match[4]) : currentVal * 1.3
  const futureUnit = match[5] || currentUnit
  const futureYear = match[6] || String(parseInt(currentYear) + 5)

  // Normalize to billions (T=1000B, M=0.001B)
  const unitToB = (val: number, unit: string) => {
    if (unit === 'T') return val * 1000
    if (unit === 'M') return val / 1000
    return val
  }

  const currentInB = unitToB(currentVal, currentUnit)
  const futureInB = unitToB(futureVal, futureUnit)

  return {
    current: currentInB,
    currentYear,
    future: futureInB,
    futureYear,
    unit: 'B',
  }
}

function extractFirstMarketSize(sizeString: string): MarketSize | null {
  // Get the first market size segment (before · if exists)
  const firstSegment = sizeString.split('·')[0].trim()
  return parseMarketSize(firstSegment)
}

function formatValue(val: number): string {
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}T`
  if (val >= 1) return `$${val.toFixed(1)}B`
  return `$${(val * 1000).toFixed(0)}M`
}

function MarketSizeBar({ size, sizeString, cagr, isEn }: { size: MarketSize; sizeString: string; cagr: string; isEn?: boolean }) {
  const maxSize = size.future
  const currentWidth = Math.min((size.current / maxSize) * 100, 100)
  const futureWidth = 100

  // Calculate period for CAGR
  const period = `${size.currentYear}-${size.futureYear}`

  return (
    <div className="mt-3 pt-3 border-t border-brd/30">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] text-t4 font-medium">{isEn ? 'Market Size' : '시장 규모'}</div>
        <div className="text-[10px] font-semibold text-accent-green">
          {cagr} <span className="text-t4 font-normal">({period})</span>
        </div>
      </div>
      <div className="space-y-2">
        {/* Current */}
        <div className="flex items-center gap-2">
          <span className="w-12 text-[10px] text-t3 shrink-0">{size.currentYear}</span>
          <div className="flex-1 h-5 bg-bg/50 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold/80 to-gold rounded"
              style={{ width: `${currentWidth}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-gold w-16 text-right">
            {formatValue(size.current)}
          </span>
        </div>
        {/* Future */}
        <div className="flex items-center gap-2">
          <span className="w-12 text-[10px] text-t3 shrink-0">{size.futureYear}E</span>
          <div className="flex-1 h-5 bg-bg/50 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-green/70 to-accent-green rounded"
              style={{ width: `${futureWidth}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-accent-green w-16 text-right">
            {formatValue(size.future)}
          </span>
        </div>
      </div>
      {/* Additional context */}
      {sizeString.includes('·') && (
        <div className="mt-2 text-[10px] text-t4">
          {sizeString.split('·').slice(1).map(s => s.trim()).join(' · ')}
        </div>
      )}
    </div>
  )
}

export function SectorCard({ sector, locale = 'ko' }: SectorCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const marketSize = extractFirstMarketSize(sector.size)
  const isEn = locale === 'en'

  return (
    <div className={`bg-bg3/80 border rounded-xl overflow-hidden transition-[border-color,box-shadow] duration-300 ease-out ${isOpen ? 'border-brd2 shadow-[0_4px_30px_rgba(0,0,0,0.25)]' : 'border-brd hover:border-brd2'}`}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className={`w-full p-4 px-5 flex items-center gap-3.5 cursor-pointer text-left transition-[background-color,border-color] duration-250 focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-inset ${isOpen ? 'border-b border-brd bg-bg3' : 'border-b border-transparent hover:bg-bg3/60'}`}
      >
        <div className="text-[26px] transition-transform duration-300" style={{ transform: isOpen ? 'scale(1.05)' : 'scale(1)' }}>{sector.icon}</div>
        <div className="flex-1">
          <div className="font-bold text-[15px]">{sector.name}</div>
        </div>
        <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-bg/60 text-t2 border border-brd/50">
          {isOpen ? (isEn ? 'Collapse' : '접기') : (isEn ? 'Expand' : '펼치기')}
        </span>
      </button>
      {isOpen && (
        <div className="p-4 px-5 animate-fade-in">
          {/* Market Size Visual */}
          {marketSize && <MarketSizeBar size={marketSize} sizeString={sector.size} cagr={sector.cagr} isEn={isEn} />}

          {/* Value Chain */}
          {sector.valueChain && sector.valueChain.length > 0 && (
            <div className="mt-4 pt-3 border-t border-brd/30">
              <div className="text-[10px] text-t4 font-medium mb-2">{isEn ? 'Value Chain' : '밸류체인'}</div>
              <ValueChain steps={sector.valueChain} />
            </div>
          )}

          {/* Player Header */}
          <div className="grid grid-cols-[minmax(100px,140px)_minmax(70px,100px)_1fr] gap-3 pb-2 mb-1 mt-4 border-b border-brd text-[10px] text-t4 font-semibold uppercase tracking-wider">
            <span>Company</span>
            <span>Position</span>
            <span>Key Facts</span>
          </div>
          <div>
            {sector.players.map((player) => (
              <PlayerRow key={player.name} player={player} />
            ))}
          </div>
          {sector.insight && (
            <div className="mt-3 p-3 bg-bg/80 rounded-lg text-[11px] text-gold border border-gold/10">
              {sector.insight}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
