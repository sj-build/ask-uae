'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/hooks/useLocale'

const tabs = [
  { href: '/home', key: 'home' as const, icon: '\u25C8' },
  { href: '/comparison', key: 'comparison' as const, icon: '\u2194' },
  { href: '/politics', key: 'politics' as const, icon: '\u2666' },
  { href: '/economy', key: 'economy' as const, icon: '\u25B2' },
  { href: '/society', key: 'society' as const, icon: '\u2B22' },
  { href: '/industry', key: 'industry' as const, icon: '\u25A0' },
  { href: '/legal', key: 'legal' as const, icon: '\u2696' },
] as const

export function TabNav() {
  const pathname = usePathname()
  const { t } = useLocale()

  return (
    <div className="px-6 bg-bg/80 backdrop-blur-2xl border-b border-brd/40">
      <div className="max-w-[1700px] mx-auto">
        <nav className="flex gap-0.5 overflow-x-auto py-1.5 -mx-1">
          {tabs.map(({ href, key, icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-3.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-gold bg-gold/10 border border-gold/20 shadow-[0_1px_8px_rgba(200,164,78,0.06)]'
                    : 'text-t4 hover:text-t2 hover:bg-bg3/60 border border-transparent'
                }`}
              >
                <span className={`text-[9px] transition-colors duration-300 ${isActive ? 'text-gold/70' : 'text-t4/60'}`}>{icon}</span>
                {t.nav[key]}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
