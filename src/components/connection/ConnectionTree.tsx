import type { TreeData } from '@/types/tree'
import { ConnectionBox } from './ConnectionBox'

interface ConnectionTreeProps {
  readonly trees: readonly TreeData[]
}

export function ConnectionTree({ trees }: ConnectionTreeProps) {
  return (
    <>
      {trees.map((tree) => (
        <ConnectionBox key={tree.title} tree={tree} />
      ))}
    </>
  )
}
