'use client'

import { comparisonStats as comparisonStatsKo } from '@/data/overview/comparison-stats'
import { comparisonStats as comparisonStatsEn } from '@/data/overview/comparison-stats.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { useLocale } from '@/hooks/useLocale'

export function StatsComparisonTable() {
  const comparisonStats = useLocalizedData(comparisonStatsKo, comparisonStatsEn)
  const { t } = useLocale()

  return (
    <div className="mb-6">
      <div className="text-sm font-bold mb-3 text-gold">{`📊 ${t.pages.comparison.statsHeader}`}</div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-2.5 px-3.5 text-left bg-bg3 text-t3 font-semibold text-[11px] uppercase tracking-wider border-b border-brd w-[200px]">{t.pages.comparison.tableIndicator}</th>
              <th className="p-2.5 px-3.5 text-left bg-bg3 text-t3 font-semibold text-[11px] uppercase tracking-wider border-b border-brd">🇦🇪 UAE</th>
              <th className="p-2.5 px-3.5 text-left bg-bg3 text-t3 font-semibold text-[11px] uppercase tracking-wider border-b border-brd">🇰🇷 {t.pages.comparison.korea}</th>
              <th className="p-2.5 px-3.5 text-left bg-bg3 text-t3 font-semibold text-[11px] uppercase tracking-wider border-b border-brd">{t.pages.comparison.tableNote}</th>
            </tr>
          </thead>
          <tbody>
            {comparisonStats.map((row) => (
              <tr key={row.indicator} className="hover:[&_td]:bg-bg3">
                <td className="p-2.5 px-3.5 border-b border-brd/40 font-bold">{row.indicator}</td>
                <td className={`p-2.5 px-3.5 border-b border-brd/40 ${row.uaeHighlight ? 'text-gold font-mono' : ''} ${row.uaeColor === 'red' ? 'text-accent-red font-mono' : ''} ${row.uaeColor === 'green' ? 'text-accent-green font-mono' : ''}`}>
                  {row.uae}
                </td>
                <td className="p-2.5 px-3.5 border-b border-brd/40 font-mono">{row.korea}</td>
                <td className="p-2.5 px-3.5 border-b border-brd/40">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
