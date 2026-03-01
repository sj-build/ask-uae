import type { WarScenario, KeyLocation } from '@/types/hormuz'

// ============================================================================
// War Scenarios for Market Impact tracker
// ============================================================================

export const WAR_SCENARIOS: WarScenario[] = [
  {
    id: 'quick-victory',
    nameEn: 'Scenario A: Quick Victory',
    nameKo: '시나리오 A: 단기 승리',
    descriptionEn: 'US achieves air superiority, IRGC neutralized, minimal Hormuz disruption. Oil spike short-lived.',
    descriptionKo: '미국 항공 우세 달성, IRGC 무력화, 호르무즈 영향 최소화. 유가 급등 단기 종료.',
    probability: 10,
    oilImpactEn: 'Brent $85-95 (spike to $100, back to normal in 1-2 weeks)',
    oilImpactKo: 'Brent $85-95 (일시적 $100, 1-2주 내 정상화)',
    isActive: false,
  },
  {
    id: 'hormuz-blockade',
    nameEn: 'Scenario B: Hormuz Blockade',
    nameKo: '시나리오 B: 호르무즈 봉쇄',
    descriptionEn: 'Iran closes Strait with mines/missiles. 20% of global oil transit disrupted. Insurance rates skyrocket.',
    descriptionKo: '이란 기뢰/미사일로 해협 봉쇄. 글로벌 원유 수송 20% 차단. 보험료 폭등.',
    probability: 60,
    oilImpactEn: 'Brent $120-150 (sustained for weeks/months)',
    oilImpactKo: 'Brent $120-150 (수주-수개월 지속)',
    isActive: true,
  },
  {
    id: 'regime-collapse',
    nameEn: 'Scenario C: Regime Collapse',
    nameKo: '시나리오 C: 정권 붕괴',
    descriptionEn: 'Extended campaign leads to IRGC fracture. Power vacuum, internal chaos. Eventually Hormuz reopens.',
    descriptionKo: '장기전으로 IRGC 분열. 권력 공백, 내부 혼란. 궁극적 호르무즈 재개방.',
    probability: 30,
    oilImpactEn: 'Brent $100-120 (volatile, gradual normalization over months)',
    oilImpactKo: 'Brent $100-120 (변동 심함, 수개월에 걸쳐 점진적 정상화)',
    isActive: false,
  },
]

// ============================================================================
// Key Locations for Crisis Map
// ============================================================================

export const KEY_LOCATIONS: KeyLocation[] = [
  // Military Bases
  { name: 'US 5th Fleet HQ', nameKo: '미 5함대 사령부', lat: 26.2361, lon: 50.5860, type: 'military_base', country: 'BH', icon: '🇺🇸' },
  { name: 'Al Udeid Air Base', nameKo: '알 우데이드 공군기지', lat: 25.1174, lon: 51.3150, type: 'military_base', country: 'QA', icon: '🇺🇸' },
  { name: 'Al Dhafra Air Base', nameKo: '알 다프라 공군기지', lat: 24.2483, lon: 54.5477, type: 'military_base', country: 'AE', icon: '🇺🇸' },
  { name: 'Camp Lemonnier', nameKo: '캠프 르모니에', lat: 11.5471, lon: 43.1457, type: 'military_base', country: 'DJ', icon: '🇺🇸' },
  { name: 'Bandar Abbas Naval Base', nameKo: '반다르 아바스 해군기지', lat: 27.1865, lon: 56.2808, type: 'military_base', country: 'IR', icon: '🇮🇷' },

  // Oil Infrastructure
  { name: 'Ras Tanura', nameKo: '라스 타누라 (사우디)', lat: 26.6868, lon: 50.0514, type: 'oil_infrastructure', country: 'SA', icon: '🛢️' },
  { name: 'Kharg Island', nameKo: '하르그 섬 (이란)', lat: 29.2333, lon: 50.3167, type: 'oil_infrastructure', country: 'IR', icon: '🛢️' },
  { name: 'Fujairah Oil Terminal', nameKo: '푸자이라 유류 터미널', lat: 25.1288, lon: 56.3264, type: 'oil_infrastructure', country: 'AE', icon: '🛢️' },
  { name: 'Abqaiq Processing', nameKo: '아브카이크 처리시설', lat: 25.9386, lon: 49.6781, type: 'oil_infrastructure', country: 'SA', icon: '🛢️' },

  // Key Ports
  { name: 'Jebel Ali Port', nameKo: '제벨 알리 항', lat: 24.9857, lon: 55.0272, type: 'port', country: 'AE', icon: '🚢' },
  { name: 'Khor Fakkan Port', nameKo: '코르 파칸 항', lat: 25.3390, lon: 56.3553, type: 'port', country: 'AE', icon: '🚢' },
  { name: 'Sohar Port', nameKo: '소하르 항', lat: 24.3658, lon: 56.7355, type: 'port', country: 'OM', icon: '🚢' },
  { name: 'Bushehr Port', nameKo: '부셰르 항 (이란)', lat: 28.9234, lon: 50.8204, type: 'port', country: 'IR', icon: '🚢' },

  // Nuclear Sites
  { name: 'Natanz', nameKo: '나탄즈 핵시설', lat: 33.7225, lon: 51.7277, type: 'nuclear_site', country: 'IR', icon: '☢️' },
  { name: 'Fordow', nameKo: '포르도 핵시설', lat: 34.8800, lon: 51.5900, type: 'nuclear_site', country: 'IR', icon: '☢️' },
  { name: 'Isfahan Nuclear', nameKo: '이스파한 핵시설', lat: 32.6546, lon: 51.6680, type: 'nuclear_site', country: 'IR', icon: '☢️' },
  { name: 'Bushehr Nuclear Plant', nameKo: '부셰르 원전', lat: 28.8321, lon: 50.8851, type: 'nuclear_site', country: 'IR', icon: '☢️' },

  // Key Cities
  { name: 'Tehran', nameKo: '테헤란', lat: 35.6892, lon: 51.3890, type: 'city', country: 'IR', icon: '🏙️' },
  { name: 'Dubai', nameKo: '두바이', lat: 25.2048, lon: 55.2708, type: 'city', country: 'AE', icon: '🏙️' },
  { name: 'Abu Dhabi', nameKo: '아부다비', lat: 24.4539, lon: 54.3773, type: 'city', country: 'AE', icon: '🏙️' },
  { name: 'Strait of Hormuz', nameKo: '호르무즈 해협', lat: 26.5, lon: 56.2, type: 'port', country: '', icon: '⚓' },
]

