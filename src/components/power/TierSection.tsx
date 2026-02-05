import { Badge } from '@/components/ui/Badge'
import { Collapsible } from '@/components/ui/Collapsible'
import { PersonGrid } from './PersonGrid'
import type { Tier } from '@/types/tier'

interface TierSectionProps {
  readonly tier: Tier
}

export function TierSection({ tier }: TierSectionProps) {
  const header = (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <Badge level={tier.level}>Tier {tier.level}</Badge>
      <span className="font-bold text-[15px] flex-1">{tier.label}</span>
      <span className="text-t3 text-xs hidden sm:inline">{tier.subtitle}</span>
    </div>
  )

  return (
    <Collapsible header={header} defaultOpen={tier.defaultOpen}>
      <PersonGrid persons={tier.persons} />
    </Collapsible>
  )
}
