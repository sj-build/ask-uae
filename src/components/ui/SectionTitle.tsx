interface SectionTitleProps {
  readonly title: string
  readonly subtitle?: string
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center gap-3.5 mb-2">
        <div className="relative">
          <div className="w-[3px] h-8 rounded-full bg-gradient-to-b from-gold via-gold to-gold2/30" />
          <div className="absolute inset-0 w-[3px] rounded-full bg-gradient-to-b from-gold via-gold to-gold2/30 blur-sm" />
        </div>
        <h1 className="font-display text-[28px] font-black text-gradient-gold leading-tight tracking-[-0.02em]">
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="text-t3 text-[12px] mt-1.5 ml-[19px] leading-relaxed tracking-wide max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
