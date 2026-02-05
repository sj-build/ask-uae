import type { Person } from './person'

export type TierLevel = 'S' | 'A' | 'B' | 'C'

export interface Tier {
  readonly level: TierLevel
  readonly label: string
  readonly subtitle: string
  readonly defaultOpen?: boolean
  readonly persons: readonly Person[]
}
