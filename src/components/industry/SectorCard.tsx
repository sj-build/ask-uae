'use client'

import { useState } from 'react'
import type { Sector } from '@/types/sector'
import { PlayerRow } from './PlayerRow'

interface SectorCardProps {
  readonly sector: Sector
}

export function SectorCard({ sector }: SectorCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`bg-bg3/80 border rounded-xl overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'border-brd2 shadow-[0_4px_30px_rgba(0,0,0,0.25)]' : 'border-brd hover:border-brd2'}`}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full p-4 px-5 flex items-center gap-3.5 cursor-pointer text-left transition-all duration-250 ${isOpen ? 'border-b border-brd bg-bg3' : 'border-b border-transparent hover:bg-bg3/60'}`}
      >
        <div className="text-[26px] transition-transform duration-300" style={{ transform: isOpen ? 'scale(1.05)' : 'scale(1)' }}>{sector.icon}</div>
        <div className="flex-1">
          <div className="font-bold text-[15px]">{sector.name}</div>
          <div className="font-mono text-[13px] text-gold mt-px">{sector.size}</div>
        </div>
        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-accent-green/10 text-accent-green border border-accent-green/15">
          {sector.cagr}
        </span>
      </button>
      {isOpen && (
        <div className="p-4 px-5 animate-fade-in">
          <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] gap-2 pb-2 mb-1 border-b border-brd text-[10px] text-t4 font-semibold uppercase tracking-wider">
            <span>Company</span>
            <span>Position</span>
            <span>Market Cap</span>
            <span>Revenue</span>
            <span className="text-right">Note</span>
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
