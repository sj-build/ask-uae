// Welfare Section
export interface WelfareItem {
  readonly category: string;
  readonly icon: string;
  readonly title: string;
  readonly items: readonly string[];
  readonly note?: string;
}

export const welfareData: readonly WelfareItem[] = [
  {
    category: "healthcare",
    icon: "🏥",
    title: "의료 시스템",
    items: [
      "Cleveland Clinic Abu Dhabi, Johns Hopkins Medicine 등 세계적 의료기관 유치",
      "DHA (Dubai Health Authority) 중심의 통합 의료 시스템",
      "에미라티: 정부 병원 무료 의료 서비스",
      "외국인: 고용주 의무 건강보험 제공 (2014년부터)",
      "의료 관광 허브: 2025년까지 50만 의료관광객 목표",
    ],
    note: "외국인 의료비는 비싸므로, 충분한 보험 커버리지 확인 필수",
  },
  {
    category: "education",
    icon: "🎓",
    title: "교육 시스템",
    items: [
      "GDP 대비 교육 지출 세계 상위권",
      "NYU Abu Dhabi, Sorbonne Abu Dhabi 등 명문대 분교 유치",
      "200개+ 국제학교 (British, American, IB 커리큘럼)",
      "에미라티: 유치원~대학 무료, 해외 유학 장학금",
      "외국인: 학비 연간 $10,000~$30,000+ (학교별 상이)",
    ],
    note: "Knowledge & Human Development Authority (KHDA)가 학교 품질 감독",
  },
  {
    category: "pension",
    icon: "💰",
    title: "연금/사회보장",
    items: [
      "에미라티 전용: GPSSA (General Pension and Social Security Authority)",
      "퇴직금: 20년 근속 시 월급의 100% (최대)",
      "실업급여: 에미라티 전용 (최대 3개월)",
      "결혼보조금, 주택지원, 토지무상제공 (에미라티 한정)",
    ],
    note: "외국인은 사회보장 혜택 없음. End of Service Gratuity만 적용",
  },
  {
    category: "expat",
    icon: "🌍",
    title: "외국인 복지 현실",
    items: [
      "End of Service Gratuity: 근속 연수당 21일~30일치 급여",
      "의료보험: 고용주 의무 제공 (가족 포함 여부는 협상)",
      "주거수당: 회사별 상이 (급여의 10~20% 또는 별도 제공)",
      "자녀 교육비: 일부 회사만 지원 (협상 필수)",
      "귀국 항공권: 연 1회 본국 왕복 항공권 (일반적)",
    ],
    note: "복지는 대부분 고용주 의존적. 계약서 세부사항 확인 필수",
  },
] as const;

// Women Section
export interface WomenStatusItem {
  readonly metric: string;
  readonly value: string;
  readonly description: string;
  readonly icon: string;
}

export const womenStatusData: readonly WomenStatusItem[] = [
  {
    metric: "의회 참여",
    value: "50%",
    description:
      "FNC (Federal National Council) 여성 의원 비율. 중동 최고 수준",
    icon: "🏛️",
  },
  {
    metric: "경제활동 참가율",
    value: "57%",
    description: "2023년 기준 에미라티 여성. GCC 국가 중 최고",
    icon: "💼",
  },
  {
    metric: "고위 관리직",
    value: "30%+",
    description: "정부 및 공기업 리더십 포지션. 지속 증가 추세",
    icon: "👩‍💼",
  },
  {
    metric: "대학 졸업률",
    value: "70%",
    description: "UAE 대학 졸업생 중 여성 비율",
    icon: "🎓",
  },
] as const;

export interface WomenRightsItem {
  readonly topic: string;
  readonly description: string;
  readonly comparedToRegion: string;
}

