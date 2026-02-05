export interface AdminUser {
  readonly name: string
  readonly authenticated: boolean
}

export interface UpdateLog {
  readonly id: string
  readonly type: 'auto' | 'manual'
  readonly action: string
  readonly timestamp: string
  readonly details?: string
}

export interface ContentSection {
  readonly id: string
  readonly tab: string
  readonly sectionKey: string
  readonly content: string
  readonly updatedAt: string
}
