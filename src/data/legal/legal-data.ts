// ─── Legal Framework (법체계 계층) ────────────────────────────

export interface LegalLayer {
  readonly tier: number
  readonly label: string
  readonly labelKo: string
  readonly description: string
  readonly color: string
  readonly glowColor: string
  readonly examples: readonly string[]
}

export const legalLayers: readonly LegalLayer[] = [
  {
    tier: 1,
    label: 'Federal Constitution & Laws',
    labelKo: '연방 헌법 및 연방법',
    description: '최상위 법체계. 연방국가평의회(FNC) 및 연방내각에서 제정.',
    color: '#c8a44e',
    glowColor: 'rgba(200, 164, 78, 0.15)',
    examples: ['헌법 (1971)', '연방형법', '민사소송법', '상법', '노동법', 'PDPL 2022'],
  },
  {
    tier: 2,
    label: 'Emirate-Level Laws',
    labelKo: '에미리트 개별법',
    description: '7개 에미리트가 연방법 범위 내에서 독자 입법. 부동산, 임대, 지방세 등.',
    color: '#4a9eff',
    glowColor: 'rgba(74, 158, 255, 0.12)',
    examples: ['Dubai 임대법', 'Abu Dhabi 토지법', 'Dubai RERA', 'Abu Dhabi DOE 규정'],
  },
  {
    tier: 3,
    label: 'Sharia + Civil Law (Mixed)',
    labelKo: '이슬람법(샤리아) + 대륙법 혼합',
    description: '가족법·상속법은 샤리아 기반. 상법·형법은 이집트·프랑스계 대륙법 기반.',
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.12)',
    examples: ['가족법 (샤리아)', '상속법', '상법 (대륙법)', '비무슬림 가족법 2023'],
  },
  {
    tier: 4,
    label: 'Free Zone Common Law',
    labelKo: 'DIFC / ADGM 커먼로 체계',
    description: '영미식 커먼로 독자 법체계. 독립 법원·판사·중재. 글로벌 비즈니스 표준.',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.12)',
    examples: ['DIFC Courts (영국 판사)', 'ADGM Courts', 'DIFC 회사법', 'ADGM 파산법'],
  },
] as const

export interface LegalSystemFeature {
  readonly icon: string
  readonly title: string
  readonly description: string
}

export const legalSystemFeatures: readonly LegalSystemFeature[] = [
  {
    icon: '🏛️',
    title: '이원적 법체계',
    description: '연방법 + 에미리트법이 공존. 사안에 따라 관할이 달라 법률 전문가 자문 필수.',
  },
  {
    icon: '⚖️',
    title: '샤리아 + 대륙법',
    description: '가족·상속은 이슬람법, 상사·형사는 대륙법. 2023년 비무슬림 가족법 도입으로 유연화.',
  },
  {
    icon: '🌐',
    title: '커먼로 병존',
    description: 'DIFC·ADGM 내 영미식 커먼로 체계. 국제 분쟁해결, 영어 재판, 글로벌 판사.',
  },
  {
    icon: '📜',
    title: '빠른 입법 속도',
    description: '군주제 특성상 입법 속도 매우 빠름. 법인세, 데이터보호법 등 수개월 내 도입.',
  },
] as const

// ─── Business Regulations (기업 규제) ─────────────────────────

export interface TaxMetric {
  readonly label: string
  readonly value: string
  readonly subLabel: string
  readonly icon: string
  readonly color: string
  readonly glowColor: string
}

export const taxMetrics: readonly TaxMetric[] = [
  {
    label: '법인세',
    value: '9%',
    subLabel: 'AED 375K 초과 소득 (2023.6~)',
    icon: '🏢',
    color: '#c8a44e',
    glowColor: 'rgba(200, 164, 78, 0.15)',
  },
  {
    label: 'VAT (부가가치세)',
    value: '5%',
    subLabel: '2018년 도입, GCC 최저 수준',
    icon: '🧾',
    color: '#4a9eff',
    glowColor: 'rgba(74, 158, 255, 0.12)',
  },
  {
    label: '소득세',
    value: '0%',
    subLabel: '개인 소득세 없음 (세계 최저)',
    icon: '👤',
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.12)',
  },
  {
    label: '자본이득세',
    value: '0%',
    subLabel: '주식·부동산 양도차익 비과세',
    icon: '📈',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.12)',
  },
] as const

