interface ConnBoxProps {
  readonly title: string
  readonly children: React.ReactNode
  readonly className?: string
}

export function ConnBox({ title, children, className }: ConnBoxProps) {
  return (
    <div className={`bg-gradient-to-br from-bg3 to-bg3/60 border border-brd rounded-xl p-6 mb-6 overflow-x-auto relative${className ? ` ${className}` : ''}`}>
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <h3 className="font-display text-lg text-gold mb-4 tracking-wide">{title}</h3>
      {children}
    </div>
  )
}
