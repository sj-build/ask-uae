type DotColor = 'red' | 'green' | 'orange' | 'blue'

const dotStyles: Record<DotColor, string> = {
  red: 'bg-accent-red',
  green: 'bg-accent-green',
  orange: 'bg-accent-orange',
  blue: 'bg-accent-blue',
}

interface DotIndicatorProps {
  readonly color: DotColor
}

export function DotIndicator({ color }: DotIndicatorProps) {
  return (
    <span className={`inline-block w-[7px] h-[7px] rounded-full mr-1.5 shrink-0 ${dotStyles[color]}`} />
  )
}
