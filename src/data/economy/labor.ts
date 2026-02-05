export interface WorkforceBreakdown {
  readonly category: string
  readonly percentage: number
  readonly description: string
  readonly color: string
}

export const workforceComposition: readonly WorkforceBreakdown[] = [
  {
    category: '외국인 노동자',
    percentage: 88,
    description: '인도, 파키스탄, 방글라데시, 필리핀 등. 건설, 서비스, 가사노동부터 금융, IT까지 전 분야',
    color: '#4a9eff',
  },
  {
    category: '에미라티 (자국민)',
    percentage: 12,
    description: '정부, 공기업 중심 고용. 민간 부문 에미라티화 정책으로 점진적 확대 중',
    color: '#c8a44e',
  },
] as const

export interface SectorEmployment {
  readonly sector: string
  readonly employmentShare: number
  readonly averageSalary: string
  readonly salaryRangeAED: string
  readonly keyRoles: readonly string[]
  readonly emiratizationRate: string
  readonly color: string
}

export const sectorEmployment: readonly SectorEmployment[] = [
  {
    sector: '건설 / 인프라',
    employmentShare: 22,
    averageSalary: 'AED 2,000-15,000',
    salaryRangeAED: '~AED 50,000+ (시니어)',
    keyRoles: ['현장 노동자', '엔지니어', '프로젝트 매니저'],
    emiratizationRate: '2%',
    color: '#f59e0b',
  },
  {
    sector: '도소매 / 무역',
    employmentShare: 18,
    averageSalary: 'AED 3,000-12,000',
    salaryRangeAED: '~AED 40,000+ (매니저)',
    keyRoles: ['영업', '물류', '구매담당'],
    emiratizationRate: '2%',
    color: '#4a9eff',
  },
  {
    sector: '금융 / 보험',
    employmentShare: 8,
    averageSalary: 'AED 8,000-35,000',
    salaryRangeAED: '~AED 100,000+ (임원)',
    keyRoles: ['뱅커', '애널리스트', '보험설계사'],
    emiratizationRate: '4%',
    color: '#34d399',
  },
  {
    sector: '호텔 / 관광',
    employmentShare: 12,
    averageSalary: 'AED 2,500-10,000',
    salaryRangeAED: '~AED 30,000+ (GM)',
    keyRoles: ['호텔리어', '여행사', '가이드'],
    emiratizationRate: '2%',
    color: '#a78bfa',
  },
  {
    sector: '정부 / 공기업',
    employmentShare: 15,
    averageSalary: 'AED 15,000-40,000',
    salaryRangeAED: '~AED 80,000+ (고위직)',
    keyRoles: ['공무원', '국영기업 직원'],
    emiratizationRate: '90%+',
    color: '#c8a44e',
  },
  {
    sector: 'IT / 기술',
    employmentShare: 6,
    averageSalary: 'AED 10,000-40,000',
    salaryRangeAED: '~AED 80,000+ (CTO/Director)',
    keyRoles: ['개발자', 'PM', '데이터 사이언티스트'],
    emiratizationRate: '2%',
    color: '#22d3ee',
  },
  {
    sector: '의료 / 헬스케어',
    employmentShare: 5,
    averageSalary: 'AED 8,000-50,000',
    salaryRangeAED: '~AED 120,000+ (전문의)',
    keyRoles: ['의사', '간호사', '약사'],
    emiratizationRate: '2%',
    color: '#ef4444',
  },
] as const

export interface EmiraitizationRule {
  readonly title: string
  readonly content: string
  readonly penalty?: string
}

export const emiratizationRules: readonly EmiraitizationRule[] = [
  {
    title: '적용 대상',
    content: '50인 이상 민간 기업 (14개 주요 업종)',
    penalty: undefined,
  },
  {
    title: '연간 목표',
    content: '매년 에미라티 고용 2% 증가 의무 (2026년까지 10% 목표)',
    penalty: '미달 시 AED 96,000/인/년 벌금',
  },
  {
    title: '2024년 목표',
    content: '숙련 노동자 기준 6% (2024년), 7% (2025년), 10% (2026년)',
    penalty: undefined,
  },
  {
    title: '혜택',
    content: '목표 초과 달성 시 정부 계약 우대, 라이선스 수수료 감면',
    penalty: undefined,
  },
  {
    title: '주의사항',
    content: '에미라티 해고 시 당국 승인 필요. 가짜 고용(스폰서십 거래) 적발 시 강력 제재',
    penalty: undefined,
  },
] as const

export interface LaborLawItem {
  readonly topic: string
  readonly description: string
  readonly effectiveDate: string
  readonly icon: string
}

export const laborLawUpdates: readonly LaborLawItem[] = [
  {
    topic: '무기한 계약 폐지',
    description: '모든 고용계약은 최대 3년 기한제로 전환 의무. 갱신 가능',
    effectiveDate: '2025.1.1',
    icon: '📋',
  },
  {
    topic: '유연근무 공식 인정',
    description: '파트타임, 임시직, 원격근무 등 다양한 근무 형태 법적 인정',
    effectiveDate: '2024',
    icon: '🏠',
  },
  {
    topic: 'WPS (임금보호시스템)',
    description: '모든 급여는 UAE 은행 계좌로 지급 의무. 체불 시 자동 신고',
    effectiveDate: '강화 중',
    icon: '💳',
  },
  {
    topic: '골든 비자',
    description: '투자자, 기업가, 특수 재능자에게 5-10년 장기 거주 비자. 스폰서 없이 독립 체류',
    effectiveDate: '확대 중',
    icon: '🏆',
  },
  {
    topic: '분쟁 해결',
    description: 'MOHRE (노동부) 온라인 분쟁 신청. 14일 내 조정, 불복 시 법원',
    effectiveDate: '간소화',
    icon: '⚖️',
  },
] as const

export interface WPSInfo {
  readonly label: string
  readonly content: string
}

export const wpsInfo: readonly WPSInfo[] = [
  { label: '정의', content: '임금보호시스템 (Wage Protection System). UAE 내 모든 고용주가 근로자 급여를 은행 송금으로 지급하도록 의무화' },
  { label: '목적', content: '임금 체불 방지, 노동자 권리 보호, 임금 지급 투명성 확보' },
  { label: '적용 범위', content: '모든 민간 기업 (가사노동자 제외 일부)' },
  { label: '벌칙', content: '미준수 시 신규 취업비자 발급 정지, 벌금, 라이선스 취소 가능' },
  { label: '비즈니스 시사점', content: '급여 체계는 반드시 UAE 은행 계좌 연동 필요. 현금 지급 관행 불가' },
] as const

export const laborInsights: readonly string[] = [
  '에미라티화: 50인+ 기업은 채용 시 에미라티 쿼터 필수 고려. 미달 시 상당한 벌금',
  'WPS 준수: 급여는 반드시 UAE 은행 계좌로 지급. 현금/해외 송금 불가',
  '계약서 필수: 모든 고용계약은 MOHRE 등록 필수. 아랍어 계약서 원본 효력',
  '골든 비자: 투자자, 기업가는 독립 비자 취득으로 스폰서 의존 탈피 가능',
  '해고 절차: 에미라티 직원 해고 시 당국 사전 승인 필요. 일반 외국인도 통지 기간 준수',
] as const
