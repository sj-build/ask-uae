'use client'

import { SectionTitle } from '@/components/ui/SectionTitle'
import { EconomyOverview } from '@/components/economy/EconomyOverview'
import { EconomyStructureDetailed } from '@/components/economy/EconomyStructureDetailed'
import { EconomyUniqueness } from '@/components/economy/EconomyUniqueness'
import { MacroRiskSummary } from '@/components/overview/MacroRiskSummary'
import { useLocale } from '@/hooks/useLocale'

export default function EconomyPage() {
  const { t } = useLocale()
  const p = t.pages.economy

  return (
    <>
      <SectionTitle
        title={p.title}
        subtitle={p.subtitle}
      />

      <section className="mb-2">
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-gold to-gold2" />
          {p.overviewTitle}
        </h2>
        <EconomyOverview />
      </section>

      <section className="mb-2">
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-accent-blue to-accent-cyan" />
          {p.structureTitle}
        </h2>
        <EconomyStructureDetailed />
      </section>

      <section className="mb-2">
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-accent-purple to-accent-pink" />
          {p.uniquenessTitle}
        </h2>
        <EconomyUniqueness />
      </section>

      <section>
        <h2 className="text-sm font-bold text-t2 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-accent-red to-accent-orange" />
          {p.macroRiskTitle}
        </h2>
        <MacroRiskSummary />
      </section>
    </>
  )
}
