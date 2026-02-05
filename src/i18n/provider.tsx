'use client'

import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import type { Locale, Translations } from './types'
import { ko } from './ko'
import { en } from './en'

const translations: Record<Locale, Translations> = { ko, en }

interface LocaleContextValue {
  readonly locale: Locale
  readonly t: Translations
  readonly setLocale: (locale: Locale) => void
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: 'ko',
  t: ko,
  setLocale: () => {},
})

export function LocaleProvider({ children }: { readonly children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ko')

  useEffect(() => {
    const saved = localStorage.getItem('uae-dashboard-locale') as Locale | null
    if (saved === 'ko' || saved === 'en') {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('uae-dashboard-locale', newLocale)
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}
