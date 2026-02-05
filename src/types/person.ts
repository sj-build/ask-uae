export type PersonRole = 'royal' | 'exec' | 'official' | 'family'

export type TagCategory =
  | 'swf'
  | 'tech'
  | 'bank'
  | 'energy'
  | 'royal'
  | 'defense'
  | 'retail'

export interface PersonTag {
  readonly label: string
  readonly category: TagCategory
}

export interface Person {
  readonly name: string
  readonly nameAr?: string
  readonly title: string
  readonly role: PersonRole
  readonly tags: readonly PersonTag[]
  readonly details: readonly string[]
  readonly aum?: string
}
