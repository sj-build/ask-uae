'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface CollapsibleProps {
  readonly header: ReactNode
  readonly children: ReactNode
  readonly defaultOpen?: boolean
}

export function Collapsible({ header, children, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className={`group w-full flex items-center gap-3 p-3.5 px-5 bg-bg3/60 border border-brd/80 rounded-xl cursor-pointer transition-[background-color,border-color] duration-400 ease-out hover:bg-bg3/90 text-left focus-visible:ring-2 focus-visible:ring-gold/50 ${
          isOpen ? 'rounded-b-none border-b-transparent border-brd2/60' : 'hover:border-brd2/40'
        }`}
      >
        {header}
        <ChevronDown
          className={`w-3.5 h-3.5 text-t4 transition-transform duration-400 ease-out ml-auto shrink-0 group-hover:text-t3 ${
            isOpen ? 'rotate-180 text-gold/50' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="border border-brd2/50 border-t-0 rounded-b-xl p-5 bg-bg2/70 backdrop-blur-sm animate-fade-in">
          {children}
        </div>
      )}
    </div>
  )
}