export interface RegulationItem {
  readonly category: string
  readonly icon: string
  readonly title: string
  readonly description: string
  readonly details: readonly string[]
  readonly badgeColor: string
}

export const regulations: readonly RegulationItem[] = [
  {
    category: '고용',
    icon: '🇦🇪',
    title: 'Emiratisation (에미라티화)',
    description: '민간 부문 UAE 국민 고용 의무화',
    details: [
      '50인 이상 민간기업 대상',
      '매년 숙련직 에미라티 비율 2%씩 증가 의무',
      '2025년 목표: 10%',
      '미준수 시 벌금: AED 96,000/인/년 (약 $26,000)',
      'MoHRE(노동부) 감독',
    ],
    badgeColor: '#ef4444',
  },
  {
    category: '투자',
    icon: '🌍',
    title: '외국인 투자 (FDI)',
    description: '2021년 상법 개정으로 100% 외국인 소유 허용',
    details: [
      '2021년 이전: 현지 스폰서 51% 의무',
      '2021년 이후: 본토(Mainland) 100% 외국인 소유 가능',
      '프리존: 기존부터 100% 외국인 소유',
      '네거티브 리스트: 석유/가스, 은행, 보험 등 일부 업종 제한',
      '전략적 산업 1,000+ 활동 개방',
    ],
    badgeColor: '#34d399',
  },
  {
    category: '데이터',
    icon: '🔒',
    title: '데이터 보호 (PDPL 2022)',
    description: 'UAE 최초 연방 개인정보보호법',
    details: [
      '2022년 1월 시행 (Federal Decree-Law No. 45/2021)',
      'GDPR과 유사한 구조 (동의, 정보주체 권리, DPO)',
      '국외 이전: 적정성 평가 또는 계약적 보호',
      '위반 시 AED 50K~5M 벌금',
      'DIFC/ADGM은 별도 데이터보호법 적용',
    ],
    badgeColor: '#4a9eff',
  },
  {
    category: '자금세탁',
    icon: '🛡️',
    title: 'AML/CFT 규제',
    description: 'FATF 그레이리스트 2024년 2월 해제',
    details: [
      '2022년 3월 FATF 그레이리스트 등재',
      '2024년 2월 해제 (2년 만에 조기 달성)',
      '실질소유자(UBO) 등록 의무화',
      'goAML 시스템: 의심거래보고(STR) 전산화',
      '가상자산 AML: VARA/CBUAE 이중 감독',
    ],
    badgeColor: '#f59e0b',
  },
] as const

// ─── Free Zones (프리존) ──────────────────────────────────────

export interface FreeZone {
  readonly name: string
  readonly fullName: string
  readonly specialty: string
  readonly location: string
  readonly stats: readonly string[]
  readonly advantages: readonly string[]
  readonly color: string
  readonly glowColor: string
}

