import type { CasinoDetail, CasinoSurvey, LiberalizationEvent, CulturalInfra, UnescoItem, GamingMetric, GenZTrend, KWaveCategory, TrendAxis, CreativeIndustryStrategy, FilmMediaHub } from './trends'

export const casinoDetails: readonly CasinoDetail[] = [
  { label: 'First Casino License', value: 'Issued to Wynn Resorts in Oct 2024 (GCGRA)' },
  { label: 'Project', value: 'Wynn Al Marjan Island -- RAK, Al Marjan Island' },
  { label: 'Scale', value: '$5.1B investment, 1,500+ rooms, 47 floors, 21,000m2 casino' },
  { label: 'Expected Opening', value: 'March 2027 (construction underway, $2.4B loan secured)' },
  { label: 'Market Outlook', value: 'GGR $3B-$5B/year, up to $8.5B depending on analyst estimates' },
  { label: 'License Structure', value: 'One casino license possible per emirate (Sharjah not participating)' },
  { label: 'Additional Entrants', value: 'MGM Resorts pursuing additional license, Abu Dhabi/Dubai as candidate locations' },
  { label: 'Online Gaming', value: 'Play971 brand iGaming pilot launched in Abu Dhabi in Nov 2025' },
] as const

export const casinoSurveyData: readonly CasinoSurvey[] = [
  { label: 'RAK resident interest', percentage: 81, color: '#34d399' },
  { label: 'Gambling addiction concern', percentage: 34, color: '#f59e0b' },
  { label: 'Cultural identity preservation demand', percentage: 28, color: '#ef4444' },
] as const

export const casinoInsights: readonly string[] = [
  'UAE legalizing casinos as the first Islamic-culture country = the strongest signal of "accelerating social openness"',
  'Opportunities for Korean companies: casino equipment/technology supply, hospitality services, K-Pop performances, etc.',
  'Projected GDP contribution of up to 1.7% -- ripple effects across the entire tourism/entertainment sector',
  'NIP Group (esports) $40M Abu Dhabi Investment Office deal -- gaming ecosystem expanding',
] as const

export const liberalizationTimeline: readonly LiberalizationEvent[] = [
  { date: '2020.11', change: 'Cohabitation legalized', significance: 'Unmarried couples living together changed from criminal to legal. Includes foreigners/tourists' },
  { date: '2020.11', change: 'Extramarital relations decriminalized', significance: 'Consensual adult relationships removed from criminal prosecution' },
  { date: '2020.11', change: 'Alcohol regulations relaxed', significance: 'Private consumption decriminalized, Abu Dhabi alcohol license simplified' },
  { date: '2020.11', change: 'Suicide/attempted suicide decriminalized', significance: 'Shifted to mental health support approach' },
  { date: '2020.11', change: '"Honor crime" leniency abolished', significance: 'Ended practice of lighter penalties for violence against women' },
  { date: '2022.1', change: 'Weekend changed (Fri-Sat to Sat-Sun)', significance: 'Global business alignment (historic change)' },
  { date: '2024.10', change: 'New Personal Status Law', significance: 'Major reforms in divorce, custody, alimony. Gender equality strengthened. Effective 2025.4.15' },
  { date: '2025.1', change: 'Indefinite contracts abolished', significance: 'All labor contracts converted to fixed-term (worker protection enhanced)' },
  { date: '2025.8', change: 'Ejari regulations relaxed', significance: 'Cohabitant registration requirement effectively abolished' },
] as const

export const liberalizationDrivers: readonly string[] = [
  'Competitive pressure: Direct competition with Saudi Arabia Vision 2030',
  'Talent attraction: Need to attract Western professionals alongside Golden Visa expansion',
  'Tourism targets: Dubai 2040 Urban Master Plan -- population 5.8M, 25M+ annual tourists',
  'Generational shift: UAE median age 31.6, Gen Z/millennials driving consumption and culture',
] as const

export const liberalizationInsights: readonly string[] = [
  'The legal environment is becoming "more liberal than Korea" in certain areas',
  'Living conditions for Korean corporate expatriates/secondees have significantly improved',
  'Gap between official laws and social expectations persists -- legally possible does not always mean culturally welcome',
  'The pace of legal change itself is a business opportunity signal: the regulatory environment is rapidly becoming pro-business',
] as const

