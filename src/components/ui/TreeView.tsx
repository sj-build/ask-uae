import type { TreeData, TreeSpanColor } from '@/types/tree'

const colorMap: Record<TreeSpanColor, string> = {
  r: 'text-gold font-bold',
  e: 'text-accent-blue',
  p: 'text-accent-green',
  a: 'text-accent-orange font-medium',
  d: 'text-t4',
  c: 'text-accent-cyan',
}

interface TreeViewProps {
  readonly data: TreeData
}

export function TreeView({ data }: TreeViewProps) {
  return (
    <pre className="font-mono text-xs leading-[2.2] whitespace-pre text-t2 overflow-x-auto">
      {data.lines.map((line, i) => (
        <div key={i}>
          {line.spans.map((span, j) => (
            <span key={j} className={span.color ? colorMap[span.color] : ''}>
              {span.text}
            </span>
          ))}
        </div>
      ))}
    </pre>
  )
}
