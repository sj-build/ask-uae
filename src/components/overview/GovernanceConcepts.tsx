'use client'

import { governanceConcepts as governanceConceptsKo, koreanDifferences as koreanDifferencesKo } from '@/data/overview/governance'
import { governanceConcepts as governanceConceptsEn, koreanDifferences as koreanDifferencesEn } from '@/data/overview/governance.en'
import { useLocalizedData } from '@/hooks/useLocalizedData'

export function GovernanceConcepts() {
  const governanceConcepts = useLocalizedData(governanceConceptsKo, governanceConceptsEn)
  const koreanDifferences = useLocalizedData(koreanDifferencesKo, koreanDifferencesEn)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div className="bg-bg3 border border-brd rounded-xl p-5">
        <h3 className="text-sm font-bold mb-3 text-gold">🕌 UAE 핵심 통치 개념</h3>
        {governanceConcepts.map((item) => (
          <div key={item.title} className="flex items-start gap-2 py-1.5 text-xs leading-relaxed">
            <span className="inline-block w-[7px] h-[7px] rounded-full bg-accent-orange mt-1.5 shrink-0" />
            <div><b>{item.title}</b> — {item.description}</div>
          </div>
        ))}
      </div>
      <div className="bg-bg3 border border-brd rounded-xl p-5">
        <h3 className="text-sm font-bold mb-3 text-accent-red">⚠️ 한국인이 반드시 알아야 할 차이</h3>
        {koreanDifferences.map((item) => (
          <div key={item.title} className="flex items-start gap-2 py-1.5 text-xs leading-relaxed">
            <span className="inline-block w-[7px] h-[7px] rounded-full bg-accent-red mt-1.5 shrink-0" />
            <div><b>{item.title}</b> — {item.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
