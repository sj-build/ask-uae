export interface MacroRisk {
  readonly title: string
  readonly titleColor: string
  readonly borderColor: string
  readonly summary: string
  readonly detail?: string
}

export const macroRisks: readonly MacroRisk[] = [
  {
    title: '🛢️ 유가 변동',
    titleColor: '#ef4444',
    borderColor: '#ef4444',
    summary: '유가 $60 이하 장기화 시 SWF 투자 축소, 정부 프로젝트 지연 가능',
  },
  {
    title: '🌍 지정학 리스크',
    titleColor: '#f59e0b',
    borderColor: '#f59e0b',
    summary: '이란 긴장 (호르무즈 해협), 예멘 후티 반군 드론 공격 위험',
  },
  {
    title: '🏠 부동산 과열',
    titleColor: '#a78bfa',
    borderColor: '#a78bfa',
    summary: '2022년 이후 +60% 상승, 2025~27년 21만 유닛 공급으로 최대 15% 조정 가능',
  },
  {
    title: '🏢 사우디 경쟁',
    titleColor: '#4a9eff',
    borderColor: '#4a9eff',
    summary: 'Vision 2030, HUMAIN $100B AI, 리야드 외국인 부동산 개방 (2026~)',
  },
  {
    title: '📊 규제 강화',
    titleColor: '#34d399',
    borderColor: '#34d399',
    summary: '법인세 도입 (2023~), VAT 인상 가능성, 에미라티화 벌금 강화',
  },
  {
    title: '⚡ 전력 한계',
    titleColor: '#c8a44e',
    borderColor: '#c8a44e',
    summary: 'Stargate 5GW + DC 수요 급증, 전력망 한계로 단기 해결 어려움',
  },
] as const
