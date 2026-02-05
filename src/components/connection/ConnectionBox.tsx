import type { TreeData } from '@/types/tree'

const colorMap: Record<string, string> = {
  r: 'text-gold font-bold',
  e: 'text-accent-blue',
  p: 'text-accent-green',
  a: 'text-accent-orange font-medium',
  d: 'text-t4',
  c: 'text-accent-cyan',
}

interface ConnectionBoxProps {
  readonly tree: TreeData
}

export function ConnectionBox({ tree }: ConnectionBoxProps) {
  return (
    <div className="bg-bg3 border border-brd rounded-xl p-6 mb-6 overflow-x-auto">
      <h3 className="font-display text-lg text-gold mb-4">{tree.title}</h3>
      <pre className="font-mono text-xs leading-[2.2] whitespace-pre text-t2">
        {tree.lines.map((line, i) => (
          <div key={i}>
            {line.spans.map((span, j) => (
              <span key={j} className={span.color ? colorMap[span.color] : ''}>
                {span.text}
              </span>
            ))}
          </div>
        ))}
      </pre>
    </div>
  )
}
