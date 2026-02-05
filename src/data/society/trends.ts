export interface CasinoDetail {
  readonly label: string
  readonly value: string
}

export const casinoDetails: readonly CasinoDetail[] = [
  { label: '첫 카지노 라이선스', value: 'Wynn Resorts에 2024.10 발급 (GCGRA)' },
  { label: '프로젝트', value: 'Wynn Al Marjan Island -- RAK, Al Marjan Island' },
  { label: '규모', value: '$5.1B 투자, 1,500+ 객실, 47층, 카지노 21,000m2' },
  { label: '오픈 예정', value: '2027년 3월 (건설 진행 중, $2.4B 대출 확보)' },
  { label: '시장 전망', value: 'GGR $3B~$5B/년, 분석기관에 따라 $8.5B까지' },
  { label: '라이선스 구조', value: '에미리트별 1개 카지노 라이선스 가능 (Sharjah 불참)' },
  { label: '추가 진출', value: 'MGM Resorts 추가 라이선스 추진 중, Abu Dhabi/Dubai 후보지' },
  { label: '온라인 게이밍', value: '2025.11 Play971 브랜드로 Abu Dhabi에서 iGaming 시범 출시' },
] as const

export interface CasinoSurvey {
  readonly label: string
  readonly percentage: number
  readonly color: string
}

export const casinoSurveyData: readonly CasinoSurvey[] = [
  { label: 'RAK 거주자 관심', percentage: 81, color: '#34d399' },
  { label: '도박중독 우려', percentage: 34, color: '#f59e0b' },
  { label: '문화적 정체성 보존 요구', percentage: 28, color: '#ef4444' },
] as const

export const casinoInsights: readonly string[] = [
  'UAE가 이슬람 문화권 최초로 카지노를 합법화 = "사회 개방 가속화"의 가장 강력한 시그널',
  '한국 기업 기회: 카지노 장비/기술 공급, 호스피탈리티 서비스, K-Pop 공연 등',
  'GDP 기여도 최대 1.7% 예상 -> 관광/엔터 섹터 전체에 파급 효과',
  'NIP Group(e스포츠) $40M Abu Dhabi Investment Office 딜 -> 게이밍 생태계 확장 중',
] as const

export interface LiberalizationEvent {
  readonly date: string
  readonly change: string
  readonly significance: string
}

export const liberalizationTimeline: readonly LiberalizationEvent[] = [
  { date: '2020.11', change: '동거 합법화', significance: '미혼 커플 동거가 범죄에서 합법으로. 외국인/관광객 포함' },
  { date: '2020.11', change: '혼외 성관계 비범죄화', significance: '합의하의 성인 관계 형사처벌 대상에서 제외' },
  { date: '2020.11', change: '알코올 규제 완화', significance: '사적 공간 음주 비범죄화, Abu Dhabi 주류 라이선스 간소화' },
  { date: '2020.11', change: '자살/자살시도 비범죄화', significance: '정신건강 지원으로 전환' },
  { date: '2020.11', change: '"명예범죄" 감경 폐지', significance: '여성 대상 폭력의 가벼운 처벌 관행 종료' },
  { date: '2022.1', change: '주말 변경 (금-토 -> 토-일)', significance: '글로벌 비즈니스 정렬 (역사적 변화)' },
  { date: '2024.10', change: '신 개인신분법', significance: '이혼, 양육권, 부양비 대폭 개혁. 성평등 강화. 2025.4.15 시행' },
  { date: '2025.1', change: '무기한 계약 폐지', significance: '모든 노동 계약 기간 한정 전환 (노동자 보호 강화)' },
  { date: '2025.8', change: 'Ejari 규정 완화', significance: '동거인 등록 의무 사실상 폐지' },
] as const

export const liberalizationDrivers: readonly string[] = [
  '경쟁 압력: Saudi Arabia Vision 2030과 직접 경쟁',
  '인재 유치: Golden Visa 확대와 함께 서구 전문인력 유치 필요',
  '관광 목표: Dubai 2040 Urban Master Plan -- 인구 5.8M, 연간 관광객 25M+',
  '세대 변화: UAE 중위연령 31.6세, Gen Z/밀레니얼이 소비/문화 주도',
] as const

export const liberalizationInsights: readonly string[] = [
  '법률 환경이 "한국보다 오히려 더 자유로운" 영역들이 생기고 있음',
  '한국 기업의 현지 주재원/파견 직원 생활 환경이 크게 개선됨',
  '공식 법률 vs 사회적 기대 괴리는 여전 -- 법적으로 가능해도 문화적으로 환영받지 못할 수 있음',
  '법률 변화 속도 자체가 비즈니스 기회 시그널: 규제 환경이 빠르게 친기업적으로 변화 중',
] as const

