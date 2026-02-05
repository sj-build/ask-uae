'use client'

import { bilateralRelations as bilateralRelationsKo, bilateralInsight as bilateralInsightKo } from '@/data/overview/bilateral'
import { bilateralRelations as bilateralRelationsEn, bilateralInsight as bilateralInsightEn } from '@/data/overview/bilateral.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { useLocale } from '@/hooks/useLocale'

export function BilateralRelations() {
  const bilateralRelations = useLocalizedData(bilateralRelationsKo, bilateralRelationsEn)
  const bilateralInsight = useLocalizedData(bilateralInsightKo, bilateralInsightEn)
  const { t } = useLocale()

  return (
    <div className="bg-bg3 border border-brd rounded-xl p-6 mb-6 overflow-x-auto">
      <h3 className="font-display text-lg text-gold mb-4">{`🤝 ${t.pages.comparison.bilateralHeader}`}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-2.5 px-3.5 text-left bg-bg3 text-t3 font-semibold text-[11px] uppercase tracking-wider border-b border-brd">{t.pages.comparison.tableCategory}</th>
              <th className="p-2.5 px-3.5 text-left bg-bg3 text-t3 font-semibold text-[11px] uppercase tracking-wider border-b border-brd">{t.pages.comparison.tableContent}</th>
              <th className="p-2.5 px-3.5 text-left bg-bg3 text-t3 font-semibold text-[11px] uppercase tracking-wider border-b border-brd">{t.pages.comparison.tableAmount}</th>
              <th className="p-2.5 px-3.5 text-left bg-bg3 text-t3 font-semibold text-[11px] uppercase tracking-wider border-b border-brd">{t.pages.comparison.tableSignificance}</th>
            </tr>
          </thead>
          <tbody>
            {bilateralRelations.map((item) => (
              <tr key={item.category} className="hover:[&_td]:bg-bg3">
                <td className="p-2.5 px-3.5 border-b border-brd/40 font-semibold">{item.category}</td>
                <td className="p-2.5 px-3.5 border-b border-brd/40">{item.content}</td>
                <td className="p-2.5 px-3.5 border-b border-brd/40 text-gold font-mono">{item.amount}</td>
                <td className="p-2.5 px-3.5 border-b border-brd/40 text-[11px]">{item.significance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 p-3 bg-bg rounded-lg text-xs text-gold leading-relaxed">
        💡 <b>{bilateralInsight}</b>
      </div>
    </div>
  )
}
