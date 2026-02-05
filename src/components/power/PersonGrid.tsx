import type { Person } from '@/types/person'
import { PersonCard } from './PersonCard'

interface PersonGridProps {
  readonly persons: readonly Person[]
}

export function PersonGrid({ persons }: PersonGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
      {persons.map((person) => (
        <PersonCard key={person.name} person={person} />
      ))}
    </div>
  )
}
