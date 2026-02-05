import type { InitiativeData } from '@/data/overview/initiatives'

interface InitiativeCardProps {
  readonly initiative: InitiativeData
}

export function InitiativeCard({ initiative }: InitiativeCardProps) {
  return (
    <div className="bg-bg3 border border-brd rounded-xl p-5 overflow-hidden transition-all duration-250 hover:border-brd2 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-2xl">{initiative.icon}</span>
        <div>
          <div className="font-bold text-[15px]" style={{ color: initiative.titleColor }}>{initiative.title}</div>
          <div className="text-[10px] text-t4">{initiative.subtitle}</div>
        </div>
      </div>
      <div
        className="text-xs text-t2 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: initiative.content }}
      />
    </div>
  )
}
