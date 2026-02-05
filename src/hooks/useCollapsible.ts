'use client'

import { useState, useCallback } from 'react'

export function useCollapsible(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])
  return { isOpen, toggle } as const
}
