export interface BilateralItem {
  readonly category: string
  readonly content: string
  readonly amount: string
  readonly significance: string
}

export const bilateralRelations: readonly BilateralItem[] = [
  { category: 'Barakah 원전', content: 'KEPCO 건설 (아랍 최초 원전, 5.6GW)', amount: '$23.8B', significance: 'UAE 에너지 안보의 기초, 한국 최대 해외 수주' },
  { category: '삼성엔지니어링', content: 'ADNOC 정유/석유화학 프로젝트 다수', amount: '$8B+', significance: 'Ruwais, Hail & Ghasha 등' },
  { category: 'CEPA 발효', content: '포괄적경제동반자협정', amount: '2024.5', significance: '관세 철폐, 투자 보호, 디지털 무역' },
  { category: '100년 파트너십', content: 'MBZ 방한 시 체결 (2022.1)', amount: '전략적 특별동반자', significance: '양국 관계 최고 수준 격상' },
  { category: '교역 규모', content: '수출 $5.4B + 수입 $26.2B(석유)', amount: '~$31.6B/년', significance: '한국의 중동 1위 교역국' },
  { category: 'K-City (Dubai)', content: '한국 문화·기술 복합단지', amount: '개발 중', significance: 'K-콘텐츠 + K-테크 쇼케이스' },
  { category: 'FAB 서울 사무소', content: 'First Abu Dhabi Bank (Tahnoun 산하)', amount: '2014~', significance: '$330B 은행의 한국 거점' },
  { category: '한국인 거주', content: 'Dubai/Abu Dhabi 중심', amount: '~12,000명', significance: '비즈니스+건설+외교' },
] as const

export const bilateralInsight = '투자자 관점: $30B+ 에너지 계약 + 100년 전략적 파트너십 = 단순 투자가 아닌 "국가 간 전략적 투자 파트너십의 디지털 자산 확장"으로 프레이밍할 근거. 한-UAE 관계의 구조적 강점.' as const
