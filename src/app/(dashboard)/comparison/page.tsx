'use client'

import { SectionTitle } from '@/components/ui/SectionTitle'
import { StatsComparisonTable } from '@/components/overview/StatsComparisonTable'
import { PopulationDemographics } from '@/components/overview/PopulationDemographics'
import { BilateralRelations } from '@/components/overview/BilateralRelations'
import { GovernanceConcepts } from '@/components/overview/GovernanceConcepts'
import { MustKnowDifferences } from '@/components/comparison/MustKnowDifferences'
import { useLocale } from '@/hooks/useLocale'

function SectionHeading({
  title,
  subtitle,
}: {
  readonly title: string
  readonly subtitle?: string
}) {
  return (
    <div className="mb-5 mt-10 first:mt-0">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-0.5 h-5 rounded-full bg-gradient-to-b from-gold to-gold2" />
        <h2 className="font-display text-lg font-bold text-t1">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-t3 text-[12px] ml-[18px]">{subtitle}</p>
      )}
    </div>
  )
}

export default function ComparisonPage() {
  const { t } = useLocale()
  const p = t.pages.comparison

  return (
    <>
      <SectionTitle
        title={p.title}
        subtitle={p.subtitle}
      />

      <SectionHeading title={p.statsTitle} subtitle={p.statsSubtitle} />
      <StatsComparisonTable />

      <SectionHeading title={p.populationTitle} subtitle={p.populationSubtitle} />
      <PopulationDemographics />

      <SectionHeading title={p.bilateralTitle} subtitle={p.bilateralSubtitle} />
      <BilateralRelations />

      <SectionHeading title={p.governanceTitle} subtitle={p.governanceSubtitle} />
      <GovernanceConcepts />

      <SectionHeading title={p.differencesTitle} subtitle={p.differencesSubtitle} />
      <MustKnowDifferences />

      <div className="h-10" />
    </>
  )
}
