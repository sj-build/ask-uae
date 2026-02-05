export interface Bank {
  readonly name: string
  readonly shortName: string
  readonly totalAssets: string
  readonly assetsValue: number // in billions USD for chart
  readonly type: 'conventional' | 'islamic' | 'hybrid'
  readonly ownership: string
  readonly headquarters: string
  readonly founded: string
  readonly characteristics: readonly string[]
  readonly color: string
}

export const majorBanks: readonly Bank[] = [
  {
    name: 'First Abu Dhabi Bank',
    shortName: 'FAB',
    totalAssets: '$330B+',
    assetsValue: 330,
    type: 'hybrid',
    ownership: 'Mubadala 투자 (NBAD + FGB 합병)',
    headquarters: 'Abu Dhabi',
    founded: '2017 (합병)',
    characteristics: ['UAE 최대 은행', 'MENA 지역 최대', '글로벌 확장 적극적'],
    color: '#c8a44e',
  },
  {
    name: 'Emirates NBD',
    shortName: 'ENBD',
    totalAssets: '$220B+',
    assetsValue: 220,
    type: 'hybrid',
    ownership: 'ICD (Dubai 왕실)',
    headquarters: 'Dubai',
    founded: '2007',
    characteristics: ['Dubai 최대 은행', '리테일 뱅킹 강점', 'DenizBank(터키) 인수'],
    color: '#4a9eff',
  },
  {
    name: 'Abu Dhabi Commercial Bank',
    shortName: 'ADCB',
    totalAssets: '$145B+',
    assetsValue: 145,
    type: 'conventional',
    ownership: 'Abu Dhabi 정부',
    headquarters: 'Abu Dhabi',
    founded: '1985',
    characteristics: ['UAE 3위', 'Union National Bank 합병', '디지털 뱅킹 선도'],
    color: '#34d399',
  },
  {
    name: 'Mashreq Bank',
    shortName: 'Mashreq',
    totalAssets: '$55B+',
    assetsValue: 55,
    type: 'conventional',
    ownership: 'Al Ghurair 가문 (민간)',
    headquarters: 'Dubai',
    founded: '1967',
    characteristics: ['UAE 최대 민간 은행', '핀테크 선도', '해외 네트워크 강점'],
    color: '#a78bfa',
  },
  {
    name: 'Dubai Islamic Bank',
    shortName: 'DIB',
    totalAssets: '$80B+',
    assetsValue: 80,
    type: 'islamic',
    ownership: 'ICD (Dubai 왕실)',
    headquarters: 'Dubai',
    founded: '1975',
    characteristics: ['세계 최초 이슬람 은행', 'Noor Bank 합병', '이슬람 금융 선도'],
    color: '#22d3ee',
  },
  {
    name: 'Abu Dhabi Islamic Bank',
    shortName: 'ADIB',
    totalAssets: '$50B+',
    assetsValue: 50,
    type: 'islamic',
    ownership: 'Emirates Investment Authority',
    headquarters: 'Abu Dhabi',
    founded: '1997',
    characteristics: ['Abu Dhabi 최대 이슬람 은행', '에미라티 고객 집중', '소매 강점'],
    color: '#f59e0b',
  },
] as const

export interface IslamicBankingInfo {
  readonly title: string
  readonly content: string
  readonly icon: string
}

export const islamicBankingInfo: readonly IslamicBankingInfo[] = [
  {
    title: '시장 점유율',
    content: 'UAE 은행 자산의 약 25%가 이슬람 금융 상품. 지속 성장 중',
    icon: '📊',
  },
  {
    title: '핵심 원칙',
    content: '이자(Riba) 금지, 위험 공유, 실물 자산 기반 거래. Murabaha, Ijara, Sukuk 등',
    icon: '📜',
  },
  {
    title: '규제 기관',
    content: 'Central Bank of UAE 산하 Higher Sharia Authority가 샤리아 적합성 인증',
    icon: '🏛️',
  },
  {
    title: '비즈니스 시사점',
    content: '이슬람 금융 이해 필요. 할부/리스 구조 설계 시 샤리아 적합성 검토 필수',
    icon: '💡',
  },
] as const

export interface FinancialHub {
  readonly name: string
  readonly fullName: string
  readonly location: string
  readonly founded: string
  readonly legalSystem: string
  readonly regulators: readonly string[]
  readonly keyFeatures: readonly string[]
  readonly registeredEntities: string
  readonly color: string
}

export const financialHubs: readonly FinancialHub[] = [
  {
    name: 'DIFC',
    fullName: 'Dubai International Financial Centre',
    location: 'Dubai',
    founded: '2004',
    legalSystem: '영국 보통법 기반 (독자 법원)',
    regulators: ['DFSA (Dubai Financial Services Authority)'],
    keyFeatures: [
      '100% 외국인 소유 가능',
      '50년간 법인세 0% 보장',
      '이익 송금 제한 없음',
      '글로벌 금융 기관 집중',
    ],
    registeredEntities: '5,600+',
    color: '#c8a44e',
  },
  {
    name: 'ADGM',
    fullName: 'Abu Dhabi Global Market',
    location: 'Abu Dhabi (Al Maryah Island)',
    founded: '2015',
    legalSystem: '영국 보통법 기반 (독자 법원)',
    regulators: ['FSRA (Financial Services Regulatory Authority)'],
    keyFeatures: [
      '핀테크 허브 지향',
      '암호화폐 규제 프레임워크 선도',
      '자산관리/사모펀드 강점',
      'RegLab (규제 샌드박스) 운영',
    ],
    registeredEntities: '2,000+',
    color: '#4a9eff',
  },
] as const

export interface FintechRegulation {
  readonly topic: string
  readonly status: string
  readonly detail: string
}

export const fintechRegulations: readonly FintechRegulation[] = [
  {
    topic: '암호화폐',
    status: '규제 프레임워크 확립',
    detail: 'VARA (Virtual Assets Regulatory Authority) 설립 (2022). 거래소 라이선스 발급. Binance, OKX 등 글로벌 거래소 진출',
  },
  {
    topic: '디지털 은행',
    status: '성장 중',
    detail: 'YAP, Zand 등 디지털 전용 은행 라이선스 발급. 기존 은행도 디지털 전환 가속',
  },
  {
    topic: '오픈 뱅킹',
    status: '도입 초기',
    detail: 'Central Bank의 오픈 뱅킹 프레임워크 발표 (2023). API 표준화 진행 중',
  },
  {
    topic: 'BNPL (Buy Now Pay Later)',
    status: '급성장',
    detail: 'Tabby, Postpay, Tamara 등 현지 및 지역 BNPL 서비스 활성화',
  },
] as const

export const bankingInsights: readonly string[] = [
  'FAB, ENBD 등 대형 은행은 정부/왕실 소유 -- 정부 프로젝트 금융에 필수적 파트너',
  '이슬람 금융 상품 이해 필수. 할부 판매, 리스, 프로젝트 파이낸싱 시 샤리아 적합 구조 고려',
  'DIFC/ADGM: 글로벌 기준 법률 환경. 지주회사, 펀드, 핀테크 설립 시 검토',
  '핀테크 생태계 급성장 중. 한국 핀테크 기업의 중동 진출 거점으로 UAE 적합',
] as const