export const womenRightsData: readonly WomenRightsItem[] = [
  {
    topic: "운전",
    description: "제한 없음. 여성 운전 자유",
    comparedToRegion: "사우디는 2018년에야 허용",
  },
  {
    topic: "여행",
    description: "남성 보호자 동의 불필요. 독립적 여행 가능",
    comparedToRegion: "일부 GCC 국가는 여전히 제한",
  },
  {
    topic: "복장",
    description: "외국인 여성은 자유. 모스크/정부기관만 보수적 복장",
    comparedToRegion: "사우디/이란 대비 매우 자유로움",
  },
  {
    topic: "취업",
    description: "모든 분야 취업 가능. 군, 경찰, 항공 포함",
    comparedToRegion: "일부 GCC는 특정 직종 제한",
  },
  {
    topic: "재산권",
    description: "동등한 재산 소유 및 상속권",
    comparedToRegion: "법적 보장 명확",
  },
] as const;

export const womenCultureTips: readonly string[] = [
  "비즈니스 미팅: 여성 동료와의 미팅은 공개된 장소 권장",
  "악수: 에미라티 여성과는 상대방이 먼저 손 내밀 때만 악수",
  "시선: 에미라티 여성과 장시간 눈 마주침 자제",
  "촬영: 현지 여성 촬영 전 반드시 허락 구하기",
  "라마단: 공공장소에서 식음료 자제, 복장 더욱 보수적으로",
] as const;

// Food Section
export interface FoodCultureItem {
  readonly category: string;
  readonly icon: string;
  readonly title: string;
  readonly points: readonly string[];
}

export const foodCultureData: readonly FoodCultureItem[] = [
  {
    category: "halal",
    icon: "🍖",
    title: "할랄 식문화",
    points: [
      "돼지고기/돼지 부산물 전면 금지",
      "할랄 도축: 이슬람 방식 도축 인증 필요",
      "알코올 성분 조리 금지",
      "수입 식품도 할랄 인증 필수 (ESMA 관할)",
      "한국 라면/과자도 비할랄 성분 주의",
    ],
  },
  {
    category: "ramadan",
    icon: "🌙",
    title: "라마단 특수",
    points: [
      "일출~일몰 금식 (Sawm)",
      "공공장소 식음료 섭취 금지 (외국인 포함)",
      "Iftar (저녁 금식 해제): 비즈니스 식사의 핵심",
      "Suhoor (새벽 식사): 금식 전 마지막 식사",
      "라마단 기간 음주 더욱 제한 (호텔 라운지도 축소)",
    ],
  },
  {
    category: "multicultural",
    icon: "🌍",
    title: "다문화 음식",
    points: [
      "200+ 국적 반영한 다양한 요리",
      "인도/파키스탄 음식: 가장 풍부 (인구 비율 반영)",
      "레바논/터키 음식: 중동 요리 대표",
      "한식당: 두바이 Deira 지역 집중 (50개+)",
      "파인 다이닝: 세계적 셰프 레스토랑 다수 (미쉐린 스타)",
    ],
  },
  {
    category: "alcohol",
    icon: "🍷",
    title: "주류 규정",
    points: [
      "무슬림 음주 금지 (외국인 허용)",
      "호텔, 면허 레스토랑에서만 음주 가능",
      "주류 구매: 주류 면허 필요 (21세 이상)",
      "공공장소 음주 = 불법 (심각한 처벌)",
      "Sharjah 에미리트는 완전 금주 (주류 면허 없음)",
    ],
  },
] as const;

export interface LocalFoodItem {
  readonly name: string;
  readonly arabicName: string;
  readonly description: string;
  readonly mustTry: boolean;
}

export const localFoods: readonly LocalFoodItem[] = [
  {
    name: "마즈부스",
    arabicName: "Machboos",
    description: "향신료 밥 + 양고기/닭고기. UAE 국민 음식",
    mustTry: true,
  },
  {
    name: "하리스",
    arabicName: "Harees",
    description: "으깬 밀과 고기 죽. 라마단 필수",
    mustTry: true,
  },
  {
    name: "루게이맛",
    arabicName: "Luqaimat",
    description: "꿀 시럽 도넛. 전통 디저트",
    mustTry: true,
  },
  {
    name: "감와",
    arabicName: "Gahwa",
    description: "아랍 커피. 카르다몸 향. Majlis 필수품",
    mustTry: true,
  },
  {
    name: "우지",
    arabicName: "Ouzi",
    description: "양고기 통구이 + 밥. 축제 음식",
    mustTry: false,
  },
  {
    name: "테리드",
    arabicName: "Thareed",
    description: "빵 + 야채 스튜. 라마단 전통",
    mustTry: false,
  },
] as const;

