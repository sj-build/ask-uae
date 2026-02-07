import type { Sector } from '@/types/sector'
import { SectorCard } from './SectorCard'

interface SectorGridProps {
  readonly sectors: readonly Sector[]
}

export function SectorGrid({ sectors }: SectorGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 items-start" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))' }}>
      {sectors.map((sector) => (
        <SectorCard key={sector.name} sector={sector} />
      ))}
    </div>
  )
}
