'use client'

import { useContext } from 'react'
import { LocaleContext } from '@/i18n/provider'

export function useLocale() {
  return useContext(LocaleContext)
}