export const freeZones: readonly FreeZone[] = [
  {
    name: 'DIFC',
    fullName: 'Dubai International Financial Centre',
    specialty: '금융 / 핀테크',
    location: 'Dubai',
    stats: [
      '4,400+ 등록 기업',
      '36,000+ 종사자',
      '독자 커먼로 법원',
      '총 자산 $5.8T 관리',
    ],
    advantages: [
      '영국계 커먼로 법체계',
      '독립 법원 (영국 판사)',
      '50년 세금 면제 보장',
      '세계 8위 금융센터 (GFCI)',
    ],
    color: '#c8a44e',
    glowColor: 'rgba(200, 164, 78, 0.12)',
  },
  {
    name: 'ADGM',
    fullName: 'Abu Dhabi Global Market',
    specialty: '금융 / 크립토',
    location: 'Abu Dhabi',
    stats: [
      'FSRA 규제 프레임워크',
      '2018년 세계 최초 크립토 규제',
      'RegLab 핀테크 샌드박스',
      '1,800+ 라이선스',
    ],
    advantages: [
      '영국계 커먼로 법체계',
      '크립토/디지털 자산 선도 규제',
      '핀테크 샌드박스 (RegLab)',
      '독립 법원 + 중재센터',
    ],
    color: '#4a9eff',
    glowColor: 'rgba(74, 158, 255, 0.12)',
  },
  {
    name: 'JAFZA',
    fullName: 'Jebel Ali Free Zone',
    specialty: '물류 / 제조',
    location: 'Dubai',
    stats: [
      '8,700+ 입주 기업',
      'UAE 비석유 무역의 23%',
      '135+ 국가 기업 유치',
      '인접 Jebel Ali Port (세계 9위)',
    ],
    advantages: [
      '세계 최대 프리존 중 하나',
      '항만·공항 직접 연결',
      '풀 인프라 (공장, 물류, 사무실)',
      '100% 이익 송금 자유',
    ],
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.12)',
  },
  {
    name: 'DMCC',
    fullName: 'Dubai Multi Commodities Centre',
    specialty: '상품거래 / 무역',
    location: 'Dubai',
    stats: [
      '22,000+ 회원사',
      '8년 연속 세계 1위 프리존 (fDi)',
      '글로벌 상품거래 허브',
      '650+ 크립토 기업',
    ],
    advantages: [
      '금, 다이아몬드, 커피 등 상품거래',
      '크립토센터 운영',
      '스마트 오피스 + 코워킹',
      '비자·라이선스 원스톱 서비스',
    ],
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.12)',
  },
  {
    name: 'DAFZA',
    fullName: 'Dubai Airport Free Zone',
    specialty: 'IT / 항공 / 물류',
    location: 'Dubai',
    stats: [
      '1,800+ 기업',
      'DXB 공항 인접',
      'IT·항공·물류 특화',
      '연 무역 $18B+',
    ],
    advantages: [
      '공항 직접 연결',
      'IT·테크 기업 집중',
      '빠른 라이선스 발급',
      '전략적 위치 (공항 내)',
    ],
    color: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.12)',
  },
  {
    name: 'KIZAD',
    fullName: 'Khalifa Industrial Zone Abu Dhabi',
    specialty: '산업 / 제조',
    location: 'Abu Dhabi',
    stats: [
      '420 km\u00B2 면적',
      'Khalifa Port 인접',
      '식품·금속·화학·물류',
      '800+ 기업',
    ],
    advantages: [
      '대규모 산업용지',
      '맞춤형 인프라 구축',
      '항만 직결 물류',
      'Abu Dhabi 정부 지원',
    ],
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.12)',
  },
  {
    name: 'Masdar City FZ',
    fullName: 'Masdar City Free Zone',
    specialty: '신재생에너지 / 클린테크',
    location: 'Abu Dhabi',
    stats: [
      '1,000+ 기업',
      '클린테크 R&D 허브',
      'IRENA 본부 소재',
      '탄소중립 도시 목표',
    ],
    advantages: [
      '클린에너지 특화 생태계',
      'R&D 시설 + 연구소',
      'IRENA, MBZUAI 인접',
      '지속가능 인프라',
    ],
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.12)',
  },
  {
    name: 'twofour54',
    fullName: 'twofour54 Media Free Zone',
    specialty: '미디어 / 엔터테인먼트',
    location: 'Abu Dhabi',
    stats: [
      '900+ 미디어 기업',
      'CNN, Sky News, MBC 입주',
      '영화/방송 제작 스튜디오',
      'Yas Island 인접',
    ],
    advantages: [
      '미디어 콘텐츠 특화',
      '세계적 제작 인프라',
      '30% 프로덕션 리베이트',
      'Abu Dhabi Film Commission',
    ],
    color: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.12)',
  },
] as const

export interface FreeZoneProCon {
  readonly type: 'pro' | 'con'
  readonly text: string
}

