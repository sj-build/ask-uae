import { Badge } from '@/components/ui/Badge'
import type { EmirateData } from '@/data/overview/emirates'

interface EmirateCardProps {
  readonly emirate: EmirateData
}

export function EmirateCard({ emirate }: EmirateCardProps) {
  return (
    <div
      className="bg-bg3 border border-brd rounded-xl p-4 overflow-hidden transition-all duration-250 hover:border-brd2 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
      style={{ borderLeftWidth: '3px', borderLeftColor: emirate.borderColor }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-base font-bold">{emirate.icon} {emirate.name}</div>
          <div className="text-[11px] text-t3">{emirate.nameAr}</div>
        </div>
        <Badge level={emirate.badgeLevel}>{emirate.badgeLabel}</Badge>
      </div>
      <div className="text-xs text-t2 leading-relaxed mt-2.5">
        {emirate.details.map((detail, i) => (
          <span key={i}>
            <b>{detail.split(':')[0]}:</b>{detail.split(':').slice(1).join(':')}<br />
          </span>
        ))}
      </div>
    </div>
  )
}
