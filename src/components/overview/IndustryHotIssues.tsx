'use client'

import { hotIssues as hotIssuesKo } from '@/data/overview/hot-issues'
import { hotIssues as hotIssuesEn } from '@/data/overview/hot-issues.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { HotIssueCard } from './HotIssueCard'

export function IndustryHotIssues() {
  const hotIssues = useLocalizedData(hotIssuesKo, hotIssuesEn)

  return (
    <div className="mb-6">
      <div className="mt-9 mb-2">
        <h2 className="font-display text-[28px] font-black bg-gradient-to-br from-gold to-gold3 bg-clip-text text-transparent">
          🔥 산업별 최신 핫이슈 — 기회와 위기의 교차점
        </h2>
        <p className="text-t3 text-[13px] mt-1">각 주요 시장에서 지금 가장 뜨거운 이슈. 2025~2026 기준으로 투자자가 알아야 할 것들.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {hotIssues.map((issue) => (
          <HotIssueCard key={issue.title} issue={issue} />
        ))}
      </div>
    </div>
  )
}
