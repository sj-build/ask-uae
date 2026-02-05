interface CardProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly borderColor?: string
}

export function Card({ children, className = '', borderColor }: CardProps) {
  const borderStyle = borderColor ? `border-l-3 border-l-[${borderColor}]` : ''
  return (
    <div
      className={`bg-bg3/70 border border-brd/80 rounded-xl overflow-hidden transition-all duration-400 ease-out hover:border-brd2 hover:bg-bg3/95 hover:shadow-[0_8px_40px_rgba(0,0,0,0.25),0_0_1px_rgba(200,164,78,0.08)] hover:translate-y-[-1px] ${borderStyle} ${className}`}
    >
      {children}
    </div>
  )
}
