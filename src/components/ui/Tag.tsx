import type { TagCategory } from '@/types/person'

const tagStyles: Record<TagCategory, string> = {
  swf: 'bg-accent-blue/10 text-accent-blue border-accent-blue/15',
  tech: 'bg-accent-purple/10 text-accent-purple border-accent-purple/15',
  bank: 'bg-accent-green/10 text-accent-green border-accent-green/15',
  energy: 'bg-accent-orange/10 text-accent-orange border-accent-orange/15',
  royal: 'bg-gold/10 text-gold border-gold/15',
  defense: 'bg-accent-red/10 text-accent-red border-accent-red/15',
  retail: 'bg-accent-pink/10 text-accent-pink border-accent-pink/15',
}

interface TagProps {
  readonly category: TagCategory
  readonly children: React.ReactNode
}

export function Tag({ category, children }: TagProps) {
  return (
    <span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-semibold border ${tagStyles[category]}`}>
      {children}
    </span>
  )
}
