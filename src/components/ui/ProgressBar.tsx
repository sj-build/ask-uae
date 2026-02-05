interface ProgressBarProps {
  readonly label: string
  readonly percentage: number
  readonly value: string
  readonly color: string
  readonly labelBold?: boolean
}

export function ProgressBar({ label, percentage, value, color, labelBold }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-[90px] ${labelBold ? 'font-bold text-gold' : 'font-semibold'}`}>{label}</div>
      <div className="flex-1 h-[22px] bg-bg rounded overflow-hidden">
        <div
          className="h-full rounded flex items-center pl-2 text-[10px] font-bold text-black"
          style={{ width: `${percentage}%`, background: color }}
        >
          {percentage >= 5 ? `${percentage}%` : ''}
        </div>
      </div>
      <div className="w-[55px] text-right text-t3 text-[11px]">{value}</div>
    </div>
  )
}
