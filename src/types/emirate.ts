export type BadgeLevel = 'S' | 'A' | 'B' | 'C'

export interface Emirate {
  readonly icon: string
  readonly name: string
  readonly nameAr: string
  readonly subtitle: string
  readonly badgeLabel: string
  readonly badgeLevel: BadgeLevel
  readonly borderColor: string
  readonly details: readonly string[]
}
