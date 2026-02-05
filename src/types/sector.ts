export interface ValueChainStep {
  readonly label: string
}

export interface Player {
  readonly name: string
  readonly owner?: string
  readonly revenue?: string
  readonly revenueUsd?: string
  readonly marketCapUsd?: string
  readonly valueChainPosition?: string
  readonly note?: string
}

export interface Sector {
  readonly icon: string
  readonly name: string
  readonly size: string
  readonly cagr: string
  readonly valueChain: readonly ValueChainStep[]
  readonly players: readonly Player[]
  readonly insight?: string
}
