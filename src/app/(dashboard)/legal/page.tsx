'use client'

import { SectionTitle } from '@/components/ui/SectionTitle'
import { LegalFramework } from '@/components/legal/LegalFramework'
import { BusinessRegulations } from '@/components/legal/BusinessRegulations'
import { FreeZones } from '@/components/legal/FreeZones'
import { RecentLegalChanges } from '@/components/legal/RecentLegalChanges'
import { useLocale } from '@/hooks/useLocale'

export default function LegalPage() {
  const { t } = useLocale()
  const p = t.pages.legal

  return (
    <>
      <SectionTitle
        title={p.title}
        subtitle={p.subtitle}
      />

      <section className="mb-2">
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-gold to-gold2" />
          {p.frameworkTitle}
        </h2>
        <LegalFramework />
      </section>

      <section className="mb-2">
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-accent-blue to-accent-cyan" />
          {p.regulationsTitle}
        </h2>
        <BusinessRegulations />
      </section>

      <section className="mb-2">
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-accent-purple to-accent-pink" />
          {p.freeZonesTitle}
        </h2>
        <FreeZones />
      </section>

      <section>
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-accent-green to-accent-cyan" />
          {p.timelineTitle}
        </h2>
        <RecentLegalChanges />
      </section>
    </>
  )
}
