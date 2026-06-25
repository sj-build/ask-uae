/**
 * KARA Scenario Intelligence Agent — Configuration
 * Translated from kara-scenario-agent-spec.md (Python) to TypeScript
 */

import type {
  ScenarioTree,
  ScenarioId,
  KeyVariablesConfig,
  ImpactMatrix,
  ScenarioAgentConfig,
} from '@/types/scenario'

// ============================================================================
// SCENARIO_TREE — 4 main scenarios with sub-scenarios
// ============================================================================

export const SCENARIO_TREE: ScenarioTree = {
  A: {
    name: '단기 승리 (Swift Victory)',
    description:
      '미-이스라엘 공습이 이란 군사력을 빠르게 무력화. IRGC 조직적 저항 불가. 호르무즈 봉쇄 단기간 해제.',
    sub_scenarios: {
      A1: {
        name: '협상 종료',
        description: '이란 과도정부가 미국과 빠른 휴전 협상. 질서있는 전환.',
        timeline: '2~4주',
      },
      A2: {
        name: '군사적 종료',
        description: 'IRGC 전투력 완전 소진. 사실상 항복 (공식 선언 없이).',
        timeline: '1~3주',
      },
    },
    default_probability: 25,
  },
  B: {
    name: '장기 확전 (Prolonged Conflict)',
    description:
      'IRGC가 비대칭 전술로 저항 지속. 호르무즈 부분 봉쇄 장기화. 게릴라전 양상.',
    sub_scenarios: {
      B1: {
        name: '호르무즈 장기 봉쇄',
        description: '기뢰+대함미사일로 해협 통행 수주~수개월 차단. 유가 $100+ 지속.',
        timeline: '1~3개월',
      },
      B2: {
        name: '대리전 확산',
        description: '이란 잔존 세력이 헤즈볼라/후티/이라크 민병대 통해 다전선 확전.',
        timeline: '3~6개월',
      },
    },
    default_probability: 35,
  },
  C: {
    name: '정권 붕괴 (Regime Collapse)',
    description: 'IRGC 지휘체계 와해 + 시민 봉기로 이슬람 공화국 체제 종료.',
    sub_scenarios: {
      C1: {
        name: '빠른 붕괴',
        description: '군 부대 단위 투항 + 시민 봉기 동시 발생. 수주 내 과도정부.',
        timeline: '2~6주',
      },
      C2: {
        name: '분열 붕괴',
        description: '지역별 군벌화. 쿠르드/아제리/발루치 분리 움직임. 리비아 모델.',
        timeline: '3~12개월',
      },
      C3: {
        name: '질서있는 전환',
        description: 'IRGC 온건파 + 개혁파 성직자 + 시민 대표가 합의. 과도정부 수립.',
        timeline: '1~3개월',
      },
    },
    default_probability: 35,
  },
  D: {
    name: '예상 외 확전 (Unexpected Escalation)',
    description: '전쟁이 예상치 못한 방향으로 확대. 핵 위기, 러시아/중국 개입 등.',
    sub_scenarios: {
      D1: {
        name: '핵 위기',
        description: '이란이 핵 장치 보유/사용 시도 또는 핵 시설 방사능 유출.',
        timeline: '즉시',
      },
      D2: {
        name: '러시아/중국 개입',
        description: '러시아 또는 중국이 직접 군사 개입. 대리전 → 강대국 충돌.',
        timeline: '불확실',
      },
      D3: {
        name: '걸프 내전',
        description: '이란 공격으로 걸프 내 시아파 소수민족 불안정. 바레인/동부 사우디 등.',
        timeline: '수주~수개월',
      },
    },
    default_probability: 5,
  },
}

// ============================================================================
// KEY_VARIABLES — 17 variables the agent tracks
// ============================================================================

