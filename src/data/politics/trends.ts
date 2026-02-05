export interface TrendItem {
  readonly title: string
  readonly description: string
  readonly details: readonly string[]
  readonly significance: string
}

export interface TrendCategory {
  readonly id: string
  readonly icon: string
  readonly title: string
  readonly items: readonly TrendItem[]
}

export const politicalTrends: readonly TrendCategory[] = [
  {
    id: 'succession',
    icon: '👑',
    title: 'MBZ 승계 계획 — 역사적 전환점',
    items: [
      {
        title: '⚠️ 형제→장남 승계 전환',
        description: '전통적 "측면 승계"에서 "직계 승계"로 역사적 전환',
        details: [
          '전통: 아랍 군주제는 형→동생으로 순차 승계 (측면 승계)',
          '변화: MBZ가 장남 Khaled를 왕세자로 임명 (2023.3)',
          '10개월 내부 합의: 5명의 친형제(Bani Fatima)와 조율 필요',
          '사우디 영향: MBS도 왕세자 측면 승계 폐기 → 직계로 전환',
          '권력 균열 가능성: 형제들 불만 → 보상으로 핵심 직책 배분',
        ],
        significance: '권력 집중화 + 세대교체, 그러나 형제간 긴장 관계 잠재',
      },
      {
        title: 'Sheikh Khaled bin Mohamed 부상',
        description: 'MBZ 장남, Abu Dhabi 왕세자 (2023.3 임명)',
        details: [
          'L\'imad Holding (前 ADQ) 의장 — $263B AUM',
          'Abu Dhabi 집행위원회 의장',
          '40대 초반, 옥스포드/샌드허스트 교육',
          'Khaldoon Al Mubarak이 L\'imad 이사회 참여 → 세대교체 브릿지',
        ],
        significance: '실무적 경험 축적 중, 5-10년 내 리더십 전환 준비',
      },
      {
        title: 'Sheikh Tahnoun 권한 강화 — "형제들의 보상"',
        description: 'MBZ 동생, 국가안보보좌관 — 왕세자 못 됐으나 실권 장악',
        details: [
          'ADIA 의장 ($1.18T) + G42 의장 + FAB 의장',
          'MGX 설립 지원 → AI/테크 투자 주도',
          'Royal Group → IHC 61% 지배 → 시총 $240B',
          'Mansour(MBZ 동생): 부통령 승격, Man City 구단주',
          'Hazza(MBZ 동생): Abu Dhabi 부통치자 임명',
        ],
        significance: 'Khaled 왕세자 지원하면서도 실질 경제권 장악 — 형제 충성 유지 장치',
      },
    ],
  },
  {
    id: 'saudi-relations',
    icon: '🤝',
    title: 'UAE-사우디 경쟁/협력 다이나믹스',
    items: [
      {
        title: '경제적 경쟁 심화',
        description: 'Vision 2030 vs We the UAE 2031',
        details: [
          '사우디: 리야드 HQ 유치 → 다국적 기업 "리야드 아니면 사업 못함" 압박',
          'UAE: 두바이 기존 허브 지위 방어 + Abu Dhabi 금융/기술 투자',
          '관광: 사우디 Red Sea/Neom vs UAE 기존 인프라',
          'OPEC+: 생산량 쿼터 갈등 (UAE 증산 요구 vs 사우디 감산 주도)',
        ],
        significance: 'GCC 내 패권 경쟁, 그러나 서방 대비 공동 전선 유지',
      },
      {
        title: '안보/외교 협력',
        description: '이란 견제, 예멘 개입, 미국 관계',
        details: [
          '예멘 전쟁: UAE 남부 분리세력 지원 vs 사우디 하디 정부 지원 → 긴장',
          '이란: 양국 모두 견제하나 UAE는 경제 관계 유지 (재수출)',
          '아브라함 협정: UAE 선도 가입 → 사우디 관망',
          'US 관계: 양국 경쟁적으로 미국 방위/기술 파트너십 추구',
        ],
        significance: '갈등 표면화 자제, 그러나 이해관계 분기점 증가',
      },
    ],
  },
  {
    id: 'regional-influence',
    icon: '🌍',
    title: '지역 영향력 확대',
    items: [
      {
        title: 'BRICS 가입 (2024.1)',
        description: '서방 외 다극화 전략',
        details: [
          '중국/러시아/인도/브라질/남아공과 경제 블록 형성',
          '사우디, 이란, 이집트, 에티오피아와 동시 가입',
          '달러 패권 대안 논의 참여',
          '중국 위안화 결제 확대 가능성',
        ],
        significance: '미국 일변도에서 다변화, 협상력 강화',
      },
      {
        title: 'Abraham Accords 활용',
        description: '이스라엘 정상화 (2020.8)',
        details: [
          '무역: UAE-이스라엘 양자 무역 $2.5B+ (2023)',
          '투자: Abu Dhabi SWF → 이스라엘 테크 투자',
          '안보: 정보 공유, 사이버 협력',
          '관광: 직항 개설, 연간 30만+ 왕래',
        ],
        significance: 'GCC 최초, 팔레스타인 이슈 우회하며 실리 추구',
      },
      {
        title: '아프리카 진출 확대',
        description: 'DP World, 투자, 외교',
        details: [
          'DP World: 아프리카 동부/서부 항만 운영 확대',
          '농업: 이집트, 수단, 모로코 농지 투자',
          '안보: 리비아, 소말리아, 에리트레아 관계',
          '투자: 아프리카 전역 인프라, 통신, 에너지 투자',
        ],
        significance: 'GCC 경쟁자 대비 아프리카 "퍼스트 무버" 이점',
      },
    ],
  },
  {
    id: 'government-restructuring',
    icon: '🏛️',
    title: '정부 구조조정 트렌드',
    items: [
      {
        title: '부처 통폐합 및 효율화',
        description: '작은 정부, 빠른 의사결정',
        details: [
          '2023-2024 내각 개편: 일부 부처 통합',
          'ADQ → L\'imad 리브랜딩 (2026.1): 차세대 이미지',
          'EGA + Dubal 합병 → Emirates Global Aluminium',
          '공기업 IPO 확대: DEWA, ADNOC Drilling, Salik 등',
        ],
        significance: '관료주의 축소, 민간 효율성 도입',
      },
      {
        title: '디지털 정부 가속화',
        description: 'AI 전략, 스마트 서비스',
        details: [
          'AI 장관직 세계 최초 신설 (2017)',
          'ChatGPT 앱 공식 정부 채널 도입',
          '90%+ 정부 서비스 온라인화',
          'G42/Core42와 정부 AI 인프라 구축',
        ],
        significance: '인구 규모 대비 과도할 수 있는 행정 효율화',
      },
    ],
  },
  {
    id: 'economic-diplomacy',
    icon: '💼',
    title: '경제 외교 전환',
    items: [
      {
        title: 'AI 인프라 허브 전략',
        description: 'Stargate, MGX, G42 중심',
        details: [
          'OpenAI Stargate $500B 파트너십 (SoftBank/Oracle/MGX)',
          'xAI $26B 투자, Anthropic $3.5B 투자',
          'Khazna 데이터센터: UAE 시장 70%+ 점유',
          'Microsoft $1.5B G42 투자 유치',
        ],
        significance: '석유 → AI 인프라로 전략적 중요성 전환',
      },
      {
        title: 'CEPA 네트워크 확대',
        description: 'Comprehensive Economic Partnership Agreement',
        details: [
          '인도 CEPA (2022): 양자 무역 $85B 목표',
          '터키 CEPA (2023): 비관세 무역 확대',
          '인도네시아 CEPA (2022): 이슬람 경제권 연결',
          '한국 CEPA 협상 중',
        ],
        significance: '전통 석유 수출 → 다자 무역 파트너십 다각화',
      },
      {
        title: '그린 에너지 리더십',
        description: 'COP28 개최, 에너지 전환 투자',
        details: [
          'COP28 의장: Dr. Sultan Al Jaber (ADNOC CEO)',
          'Masdar: $30B 청정에너지 투자 계획',
          '2050 탄소중립 선언 (GCC 최초)',
          'XRG (ADNOC 스핀오프): 저탄소 에너지 $80B+',
        ],
        significance: '석유 생산국이면서 기후 리더십 주장 — 실리적 전환',
      },
    ],
  },
] as const
