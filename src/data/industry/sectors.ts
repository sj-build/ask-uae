import type { Sector } from '@/types/sector'

// 데이터 출처:
// - AI: Statista AI Market Forecast UAE (2024)
// - 데이터센터: Arizton UAE Data Center Market Report (2024)
// - 헬스케어: Statista Hospitals UAE, Nexdigm Healthcare Report (2024)
// - 뷰티: Mordor Intelligence UAE Cosmetic Products (2025)
// - 관광: UAE Ministry of Economy, WTTC (2024)
// - 핀테크: Mordor Intelligence UAE Fintech (2024)
// - 부동산: Dubai Land Department, Abu Dhabi Real Estate (2024)
// - 에너지: IMARC UAE Renewable Energy (2024)
// - 럭셔리: IMARC UAE Luxury Goods, Chalhoub Group (2024)
// - 방위: GlobalData UAE Defense (2025)
// - 주식시장: ADX, DFM Official Data (2024)

export const sectors: readonly Sector[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 🏦 금융 & 투자
  // ═══════════════════════════════════════════════════════════════════════════
  {
    icon: '🏦',
    name: '금융 · 은행 · 보험',
    size: '은행자산 $1.1T (2024) · 이슬람금융 $260B · 보험 $15B',
    cagr: 'CAGR 6-8%',
    valueChain: [
      { label: '중앙은행/규제 (CBUAE)' },
      { label: '상업은행' },
      { label: '이슬람은행 (수쿡/타카풀)' },
      { label: '투자은행/자산운용' },
      { label: '보험 (타카풀)' },
    ],
    players: [
      { name: 'First Abu Dhabi Bank', owner: 'Mubadala/IHC', revenueUsd: '매출 $9.2B', marketCapUsd: '$52B', valueChainPosition: '상업은행', note: 'UAE 1위, GCC 최대 은행' },
      { name: 'Emirates NBD', owner: 'ICD/Dubai 정부', revenueUsd: '매출 $7.8B', marketCapUsd: '$35B', valueChainPosition: '상업은행', note: 'UAE 2위, DenizBank 소유' },
      { name: 'Abu Dhabi Commercial Bank', owner: '정부 61%', revenueUsd: '매출 $4.2B', marketCapUsd: '$18B', valueChainPosition: '상업은행', note: 'UAE 3위' },
      { name: 'Dubai Islamic Bank', owner: 'ICD', revenueUsd: '매출 $3.5B', marketCapUsd: '$12B', valueChainPosition: '이슬람은행', note: '세계 최대 이슬람은행' },
      { name: 'ADIA', owner: 'Abu Dhabi 정부', revenueUsd: '$1T+ AUM', marketCapUsd: '국부펀드', valueChainPosition: '자산운용', note: '세계 3대 SWF' },
      { name: 'Mubadala', owner: 'Abu Dhabi 정부', revenueUsd: '$302B AUM', marketCapUsd: '국부펀드', valueChainPosition: '자산운용', note: '기술/헬스케어 집중' },
    ],
  },
  {
    icon: '₿',
    name: '핀테크 · 크립토 · 디지털자산',
    size: '핀테크 $3.0B (2024) → $6.4B (2030E)',
    cagr: 'CAGR 13.8%',
    valueChain: [
      { label: '규제 (VARA/ADGM/CBUAE)' },
      { label: '인프라 (블록체인/DC)' },
      { label: '거래소/결제' },
      { label: '스테이블코인/DeFi' },
      { label: '자산 토큰화/RWA' },
    ],
    players: [
      { name: 'Binance (VARA)', owner: 'CZ/MGX $2B', revenueUsd: '매출 $12B+', marketCapUsd: '$80B+', valueChainPosition: '거래소', note: 'Dubai 본사, VASP 라이선스' },
      { name: 'Phoenix Group', owner: 'IHC', revenueUsd: '$370M IPO', marketCapUsd: '$2.8B', valueChainPosition: '채굴/인프라', note: '500MW BTC 채굴, ADX 상장' },
      { name: 'AED Stablecoin', owner: 'IHC+ADQ+FAB', revenueUsd: '$120M 투자', marketCapUsd: '', valueChainPosition: '스테이블코인', note: 'ADI Foundation L2 블록체인' },
      { name: 'VARA', owner: 'Dubai 정부', revenue: '~23개 VASP', marketCapUsd: '규제기관', valueChainPosition: '규제', note: '세계 최초 전담 크립토 규제기관' },
      { name: 'ADGM/FSRA', owner: 'Abu Dhabi', revenue: '2018 선구자', marketCapUsd: '규제기관', valueChainPosition: '규제', note: 'RegLab, Kraken ADGM 선택' },
    ],
    insight: '핵심 포인트: AED 스테이블코인 국영 프로젝트 (IHC+ADQ+FAB), ADGM 펀드 라이선스 체계, Phoenix Group → IHC → Tahnoun 연결고리.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🤖 기술 & 인프라
  // ═══════════════════════════════════════════════════════════════════════════
  {
    icon: '🤖',
    name: 'AI · 기술 · 데이터센터',
    size: 'AI $950M (2024) → $4.3B (2030E)',
    cagr: 'AI CAGR 28.5% · DC CAGR 17.6%',
    valueChain: [
      { label: '반도체/칩 수입' },
      { label: '데이터센터 인프라' },
      { label: '클라우드/AI 플랫폼' },
      { label: 'AI 모델/서비스' },
      { label: '산업 응용 (금융/의료/물류)' },
    ],
    players: [
      { name: 'G42 / Core42', owner: 'Sheikh Tahnoun', revenue: '직원 24,000명', marketCapUsd: '비상장', valueChainPosition: 'AI 플랫폼', note: 'Falcon LLM, Cerebras 파트너' },
      { name: 'Khazna Data Centers', owner: 'G42 자회사', revenue: 'UAE DC 70%+', marketCapUsd: '', valueChainPosition: 'DC 인프라', note: '시장 점유율 압도적' },
      { name: 'MGX', owner: 'G42+Mubadala', revenueUsd: '$50B+ AUM', marketCapUsd: '투자기관', valueChainPosition: 'AI 투자', note: 'OpenAI, xAI, Anthropic 투자' },
      { name: 'Presight AI', owner: 'G42 (ADX 상장)', revenueUsd: '매출 $180M', marketCapUsd: '$4.2B', valueChainPosition: 'AI 서비스', note: '정부/안보 빅데이터 분석' },
      { name: 'Stargate UAE', owner: 'G42+OpenAI+SoftBank', revenueUsd: '$500B 글로벌', marketCapUsd: 'JV', valueChainPosition: 'DC 인프라', note: '5GW AI 캠퍼스, 200MW 1단계 2026' },
      { name: 'e& (Etisalat)', owner: 'Abu Dhabi 정부 60%', revenueUsd: '매출 $14.7B', marketCapUsd: '$58B', valueChainPosition: '클라우드/통신', note: '5G, 클라우드, AI 서비스' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ⚡ 에너지 & 부동산
  // ═══════════════════════════════════════════════════════════════════════════
  {
    icon: '⚡',
    name: '에너지 · 석유가스 · 재생에너지',
    size: '재생에너지 $4.8B (2024) → $12B (2033E)',
    cagr: 'RE CAGR 10.8%',
    valueChain: [
      { label: '원유/가스 생산' },
      { label: '정제/석유화학' },
      { label: '송배전 인프라' },
      { label: '재생에너지 (태양광/풍력)' },
      { label: '수소/원자력' },
    ],
    players: [
      { name: 'ADNOC', owner: 'Abu Dhabi 정부', revenueUsd: '매출 $49.7B', marketCapUsd: '$90B+', valueChainPosition: 'Upstream', note: '세계 12위 원유 매장, 한국 $30B+ 계약' },
      { name: 'XRG', owner: 'ADNOC 스핀오프', revenueUsd: '신설', marketCapUsd: '$80B+', valueChainPosition: '저탄소', note: '에너지 전환 투자 차량' },
      { name: 'Masdar', owner: 'Mubadala+ADNOC+TAQA', revenue: '50GW RE', marketCapUsd: '', valueChainPosition: '재생에너지', note: '100GW 목표 2030' },
      { name: 'Barakah Nuclear', owner: 'ENEC/KEPCO 건설', revenue: '5.6GW', marketCapUsd: '', valueChainPosition: '원자력', note: '한국 $23.8B 계약 (아랍 최초 원전)' },
      { name: 'TAQA', owner: 'Abu Dhabi 정부 74%', revenueUsd: '매출 $15.4B', marketCapUsd: '$28B', valueChainPosition: '유틸리티', note: '수도/전기 유틸리티' },
      { name: 'DEWA', owner: 'ICD/Dubai', revenueUsd: '매출 $8B', marketCapUsd: '$23B', valueChainPosition: '유틸리티', note: 'Mohammed bin Rashid Solar Park (5GW)' },
    ],
    insight: '한국 레버리지: KEPCO Barakah $23.8B + 삼성엔지니어링 $8B+ + SK E&C $1.2B = UAE 내 $30B+ 한국 에너지 풋프린트.',
  },
  {
    icon: '🏗️',
    name: '부동산 · 건설',
    size: 'UAE 총 거래 $243B (2024)',
    cagr: '거래량 +36% YoY (Dubai)',
    valueChain: [
      { label: '토지 개발/마스터플랜' },
      { label: '건설 (삼성엔지니어링 등)' },
      { label: '디벨로퍼' },
      { label: '브로커/중개' },
      { label: '프롭테크/관리' },
    ],
    players: [
      { name: 'Emaar Properties', owner: 'ICD/Dubai 정부', revenueUsd: '매출 $9.5B', marketCapUsd: '$22B', valueChainPosition: '디벨로퍼', note: 'Burj Khalifa, Dubai Mall' },
      { name: 'Aldar Properties', owner: 'Mubadala 25%', revenueUsd: '매출 $4.5B', marketCapUsd: '$14B', valueChainPosition: '디벨로퍼', note: 'Abu Dhabi 1위 디벨로퍼' },
      { name: 'DAMAC', owner: 'Hussain Sajwani', revenueUsd: '매출 $6.7B', marketCapUsd: '$10B', valueChainPosition: '디벨로퍼', note: 'Trump 브랜드 파트너' },
      { name: 'Nakheel', owner: 'Dubai 정부', revenue: 'Palm Jumeirah', marketCapUsd: '', valueChainPosition: '디벨로퍼', note: 'Dubai Holding 합병' },
      { name: 'Modon', owner: 'IHC 자회사', revenueUsd: '매출 $5.5B+', marketCapUsd: '', valueChainPosition: '디벨로퍼', note: 'Saadiyat, Yas Bay 개발' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🏥 헬스케어
  // ═══════════════════════════════════════════════════════════════════════════
  {
    icon: '🏥',
    name: '헬스케어 · 바이오',
    size: '병원 $9.5B (2024) → $13.4B (2029E)',
    cagr: 'CAGR 6.97%',
    valueChain: [
      { label: '의약품 수입/생산' },
      { label: '병원/클리닉 네트워크' },
      { label: '보험/지급' },
      { label: '디지털 헬스' },
      { label: '게노믹스/정밀의료' },
    ],
    players: [
      { name: 'M42 (G42 Healthcare)', owner: 'Sheikh Tahnoun', revenueUsd: '', marketCapUsd: '', valueChainPosition: '디지털 헬스', note: '게노믹스+AI 진단' },
      { name: 'SEHA (Abu Dhabi Health)', owner: "L'imad/ADQ", revenue: '12개 병원', marketCapUsd: '국영기업', valueChainPosition: '병원 네트워크', note: 'Abu Dhabi 공공의료' },
      { name: 'Mediclinic Middle East', owner: "Mediclinic Int'l", revenue: '7개 병원', marketCapUsd: '$5.7B', valueChainPosition: '병원 네트워크', note: '프리미엄 민간' },
      { name: 'Burjeel Holdings', owner: 'ADX 상장', revenueUsd: '매출 $1.4B', marketCapUsd: '$3.8B', valueChainPosition: '병원 네트워크', note: '83개 시설, 의료관광 핵심' },
      { name: 'Aster DM Healthcare', owner: '인도계', revenueUsd: '매출 $870M', marketCapUsd: '$2.1B', valueChainPosition: '병원 네트워크', note: 'GCC+인도 네트워크' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🛍️ 소비재 & 라이프스타일
  // ═══════════════════════════════════════════════════════════════════════════
  {
    icon: '👗',
    name: '패션 · 럭셔리 · 리테일',
    size: '럭셔리 $4.2B (2024)',
    cagr: 'CAGR 5.5%',
    valueChain: [
      { label: '글로벌 브랜드 소싱' },
      { label: '현지 유통사 독점계약' },
      { label: '몰/백화점/부티크' },
      { label: '이커머스' },
      { label: '소비자' },
    ],
    players: [
      { name: 'Chalhoub Group', owner: 'Chalhoub 가문', revenueUsd: '매출 $3-5B', marketCapUsd: '비상장', valueChainPosition: '유통', note: 'LVMH, Chanel, Dior 독점유통' },
      { name: 'Al Tayer Group', owner: 'Al Tayer 가문', revenueUsd: '매출 $8B', marketCapUsd: '비상장', valueChainPosition: '유통/리테일', note: "Harvey Nichols, Bloomingdale's" },
      { name: 'Majid Al Futtaim', owner: 'MAF Group', revenueUsd: '매출 $9.2B', marketCapUsd: '비상장', valueChainPosition: '리테일/몰', note: 'Carrefour, Mall of Emirates' },
      { name: 'Lulu Hypermarket', owner: 'Yusuff Ali/ADQ', revenueUsd: '매출 $8.4B', marketCapUsd: '$6.5B', valueChainPosition: '리테일', note: '259개 점, ADX 상장' },
      { name: 'Noon.com', owner: 'Emaar/MBR', revenue: '중동 최대 이커머스', marketCapUsd: '비상장', valueChainPosition: '이커머스', note: 'Noon Minutes 퀵커머스' },
    ],
    insight: 'K-Fashion 기회: Chalhoub/Al Tayer = 게이트키퍼. 독자 진출 시 DMCC/DIFC 프리존 활용. 한류 팬층 타겟 D2C도 가능.',
  },
  {
    icon: '💄',
    name: '뷰티 · 화장품 · 퍼스널케어',
    size: '화장품 $395M (2025) → $487M (2030E)',
    cagr: 'CAGR 4.3%',
    valueChain: [
      { label: '브랜드/제조 (수입 90%+)' },
      { label: '유통/물류' },
      { label: '리테일 (백화점/온라인)' },
      { label: '뷰티 살롱/스파' },
      { label: '소비자' },
    ],
    players: [
      { name: 'Chalhoub (Sephora)', owner: 'Chalhoub 가문', revenueUsd: '매출 $3-5B', marketCapUsd: '비상장', valueChainPosition: '유통/리테일', note: "Dior, Chanel, L'Oreal 독점" },
      { name: 'Faces (Al Tayer)', owner: 'Al Tayer 가문', revenue: '~80개점', marketCapUsd: '비상장', valueChainPosition: '리테일', note: '뷰티 편집숍 체인' },
      { name: 'Huda Beauty', owner: 'Huda Kattan', revenueUsd: '매출 $200M+', marketCapUsd: '비상장', valueChainPosition: '브랜드/제조', note: 'Dubai 기반 글로벌 인디 브랜드' },
      { name: 'Paris Gallery', owner: 'UAE 로컬', revenue: '50+매장', marketCapUsd: '', valueChainPosition: '리테일', note: '럭셔리 향수/화장품 리테일' },
    ],
    insight: 'K-Beauty 기회: Olive Young 진출 적기. UAE 소비자 1인당 뷰티 지출 $460+/년 (세계 최고 수준). Chalhoub/Al Tayer 유통 파트너십 or 독자 진출 가능.',
  },
  {
    icon: '🎬',
    name: '엔터테인먼트 · 미디어 · 관광',
    size: '관광 $61.3B (2024)',
    cagr: 'CAGR 11%',
    valueChain: [
      { label: '콘텐츠 제작' },
      { label: '스트리밍/배급' },
      { label: '테마파크/체험' },
      { label: '이벤트/페스티벌' },
      { label: '게이밍/e스포츠' },
    ],
    players: [
      { name: 'Miral (Yas Island)', owner: "L'imad/ADQ", revenueUsd: '$4.1B 투자', marketCapUsd: '국영기업', valueChainPosition: '테마파크', note: 'Ferrari World, Warner Bros, SeaWorld' },
      { name: 'twofour54', owner: 'Abu Dhabi 정부', revenue: '미디어 허브', marketCapUsd: '', valueChainPosition: '콘텐츠 제작', note: 'CNN, Sky News Arabia, MBC 입주' },
      { name: 'DWTC', owner: 'Dubai 정부', revenue: '500+이벤트/년', marketCapUsd: '', valueChainPosition: '이벤트', note: 'GITEX, Gulfood 등 메가 전시' },
      { name: 'VOX Cinemas', owner: 'Majid Al Futtaim', revenue: '600+스크린', marketCapUsd: '비상장', valueChainPosition: '배급', note: 'MENA 최대 시네마 체인' },
      { name: 'Dubai Tourism (DTCM)', owner: 'Dubai 정부', revenue: '방문객 18M+', marketCapUsd: '', valueChainPosition: '관광', note: 'K-Pop 팬 1.8M+ UAE/GCC' },
    ],
    insight: 'K-Entertainment 기회: K-Pop 공연 (Coca-Cola Arena), K-Drama IP 라이선싱, 뷰티+엔터 컬래버.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🦾 방위 & 우주
  // ═══════════════════════════════════════════════════════════════════════════
  {
    icon: '🦾',
    name: '로보틱스 · 우주 · 방위산업',
    size: '방위예산 $23.9B (2025) → $30.2B (2030E)',
    cagr: 'CAGR 4.7%',
    valueChain: [
      { label: 'R&D (ATRC/TIRA)' },
      { label: '방위 제조 (EDGE)' },
      { label: '드론/무인시스템' },
      { label: '위성/우주' },
      { label: '산업 자동화' },
    ],
    players: [
      { name: 'EDGE Group', owner: 'UAE 정부', revenueUsd: '매출 $5B', marketCapUsd: '', valueChainPosition: '방위 제조', note: '세계 22위 방위산업' },
      { name: 'Space42', owner: 'G42 자회사', revenue: '위성 AI', marketCapUsd: '$3.5B', valueChainPosition: '위성/우주', note: 'Bayanat+Yahsat 합병' },
      { name: 'MBRSC', owner: 'Dubai 정부', revenue: 'Hope Probe', marketCapUsd: '', valueChainPosition: '우주', note: 'UAE 화성탐사선, 달 탐사 계획' },
      { name: 'Tawazun (IHC)', owner: 'IHC 자회사', revenue: '방위 투자', marketCapUsd: '', valueChainPosition: '방위 투자', note: '오프셋 프로그램 관리' },
    ],
  },
] as const satisfies ReadonlyArray<Sector>
