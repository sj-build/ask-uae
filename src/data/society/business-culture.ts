export interface WastaItem {
  readonly concept: string
  readonly arabic: string
  readonly description: string
}

export const wastaConcepts: readonly WastaItem[] = [
  {
    concept: 'Wasta',
    arabic: '와스타',
    description: '아랍어로 "중개/연결". 한국의 "빽"과 유사하지만, UAE에서는 공식적이고 합법적인 사회 시스템',
  },
  {
    concept: 'Mojamala',
    arabic: '상호성',
    description: '호의를 베풀면 반드시 돌아온다 -- 먼저 도움을 줄 것',
  },
  {
    concept: 'Hamola',
    arabic: '빚진 호의',
    description: '도움 받으면 반드시 갚아야 한다 -- 관계의 채무',
  },
  {
    concept: 'Somah',
    arabic: '축적된 신뢰',
    description: '시간이 지남에 따라 쌓이는 것. 한 번의 만남으로 형성되지 않음',
  },
] as const

export const wastaPrinciple = '신뢰 없이 거래 없다 (No trust, no deal) -- 계약서보다 관계가 우선' as const

export const wastaTips: readonly string[] = [
  '첫 미팅 = 신뢰 구축용: 바로 본론 들어가면 안 됨. 가족, 건강, 일반적 안부부터',
  '소개자(Waseet)의 중요성: 누가 소개했느냐가 미팅의 성격을 결정. 콜드콜은 거의 작동 안 함',
  '인내심: 의사결정이 느림. "Inshallah" = 완곡한 "아마도" 또는 "No". 재촉하면 관계가 깨짐',
  '선물 문화: 고급 선물 환영. 단, 술은 금물. 한국 전통 공예품, 고급 차 세트 등이 적절',
] as const

export interface MajlisItem {
  readonly label: string
  readonly content: string
}

export const majlisInfo: readonly MajlisItem[] = [
  { label: '정의', content: '아랍어로 "앉는 장소". 통치자/유력자가 시민을 직접 만나는 전통적 청원 회의' },
  { label: '현대적 역할', content: '왕족/정부 고위관리 접근의 가장 전통적 통로. 현대화되어 예약제로 운영' },
  { label: '비즈니스 맥락', content: '에미라티 비즈니스맨의 Majlis = 사교의 장. 초대받으면 반드시 참석' },
  { label: '에티켓', content: '연장자에게 경의 표시. 아랍 커피(Gahwa)와 대추야자(Dates) 대접 -> 반드시 수용' },
] as const

export interface MeetingComparison {
  readonly situation: string
  readonly korea: string
  readonly uae: string
}

export const meetingComparisons: readonly MeetingComparison[] = [
  { situation: '첫 미팅', korea: '빠르게 본론 진입', uae: '30분~1시간 관계 구축 후 사업 논의' },
  { situation: '의사결정 속도', korea: '빠름 (위계적 결정)', uae: '느림 (합의 + 상위 결재 반복). "Bukra" = 나중에' },
  { situation: '약속 시간', korea: '칼같이 준수', uae: '15-30분 지연 일반적. "Arab time"' },
  { situation: '계약', korea: '서면 계약 중심', uae: '구두 약속도 중요. 계약 전 신뢰 관계가 선행' },
  { situation: '거절 표현', korea: '직접적 거절 가능', uae: '직접 "No" 하지 않음. "Inshallah", "We will see" = 거절 신호' },
  { situation: '식사 미팅', korea: '점심/저녁 모두', uae: '저녁 미팅 선호. 라마단에는 Iftar 미팅이 핵심 사교' },
  { situation: '명함 교환', korea: '양손 또는 한 손', uae: '오른손 사용 (왼손은 불결). 아랍어 번역 명함 있으면 인상적' },
] as const

export interface DressCode {
  readonly who: string
  readonly description: string
  readonly icon: string
}

export const dressCodes: readonly DressCode[] = [
  { who: '에미라티 남성', description: 'Kandura (흰 전통복) + Ghutra (머리 장식). 비즈니스/공식석상 모두 착용', icon: '👳' },
  { who: '에미라티 여성', description: 'Abaya (검은 겉옷) + Shayla (머리 스카프). 점점 패션화 (디자이너 아바야 시장 성장)', icon: '🧕' },
  { who: '외국인 남성', description: '정장 (비즈니스 미팅). 캐주얼은 정돈된 스마트 캐주얼', icon: '👔' },
  { who: '외국인 여성', description: '단정한 비즈니스 정장. 어깨/무릎 노출 자제. 모스크 방문 시 머리 커버', icon: '👗' },
] as const

export const dressWarning = '외국인에게 전통 복장 착용 강제 없음. 그러나 공공장소에서 과도한 노출 = 벌금 가능' as const

export interface HierarchyTier {
  readonly rank: number
  readonly name: string
  readonly members: string
  readonly description: string
  readonly color: string
}

export const hierarchyTiers: readonly HierarchyTier[] = [
  {
    rank: 1,
    name: '왕족 (Ruling Family)',
    members: 'Al Nahyan (Abu Dhabi), Al Maktoum (Dubai) 등',
    description: '절대적 권력과 부. 모든 주요 결정의 최종 승인자',
    color: '#c8a44e',
  },
  {
    rank: 2,
    name: '주요 에미라티 가문',
    members: 'Al Otaiba, Al Qemzi, Al Mubarak 등',
    description: '사업/정부 핵심 인물. 왕족과 밀접한 관계',
    color: '#e8c85a',
  },
  {
    rank: 3,
    name: '일반 에미라티',
    members: '~1.2M',
    description: '정부 일자리, 주택/교육/의료 무상, 결혼 보조금 등 광범위한 복지',
    color: '#f59e0b',
  },
  {
    rank: 4,
    name: '아랍계 외국인',
    members: '이집트, 요르단, 레바논 등',
    description: '전문직 다수. 문화적 친밀감으로 중간 관리직 선호됨',
    color: '#ef4444',
  },
  {
    rank: 5,
    name: '서양인 주재원',
    members: '미국, 영국, 유럽',
    description: '고위 경영진, 금융, 컨설팅. 높은 급여 패키지',
    color: '#4a9eff',
  },
  {
    rank: 6,
    name: '아시아 전문직',
    members: '인도, 파키스탄, 한국, 일본 등',
    description: 'IT, 의료, 교육, 엔지니어링',
    color: '#a78bfa',
  },
  {
    rank: 7,
    name: '아시아/아프리카 노동자',
    members: '인도, 방글라, 파키스탄, 네팔, 아프리카',
    description: '건설, 가사, 서비스업. 가장 취약한 계층',
    color: '#6b7280',
  },
] as const

export const hierarchyInsights: readonly string[] = [
  '에미라티와의 관계가 없으면 정부/SWF 비즈니스는 사실상 불가능',
  '"누가 소개했는가"가 당신의 계층적 위치를 결정',
  '한국은 UAE에서 꽤 긍정적 이미지 (기술력, K-문화, 바라카 원전)',
] as const
