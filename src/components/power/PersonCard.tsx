import { Tag } from '@/components/ui/Tag'
import type { Person } from '@/types/person'

interface PersonCardProps {
  readonly person: Person
}

export function PersonCard({ person }: PersonCardProps) {
  return (
    <div className={`bg-bg3/80 border border-brd rounded-[10px] p-4 relative overflow-hidden transition-all duration-300 ease-out hover:border-brd2 hover:bg-bg3 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]`}>
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: person.role === 'royal'
            ? 'linear-gradient(90deg,#c8a44e,#e8c85a,#c8a44e)'
            : person.role === 'official'
            ? 'linear-gradient(90deg,#4a9eff,#22d3ee,#4a9eff)'
            : person.role === 'exec'
            ? 'linear-gradient(90deg,#34d399,#22d3ee,#34d399)'
            : 'linear-gradient(90deg,#a78bfa,#f472b6,#a78bfa)',
        }}
      />
      <div className="font-bold text-[15px]">{person.name}</div>
      {person.nameAr && <div className="text-[11px] text-t4 mb-1.5">{person.nameAr}</div>}
      <div className="text-xs text-accent-blue mb-2 leading-relaxed whitespace-pre-line">{person.title}</div>
      <div className="flex flex-wrap gap-1 mb-2.5">
        {person.tags.map((tag) => (
          <Tag key={tag.label} category={tag.category}>{tag.label}</Tag>
        ))}
      </div>
      <div className="text-[11px] text-t2 leading-relaxed">
        {person.details.map((detail, i) => (
          <span key={i}>• {detail}<br /></span>
        ))}
      </div>
      {person.aum && (
        <div className="mt-2 pt-2 border-t border-brd font-mono text-xs text-gold">
          {person.aum}
        </div>
      )}
    </div>
  )
}
