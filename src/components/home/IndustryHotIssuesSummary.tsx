'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react'
import { hotIssues as hotIssuesKo } from '@/data/overview/hot-issues'
import { hotIssues as hotIssuesEn } from '@/data/overview/hot-issues.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { useLocale } from '@/hooks/useLocale'

interface IssueSummary {
  readonly title: string
  readonly titleColor: string
  readonly opportunity: string
  readonly risk: string
}

function getIssueSummaries(
  issues: readonly { title: string; titleColor: string; opportunities: readonly string[]; risks: readonly string[] }[],
  locale: string
): IssueSummary[] {
  // Pick 4 key industries
  const keyIndices = [0, 1, 3, 5] // AI, Real Estate, Crypto, Tourism

  return keyIndices.map((idx) => {
    const issue = issues[idx]
    return {
      title: issue.title,
      titleColor: issue.titleColor,
      opportunity: issue.opportunities[0].split(':')[0].split('—')[0].trim().slice(0, 30) + (issue.opportunities[0].length > 30 ? '...' : ''),
      risk: issue.risks[0].split(':')[0].split('—')[0].trim().slice(0, 30) + (issue.risks[0].length > 30 ? '...' : ''),
    }
  })
}

export function IndustryHotIssuesSummary() {
  const { locale } = useLocale()
  const hotIssues = useLocalizedData(hotIssuesKo, hotIssuesEn)
  const summaries = getIssueSummaries(hotIssues, locale)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {summaries.map((item) => (
        <Card key={item.title} className="group">
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, ${item.titleColor}, ${item.titleColor}60, transparent)`,
            }}
          />
          <div className="p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className="text-[11px] font-bold"
                style={{ color: item.titleColor }}
              >
                {item.title}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-1.5">
                <TrendingUp className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-[10px] text-t3 leading-snug line-clamp-1">
                  {item.opportunity}
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-[10px] text-t3 leading-snug line-clamp-1">
                  {item.risk}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
      <div className="col-span-full flex justify-end mt-1">
        <Link
          href="/industry"
          className="flex items-center gap-1 text-[10px] text-t4 transition-colors hover:text-t2"
        >
          {locale === 'en' ? 'More' : '더보기'}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
