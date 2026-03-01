'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/hooks/useLocale'
import { useState, useRef, useEffect, useCallback } from 'react'

type NavKey = 'home' | 'comparison' | 'places' | 'politics' | 'economy' | 'society' | 'industry' | 'legal' | 'news' | 'crisisMap' | 'hormuzMonitor' | 'warRoom' | 'marketImpact'

interface TabItem {
  readonly href: string
  readonly key: NavKey
  readonly icon: string
}

interface TabDropdown {
  readonly type: 'dropdown'
  readonly key: 'hormuzCrisis'
  readonly icon: string
  readonly items: readonly TabItem[]
}

type TabEntry = TabItem | TabDropdown

function isDropdown(entry: TabEntry): entry is TabDropdown {
  return 'type' in entry && entry.type === 'dropdown'
}

const tabs: readonly TabEntry[] = [
  { href: '/home', key: 'home', icon: '🏠' },
  {
    type: 'dropdown',
    key: 'hormuzCrisis',
    icon: '🔴',
    items: [
      { href: '/crisis-map', key: 'crisisMap', icon: '🗺️' },
      { href: '/hormuz', key: 'hormuzMonitor', icon: '⚓' },
      { href: '/war-room', key: 'warRoom', icon: '🎯' },
      { href: '/market-impact', key: 'marketImpact', icon: '💹' },
    ],
  },
  { href: '/comparison', key: 'comparison', icon: '🔄' },
  { href: '/places', key: 'places', icon: '📍' },
  { href: '/politics', key: 'politics', icon: '🏛️' },
  { href: '/economy', key: 'economy', icon: '📈' },
  { href: '/society', key: 'society', icon: '🎭' },
  { href: '/industry', key: 'industry', icon: '🏭' },
  { href: '/legal', key: 'legal', icon: '⚖️' },
  { href: '/news', key: 'news', icon: '📰' },
] as const

function DropdownTab({ entry, pathname }: { readonly entry: TabDropdown; readonly pathname: string }) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isChildActive = entry.items.some(item => pathname === item.href)

  const handleClose = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open, handleClose])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`
          relative px-4 py-2 rounded-lg text-[11px] font-semibold whitespace-nowrap
          transition-colors duration-200 flex items-center gap-2 cursor-pointer
          ${isChildActive
            ? 'text-gold bg-gold/[0.08] border border-gold/20 shadow-[0_2px_12px_rgba(200,164,78,0.08)]'
            : 'text-t4 hover:text-t2 hover:bg-bg3/50 border border-transparent'
          }
        `}
      >
        {isChildActive && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
        )}
        <span className="text-sm">{entry.icon}</span>
        <span className={isChildActive ? 'text-gold' : ''}>
          {t.nav[entry.key]}
        </span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[180px] bg-bg2 border border-brd/60 rounded-lg shadow-2xl overflow-hidden backdrop-blur-xl">
          {entry.items.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className={`
                  flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-semibold whitespace-nowrap
                  transition-colors duration-150
                  ${isActive
                    ? 'text-gold bg-gold/[0.08]'
                    : 'text-t4 hover:text-t2 hover:bg-bg3/60'
                  }
                `}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{t.nav[item.key]}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function TabNav() {
  const pathname = usePathname()
  const { t } = useLocale()

  return (
    <div className="px-6 bg-bg/70 backdrop-blur-2xl border-b border-brd/30">
      <div className="max-w-[1700px] mx-auto">
        <nav className="flex gap-1 overflow-x-auto py-2 -mx-1">
          {tabs.map((entry, idx) => {
            if (isDropdown(entry)) {
              return <DropdownTab key={entry.key} entry={entry} pathname={pathname} />
            }

            const isActive = pathname === entry.href
            return (
              <Link
                key={entry.href}
                href={entry.href}
                className={`
                  relative px-4 py-2 rounded-lg text-[11px] font-semibold whitespace-nowrap
                  transition-colors duration-200 flex items-center gap-2
                  ${isActive
                    ? 'text-gold bg-gold/[0.08] border border-gold/20 shadow-[0_2px_12px_rgba(200,164,78,0.08)]'
                    : 'text-t4 hover:text-t2 hover:bg-bg3/50 border border-transparent'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
                )}
                <span className="text-sm">{entry.icon}</span>
                <span className={isActive ? 'text-gold' : ''}>
                  {t.nav[entry.key]}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
