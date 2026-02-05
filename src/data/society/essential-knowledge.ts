export interface LawComparison {
  readonly category: string
  readonly uaeRule: string
  readonly koreaDifference: string
  readonly violation: string
  readonly severity: 'critical' | 'high' | 'medium' | 'low'
}

export const lawComparisons: readonly LawComparison[] = [
  {
    category: '음주',
    uaeRule: 'Abu Dhabi/Dubai는 면허제로 허용. Sharjah 전면 금지',
    koreaDifference: '한국은 자유',
    violation: '공공 만취 = 체포/추방 가능',
    severity: 'high',
  },
  {
    category: '마약',
    uaeRule: '제로 톨러런스. 미량이라도 소지 시 최소 4년 징역',
    koreaDifference: '한국은 상대적으로 가벼운 처벌',
    violation: '사형까지 가능 (대량 밀매)',
    severity: 'critical',
  },
  {
    category: '동거',
    uaeRule: '비혼 동거 비범죄화 (2020~)',
    koreaDifference: '이전에는 형사처벌',
    violation: '최근 개방',
    severity: 'low',
  },
  {
    category: 'SNS 발언',
    uaeRule: '정부/왕족 비판 SNS 게시 = 범죄',
    koreaDifference: '한국은 표현의 자유 폭 넓음',
    violation: '벌금/구금/추방. 외국인도 예외 없음',
    severity: 'critical',
  },
  {
    category: '사진 촬영',
    uaeRule: '군사시설, 정부건물, 타인(특히 여성) 무단 촬영 금지',
    koreaDifference: '한국은 비교적 자유',
    violation: '벌금/구금',
    severity: 'high',
  },
  {
    category: '공공 애정표현',
    uaeRule: '손잡기 정도는 OK. 키스/포옹 = 벌금 가능',
    koreaDifference: '한국은 자유',
    violation: '벌금/구금',
    severity: 'medium',
  },
  {
    category: '욕설/제스처',
    uaeRule: '가운데 손가락 등 비속어 제스처 = 범죄',
    koreaDifference: '사회적 비난 수준',
    violation: '구금/추방',
    severity: 'high',
  },
  {
    category: '수표 부도',
    uaeRule: '형사 범죄 (최근 비범죄화 추세이나 여전히 심각)',
    koreaDifference: '한국은 민사',
    violation: '구금/입국금지 가능',
    severity: 'high',
  },
] as const

export interface VisaType {
  readonly name: string
  readonly target: string
  readonly duration: string
  readonly keyCondition: string
  readonly highlight?: boolean
}

export const visaTypes: readonly VisaType[] = [
  {
    name: '고용 비자',
    target: '취업자',
    duration: '2-3년 (갱신 가능)',
    keyCondition: '고용주 스폰서 필요',
  },
  {
    name: 'Golden Visa',
    target: '투자자/전문가/과학자/우수학생',
    duration: '5-10년',
    keyCondition: 'AED 2M+ 부동산 투자 또는 전문 분야 자격. 250,000+ 발급 완료',
    highlight: true,
  },
  {
    name: 'Green Visa',
    target: '프리랜서/자영업자',
    duration: '5년',
    keyCondition: '스폰서 없이 자체 체류 가능',
  },
  {
    name: '구직 비자',
    target: '구직자',
    duration: '60-120일',
    keyCondition: '스폰서 없이 입국하여 구직 활동 가능 (신규)',
  },
  {
    name: '프리존 비자',
    target: '프리존 법인 직원',
    duration: '2-3년',
    keyCondition: '프리존 회사가 스폰서',
  },
  {
    name: '관광 비자',
    target: '방문객',
    duration: '30-90일',
    keyCondition: '한국 여권 = 30일 무비자 입국',
  },
] as const

export const goldenVisaInsights: readonly string[] = [
  '고용주에 비자가 묶이지 않음 -> 자유로운 사업 활동',
  '가족 초청 가능. 자녀 교육 안정성',
  'UAE에서 장기 거주 의사가 있다는 신호 -> 현지 파트너의 신뢰 상승',
] as const

export interface WelfareItem {
  readonly category: string
  readonly description: string
  readonly icon: string
}

export const emiratiWelfare: readonly WelfareItem[] = [
  { category: '교육', description: '유치원~대학 무상 (해외 유학 장학금 포함)', icon: '🎓' },
  { category: '의료', description: '완전 무상 의료', icon: '🏥' },
  { category: '주택', description: '정부 제공 주택 또는 주택 보조금 (신혼 부부에게 토지 + 건축 지원금)', icon: '🏠' },
  { category: '결혼 보조금', description: 'AED 70,000+ 결혼 지원금 (에미라티 간 결혼 시)', icon: '💍' },
  { category: '연금', description: '넉넉한 정부 연금', icon: '💰' },
  { category: '일자리', description: '정부/공기업 우선 채용. Nafis 프로그램 (민간 취업 인센티브)', icon: '💼' },
  { category: '유틸리티', description: '전기/수도 보조금', icon: '⚡' },
] as const