export const culturalInfrastructure: readonly CulturalInfra[] = [
  { name: 'Louvre Abu Dhabi', location: 'Saadiyat Island', description: 'World\'s first universal museum Arab edition. Jean Nouvel design', year: '2017', investment: '$1B', status: 'open' },
  { name: 'teamLab Phenomena Abu Dhabi', location: 'Saadiyat Island', description: 'teamLab\'s first permanent Middle East exhibition. 17,000m² immersive digital art', year: '2025', investment: '$350M', status: 'open' },
  { name: 'Natural History Museum Abu Dhabi', location: 'Saadiyat Island', description: '13.8 billion years of cosmic history to Earth life evolution. 35,000m² (largest in region)', year: '2025', investment: '$500M', status: 'open' },
  { name: 'Zayed National Museum', location: 'Saadiyat Island', description: 'UAE founding to present national narrative. 56,000m² national museum', year: '2025', investment: '$600M', status: 'open' },
  { name: 'Guggenheim Abu Dhabi', location: 'Saadiyat Island', description: 'Frank Gehry design, largest Guggenheim globally. Post-1960s West Asian/North African/South Asian art', year: '2026', investment: '$800M', status: 'under-construction' },
  { name: 'Dubai Museum of Art', location: 'Dubai', description: 'Dubai\'s first large-scale art museum (Dubai Creek Harbour)', year: 'TBD', status: 'planned' },
] as const

export const creativeEconomyStrategy: CreativeIndustryStrategy = {
  target: '5% of GDP',
  current: '2.6% of GDP (Dubai)',
  deadline: '2031',
  initiatives: [
    'National Strategy for Cultural & Creative Industries (40 initiatives)',
    'Dubai Creative Economy Strategy: 140,000 creative workforce target (2025)',
    'National Grant Program for Culture and Creativity',
    'Creative Youth mentorship/funding program (DCT)',
    'Cultural freelancer/SME business environment study and policy development',
    'ICOM Dubai 2025: First Middle East International Council of Museums Conference',
  ],
} as const

export const filmMediaHub: FilmMediaHub = {
  name: 'Yas Creative Hub / twofour54',
  operator: 'ADNEC Group',
  facilities: [
    '100+ acre studio complex (2025 completion)',
    '11 soundstages',
    'Exterior water tank for filming',
    '6 standing sets',
    'CNN, National Geographic, MTV resident',
  ],
  incentives: [
    '35%++ cashback rebate (increased from Jan 2025)',
    'First cashback in Middle East (2013)',
    '150+ major productions supported',
    '175+ local crew employment requirement',
  ],
  productions: [
    'F1: The Movie (Brad Pitt, 2025) — Yas Marina Circuit',
    'Now You See Me: Now You Don\'t (2025) — Louvre, Liwa Desert',
    'Mission: Impossible 7 — Abu Dhabi shooting',
  ],
} as const

export const cinemaMilestones: readonly { readonly year: number; readonly revenue: string; readonly tickets: string; readonly films: number }[] = [
  { year: 2024, revenue: 'AED 800M ($218M)', tickets: '15M+', films: 1262 },
] as const

export const unescoItems: readonly UnescoItem[] = [
  { name: 'Al Ayyala (traditional dance)', year: 2025 },
  { name: 'Al Bisht (traditional cloak)', year: 2025 },
  { name: 'Bridal procession', year: 2025 },
  { name: 'Kohl', year: 2025 },
] as const

export const softPowerInitiatives: readonly string[] = [
  'Cultural dialogue activated with strategic partners including France and South Korea',
  'UNESCO + UAE + Iraq: Iraq cultural heritage reconstruction $50.4M (5 years)',
  'Sharjah Art Foundation Middle East cultural production grants',
  'Ministry of Culture National Grant Program',
  'Saadiyat Cultural District = one of world\'s largest single cultural clusters',
] as const

export const culturalInsights: readonly string[] = [
  'Saadiyat Island = Louvre (2017) + Guggenheim (2026) + 4 new museums — $6B+ cultural cluster',
  'Creative industries GDP target 5% (2031) — currently 2.6% (Dubai)',
  'Korean opportunities: K-Art exhibitions, digital art technology, film co-production, cultural content festivals',
  'UAE government seeking "post-oil identity" in culture — high likelihood of government support for culture investments',
  '35% film shooting rebate + 100-acre studio — actively attracting Hollywood productions',
] as const

export const gamingMetrics: readonly GamingMetric[] = [
  { label: 'Global Esports Market', value: '$1.79B (2025), +16.2% YoY' },
  { label: 'Middle East Investment', value: 'NIP Group + ADIO $40M deal (2025 Q1)' },
  { label: 'Saudi Gamers8', value: 'Contributed $90M+ to Saudi economy in 2024' },
  { label: 'Olympic Esports', value: 'IOC + Saudi NOC, Olympic Esports Games 2025 confirmed (12-year agreement)' },
  { label: 'Luxury x Gaming', value: 'Gucci, LV Valorant/LoL campaigns. 347 new brands in H1 2024' },
] as const

export const gamingInsights: readonly string[] = [
  'Korea = birthplace of esports -- very high value in exporting infrastructure/know-how to UAE/GCC',
  'K-Pop x Gaming convergence (aespa avatars, TWICE Roblox -- streaming up 6.4%)',
  "Netflix 'K-Pop Demon Hunters' 80M+ views in 1 month -- proving K-Pop + gaming IP value",
  'UAE young population (31.6 years) + 100% internet penetration = ideal gaming market environment',
] as const

