'use client'

import { macroRisks as macroRisksKo } from '@/data/overview/macro-risks'
import { macroRisks as macroRisksEn } from '@/data/overview/macro-risks.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { useLocale } from '@/hooks/useLocale'

export function MacroRiskSummary() {
  const { t } = useLocale()
  const macroRisks = useLocalizedData(macroRisksKo, macroRisksEn)

  return (
    <div className="bg-bg3 border border-brd rounded-xl p-6 mb-6">
      <h3 className="font-display text-lg text-gold mb-4">⚠️ {t.pages.home.macroRiskTitle}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {macroRisks.map((risk) => (
          <div
            key={risk.title}
            className="p-3.5 bg-bg rounded-lg"
            style={{ borderLeftWidth: '3px', borderLeftColor: risk.borderColor }}
          >
            <div className="font-bold text-[13px] mb-1.5" style={{ color: risk.titleColor }}>{risk.title}</div>
            <div className="text-[11px] text-t2 leading-relaxed">{risk.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
