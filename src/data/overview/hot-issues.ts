export interface HotIssueData {
  readonly title: string
  readonly titleColor: string
  readonly borderColor: string
  readonly opportunities: readonly string[]
  readonly risks: readonly string[]
}

export const hotIssues: readonly HotIssueData[] = [
  {
    title: '🧠 AI / 데이터센터', titleColor: '#a78bfa', borderColor: '#a78bfa',
    opportunities: [
      'Stargate UAE 5GW: 미국 외 최대 AI 인프라. 1단계 2026 가동',
      'Microsoft $15.2B + Oracle 슈퍼클러스터 + Nvidia GPU 공급',
      'Khazna: UAE DC 시장 70% 점유, 글로벌 확장 (터키, 프랑스, 이탈리아, 케냐)',
      'G42-OpenAI 파트너십으로 소버린 AI 모델 개발',
    ],
    risks: [
      '전력 부족: AI DC 폭발적 수요 vs 전력망 한계 — 정부가 "Data Center Energy Review Team" 신설',
      '냉각 비용: 40°C+ 기후에서 GPU 냉각 효율 저하 → 운영비 급증',
      '미국 칩 수출규제: 트럼프 정부가 완화했지만, 정책 불확실성 지속',
      'AI 인재 부족: 인프라는 있으나 운영할 현지 AI 엔지니어 절대 부족',
    ],
  },
  {
    title: '🏗️ 부동산', titleColor: '#f59e0b', borderColor: '#f59e0b',
    opportunities: [
      'Dubai 2025년 거래 AED 680B 돌파 (전년비 +30%)',
      '인구 400만 돌파 (2020 이후 +15%), 연 20만+ 유입',
      'Golden Visa 250,000+ 발급 → 실수요 기반 강화',
      '수익률 5~9% — 런던/뉴욕(2~4%) 대비 월등',
    ],
    risks: [
      '공급 폭탄: 2025~27년 21만 유닛 예정 (이전 3년의 2배) → 2026년 ~10만 유닛 인도 피크 → Fitch: 15% 조정 가능',
      'UBS 버블 경고: 2014년 이후 실질 최고가, 2년 연속 버블 리스크 상향',
      '사우디 경쟁: 2026년부터 리야드 외국인 부동산 매입 허용 → 자본 유출 우려',
      'Off-plan 58% → 인도 시점 시장 변동 리스크',
    ],
  },
  {
    title: '⚡ 에너지', titleColor: '#c8a44e', borderColor: '#c8a44e',
    opportunities: [
      'Barakah 원전 완전 가동: 5.6GW — 아랍권 최대, KEPCO 한국 건설',
      'XRG 출범: ADNOC의 에너지 전환 자회사, $80B+ 기업가치',
      'Masdar 50GW: 신재생에너지 글로벌 플레이어 성장',
      'ADNOC AI 적용: 30+ AI 시스템으로 $500M 가치 창출',
    ],
    risks: [
      '유가 리스크: OPEC+ 감산 불확실성, 유가 $60 이하 시 재정 압박',
      'DC 전력 수요 폭발: AI 인프라에 전력 빨려감 → 산업/주거용 전력 공급 균형',
      '석유 의존: 비석유 GDP 75% 달성했지만 재정의 핵심 수입원은 여전히 석유',
      '중동 지정학: 호르무즈 해협 리스크, 이란 긴장',
    ],
  },
  {
    title: '💰 크립토 / 핀테크', titleColor: '#22d3ee', borderColor: '#22d3ee',
    opportunities: [
      'MGX $2B → Binance: 사상 최대 크립토 기업 단일 투자',
      'AED Stablecoin: 국영 스테이블코인 (IHC+ADQ+FAB)',
      'VARA + ADGM: 세계에서 가장 명확한 크립토 규제 체계',
      'SWF 크립토 노출 합산 $4B+ (ADIA, Mubadala 비트코인 ETF 등)',
    ],
    risks: [
      'SWF LP 선례 = 0: 크립토 직접 투자는 하지만 크립토 펀드 LP 투자 전무',
      '규제 이중성: VARA(Dubai) vs ADGM(Abu Dhabi) 규제 경쟁으로 혼란',
      'FATF 그레이리스트: 2024년 해제됐지만 AML/KYC 규제 강화 지속',
      '미국 규제 연동: SEC 정책 변동이 UAE 크립토 생태계에도 영향',
    ],
  },
  {
    title: '🏥 헬스케어 / 바이오', titleColor: '#34d399', borderColor: '#34d399',
    opportunities: [
      'M42 (G42+Mubadala): AI 기반 헬스케어 — 유전체학, 디지털 의료',
      '의무건강보험 전국 확대 (2025~) → 시장 자동 확대',
      '인구 급증 + 부유한 고령화 → 프리미엄 의료 수요',
      '의료관광 허브 성장 (인도, 아프리카, CIS 환자 유입)',
    ],
    risks: [
      '의료인력 부족: 의사/간호사 거의 100% 외국인 의존',
      '비용 인플레이션: 보험료 연 10~15% 상승, 기업 부담 증가',
      '약가 규제: 정부 약가 통제로 제약사 마진 압박',
      '데이터 주권: 의료 데이터 해외 이전 제한 강화',
    ],
  },
  {
    title: '🎭 관광 / 엔터테인먼트', titleColor: '#f472b6', borderColor: '#f472b6',
    opportunities: [
      'Wynn 카지노 2026 오픈: UAE 관광 패러다임 전환 → 연간 GGR $6~8B 잠재력',
      'Abu Dhabi 관광: Louvre, Guggenheim (건설중), Yas Island 확장',
      'Dubai Parks: DXB 공항 연 90M+ 여객, 크루즈 허브 성장',
      'e-스포츠/게이밍: AD Gaming 설립, $6B+ 시장',
    ],
    risks: [
      '사우디 경쟁: NEOM, Riyadh Season, Diriyah Gate — 관광 투자 급증',
      '카지노 사회적 반발: 34% 주민 도박 중독 우려, 28% 문화 정체성 걱정',
      '중동 지정학: 분쟁 격화 시 관광 급감 리스크',
      '기후: 여름 45°C+ → 성수기 편중 (10~4월)',
    ],
  },
  {
    title: '💄 뷰티 / 패션 / 럭셔리', titleColor: '#f472b6', borderColor: '#f472b6',
    opportunities: [
      'UAE 뷰티 시장 $4.2B→$6.8B (2030E), CAGR 8~10%',
      'K-뷰티 열풍: 할랄 인증 수요 + 한류 영향력',
      'HNWI 유입 가속 — 연 9,800명 백만장자 이주',
      '이커머스: Noon, Namshi 성장으로 D2C 진출 용이',
    ],
    risks: [
      'Chalhoub/Al Tayer 독과점: 유통 진입장벽 매우 높음',
      '사우디 시장 개방: Vision 2030으로 리야드가 리테일 허브로 성장',
      '할랄 인증 복잡성: 국가별 상이한 기준, 제품 리포뮬레이션 필요',
      '위조품: 평행수입/카피 문제 만연',
    ],
  },
  {
    title: '🛡️ 방산 / 우주 / 로보틱스', titleColor: '#ef4444', borderColor: '#ef4444',
    opportunities: [
      'EDGE: $5B 매출, 세계 Top 25 방산 기업 진입',
      'Space42: G42+Yahsat 합병, AI 기반 우주통신',
      'Tawazun 오프셋: 방산 구매 시 UAE 내 투자/기술이전 의무',
      '한국 방산: 천궁-II 수출 기반, 추가 협력 여지',
    ],
    risks: [
      '미국 기술이전 제한: ITAR/EAR 규제로 첨단 기술 도입 한계',
      '예멘 분쟁 여파: 후티 드론 공격 경험 → 방공 수요 급증이지만 국제적 비난',
      '인재: Faisal Al Bannai가 AI로 이동하면서 EDGE 인재 유출',
      '지정학 긴장: 2025 도하 공격 이후 GCC 안보 재편 논의',
    ],
  },
] as const
