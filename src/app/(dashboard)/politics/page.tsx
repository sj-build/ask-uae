'use client'

import { SectionTitle } from '@/components/ui/SectionTitle'
import { Collapsible } from '@/components/ui/Collapsible'
import { PoliticalSystem } from '@/components/overview/PoliticalSystem'
import { EmiratesCards } from '@/components/overview/EmiratesCards'
import { AbuDhabiVsDubai } from '@/components/overview/AbuDhabiVsDubai'
import { GovernmentStructure } from '@/components/overview/GovernmentStructure'
import { AbuDhabiGovernment } from '@/components/overview/AbuDhabiGovernment'
import { TierSection } from '@/components/power/TierSection'
import { ConnectionTree } from '@/components/connection/ConnectionTree'
import { tiers as tiersKo } from '@/data/power/tiers'
import { tiers as tiersEn } from '@/data/power/tiers.en'
import { connectionTrees as treesKo } from '@/data/connection/trees'
import { connectionTrees as treesEn } from '@/data/connection/trees.en'
import { useLocale } from '@/hooks/useLocale'
import { useLocalizedData } from '@/hooks/useLocalizedData'

export default function PoliticsPage() {
  const { t } = useLocale()
  const p = t.pages.politics

  const localTiers = useLocalizedData(tiersKo, tiersEn)
  const localTrees = useLocalizedData(treesKo, treesEn)

  return (
    <>
      <SectionTitle
        title={p.title}
        subtitle={p.subtitle}
      />

      <section className="mb-10">
        <SectionTitle title={p.systemTitle} subtitle={p.systemSubtitle} />
        <PoliticalSystem />
      </section>

      <section className="mb-10">
        <SectionTitle title={p.emiratesTitle} subtitle={p.emiratesSubtitle} />
        <EmiratesCards />
      </section>

      <section className="mb-10">
        <SectionTitle title={p.abuDhabiVsDubaiTitle} subtitle={p.abuDhabiVsDubaiSubtitle} />
        <AbuDhabiVsDubai />
      </section>

      <section className="mb-10">
        <SectionTitle title={p.governmentTitle} subtitle={p.governmentSubtitle} />
        <GovernmentStructure />
        <AbuDhabiGovernment />
      </section>

      <section className="mb-10">
        <SectionTitle title={p.powerTitle} subtitle={p.powerSubtitle} />
        <Collapsible
          header={
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="font-bold text-[15px] text-gold">{p.powerTierHeader}</span>
              <span className="text-t3 text-xs hidden sm:inline">
                {p.powerTierSubheader}
              </span>
            </div>
          }
          defaultOpen={false}
        >
          <div className="space-y-2">
            {localTiers.map((tier) => (
              <TierSection key={tier.level} tier={tier} />
            ))}
          </div>
        </Collapsible>
      </section>

      <section className="mb-10">
        <SectionTitle title={p.networkTitle} subtitle={p.networkSubtitle} />
        <Collapsible
          header={
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="font-bold text-[15px] text-gold">{p.networkTreeHeader}</span>
              <span className="text-t3 text-xs hidden sm:inline">
                {p.networkTreeSubheader}
              </span>
            </div>
          }
          defaultOpen={false}
        >
          <ConnectionTree trees={localTrees} />
        </Collapsible>
      </section>
    </>
  )
}