// ============================================================================
// Security Zone Polygons
// ============================================================================

export const SECURITY_ZONES = {
  hormuz_strait: {
    name: 'Strait of Hormuz',
    nameKo: '호르무즈 해협',
    coords: [
      [26.0, 55.5],
      [27.0, 55.5],
      [27.0, 57.5],
      [26.0, 57.5],
    ] as [number, number][],
  },
  persian_gulf: {
    name: 'Persian Gulf',
    nameKo: '페르시아만',
    coords: [
      [24.0, 48.0],
      [30.0, 48.0],
      [30.0, 56.5],
      [26.0, 56.5],
      [24.0, 52.0],
    ] as [number, number][],
  },
  gulf_of_oman: {
    name: 'Gulf of Oman',
    nameKo: '오만만',
    coords: [
      [22.5, 56.5],
      [26.5, 56.5],
      [26.5, 62.0],
      [22.5, 62.0],
    ] as [number, number][],
  },
}

// ============================================================================
// Event Type Icons & Labels
// ============================================================================

export const EVENT_ICONS: Record<string, { icon: string; labelEn: string; labelKo: string }> = {
  airstrike: { icon: '💥', labelEn: 'Airstrike', labelKo: '공습' },
  missile_launch: { icon: '🚀', labelEn: 'Missile Launch', labelKo: '미사일 발사' },
  missile_intercept: { icon: '🛡️', labelEn: 'Missile Intercept', labelKo: '미사일 요격' },
  naval_incident: { icon: '⚓', labelEn: 'Naval Incident', labelKo: '해상 사건' },
  vessel_seizure: { icon: '🏴‍☠️', labelEn: 'Vessel Seizure', labelKo: '선박 나포' },
  explosion: { icon: '🔥', labelEn: 'Explosion', labelKo: '폭발' },
  protest: { icon: '✊', labelEn: 'Protest', labelKo: '시위' },
  airport_closure: { icon: '✈️', labelEn: 'Airport Closure', labelKo: '공항 폐쇄' },
  port_closure: { icon: '🚢', labelEn: 'Port Closure', labelKo: '항만 폐쇄' },
  military_deployment: { icon: '🎖️', labelEn: 'Military Deployment', labelKo: '군사 배치' },
  humanitarian: { icon: '🏥', labelEn: 'Humanitarian', labelKo: '인도적 사건' },
}

// ============================================================================
// Vessel Type Icons
// ============================================================================

export const VESSEL_ICONS: Record<string, { icon: string; color: string }> = {
  tanker_transiting: { icon: '🟢', color: '#22c55e' },
  tanker_stopped: { icon: '🔴', color: '#ef4444' },
  tanker_u_turn: { icon: '🟡', color: '#eab308' },
  lng_carrier: { icon: '🔵', color: '#3b82f6' },
  container: { icon: '⬜', color: '#94a3b8' },
  military: { icon: '⭐', color: '#f59e0b' },
  dark_vessel: { icon: '⚫', color: '#6b7280' },
  other: { icon: '⚪', color: '#d1d5db' },
}

// ============================================================================
// News Category Labels
// ============================================================================

export const NEWS_CATEGORIES: Record<string, { labelEn: string; labelKo: string; color: string }> = {
  hormuz_shipping: { labelEn: 'Hormuz Shipping', labelKo: '호르무즈 해운', color: '#3b82f6' },
  oil_energy: { labelEn: 'Oil & Energy', labelKo: '유가/에너지', color: '#f59e0b' },
  military_ops: { labelEn: 'Military Ops', labelKo: '군사 작전', color: '#ef4444' },
  iran_internal: { labelEn: 'Iran Internal', labelKo: '이란 내부', color: '#a78bfa' },
  uae_impact: { labelEn: 'UAE Impact', labelKo: 'UAE 영향', color: '#22d3ee' },
  market_reaction: { labelEn: 'Market Reaction', labelKo: '시장 반응', color: '#34d399' },
  diplomacy: { labelEn: 'Diplomacy', labelKo: '외교', color: '#818cf8' },
  insurance_maritime: { labelEn: 'Insurance/Maritime', labelKo: '해운 보험', color: '#fb923c' },
  casualties: { labelEn: 'Casualties', labelKo: '사상자', color: '#f87171' },
  regime_change: { labelEn: 'Regime Change', labelKo: '정권 교체', color: '#c084fc' },
}
