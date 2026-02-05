export interface CategoryHotIssue {
  readonly id: string
  readonly category: string
  readonly icon: string
  readonly accentColor: string
  readonly items: readonly {
    readonly title: string
    readonly description: string
  }[]
}

export const categoryHotIssues: readonly CategoryHotIssue[] = [
  {
    id: 'politics',
    category: '정치',
    icon: '🏛️',
    accentColor: '#ef4444',
    items: [
      { title: 'MBZ 3선 연임 확정', description: '2024.10 통치 안정성 강화, 왕세자 미지정' },
      { title: 'Sheikh Tahnoun 부상', description: '안보 + AI + 투자 총괄, 실질 #2' },
      { title: 'GCC 안보 재편', description: '2025 도하 공격 이후 걸프 방위 체계 논의 활발' },
    ],
  },
  {
    id: 'economy',
    category: '경제',
    icon: '💰',
    accentColor: '#c8a44e',
    items: [
      { title: '법인세 9% 시대', description: '2023 도입 후 기업 구조조정 진행 중' },
      { title: 'Stargate UAE 5GW', description: '미국 외 최대 AI 인프라, 전력 수급 핵심 이슈' },
      { title: 'SWF 글로벌 투자 가속', description: 'MGX $2B Binance, ADIA/Mubadala 비트코인 ETF 배치' },
    ],
  },
  {
    id: 'society',
    category: '사회·문화',
    icon: '🕌',
    accentColor: '#34d399',
    items: [
      { title: '카지노 합법화 추진', description: 'Wynn 2026 오픈, 이슬람 국가 최초' },
      { title: '사회 자유화 가속', description: '동거 허용, 음주 자유화, 이혼법 간소화' },
      { title: 'K-Wave 확산', description: 'K-뷰티, K-팝, K-푸드 열풍, 한류 마케팅 기회' },
    ],
  },
] as const
