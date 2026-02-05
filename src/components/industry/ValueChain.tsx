import type { ValueChainStep } from '@/types/sector'

interface ValueChainProps {
  readonly steps: readonly ValueChainStep[]
}

export function ValueChain({ steps }: ValueChainProps) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-3.5 items-center">
      {steps.map((step, i) => (
        <span key={step.label}>
          <span className="px-3 py-1 rounded-md text-[11px] font-medium bg-bg2 border border-brd inline-block">
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <span className="text-t4 text-xs mx-1">→</span>
          )}
        </span>
      ))}
    </div>
  )
}
