interface Column {
  readonly key: string
  readonly header: string
  readonly width?: string
  readonly className?: string
}

interface DataTableProps {
  readonly columns: readonly Column[]
  readonly rows: readonly Record<string, React.ReactNode>[]
}

export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="p-2.5 px-3.5 text-left bg-bg3 text-t3 font-semibold text-[11px] uppercase tracking-wider border-b border-brd"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:[&_td]:bg-bg3">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`p-2.5 px-3.5 border-b border-brd/40 ${col.className ?? ''}`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