export interface CulturalInfra {
  readonly name: string
  readonly location: string
  readonly description: string
  readonly year: string
}

export const culturalInfrastructure: readonly CulturalInfra[] = [
  { name: 'teamLab Phenomena Abu Dhabi', location: 'Saadiyat Island', description: '일본 teamLab의 중동 최초 상설 전시. 몰입형 디지털 아트', year: '2025' },
  { name: 'Zayed National Museum', location: 'Saadiyat Island', description: 'UAE 건국사~현재까지의 국가 내러티브. 국립박물관', year: '2025' },
  { name: 'Natural History Museum Abu Dhabi', location: 'Saadiyat Island', description: '138억년 우주 역사~지구 생명 진화. 세계적 규모', year: '2025' },
  { name: 'Dubai Museum of Art', location: 'Dubai', description: '두바이 최초의 대규모 미술관 (건설 예정)', year: 'TBD' },
] as const

export interface UnescoItem {
  readonly name: string
  readonly year: number
}

export const unescoItems: readonly UnescoItem[] = [
  { name: 'Al Ayyala (전통 춤)', year: 2025 },
  { name: 'Al Bisht (전통 망토)', year: 2025 },
  { name: '신부 행렬', year: 2025 },
  { name: 'Kohl', year: 2025 },
] as const

export const culturalInsights: readonly string[] = [
  'Saadiyat Island = Louvre Abu Dhabi(2017) + Guggenheim(건설중) + 3개 신규 -> 세계적 문화 클러스터',
  '한국 기회: K-Art 전시, 디지털 아트 기술, 한국 문화 콘텐츠 페스티벌',
  'UAE 정부가 "석유 이후의 정체성"을 문화에서 찾고 있음 -> 문화 관련 투자에 정부 지원 가능성 높음',
] as const

export interface GamingMetric {
  readonly label: string
  readonly value: string
}

export const gamingMetrics: readonly GamingMetric[] = [
  { label: '글로벌 e스포츠 시장', value: '$1.79B (2025), +16.2% YoY' },
  { label: '중동 투자', value: 'NIP Group + ADIO $40M 딜 (2025 Q1)' },
  { label: 'Saudi Gamers8', value: '2024 사우디 경제에 $90M+ 기여' },
  { label: '올림픽 e스포츠', value: 'IOC + 사우디 NOC, Olympic Esports Games 2025 확정 (12년 협약)' },
  { label: '럭셔리 x 게이밍', value: 'Gucci, LV Valorant/LoL 캠페인. H1 2024 347개 신규 브랜드' },
] as const

export const gamingInsights: readonly string[] = [
  '한국 = e스포츠 종주국 -> UAE/GCC에서 인프라/노하우 수출 가치 매우 높음',
  'K-Pop x Gaming 융합 (aespa 아바타, TWICE Roblox -> 스트리밍 6.4% 상승)',
  "Netflix 'K-Pop Demon Hunters' 1개월 8,000만+ 뷰 -> K-Pop + 게이밍 IP 가치 입증",
  'UAE 젊은 인구(31.6세) + 100% 인터넷 = 게이밍 시장 이상적 환경',
] as const

export interface GenZTrend {
  readonly trend: string
  readonly description: string
  readonly opportunity: string
  readonly icon: string
}

export const genZTrends: readonly GenZTrend[] = [
  {
    trend: 'Plant-based / Fusion Food',
    description: '비건/퓨전 카페 폭발 증가, 건강 의식 소비',
    opportunity: 'K-Food 비건 라인, 비비고 Plant-based 등',
    icon: '🌱',
  },
  {
    trend: 'Co-working 카페 문화',
    description: '프리랜서/리모트워크 확대, aesthetic + WiFi 카페',
    opportunity: '한국 카페 브랜드 (디자인 + 기술)',
    icon: '💻',
  },
  {
    trend: 'Adventure Tourism',
    description: 'Hatta 카약, Jebel Jais 짚라인, 맹그로브 -- "몰 말고 자연"',
    opportunity: '아웃도어 브랜드, 체험형 콘텐츠',
    icon: '🏔️',
  },
  {
    trend: 'Thrift / Sustainable Fashion',
    description: '빈티지 팝업, 지속가능 패션 부상',
    opportunity: 'K-Fashion 지속가능 브랜드',
    icon: '♻️',
  },
  {
    trend: 'Mental Wellness',
    description: '마인드풀니스, 명상, 정신건강 앱 수요 증가',
    opportunity: '한국 웰니스 앱, K-Beauty 웰니스 라인',
    icon: '🧘',
  },
  {
    trend: 'IV Vitamin Drip',
    description: '두바이 유행 "비타민 수액 주사" 웰니스',
    opportunity: '한국 미용 의료 기술',
    icon: '💉',
  },
] as const