export const KEY_VARIABLES: KeyVariablesConfig = {
  // === Military ===
  irgc_command_status: {
    description: 'IRGC 지휘체계 상태',
    category: 'military',
    default_value: 'disrupted',
    possible_values: ['intact', 'disrupted', 'collapsed'],
    scenario_impact: {
      intact: { B: 15, C: -15 },
      disrupted: { A: 10, C: 10 },
      collapsed: { C: 30, B: -20 },
    },
  },
  hormuz_status: {
    description: '호르무즈 해협 상태',
    category: 'military',
    default_value: 'blocked',
    possible_values: ['open', 'restricted', 'blocked'],
    scenario_impact: {
      open: { A: 20 },
      restricted: { B: 15 },
      blocked: { B: 20 },
    },
  },
  iran_missile_activity: {
    description: '이란 미사일 발사 활동 수준',
    category: 'military',
    default_value: 'high',
    possible_values: ['none', 'low', 'medium', 'high', 'massive'],
    scenario_impact: {
      none: { A: 25, C: 15 },
      low: { A: 10 },
      high: { B: 15 },
      massive: { B: 10, D: 5 },
    },
  },
  us_military_ops: {
    description: '미군 작전 강도',
    category: 'military',
    default_value: 'major_combat',
    possible_values: ['patrol', 'limited_strikes', 'major_combat', 'occupation'],
    scenario_impact: {
      major_combat: { A: 10, C: 10 },
      occupation: { C: 15, D: 10 },
    },
  },
  iran_air_defense: {
    description: '이란 방공 능력',
    category: 'military',
    default_value: 'destroyed',
    possible_values: ['operational', 'degraded', 'destroyed'],
    scenario_impact: {
      destroyed: { A: 15, C: 10 },
    },
  },

  // === Political ===
  khamenei_status: {
    description: '하메네이 생존 상태',
    category: 'political',
    default_value: 'confirmed_dead',
    possible_values: ['alive', 'unconfirmed', 'confirmed_dead'],
  },
  iran_successor: {
    description: '후계자 상황',
    category: 'political',
    default_value: 'no_clear_successor',
    possible_values: ['no_clear_successor', 'irgc_installed', 'assembly_selected', 'civilian_transition'],
    scenario_impact: {
      irgc_installed: { B: 15 },
      assembly_selected: { B: 5, C: -5 },
      civilian_transition: { C: 25 },
    },
  },
  iran_protests: {
    description: '이란 내부 시위 수준',
    category: 'political',
    default_value: 'celebrations_reported',
    possible_values: ['none', 'sporadic', 'widespread', 'revolution'],
    scenario_impact: {
      widespread: { C: 15 },
      revolution: { C: 30 },
    },
  },
  iran_military_defections: {
    description: '이란 군 이탈/투항 수준',
    category: 'political',
    default_value: 'none_confirmed',
    possible_values: ['none_confirmed', 'individual', 'unit_level', 'mass_defection'],
    scenario_impact: {
      unit_level: { C: 20 },
      mass_defection: { C: 35, A: 10 },
    },
  },

  // === Market ===
  oil_price_brent: {
    description: '브렌트 유가 (USD)',
    category: 'market',
    default_value: 82.0,
    thresholds: {
      below_70: '정상화 진행',
      '70_90': '전쟁 프리미엄 반영',
      '90_110': '심각한 공급 차질',
      above_110: '장기 봉쇄 확인',
    },
  },
  hormuz_traffic_pct: {
    description: '호르무즈 통행량 (정상 대비 %)',
    category: 'market',
    default_value: 25,
  },
  uae_airspace: {
    description: 'UAE 영공 상태',
    category: 'market',
    default_value: 'closed',
    possible_values: ['open', 'restricted', 'closed'],
  },
  uae_airport_status: {
    description: 'UAE 공항 상태',
    category: 'market',
    default_value: 'suspended',
    possible_values: ['normal', 'delayed', 'suspended', 'closed_indefinitely'],
  },

  // === Diplomatic ===
  ceasefire_talks: {
    description: '휴전 협상 상태',
    category: 'diplomatic',
    default_value: 'none',
    possible_values: ['none', 'backchannel', 'formal_talks', 'agreement_imminent', 'ceasefire_declared'],
    scenario_impact: {
      formal_talks: { A: 15, B: -10 },
      agreement_imminent: { A: 25 },
      ceasefire_declared: { A: 40 },
    },
  },
  un_security_council: {
    description: '유엔 안보리 동향',
    category: 'diplomatic',
    default_value: 'emergency_session',
    possible_values: ['inactive', 'emergency_session', 'resolution_proposed', 'resolution_passed'],
  },
  russia_china_stance: {
    description: '러시아/중국 입장',
    category: 'diplomatic',
    default_value: 'verbal_condemnation',
    possible_values: ['neutral', 'verbal_condemnation', 'diplomatic_intervention', 'military_support', 'direct_involvement'],
    scenario_impact: {
      military_support: { D: 20, B: 15 },
      direct_involvement: { D: 40 },
    },
  },
}