export const freeZoneProsCons: readonly FreeZoneProCon[] = [
  { type: 'pro', text: '외국인 100% 소유 보장' },
  { type: 'pro', text: '법인세·관세 면제 (최대 50년)' },
  { type: 'pro', text: '이익·자본 100% 송금 자유' },
  { type: 'pro', text: '원스톱 라이선스 발급' },
  { type: 'pro', text: '독자 규제 프레임워크' },
  { type: 'con', text: '본토(Mainland) 직접 거래 제한' },
  { type: 'con', text: '프리존별 별도 라이선스 필요' },
  { type: 'con', text: '실질 사무실 요건 (P.O.Box 불가 추세)' },
  { type: 'con', text: '프리존 간 규제 차이로 복잡성 증가' },
] as const

// ─── Recent Legal Changes (최근 법률 변경 타임라인) ──────────

export interface TimelineEvent {
  readonly year: number
  readonly month?: string
  readonly title: string
  readonly description: string
  readonly impact: 'high' | 'medium' | 'low'
  readonly category: string
  readonly categoryColor: string
}

export const timelineEvents: readonly TimelineEvent[] = [
  {
    year: 2023,
    month: '6월',
    title: '법인세 9% 도입',
    description: 'UAE 역사상 최초 법인세. AED 375,000 초과 과세소득에 9% 적용. 프리존 적격소득은 0% 유지.',
    impact: 'high',
    category: '세제',
    categoryColor: '#c8a44e',
  },
  {
    year: 2023,
    month: '10월',
    title: 'GCGRA 설립',
    description: 'General Commercial Gaming Regulatory Authority. UAE 최초 상업 게이밍(카지노) 규제기관 설립.',
    impact: 'medium',
    category: '규제기관',
    categoryColor: '#a78bfa',
  },
  {
    year: 2024,
    month: '2월',
    title: 'FATF 그레이리스트 해제',
    description: '2022년 등재 후 2년 만에 조기 해제. AML/CFT 체계 대폭 강화 인정. 국제 금융 신뢰도 회복.',
    impact: 'high',
    category: 'AML',
    categoryColor: '#34d399',
  },
  {
    year: 2024,
    month: '5월',
    title: 'CEPA 한-UAE 발효',
    description: 'Comprehensive Economic Partnership Agreement. 약 97% 품목 관세 철폐. 서비스·투자·디지털 무역 포괄.',
    impact: 'high',
    category: '통상',
    categoryColor: '#4a9eff',
  },
  {
    year: 2024,
    title: '디지털 세금 신고 전면 전환',
    description: 'EmaraTax 플랫폼 통해 법인세, VAT, 소비세 전자 신고 의무화. 종이 서류 완전 폐지.',
    impact: 'medium',
    category: '세제',
    categoryColor: '#c8a44e',
  },
  {
    year: 2025,
    title: '에미라티화 10% 목표',
    description: '50인 이상 민간기업 숙련직 에미라티 비율 10% 달성 목표. 미달 시 AED 96,000/인 벌금.',
    impact: 'high',
    category: '고용',
    categoryColor: '#ef4444',
  },
  {
    year: 2025,
    month: '1월',
    title: '설탕세(Sugar Tax) 도입',
    description: '가당 음료에 대한 추가 소비세 도입. 건강증진 및 당뇨병 예방 목적. GCC 건강세 확대 트렌드.',
    impact: 'low',
    category: '세제',
    categoryColor: '#c8a44e',
  },
  {
    year: 2026,
    title: '복수의결권 주식 허용',
    description: '2025년 상법 개정안에 따라 시행. 테크 스타트업 창업자 지배구조 유지 지원. ADX/DFM 상장 유연화.',
    impact: 'high',
    category: '기업법',
    categoryColor: '#a78bfa',
  },
  {
    year: 2026,
    title: '규제 투명성 강화법',
    description: '규제 영향분석(RIA) 의무화. 사전 공개 의견수렴 절차 도입. OECD 규제 품질 기준 수렴.',
    impact: 'medium',
    category: '행정',
    categoryColor: '#22d3ee',
  },
] as const
