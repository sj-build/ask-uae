'use client'

import { useLocale } from '@/hooks/useLocale'
import type { Locale } from '@/i18n/types'

interface HeaderProps {
  readonly onSearchClick: () => void
}

export function Header({ onSearchClick }: HeaderProps) {
  const { locale, t, setLocale } = useLocale()

  return (
    <div className="sticky top-0 z-50">
      {/* UAE flag accent line: green-white-black with red accent */}
      <div className="h-[2px] flex">
        <div className="flex-1 bg-gradient-to-r from-transparent via-[#00732f]/50 to-[#00732f]/60" />
        <div className="w-16 bg-gradient-to-r from-[#00732f]/60 via-white/30 to-white/30" />
        <div className="flex-1 bg-gradient-to-r from-white/30 via-gold/50 to-transparent" />
      </div>
      <div className="bg-bg/92 backdrop-blur-2xl border-b border-brd/60 px-6">
        <div className="max-w-[1700px] mx-auto flex items-center h-[52px] gap-4">
          <div className="whitespace-nowrap flex items-center gap-3">
            <div className="w-[3px] h-5 rounded-full bg-gradient-to-b from-gold to-gold2/60" />
            <div>
              <span className="font-display text-[17px] font-bold text-gold tracking-wide">{t.header.title}</span>
              <span className="text-t4 font-sans text-[10px] font-normal ml-2.5 tracking-tight hidden sm:inline">{t.header.subtitle}</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setLocale(locale === 'ko' ? 'en' as Locale : 'ko' as Locale)}
              className="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider text-t4 hover:text-gold hover:bg-gold/5 transition-all duration-300 uppercase"
            >
              {locale === 'ko' ? 'EN' : 'KO'}
            </button>
            <div className="w-px h-4 bg-brd/80" />
            <button
              onClick={onSearchClick}
              className="group px-3.5 py-1.5 rounded-lg text-[11px] font-semibold bg-gold/8 text-gold/90 border border-gold/15 hover:bg-gold/15 hover:text-gold hover:border-gold/30 hover:shadow-[0_0_24px_rgba(200,164,78,0.1)] transition-all duration-300 whitespace-nowrap"
            >
              <span className="mr-1.5 opacity-60 group-hover:opacity-100 transition-opacity">&#x2315;</span>
              {t.nav.search}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