// ============================================================================
// IMPACT_MATRIX — Per-scenario market impacts
// ============================================================================

export const IMPACT_MATRIX: ImpactMatrix = {
  A: {
    oil: {
      direction: '하락',
      range: '$60-70',
      timeline: '2~4주 내',
      reasoning: '전쟁 프리미엄 해소 + 호르무즈 재개통 + 이란 원유 복귀 기대',
    },
    global_equity: {
      direction: '반등',
      magnitude: '+3~5%',
      timeline: '즉시',
      reasoning: '지정학 리스크 해소, risk-on',
    },
    kospi: {
      direction: '반등',
      magnitude: '+3~7%',
      timeline: '1~2주',
      sectors: {
        방산: '단기 차익실현 후 구조적 성장 유지 (NATO, 폴란드 등)',
        조선: '전쟁 특수 해소되나 글로벌 무역 회복으로 중기 긍정',
        'K-Beauty': 'UAE 경로 정상화로 강한 반등',
        반도체: '글로벌 수요 회복 기대로 상승',
        '항공/여행': '강한 반등',
      },
    },
    kara_fund: {
      lp_meeting: '4~6주 내 리스케줄 가능',
      thesis_strength: "강화 — '이란 리스크 영구 제거된 뉴 걸프'",
      deal_opportunity: '한국 스타트업 밸류에이션 조정기 활용',
      action_items: [
        'LP 즉시 재접촉',
        '4/2 간담회 5~6월로 리스케줄',
        'UAE 방문 2주 내 실행',
        '포트폴리오 기업 UAE 진출 타임라인 재확인',
      ],
    },
  },
  B: {
    oil: {
      direction: '급등 후 고착',
      range: '$90-130',
      timeline: '수주~수개월',
      reasoning: '호르무즈 봉쇄 지속, 20M b/d 차단, JP Morgan $120-130 전망',
    },
    global_equity: {
      direction: '하락',
      magnitude: '-5~15%',
      timeline: '수주',
      reasoning: '에너지 비용 급등 → 인플레 → 금리 인하 지연 → 경기 둔화',
    },
    kospi: {
      direction: '하락',
      magnitude: '-10~15%',
      timeline: '수주',
      sectors: {
        방산: '최대 수혜. 한화에어로/한화오션/LIG넥스원 급등',
        조선: '전쟁 특수 + 해운 우회 수요로 상승',
        'K-Beauty': 'UAE 경로 차단, 단기 타격',
        반도체: '글로벌 경기 둔화 우려로 하락',
        '항공/여행': '급락',
        '정유/화학': '혼조 — 유가 상승 수혜 vs 원가 부담',
      },
    },
    kara_fund: {
      lp_meeting: '무기한 연기',
      thesis_strength: '단기 약화 — LP들이 위험 회피',
      deal_opportunity: '한국 스타트업 밸류에이션 대폭 조정 → 장기적 투자 기회',
      action_items: [
        'LP 관계 유지 (안부 + 상황 업데이트)',
        '펀드레이징 일시 중단, 딜 소싱에 집중',
        '방산/조선 간접 수혜 분석 (한-UAE 관계 강화)',
        '시나리오 C 전환 신호 모니터링',
      ],
    },
  },
  C: {
    oil: {
      direction: '스파이크 후 급락',
      range: '단기 $80-90 → 중기 $50-60',
      timeline: '스파이크 수일, 하락 수개월',
      reasoning: '혼란기 단기 스파이크 → 이란 350만 b/d 정상화 기대 → 공급 과잉',
    },
    global_equity: {
      direction: '강한 반등',
      magnitude: '+5~10%',
      timeline: '수주~수개월',
      reasoning: '최대 지정학 리스크 제거, 글로벌 에너지 비용 구조적 하락',
    },
    kospi: {
      direction: '강한 반등',
      magnitude: '+10~15%',
      timeline: '수개월',
      sectors: {
        방산: '단기 차익실현 → 구조적 성장 유지 (걸프 재무장 수요)',
        조선: '이란 재건 + 글로벌 무역 확대로 중장기 최대 수혜',
        'K-Beauty': 'UAE 정상화 + 이란 8,800만 시장 옵셔널리티',
        반도체: '글로벌 경기 회복 기대로 강한 반등',
        '건설/인프라': '이란 재건 수주 기대',
      },
    },
    kara_fund: {
      lp_meeting: '과도정부 수립 후 1~2개월 내',
      thesis_strength: '최대 강화 — 이란 리스크 제거 + 이란 시장 옵셔널리티',
      deal_opportunity: '최적의 투자 환경. 밸류에이션 조정 + 강화된 테제',
      action_items: [
        'LP 피칭 즉시 재개 — 최강 테제',
        'Fund I 클로징 가속화',
        '이란 시장 리서치 개시 (Fund II 테제)',
        '포트폴리오 기업 UAE+이란 확장 전략 수립',
        '경쟁 GP보다 먼저 LP 접촉 (first mover)',
      ],
    },
  },
  D: {
    oil: {
      direction: '급등',
      range: '$130-200+',
      timeline: '즉시',
      reasoning: '글로벌 에너지 위기. 1973 오일쇼크급 시나리오.',
    },
    global_equity: {
      direction: '폭락',
      magnitude: '-15~30%',
      timeline: '즉시',
      reasoning: '글로벌 경기 침체 공포. 안전자산 쏠림.',
    },
    kospi: {
      direction: '폭락',
      magnitude: '-15~25%',
      timeline: '즉시',
      sectors: {
        방산: '유일한 상승 섹터',
        '금/안전자산': '급등',
        '나머지 전부': '폭락',
      },
    },
    kara_fund: {
      lp_meeting: '최소 6개월 이상 연기',
      thesis_strength: '근본적 재검토 필요',
      deal_opportunity: '투자 전면 중단',
      action_items: [
        '전면 대기 모드',
        'LP 안전 확인 최우선',
        '한국 사무실 비상 계획 가동',
        '핵/화학 리스크 시 인적 안전 최우선',
      ],
    },
  },
}

