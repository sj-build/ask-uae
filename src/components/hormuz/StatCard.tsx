'use client'

interface StatCardProps {
  readonly icon: string
  readonly label: string
  readonly value: string
  readonly changePct?: number | null
  readonly suffix?: string
}

export function StatCard({ icon, label, value, changePct, suffix }: StatCardProps) {
  const isPositive = changePct != null && changePct >= 0
  const isNegative = changePct != null && changePct < 0

  return (
    <div className="bg-bg3/80 border border-brd/60 rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-[11px] text-t4 font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-t1">{value}</span>
        {suffix && <span className="text-xs text-t4">{suffix}</span>}
      </div>
      {changePct != null && (
        <div className="flex items-center gap-1">
          <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-400' : ''} ${isNegative ? 'text-red-400' : ''}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(changePct).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  )
}