export const consumptionShifts: readonly string[] = [
  '경험 > 소유: UAE 여행자 73%가 "현지 문화 몰입 경험" 추구 (글로벌 최고)',
  'AI 활용: UAE/KSA 여행자 75%가 AI 도구로 여행 계획 (글로벌 선도)',
  '소셜 커머스: Instagram/TikTok 직접 구매 -> 전통 이커머스와 경쟁',
  '인플루언서 경제: 마이크로 인플루언서(5K-10K) 최고 참여율, 정부 등록 의무',
] as const

export interface KWaveCategory {
  readonly category: string
  readonly icon: string
  readonly items: readonly string[]
  readonly challenge: string
}

export const kWaveCategories: readonly KWaveCategory[] = [
  {
    category: 'K-Beauty',
    icon: '💄',
    items: [
      'UAE 뷰티 시장 K-Beauty 수요 급증 -- 멀티스텝 루틴, 수분/광채 제품 인기',
      'Olive Young, 설화수, 더후 = "2025 Korean Wave Luxury Brands" 선정',
      '한국 화장품 = "고기능 + 트렌디 + 합리적 가격" 포지션',
    ],
    challenge: '할랄 인증 (돼지 유래 콜라겐, 알코올 성분 -> 할랄 미달)',
  },
  {
    category: 'K-Food',
    icon: '🍜',
    items: [
      'Dubai 100+ 한국 레스토랑 운영',
      '인기: 김치, 떡볶이, 치킨, 비비고, 불닭볶음면',
      'CJ Bibigo, Nongshim, Ottogi, Orion(초코파이) 진출',
    ],
    challenge: '할랄 인증 = 최대 관건',
  },
  {
    category: 'K-Pop & Entertainment',
    icon: '🎵',
    items: [
      'BTS, BLACKPINK = UAE Gen Z 최고 인지도',
      "Netflix 'K-Pop Demon Hunters' 1개월 8,000만+ 뷰",
      'Samsung, Hyundai Genesis, 경동나비엔 = "Korean Wave Luxury Brand" 산업재 부문',
    ],
    challenge: 'K-Pop x Gaming 융합 글로벌 트렌드 지속',
  },
] as const

export const kWaveInsights: readonly string[] = [
  'K-Wave = "엔터테인먼트" -> "라이프스타일 브랜드"로 진화 중',
  '한국 투자자 맥락: K-Beauty(할랄+클린뷰티), K-Food(할랄+프랜차이즈), K-Entertainment(IP) 모두 UAE 확장 가능',
  '할랄 인증 = 진입 장벽이자 경쟁 우위 -> 선점 시 20억 무슬림 시장 접근',
] as const

export interface TrendAxis {
  readonly direction: string
  readonly items: readonly string[]
}

export const trendDuality: { readonly tradition: TrendAxis; readonly innovation: TrendAxis } = {
  tradition: {
    direction: '전통 보존 가속',
    items: [
      'UNESCO 무형유산 4건 등재',
      '연방 문화유산법 제정 추진',
      '에미라티 정체성 보존 프로그램',
      '전통 공예/문화 관광 지원',
      '아랍어/에미라티 전통 촉진',
      'Zayed National Museum 개관',
    ],
  },
  innovation: {
    direction: '혁신/개방 가속',
    items: [
      '카지노 합법화 (중동 최초)',
      '동거/혼외관계 비범죄화',
      'Golden Visa 25만+ 발급',
      'e스포츠/게이밍 허브 유치',
      'Gen Z 주도 웰니스/지속가능 소비',
      'AI/디지털 트랜스포메이션 선도',
    ],
  },
} as const

export const dualityInsights: readonly string[] = [
  'UAE는 "보수적 이슬람 국가"가 아님 (구식 프레임)',
  'UAE는 "완전히 자유로운 서구 국가"도 아님 (과도한 착각)',
  '= "전통을 존중하면서 혁신을 추진하는" 정부 주도형 사회 변화 -> 예측 가능하고 안정적',
  '변화의 속도가 빨라 1-2년 전 정보도 구식일 수 있음 -> 정기적 업데이트 필수',
] as const
