export interface MacroRisk {
  readonly title: string
  readonly titleColor: string
  readonly borderColor: string
  readonly description: string
}

export const macroRisks: readonly MacroRisk[] = [
  {
    title: '🛢️ 유가 변동', titleColor: '#ef4444', borderColor: '#ef4444',
    description: '비석유 GDP 75%이지만, 재정 수입의 핵심은 여전히 석유. 유가 $60 이하 장기화 시 SWF 투자 축소, 정부 프로젝트 지연 가능.',
  },
  {
    title: '🌍 지정학', titleColor: '#f59e0b', borderColor: '#f59e0b',
    description: '이란 긴장 (호르무즈 해협), 예멘 후티 반군 드론, 2025 도하 공격. Fitch: "지역 지정학 에스컬레이션 사이클이 고도로 불확실." Abu Dhabi 석유 인프라, Dubai 관광/무역 직접 영향.',
  },
  {
    title: '🏠 부동산 조정', titleColor: '#a78bfa', borderColor: '#a78bfa',
    description: '2022년 이후 가격 60% 상승. 2025~27년 21만 유닛 공급 예정. Fitch: 최대 15% 조정 가능. UBS 버블 리스크 2년 연속 상향. 단, 인구 성장이 흡수 가능할 수도.',
  },
  {
    title: '🏢 사우디 경쟁', titleColor: '#4a9eff', borderColor: '#4a9eff',
    description: 'Vision 2030, HUMAIN $100B AI, 리야드 외국인 부동산 개방 (2026~), NEOM, Riyadh Season. Abu Dhabi/Dubai의 인재·자본·기업 유치 경쟁에서 사우디가 급부상.',
  },
  {
    title: '📊 규제 리스크', titleColor: '#34d399', borderColor: '#34d399',
    description: '법인세 도입 (2023~), VAT 인상 가능성, 에미라티화 벌금 강화, FATF AML 규제. 규제 환경이 빠르게 성숙 중 — 낮은 세금/규제의 매력이 점진적으로 축소될 수 있음.',
  },
  {
    title: '⚡ 전력/인프라', titleColor: '#c8a44e', borderColor: '#c8a44e',
    description: 'Stargate UAE 5GW + 기존 DC 수요 → 전력망 한계. EMEA DC 신규 공급 전년비 -11%. 정부가 Data Center Energy Review Team 신설했지만 단기 해결 어려움.',
  },
] as const
