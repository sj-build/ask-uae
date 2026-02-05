export interface TaxType {
  readonly name: string
  readonly rate: string
  readonly effectiveDate: string
  readonly details: readonly string[]
  readonly exemptions?: readonly string[]
  readonly color: string
}

export const taxTypes: readonly TaxType[] = [
  {
    name: '법인세 (Corporate Tax)',
    rate: '9%',
    effectiveDate: '2023년 6월',
    details: [
      '연 과세소득 AED 375,000 초과분에 9% 적용',
      'AED 375,000 이하는 0%',
      '다국적 기업 필라2 대응 (글로벌 최저세율 15%)',
    ],
    exemptions: [
      '적격 프리존 기업 (0% 유지)',
      '석유/가스 추출 사업 (기존 특별세율)',
      '개인 소득, 급여, 투자 수익 (비과세)',
    ],
    color: '#c8a44e',
  },
  {
    name: '부가가치세 (VAT)',
    rate: '5%',
    effectiveDate: '2018년 1월',
    details: [
      'GCC 공통 프레임워크',
      '대부분 재화/용역에 적용',
      '연 매출 AED 375,000 이상 등록 의무',
    ],
    exemptions: [
      '일부 금융서비스',
      '주거용 부동산 (첫 3년)',
      '필수 의료/교육',
      '수출 (0% 세율)',
    ],
    color: '#4a9eff',
  },
  {
    name: '개인소득세',
    rate: '0%',
    effectiveDate: '-',
    details: [
      '개인 급여, 투자소득에 소득세 없음',
      '전 세계적으로 가장 낮은 개인세율',
      '고소득 전문인력 유치의 핵심 요소',
    ],
    exemptions: undefined,
    color: '#34d399',
  },
  {
    name: '양도소득세',
    rate: '0%',
    effectiveDate: '-',
    details: [
      '주식, 부동산 등 자본 이득에 세금 없음',
      '투자자 친화적 환경의 핵심',
    ],
    exemptions: undefined,
    color: '#a78bfa',
  },
] as const

export interface CountryComparison {
  readonly country: string
  readonly flag: string
  readonly corporateTax: string
  readonly personalIncomeTax: string
  readonly vat: string
  readonly capitalGains: string
  readonly notes: string
}

export const taxComparison: readonly CountryComparison[] = [
  {
    country: 'UAE',
    flag: '🇦🇪',
    corporateTax: '9% (375K AED 초과)',
    personalIncomeTax: '0%',
    vat: '5%',
    capitalGains: '0%',
    notes: '프리존 0%, 개인소득 비과세',
  },
  {
    country: '한국',
    flag: '🇰🇷',
    corporateTax: '9-24%',
    personalIncomeTax: '6-45%',
    vat: '10%',
    capitalGains: '20-25%',
    notes: '누진세율, 종합과세',
  },
  {
    country: '싱가포르',
    flag: '🇸🇬',
    corporateTax: '17%',
    personalIncomeTax: '0-22%',
    vat: '9% (GST)',
    capitalGains: '0%',
    notes: '단일 법인세율, 영토주의',
  },
  {
    country: '홍콩',
    flag: '🇭🇰',
    corporateTax: '8.25-16.5%',
    personalIncomeTax: '2-17%',
    vat: '0%',
    capitalGains: '0%',
    notes: 'VAT 없음, 영토주의',
  },
] as const

export interface FreeZoneBenefit {
  readonly benefit: string
  readonly description: string
  readonly duration: string
  readonly icon: string
}

export const freeZoneBenefits: readonly FreeZoneBenefit[] = [
  {
    benefit: '법인세 면제',
    description: '적격 소득에 대해 0% 법인세 (비적격 소득은 9%)',
    duration: '50년 보장 (일부 프리존)',
    icon: '💰',
  },
  {
    benefit: '외국인 100% 소유',
    description: '현지 파트너/스폰서 없이 완전 외국인 소유 가능',
    duration: '무기한',
    icon: '🏢',
  },
  {
    benefit: '자본/이익 송금 자유',
    description: '이익, 배당, 자본금 본국 송금 제한 없음',
    duration: '무기한',
    icon: '💸',
  },
  {
    benefit: '관세 면제',
    description: '프리존 내 수입품에 관세 면제. 역외 재수출 용이',
    duration: '무기한',
    icon: '📦',
  },
  {
    benefit: '독자 규제',
    description: 'DIFC, ADGM 등은 독자 법률/법원 체계 (영국 보통법)',
    duration: '무기한',
    icon: '⚖️',
  },
] as const

export interface TransferPricingRule {
  readonly title: string
  readonly content: string
}

export const transferPricingRules: readonly TransferPricingRule[] = [
  { title: '정상가격 원칙', content: '관계사 거래는 독립기업간 거래와 동일한 조건으로 수행되어야 함 (Arm\'s Length Principle)' },
  { title: '문서화 의무', content: '마스터 파일, 로컬 파일 준비 의무. 연 매출 AED 200M 이상 기업은 국가별 보고서(CbCR) 제출' },
  { title: 'OECD 가이드라인', content: 'OECD 이전가격 가이드라인 준수. 비교가능성 분석, 기능/위험 분석 필요' },
  { title: '사전가격합의', content: 'FTA와 APA (Advance Pricing Agreement) 협의 가능' },
] as const

export const taxInsights: readonly string[] = [
  '법인세 9%: 한국 대비 매우 낮음. 단, 프리존 밖 메인랜드 법인은 과세 대상',
  '프리존 활용: DIFC, ADGM, JAFZA 등은 법인세 0% 유지. 지주회사, 금융사에 유리',
  '개인소득세 0%: 고액 연봉자에게 실질 소득 증가 효과. 인재 유치 핵심',
  '이전가격: 한국 본사와의 거래 시 정상가격 문서화 필수. 세무조사 대비',
  '글로벌 최저세: 매출 EUR 7.5억 이상 다국적 기업은 15% 최저세 적용 예정',
] as const

export interface CorporateTaxTimeline {
  readonly year: string
  readonly event: string
  readonly detail: string
}

export const corporateTaxTimeline: readonly CorporateTaxTimeline[] = [
  { year: '2022.01', event: '법인세 도입 발표', detail: 'UAE 재무부, 2023년 6월부터 9% 법인세 도입 발표' },
  { year: '2022.12', event: '법인세법 공포', detail: 'Federal Decree-Law No. 47/2022' },
  { year: '2023.06', event: '법인세 시행', detail: '회계연도 기준 순차 적용 시작' },
  { year: '2024', event: 'OECD 필라2 대응', detail: '글로벌 최저세율 15% 도입 검토 중' },
] as const
