export const NEWS_KEYWORD_PACK = {

  // -----------------------------
  // EN — Google News RSS
  // -----------------------------
  google_news_rss_en: {

    // UAE 현지 뉴스 — 주요 영어 미디어에서 UAE 관련 기사 (10 queries)
    uae_local: {
      always_on: [
        // Broad UAE coverage
        '"Abu Dhabi" economy OR investment OR policy',
        '"Dubai" business OR economy OR government',
        'UAE government policy OR reform OR cabinet',

        // Key entities (consolidated)
        'ADNOC OR Masdar OR "DP World"',
        'Mubadala OR ADIA OR ADQ investment',
        'G42 AI OR "UAE data center" OR Stargate',
        'Emirates airline OR Etihad',

        // Major sectors
        'Abu Dhabi sovereign wealth fund',
        'Dubai real estate OR fintech OR VARA',
        'UAE diversification OR industrial strategy OR D33',
      ] as const,
    },

    // Deal/investment signals (no Korea overlap, 10 queries)
    deal: {
      always_on: [
        // Capital / Policy / Platforms
        'ADGM OR DIFC venture capital fund',
        'Hub71 startup OR accelerator',
        'Abu Dhabi Finance Week OR ADFW',

        // AI / Infra / Tech
        'sovereign AI UAE OR robotics',
        'UAE healthcare AI OR medical tourism',

        // Beauty / Consumer
        'dermocosmetics OR Chalhoub beauty UAE',

        // Web3 / Finance
        'UAE stablecoin OR "digital dirham" OR CBDC',
        'VARA regulation crypto',
        'tokenization ADGM OR DIFC',

        // Dubai Future
        'Dubai Future Foundation OR Museum',
      ] as const,
    },

    // Korea-UAE (tightened — compound queries only)
    korea_uae: {
      always_on: [
        '"Korea" "UAE" investment OR partnership OR MOU',
        '"Korean company" UAE',
        'KEPCO UAE OR "Abu Dhabi"',
        'Samsung Engineering UAE',
        'Hyundai UAE OR "Abu Dhabi"',
        '"K-beauty" UAE OR Dubai OR "Abu Dhabi"',
        '"K-pop" UAE OR Dubai concert',
        'Barakah nuclear Korea',
        'Korea UAE CEPA trade',
      ] as const,
    },

    macro: {
      always_on: [
        'UAE economic policy',
        'UAE regulation reform',
        'UAE foreign policy',
        'UAE central bank policy',
        'UAE interest rate',
        'UAE inflation',
      ] as const,
    },

    noise_filters_suggested: [
      'luxury villa',
      'mortgage rate',
      'brent crude price',
      'football transfer',
      'cricket',
      'weather forecast',
      'visa application how to',
      'best restaurants',
      'hotel review',
    ] as const,
  },

  // -----------------------------
  // KO — Naver Search API
  // -----------------------------
  naver_search_ko: {
    deal: {
      always_on: [
        // 국부펀드 / 플랫폼
        '아부다비 국부펀드 투자',
        '무바달라 ADIA ADQ 투자',
        'ADGM 허브71 펀드',

        // AI / 테크
        'UAE AI 데이터센터 G42',

        // K-Beauty / 헬스케어
        'UAE K뷰티 한국 화장품',
        'UAE 의료관광',

        // 크립토/금융
        'UAE 스테이블코인 VARA',
        'ADGM 토큰증권',
      ] as const,
    },

    // Korea-UAE (tightened)
    korea_uae: {
      always_on: [
        '한국 UAE 투자 협력',
        '한국 기업 UAE 진출',
        '한국 UAE MOU 체결',
        'UAE 한국 스타트업 투자',
        '바라카 원전 한국',
        '한화 UAE',
        '삼성엔지니어링 UAE',
        '현대건설 UAE',
        'SK UAE',
        'K뷰티 중동 진출',
        'K팝 두바이 콘서트',
      ] as const,
    },

    macro: {
      always_on: [
        'UAE 경제정책',
        'UAE 산업정책',
        'UAE 규제 개편',
        'UAE 내각 결정',
        '두바이 D33',
        '아부다비 경제 비전',
        'UAE 중앙은행',
      ] as const,
    },
  },
} as const
