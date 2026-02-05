'use client'

import { SectionTitle } from '@/components/ui/SectionTitle'
import { Collapsible } from '@/components/ui/Collapsible'
import { GovernmentInitiatives } from '@/components/overview/GovernmentInitiatives'
import { IndustryHotIssues } from '@/components/overview/IndustryHotIssues'
import { CategoryHotIssues } from '@/components/home/CategoryHotIssues'
import { NewsHeadlines } from '@/components/overview/NewsHeadlines'
import { MacroRiskSummary } from '@/components/overview/MacroRiskSummary'
import { useLocale } from '@/hooks/useLocale'

export default function HomePage() {
  const { t } = useLocale()
  const p = t.pages.home

  const governmentHeader = (
    <div className="flex items-center gap-3 flex-1">
      <span className="text-lg">🚀</span>
      <div>
        <div className="font-bold text-[15px] text-t1">{p.governmentHeader}</div>
        <div className="text-[11px] text-t3">{p.governmentSubheader}</div>
      </div>
    </div>
  )

  const industryHeader = (
    <div className="flex items-center gap-3 flex-1">
      <span className="text-lg">🔥</span>
      <div>
        <div className="font-bold text-[15px] text-t1">{p.industryHeader}</div>
        <div className="text-[11px] text-t3">{p.industrySubheader}</div>
      </div>
    </div>
  )

  return (
    <>
      <SectionTitle
        title={p.title}
        subtitle={p.subtitle}
      />

      <CategoryHotIssues />

      <Collapsible header={governmentHeader} defaultOpen={false}>
        <GovernmentInitiatives />
      </Collapsible>

      <Collapsible header={industryHeader} defaultOpen={false}>
        <IndustryHotIssues />
      </Collapsible>

      <NewsHeadlines />

      <MacroRiskSummary />
    </>
  )
}