export const genZTrends: readonly GenZTrend[] = [
  {
    trend: 'Plant-based / Fusion Food',
    description: 'Explosive growth of vegan/fusion cafes, health-conscious consumption',
    opportunity: 'K-Food vegan lines, Bibigo plant-based products, etc.',
    icon: '🌱',
  },
  {
    trend: 'Co-working Cafe Culture',
    description: 'Expanding freelancer/remote work, aesthetic + WiFi cafe scene',
    opportunity: 'Korean cafe brands (design + technology)',
    icon: '💻',
  },
  {
    trend: 'Adventure Tourism',
    description: 'Hatta kayaking, Jebel Jais zipline, mangroves -- "nature over malls"',
    opportunity: 'Outdoor brands, experiential content',
    icon: '🏔️',
  },
  {
    trend: 'Thrift / Sustainable Fashion',
    description: 'Vintage pop-ups, rise of sustainable fashion',
    opportunity: 'K-Fashion sustainable brands',
    icon: '♻️',
  },
  {
    trend: 'Mental Wellness',
    description: 'Growing demand for mindfulness, meditation, and mental health apps',
    opportunity: 'Korean wellness apps, K-Beauty wellness lines',
    icon: '🧘',
  },
  {
    trend: 'IV Vitamin Drip',
    description: 'Dubai trending "vitamin IV drip" wellness treatment',
    opportunity: 'Korean aesthetic medical technology',
    icon: '💉',
  },
] as const

export const consumptionShifts: readonly string[] = [
  'Experiences > Ownership: 73% of UAE travelers seek "immersive local cultural experiences" (global highest)',
  'AI Adoption: 75% of UAE/KSA travelers use AI tools for trip planning (global leader)',
  'Social Commerce: Direct purchases via Instagram/TikTok competing with traditional e-commerce',
  'Influencer Economy: Micro-influencers (5K-10K followers) achieve highest engagement rates, government registration mandatory',
] as const

export const kWaveCategories: readonly KWaveCategory[] = [
  {
    category: 'K-Beauty',
    icon: '💄',
    items: [
      'Rapid growth in K-Beauty demand in the UAE beauty market -- multi-step routines, hydration/glow products popular',
      'Olive Young, Sulwhasoo, The History of Whoo = selected as "2025 Korean Wave Luxury Brands"',
      'Korean cosmetics positioned as "high-performance + trendy + reasonably priced"',
    ],
    challenge: 'Halal certification (pork-derived collagen, alcohol ingredients = halal non-compliant)',
  },
  {
    category: 'K-Food',
    icon: '🍜',
    items: [
      '100+ Korean restaurants operating in Dubai',
      'Popular items: kimchi, tteokbokki, Korean fried chicken, Bibigo, Buldak spicy noodles',
      'CJ Bibigo, Nongshim, Ottogi, Orion (Choco Pie) have entered the market',
    ],
    challenge: 'Halal certification = the biggest hurdle',
  },
  {
    category: 'K-Pop & Entertainment',
    icon: '🎵',
    items: [
      'BTS, BLACKPINK = highest recognition among UAE Gen Z',
      "Netflix 'K-Pop Demon Hunters' 80M+ views in 1 month",
      'Samsung, Hyundai Genesis, Kyungdong Navien = "Korean Wave Luxury Brand" industrial sector',
    ],
    challenge: 'K-Pop x Gaming convergence continues as a global trend',
  },
] as const

export const kWaveInsights: readonly string[] = [
  'K-Wave evolving from "entertainment" to "lifestyle brand"',
  'Korean investor context: K-Beauty (halal + clean beauty), K-Food (halal + franchise), K-Entertainment (IP) all expandable to UAE',
  'Halal certification = both a barrier to entry and a competitive advantage -- early movers gain access to the 2 billion Muslim market',
] as const

export const trendDuality: { readonly tradition: TrendAxis; readonly innovation: TrendAxis } = {
  tradition: {
    direction: 'Accelerating tradition preservation',
    items: [
      'UNESCO Intangible Heritage: 4 items inscribed',
      'Federal Cultural Heritage Law legislation underway',
      'Emirati identity preservation programs',
      'Traditional crafts/cultural tourism support',
      'Arabic language/Emirati tradition promotion',
      'Zayed National Museum opening',
    ],
  },
  innovation: {
    direction: 'Accelerating innovation/openness',
    items: [
      'Casino legalization (first in the Middle East)',
      'Cohabitation/extramarital relations decriminalized',
      'Golden Visa: 250,000+ issued',
      'Esports/gaming hub attraction',
      'Gen Z-led wellness/sustainable consumption',
      'AI/digital transformation leadership',
    ],
  },
} as const

export const dualityInsights: readonly string[] = [
  'The UAE is NOT a "conservative Islamic country" (outdated framing)',
  'The UAE is NOT a "fully liberal Western country" either (overcorrection)',
  '= A government-led social transformation that "pursues innovation while respecting tradition" -- predictable and stable',
  'The pace of change is so fast that information even 1-2 years old can be outdated -- regular updates are essential',
] as const
