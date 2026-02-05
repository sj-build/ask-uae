export type TreeSpanColor = 'r' | 'e' | 'p' | 'a' | 'd' | 'c'

export interface TreeSpan {
  readonly text: string
  readonly color?: TreeSpanColor
  readonly bold?: boolean
}

export interface TreeLine {
  readonly spans: readonly TreeSpan[]
}

export interface TreeData {
  readonly title: string
  readonly lines: readonly TreeLine[]
}
