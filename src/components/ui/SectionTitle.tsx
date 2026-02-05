interface SectionTitleProps {
  readonly title: string
  readonly subtitle?: string
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1.5">
        <div className="w-[3px] h-7 rounded-full bg-gradient-to-b from-gold via-gold to-gold2/40" />
        <h1 className="font-display text-[26px] font-black bg-gradient-to-br from-gold via-gold3 to-gold2 bg-clip-text text-transparent leading-tight tracking-[-0.01em]">
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="text-t3 text-[12px] mt-1 ml-[18px] leading-relaxed tracking-wide">
          {subtitle}
        </p>
      )}
    </div>
  )
}
