'use client'

import { SectionTitle } from '@/components/ui/SectionTitle'
import { PopulationStructure } from '@/components/society/PopulationStructure'
import { BusinessCulture } from '@/components/society/BusinessCulture'
import { ReligionSection } from '@/components/society/ReligionSection'
import { EssentialKnowledge } from '@/components/society/EssentialKnowledge'
import { RecentTrends } from '@/components/society/RecentTrends'
import { useLocale } from '@/hooks/useLocale'

export default function SocietyPage() {
  const { t } = useLocale()
  const p = t.pages.society

  return (
    <>
      <SectionTitle
        title={p.title}
        subtitle={p.subtitle}
      />

      <section className="mb-8">
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-gold to-gold2" />
          {p.populationTitle}
        </h2>
        <PopulationStructure />
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-accent-purple to-accent-pink" />
          {p.businessCultureTitle}
        </h2>
        <BusinessCulture />
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-accent-green to-accent-cyan" />
          {p.religionTitle}
        </h2>
        <ReligionSection />
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-accent-blue to-accent-cyan" />
          {p.essentialTitle}
        </h2>
        <EssentialKnowledge />
      </section>

      <section className="mb-2">
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-accent-red to-accent-orange" />
          {p.trendsTitle}
        </h2>
        <RecentTrends />
      </section>
    </>
  )
}
