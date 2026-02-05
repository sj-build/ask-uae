'use client'

import { SectionTitle } from '@/components/ui/SectionTitle'
import { SectorGrid } from '@/components/industry/SectorGrid'
import { sectors as sectorsKo } from '@/data/industry/sectors'
import { sectors as sectorsEn } from '@/data/industry/sectors.en'
import { useLocale } from '@/hooks/useLocale'
import { useLocalizedData } from '@/hooks/useLocalizedData'

export default function IndustryPage() {
  const { t } = useLocale()
  const p = t.pages.industry
  const localSectors = useLocalizedData(sectorsKo, sectorsEn)

  return (
    <>
      <SectionTitle
        title={p.title}
        subtitle={p.subtitle}
      />
      <SectorGrid sectors={localSectors} />
    </>
  )
}
