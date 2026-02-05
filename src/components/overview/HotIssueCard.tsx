import type { HotIssueData } from '@/data/overview/hot-issues'

interface HotIssueCardProps {
  readonly issue: HotIssueData
}

export function HotIssueCard({ issue }: HotIssueCardProps) {
  return (
    <div
      className="bg-bg3 border border-brd rounded-xl p-5 overflow-hidden transition-all duration-250 hover:border-brd2"
      style={{ borderLeftWidth: '3px', borderLeftColor: issue.borderColor }}
    >
      <div className="font-bold text-[15px] mb-3" style={{ color: issue.titleColor }}>{issue.title}</div>
      <div className="text-xs text-t2 leading-relaxed">
        <span className="inline-block px-2 py-0.5 rounded bg-accent-green/10 text-accent-green text-[10px] font-semibold mb-1">기회</span><br />
        {issue.opportunities.map((opp, i) => (
          <span key={i}>• <b>{opp.split(':')[0]}</b>{opp.includes(':') ? ':' + opp.split(':').slice(1).join(':') : ''}<br /></span>
        ))}
        <br />
        <span className="inline-block px-2 py-0.5 rounded bg-accent-red/10 text-accent-red text-[10px] font-semibold mb-1">위기/리스크</span><br />
        {issue.risks.map((risk, i) => (
          <span key={i}>• <b>{risk.split(':')[0]}</b>{risk.includes(':') ? ':' + risk.split(':').slice(1).join(':') : ''}<br /></span>
        ))}
      </div>
    </div>
  )
}
