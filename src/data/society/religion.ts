export interface ReligionGroup {
  readonly name: string
  readonly percentage: number
  readonly note: string
  readonly color: string
}

export const religionGroups: readonly ReligionGroup[] = [
  { name: '이슬람 (수니파)', percentage: 63, note: '국교. 주류', color: '#34d399' },
  { name: '이슬람 (시아파)', percentage: 7, note: '이란계 중심', color: '#22d3ee' },
  { name: '이슬람 (기타)', percentage: 4, note: '이바디, 수피 등', color: '#4a9eff' },
  { name: '기독교', percentage: 13, note: '필리핀, 서양 주재원 중심', color: '#a78bfa' },
  { name: '힌두교', percentage: 6, note: '인도 커뮤니티. BAPS 힌두 만디르 (2024)', color: '#f59e0b' },
  { name: '불교', percentage: 3, note: '동남아 커뮤니티', color: '#ef4444' },
  { name: '기타', percentage: 4, note: '시크교, 바하이, 유대교, 조로아스터 등', color: '#6b7280' },
] as const

export interface TolerancePolicy {
  readonly name: string
  readonly description: string
  readonly icon: string
}

export const tolerancePolicies: readonly TolerancePolicy[] = [
  {
    name: 'Ministry of Tolerance and Coexistence',
    description: '종교간 대화, 관용 정책 수립 전담 부처',
    icon: '🏛️',
  },
  {
    name: 'Abrahamic Family House (2023)',
    description: 'Abu Dhabi Saadiyat Island. 모스크 + 교회 + 시나고그를 한 단지에 건설',
    icon: '🕌',
  },
  {
    name: 'BAPS Hindu Mandir (2024)',
    description: 'Abu Dhabi. GCC 최초 공식 힌두 사원. 왕실이 부지 기증',
    icon: '🛕',
  },
  {
    name: 'Abraham Accords (2020)',
    description: '이스라엘 국교 정상화. 아랍-이슬람 세계에서 파격적',
    icon: '🤝',
  },
  {
    name: '종교 자유',
    description: '비무슬림 예배 허용 (등록 장소). 선교 활동은 불법. 크리스마스 장식 허용/장려',
    icon: '⛪',
  },
] as const

export interface RamadanItem {
  readonly label: string
  readonly content: string
}

export const ramadanInfo: readonly RamadanItem[] = [
  { label: '기간', content: '이슬람력 9월, 약 29-30일 (양력 날짜 매년 변동)' },
  { label: '2026년 예상', content: '2월 중순~3월 중순 (음력 기반, 달 관측으로 결정)' },
  { label: '핵심 규칙', content: '해 뜨는 동안(Fajr~Maghrib) 음식/음료/흡연 금지. 비무슬림도 공공장소에서 준수' },
  { label: '업무시간', content: '단축 근무 (보통 10am~2pm 또는 6시간). 정부기관 더 짧음' },
  { label: 'Iftar', content: '해질녘 단식 해제 식사 -> 핵심 비즈니스 네트워킹 시간' },
  { label: 'Suhoor', content: '새벽 단식 전 식사. 늦은 밤 사교 활동 활발' },
  { label: 'Eid Al Fitr', content: '라마단 종료 축제. 3~5일 연휴. 축하 인사 필수 ("Eid Mubarak")' },
] as const

export const ramadanBusinessTip = '라마단 기간 중 비무슬림도 공공장소에서 식음 자제. 생산성 저하 예상. 계약 체결/중요 결정은 라마단 전후로 조정 권장' as const

export interface PrayerTime {
  readonly name: string
  readonly nameAr: string
  readonly time: string
  readonly businessImpact: string
  readonly position: number
}

export const prayerTimes: readonly PrayerTime[] = [
  { name: 'Fajr', nameAr: '파즈르', time: '새벽 (일출 전)', businessImpact: '없음', position: 5 },
  { name: 'Dhuhr', nameAr: '두흐르', time: '정오 12:00~1:30pm', businessImpact: '미팅 중단 가능. 15-20분 기도 후 복귀', position: 30 },
  { name: 'Asr', nameAr: '아스르', time: '오후 3:00~4:30pm', businessImpact: '미팅 중단 가능', position: 55 },
  { name: 'Maghrib', nameAr: '마그립', time: '일몰', businessImpact: '퇴근 후. Iftar 시간 (라마단)', position: 75 },
  { name: 'Isha', nameAr: '이샤', time: '밤', businessImpact: '없음', position: 90 },
] as const

export const prayerEtiquette = '미팅 중 기도 시간이 되면 자연스럽게 기다리기. 절대 재촉하지 말 것. 기도실(Musalla)이 모든 건물에 있음.' as const

export interface FridayInfo {
  readonly label: string
  readonly content: string
}

export const fridayInfo: readonly FridayInfo[] = [
  { label: '금요 합동 예배', content: '12:45pm (정부 지정). 남성 무슬림 의무' },
  { label: '업무 영향', content: '금요 오후 미팅은 피하는 것이 관례. 학교 11:30am 종료' },
  { label: '주말', content: '토-일 (2022년 금-토에서 변경 -> 글로벌 비즈니스 정합성)' },
] as const

export interface HalalItem {
  readonly category: string
  readonly description: string
  readonly icon: string
}

export const halalInfo: readonly HalalItem[] = [
  { category: '식품', description: '돼지고기 금지. 도축 방법 규정. 모든 수입 식품에 할랄 인증 필요', icon: '🍖' },
  { category: '화장품/스킨케어', description: 'K-Beauty 핵심 이슈: 동물성 원료 확인 필요. 할랄 인증 있으면 경쟁력 대폭 상승', icon: '💄' },
  { category: '금융', description: '이슬람 금융(Sukuk, Mudarabah 등) -- 이자(Riba) 금지 원칙. 이슬람 은행과 일반 은행 공존', icon: '🏦' },
  { category: '인증 기관', description: 'Emirates Authority for Standardization and Metrology (ESMA)', icon: '📋' },
] as const

export const halalInsight = '할랄 인증 = UAE (그리고 전체 무슬림 시장 20억) 진입의 필수 관문. 취득 시 말레이시아, 인도네시아, 사우디 시장까지 확장 가능' as const

export interface IslamicHoliday {
  readonly name: string
  readonly timing: string
  readonly description: string
  readonly businessImpact: string
  readonly days: string
}

export const islamicHolidays: readonly IslamicHoliday[] = [
  {
    name: 'Eid Al Fitr',
    timing: '라마단 직후',
    description: '단식 종료 축제',
    businessImpact: '소비 급증 (선물, 외식, 쇼핑)',
    days: '3-5일',
  },
  {
    name: 'Eid Al Adha',
    timing: 'Hajj 기간 중',
    description: '희생제. 이슬람 최대 명절',
    businessImpact: '가족 모임 중심',
    days: '4-5일',
  },
  {
    name: 'Islamic New Year',
    timing: 'Muharram 1일',
    description: '이슬람 신년',
    businessImpact: '1일 공휴일',
    days: '1일',
  },
  {
    name: "Prophet's Birthday",
    timing: 'Rabi Al Awal 12일',
    description: '무함마드 탄신일',
    businessImpact: '1일 공휴일',
    days: '1일',
  },
  {
    name: "Isra and Mi'raj",
    timing: 'Rajab 27일',
    description: '예언자의 승천',
    businessImpact: '1일 공휴일',
    days: '1일',
  },
] as const

export const holidayNote = '모든 이슬람 공휴일은 음력 기반 -> 양력 날짜가 매년 ~11일씩 앞당겨짐' as const
