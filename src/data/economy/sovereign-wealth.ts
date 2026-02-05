export interface SovereignWealthFund {
  readonly name: string
  readonly shortName: string
  readonly aum: string
  readonly aumValue: number // in billions USD for chart
  readonly founded: string
  readonly location: string
  readonly globalRank: string
  readonly focusAreas: readonly string[]
  readonly keyInvestments: readonly string[]
  readonly governance: string
  readonly color: string
}

export const sovereignWealthFunds: readonly SovereignWealthFund[] = [
  {
    name: 'Abu Dhabi Investment Authority',
    shortName: 'ADIA',
    aum: '$1.0T+',
    aumValue: 1000,
    founded: '1976',
    location: 'Abu Dhabi',
    globalRank: '세계 3위',
    focusAreas: ['글로벌 주식', '채권', '부동산', '인프라', '대체투자'],
    keyInvestments: ['글로벌 다각화 포트폴리오', '장기 세대간 부 보존 목적'],
    governance: 'Abu Dhabi 정부 100% 소유, 독립적 운영',
    color: '#c8a44e',
  },
  {
    name: 'Mubadala Investment Company',
    shortName: 'Mubadala',
    aum: '$300B+',
    aumValue: 300,
    founded: '2002 (IPIC와 2017 합병)',
    location: 'Abu Dhabi',
    globalRank: '세계 14위',
    focusAreas: ['기술', '항공우주', '헬스케어', '금융서비스', 'ICT'],
    keyInvestments: ['GlobalFoundries', 'AMD', 'Softbank Vision Fund', 'Cepsa'],
    governance: 'MBZ 측근 Khaldoon Al Mubarak이 CEO',
    color: '#4a9eff',
  },
  {
    name: 'Abu Dhabi Developmental Holding',
    shortName: 'ADQ',
    aum: '$200B+',
    aumValue: 200,
    founded: '2018',
    location: 'Abu Dhabi',
    globalRank: '세계 20위권',
    focusAreas: ['식품/농업', '에너지/유틸리티', '의료', '물류', '관광'],
    keyInvestments: ['Abu Dhabi Ports', 'ADNEC', 'Etihad Rail', 'Abu Dhabi Health Services'],
    governance: 'Abu Dhabi 국내 전략 산업 육성 목적',
    color: '#34d399',
  },
  {
    name: 'Investment Corporation of Dubai',
    shortName: 'ICD',
    aum: '$429B',
    aumValue: 429,
    founded: '2006',
    location: 'Dubai',
    globalRank: '세계 9위',
    focusAreas: ['금융', '부동산', '항공', '소매', '레저'],
    keyInvestments: ['Emirates NBD', 'Emirates Airline', 'Dubai World', 'Emaar Properties'],
    governance: 'Dubai Inc. 지주회사, Sheikh Mohammed bin Rashid 소유',
    color: '#a78bfa',
  },
  {
    name: 'Emirates Investment Authority',
    shortName: 'EIA',
    aum: '$100B+ (추정)',
    aumValue: 100,
    founded: '2007',
    location: 'Abu Dhabi (연방)',
    globalRank: '-',
    focusAreas: ['연방 정부 잉여금 관리', '장기 투자'],
    keyInvestments: ['비공개 (연방 수준 투자)'],
    governance: '연방 정부 소유, UAE 전체 잉여금 관리',
    color: '#f59e0b',
  },
] as const

export interface SWFInsight {
  readonly title: string
  readonly content: string
  readonly icon: string
}

export const swfInsights: readonly SWFInsight[] = [
  {
    title: '왕가 = 펀드',
    content: 'SWF 의사결정권자 = 통치 가문. ADIA, Mubadala, ADQ 모두 Abu Dhabi 왕가(Al Nahyan) 통제 하에 있음',
    icon: '👑',
  },
  {
    title: '세대간 부 이전',
    content: 'ADIA는 석유 이후 시대를 위한 저축 기능. 연 4% 수익만으로도 UAE GDP의 ~10% 창출 가능',
    icon: '🏦',
  },
  {
    title: '전략적 산업 육성',
    content: 'Mubadala: 기술/항공우주, ADQ: 국내 인프라. 단순 수익 추구가 아닌 산업 다각화 도구',
    icon: '🎯',
  },
  {
    title: 'Dubai vs Abu Dhabi',
    content: 'ICD(Dubai) vs ADIA/Mubadala/ADQ(Abu Dhabi). Abu Dhabi가 SWF 자산의 ~80% 이상 보유',
    icon: '⚖️',
  },
] as const

export interface GovernanceItem {
  readonly label: string
  readonly content: string
}

export const governanceStructure: readonly GovernanceItem[] = [
  { label: '최고의결권자', content: 'Abu Dhabi 왕세자 (현 UAE 대통령 MBZ)가 대부분 SWF의 최종 결정권 보유' },
  { label: '이사회', content: '왕실 인사 및 고위 정부 관료로 구성. 독립적 운영은 전문 경영진에 위임' },
  { label: '투명성', content: 'ADIA, ICD 등은 AUM 미공개. 추정치 기반. 일부만 Sovereign Wealth Fund Institute에 보고' },
  { label: '투자 철학', content: '장기 투자, 정치적 중립(표면상), 현지 파트너와 공동투자 선호' },
] as const

export const investorTips: readonly string[] = [
  'SWF와의 공동투자는 UAE 진출의 가장 강력한 레버리지 중 하나',
  'Mubadala는 기술/스타트업 투자에 가장 적극적 -- 한국 기업과의 협업 사례 다수',
  'ADQ는 식품/농업/물류에 집중 -- 해당 분야 한국 기업에 기회',
  'SWF 투자 유치 시 정부 관계(G2G) 채널이 매우 효과적',
] as const
