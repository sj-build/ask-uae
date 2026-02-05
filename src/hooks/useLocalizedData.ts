'use client'

import { useLocale } from './useLocale'

export function useLocalizedData<T>(ko: T, en: T): T {
  const { locale } = useLocale()
  return locale === 'en' ? en : ko
}