export const welfareInsight = '이런 복지 시스템이 왕족-시민 간 사회적 계약(Social Contract)의 핵심. 시민은 복지를 받는 대가로 정치적 충성을 제공. 이 구조를 이해해야 UAE의 정치적 안정성을 이해할 수 있음.' as const

export interface WomenStatus {
  readonly category: string
  readonly status: string
}

export const womenStatus: readonly WomenStatus[] = [
  { category: '의회', status: '연방국가평의회(FNC) 여성 비율 50% (2019~ 쿼터제)' },
  { category: '내각', status: '여성 장관 9명 (2024 내각 기준, 전체의 ~27%)' },
  { category: '교육', status: '대학 졸업생 중 여성 70%+. STEM 분야 여성 비율 GCC 최고' },
  { category: '경제활동', status: '여성 경제활동참가율 ~57%. GCC 중 가장 높음' },
  { category: '군복무', status: '여성 의무 군복무 허용 (2023~)' },
  { category: '기업', status: '여성 기업인 비율 상승 중. Sheikha Shamma = UAE 청년/환경 정책 핵심 인물' },
] as const

export const womenCaveat = '가부장적 가족 구조는 여전. 상속법에서 남성 우위. 비공식적 유리천장 존재' as const

export const womenInsights: readonly string[] = [
  '여성 의사결정자 증가 -> K-Beauty, 패션, 교육, 헬스케어 진출 시 여성 타겟 마케팅 중요',
  '에미라티 여성 = 높은 교육 수준 + 높은 소비력. 핵심 소비 세그먼트',
] as const

export interface FoodItem {
  readonly category: string
  readonly content: string
  readonly icon: string
}

export const foodCulture: readonly FoodItem[] = [
  { category: '전통 음식', content: 'Al Harees (밀+고기 죽), Machboos (향신료 밥), Luqaimat (꿀 도넛), Gahwa (아랍 커피) + Dates', icon: '🍽️' },
  { category: '외식 시장', content: 'Dubai만 40,000+ 레스토랑. 1인당 외식비 세계 최고 수준', icon: '🍴' },
  { category: '할랄 필수', content: '무슬림 76% -> 모든 식품에 할랄 인증. 돼지고기는 별도 구역(Pork Section)에서만 판매', icon: '✅' },
  { category: '배달 문화', content: 'Talabat, Deliveroo, Careem 급성장. 여름 45C+ -> 배달 의존도 극히 높음', icon: '🛵' },
  { category: '금요 브런치', content: '주재원 문화의 핵심. 호텔 금요 브런치 = 비즈니스 사교의 장 (AED 200-500+/인)', icon: '🥂' },
  { category: 'K-Food', content: '한국 식당 100+ (Dubai). 김치/떡볶이/치킨 인기. 한식의 할랄 인증이 과제', icon: '🇰🇷' },
  { category: '아랍 커피 에티켓', content: 'Gahwa 대접 시 -> 컵을 흔들면 "됐습니다" 신호. 가만히 들고 있으면 리필', icon: '☕' },
] as const

export interface ClimateSeason {
  readonly season: string
  readonly temperature: string
  readonly impact: string
  readonly icon: string
  readonly color: string
}

export const climateSeasons: readonly ClimateSeason[] = [
  {
    season: '여름 (6-9월)',
    temperature: '40-50C, 습도 90%+',
    impact: '실외 활동 사실상 불가. 에어컨 = 생존 수단. 몰이 사회생활 중심. 오전 10시~오후 4시 실외 노동 법적 제한',
    icon: '🌡️',
    color: '#ef4444',
  },
  {
    season: '겨울 (11-3월)',
    temperature: '18-28C',
    impact: '최고의 시즌. 관광 성수기. 야외 행사 집중. 비즈니스 미팅 활발',
    icon: '☀️',
    color: '#34d399',
  },
  {
    season: '라마단 기간',
    temperature: '변동',
    impact: '업무 단축 + 밤 활동 증가. 뚜렷한 생활 리듬 변화',
    icon: '🌙',
    color: '#c8a44e',
  },
] as const

export const climateInsights: readonly string[] = [
  '10-3월이 비즈니스 골든타임. 출장/행사는 이 시기에 집중',
  '여름 = 비수기: 의사결정자들이 해외 휴가. 중요 미팅 잡기 어려움',
  '몰 문화: UAE 소비의 80%+가 쇼핑몰에서 발생 -> 오프라인 채널 전략의 핵심',
] as const
