export interface EconomicTrendItem {
  readonly title: string
  readonly description: string
  readonly details: readonly string[]
  readonly significance: string
}

export interface EconomicTrendCategory {
  readonly id: string
  readonly icon: string
  readonly title: string
  readonly items: readonly EconomicTrendItem[]
}

export const economicTrends: readonly EconomicTrendCategory[] = [
  {
    id: 'non-oil-transition',
    icon: '🔄',
    title: '비석유 경제 전환 가속',
    items: [
      {
        title: 'Non-oil GDP 70%+ 달성',
        description: '석유 의존도 급격히 하락, 다각화 성과 가시화',
        details: [
          '2023년 Non-oil GDP 비중 72% 도달 (2010년 60% 대비)',
          '두바이: 석유 GDP 비중 1% 미만 — 사실상 완전 탈석유',
          'Abu Dhabi: 비석유 부문 성장률 9.1% (2023)',
          'GDP 성장 드라이버: 관광, 물류, 금융, 부동산',
        ],
        significance: 'GCC 최고 수준의 경제 다각화 달성, 유가 변동 취약성 감소',
      },
      {
        title: '관광/물류/금융 허브 강화',
        description: '3대 서비스 산업 성장 가속',
        details: [
          '관광: 두바이 연간 방문객 1,700만+ (2023), 세계 4위',
          '물류: DP World 글로벌 6위, Jebel Ali 세계 9위 컨테이너 항',
          '금융: ADGM/DIFC 자산 $190B+, 핀테크 허브 부상',
          '항공: 에미레이트/에티하드 글로벌 허브 역할',
        ],
        significance: '석유 이후 지속가능 성장 엔진 구축 완료',
      },
    ],
  },
  {
    id: 'ai-datacenter',
    icon: '🤖',
    title: 'AI & 데이터센터 붐',
    items: [
      {
        title: '$100B+ AI 인프라 투자',
        description: '글로벌 AI 허브 도약 전략',
        details: [
          'Stargate 프로젝트: $500B (MGX/SoftBank/OpenAI 파트너십)',
          'xAI $26B 투자, Anthropic $3.5B 투자',
          'Khazna 데이터센터: UAE 시장 70%+ 점유',
          'Microsoft $1.5B G42 투자 → Azure 중동 허브화',
        ],
        significance: '석유 → AI 인프라로 전략적 중요성 전환',
      },
      {
        title: 'Microsoft/G42/OpenAI 파트너십',
        description: '글로벌 빅테크와 전략적 제휴',
        details: [
          'G42: Tahnoun bin Zayed 주도, AI 국가전략 핵심',
          'Microsoft: G42 $1.5B 투자 + 중국 기술 분리 조건',
          'Core42: 소버린 클라우드 + LLM 인프라 제공',
          'Falcon LLM: 오픈소스 LLM 개발 (TII)',
        ],
        significance: '미-중 기술패권 경쟁 속 균형외교 + 자체 역량 확보',
      },
    ],
  },
  {
    id: 'swf-diversification',
    icon: '💼',
    title: '국부펀드 투자 다변화',
    items: [
      {
        title: 'ADIA/Mubadala 포트폴리오 전환',
        description: '전통 자산 → 기술/헬스케어/엔터테인먼트',
        details: [
          'ADIA ($1.18T): 프라이빗 에쿼티/인프라 비중 확대',
          'Mubadala ($330B): GlobalFoundries, AMD, 바이오텍 집중',
          'L\'imad ($263B): 로컬 경제 + 국제 투자 이원화',
          'IHC ($240B): M&A 기반 공격적 다각화',
        ],
        significance: '장기 수익원 다변화, 석유 이후 부 보존 전략',
      },
      {
        title: '테크/헬스케어/엔터 투자 확대',
        description: '미래 성장 산업 선점',
        details: [
          '테크: AI 스타트업, 데이터센터, 핀테크 집중',
          '헬스케어: Cleveland Clinic Abu Dhabi, 바이오텍 투자',
          '엔터테인먼트: 미디어, 게임, 스포츠 (맨시티 구단주)',
          '우주: UAE 화성 탐사, 위성 산업 투자',
        ],
        significance: '석유 의존 탈피, 글로벌 투자 포트폴리오 재편',
      },
    ],
  },
  {
    id: 'digital-dirham',
    icon: '💳',
    title: '디르함 디지털화',
    items: [
      {
        title: 'CBUAE 디지털 디르함 파일럿',
        description: 'CBDC 개발 및 국제 결제 혁신',
        details: [
          'mBridge 프로젝트: BIS/중국/태국/홍콩과 공동 개발',
          '도매 CBDC: 은행간 결제 효율화 목표',
          '소매 CBDC: 일반 소비자 결제 2단계 계획',
          'UAE-사우디 공동 CBDC 연구 "Aber" 프로젝트',
        ],
        significance: '달러 결제 의존도 감소, 위안화 결제 대안 확보',
      },
      {
        title: '핀테크 & 결제 혁신',
        description: '디지털 금융 인프라 고도화',
        details: [
          'Aani: 실시간 결제 시스템 (2024 런칭)',
          'CBUAE 핀테크 샌드박스: 규제 혁신',
          '스테이블코인 규제 프레임워크 개발 중',
          '가상자산 규제: VARA (두바이), FSRA (ADGM)',
        ],
        significance: '글로벌 금융 허브 + 디지털 결제 선도',
      },
    ],
  },
  {
    id: 'cepa-effect',
    icon: '🤝',
    title: 'CEPA 효과',
    items: [
      {
        title: '한-UAE CEPA 발효 (2025.1)',
        description: '양자 무역 및 투자 확대 기대',
        details: [
          '한국 상품 99% 이상 관세 철폐/인하',
          'UAE → 한국: 석유/가스/알루미늄 수출 확대',
          '한국 → UAE: 자동차/전자/화학 시장 접근 강화',
          '서비스/투자 챕터: 금융/건설/의료 진출 기회',
        ],
        significance: 'GCC 최초 FTA 체결국, 전략적 경제 파트너십',
      },
      {
        title: '글로벌 CEPA 네트워크 확대',
        description: '다자 무역 협정 허브화',
        details: [
          '인도 CEPA (2022): $85B 양자무역 목표',
          '터키 CEPA (2023): 비관세 무역 확대',
          '인도네시아 CEPA (2022): 이슬람 경제권 연결',
          '향후: 일본, 호주, 영국 등 협상 진행 중',
        ],
        significance: '전통 석유 수출 → 다자 무역 파트너십 다각화',
      },
    ],
  },
  {
    id: 'real-estate-concern',
    icon: '🏠',
    title: '부동산 시장 과열 우려',
    items: [
      {
        title: '두바이 부동산 가격 급등',
        description: '2020년 대비 50%+ 상승, 거품 우려',
        details: [
          '2023년 두바이 주거 가격 20%+ 상승',
          '럭셔리 빌라: Palm Jumeirah 등 사상 최고가 경신',
          '외국인/러시아 자본 유입 급증 (2022년 우크라이나 전쟁 이후)',
          'Golden Visa 효과: 장기 체류자 부동산 수요 증가',
        ],
        significance: '2008년 금융위기 붕괴 경험, 연착륙 관리 과제',
      },
      {
        title: '주거 접근성 저하',
        description: '일반 거주자 생활비 부담 증가',
        details: [
          '임대료 상승: 일부 지역 30-50% 급등',
          '중산층/젊은 전문직 이탈 우려',
          '정부 대응: 임대료 상한제 일부 시행',
          '신규 공급: 2025년까지 대규모 프로젝트 완공 예정',
        ],
        significance: '인재 유치 경쟁력 vs 거주 비용 균형 필요',
      },
    ],
  },
] as const