// ============================================================================
// Agent Configuration
// ============================================================================

export const AGENT_CONFIG: ScenarioAgentConfig = {
  maxApiCallsPerHour: 12,
  maxDailyCostUsd: 20,
  scenarioChangeThreshold: 10,
  statusReportIntervalHours: 6,
  forceAnalysisIntervalMinutes: 60,
  claudeModel: 'claude-sonnet-4-5',
  claudeMaxTokens: 4096,
}

// ============================================================================
// Default variable values (for initialization)
// ============================================================================

export const DEFAULT_VARIABLES: Record<string, string | number> = {
  irgc_command_status: 'disrupted',
  hormuz_status: 'blocked',
  iran_missile_activity: 'high',
  us_military_ops: 'major_combat',
  iran_air_defense: 'destroyed',
  khamenei_status: 'confirmed_dead',
  iran_successor: 'no_clear_successor',
  iran_protests: 'celebrations_reported',
  iran_military_defections: 'none_confirmed',
  oil_price_brent: 82.0,
  hormuz_traffic_pct: 25,
  uae_airspace: 'closed',
  uae_airport_status: 'suspended',
  ceasefire_talks: 'none',
  un_security_council: 'emergency_session',
  russia_china_stance: 'verbal_condemnation',
}

// ============================================================================
// Scenario Labels (for UI)
// ============================================================================

export const SCENARIO_LABELS: Record<ScenarioId, { ko: string; en: string; emoji: string }> = {
  A: { ko: '단기 승리', en: 'Swift Victory', emoji: '⚡' },
  B: { ko: '장기 확전', en: 'Prolonged Conflict', emoji: '⏳' },
  C: { ko: '정권 붕괴', en: 'Regime Collapse', emoji: '🏚️' },
  D: { ko: '예상 외 확전', en: 'Unexpected Escalation', emoji: '💥' },
}

export const ALERT_LEVEL_EMOJI: Record<string, string> = {
  CRITICAL: '🚨',
  HIGH: '⚠️',
  MEDIUM: '📊',
  LOW: '📝',
  NONE: '✅',
}

// ============================================================================
// Variable Category Labels
// ============================================================================

export const VARIABLE_CATEGORY_LABELS: Record<string, { ko: string; en: string; emoji: string }> = {
  military: { ko: '군사', en: 'Military', emoji: '🎖️' },
  political: { ko: '정치', en: 'Political', emoji: '🏛️' },
  market: { ko: '시장', en: 'Market', emoji: '📈' },
  diplomatic: { ko: '외교', en: 'Diplomatic', emoji: '🕊️' },
}