export const foodBusinessTips: readonly string[] = [
  "비즈니스 디너: 호스트가 메뉴 추천 따라가기 (돼지고기/술 절대 주문 금지)",
  "오른손 사용: 음식 주고받을 때 왼손 사용 금기",
  "Iftar 초대: 라마단 중 최고의 네트워킹 기회. 반드시 참석",
  "팁 문화: 10-15% 일반적. 고급 레스토랑은 서비스료 포함 확인",
  "식사 속도: 느긋하게 대화 즐기기. 급하게 먹으면 실례",
] as const;

// Climate Section
export interface ClimateSeasonData {
  readonly season: string;
  readonly months: string;
  readonly temperature: string;
  readonly humidity: string;
  readonly description: string;
  readonly icon: string;
}

export const climateData: readonly ClimateSeasonData[] = [
  {
    season: "여름",
    months: "6-9월",
    temperature: "40-50°C",
    humidity: "80-90%",
    description: "극한의 더위. 야외 활동 거의 불가. 실내 에어컨 필수",
    icon: "🔥",
  },
  {
    season: "가을",
    months: "10-11월",
    temperature: "25-35°C",
    humidity: "50-60%",
    description: "점차 선선. 야외 활동 가능해짐",
    icon: "🍂",
  },
  {
    season: "겨울",
    months: "12-2월",
    temperature: "15-25°C",
    humidity: "40-50%",
    description: "최적의 날씨. 비즈니스 시즌, 관광 성수기",
    icon: "❄️",
  },
  {
    season: "봄",
    months: "3-5월",
    temperature: "25-40°C",
    humidity: "40-60%",
    description: "기온 상승. 모래폭풍 주의 (3-4월)",
    icon: "🌸",
  },
] as const;

export interface ClimateImpactItem {
  readonly aspect: string;
  readonly impact: string;
  readonly tip: string;
}

export const climateBusinessImpact: readonly ClimateImpactItem[] = [
  {
    aspect: "비즈니스 시즌",
    impact: "10월-4월이 핵심 비즈니스 시즌. 주요 전시회/컨퍼런스 집중",
    tip: "중요 미팅/행사는 겨울 시즌에 계획",
  },
  {
    aspect: "여름 휴가",
    impact: "6-8월 에미라티/외국인 대거 해외 휴가. 의사결정 지연",
    tip: "여름 전 중요 계약 마무리 권장",
  },
  {
    aspect: "라마단",
    impact: "업무 시간 단축 (보통 6시간). 정부기관 특히 느림",
    tip: "라마단 기간 중요 딜 피하기",
  },
  {
    aspect: "금요일",
    impact: "주말 (금-토). 금요일 기도 시간 비즈니스 불가",
    tip: "금요일 오후 미팅 피하기",
  },
  {
    aspect: "일조 시간",
    impact: "여름 일출 5:30, 일몰 19:00. 겨울 일출 7:00, 일몰 17:30",
    tip: "야외 미팅은 이른 아침 또는 저녁",
  },
] as const;

export const climateWarnings: readonly string[] = [
  "여름철 차량 실내 온도 70°C 이상 가능. 어린이/반려동물 절대 방치 금지",
  "탈수 주의: 하루 3-4리터 수분 섭취 권장",
  "선크림/선글라스 필수. UV 지수 극도로 높음",
  "실외 건설 노동: 12:30-15:00 작업 금지 (법적 의무)",
  "모래폭풍 시 시야 급격히 감소. 차량 운행 자제",
] as const;
