'use client'

import { useState, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { TabNav } from '@/components/layout/TabNav'
import { Footer } from '@/components/layout/Footer'
import { SearchModal } from '@/components/layout/SearchModal'

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const [searchOpen, setSearchOpen] = useState(false)

  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearchClick={openSearch} />
      <TabNav />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1700px] mx-auto w-full animate-fade-in">
        {children}
      </main>
      <Footer />
      <SearchModal isOpen={searchOpen} onClose={closeSearch} />
    </div>
  )
}
