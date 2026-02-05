export interface InitiativeSection {
  readonly label: string
  readonly labelColor?: string
  readonly content: readonly string[]
}

export interface Initiative {
  readonly icon: string
  readonly title: string
  readonly titleColor: string
  readonly subtitle: string
  readonly sections: readonly InitiativeSection[]
}
