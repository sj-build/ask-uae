import type { TierLevel } from '@/types/tier'
import type { BadgeLevel } from '@/types/emirate'

const tierStyles: Record<TierLevel | BadgeLevel | 'D', string> = {
  S: 'bg-gold/15 text-gold border border-gold2',
  A: 'bg-accent-red/12 text-accent-red border border-accent-red/30',
  B: 'bg-accent-blue/12 text-accent-blue border border-accent-blue/30',
  C: 'bg-accent-green/12 text-accent-green border border-accent-green/30',
  D: 'bg-accent-purple/12 text-accent-purple border border-accent-purple/30',
}

interface BadgeProps {
  readonly level: TierLevel | BadgeLevel | 'D'
  readonly children: React.ReactNode
}

export function Badge({ level, children }: BadgeProps) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider ${tierStyles[level]}`}
    >
      {children}
    </span>
  )
}
