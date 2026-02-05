import type { EconomicTrendCategory } from './trends'

export const economicTrends: readonly EconomicTrendCategory[] = [
  {
    id: 'non-oil-transition',
    icon: '🔄',
    title: 'Accelerating Non-Oil Transition',
    items: [
      {
        title: 'Non-oil GDP Exceeds 70%',
        description: 'Sharp decline in oil dependence, diversification success visible',
        details: [
          '2023 Non-oil GDP share reached 72% (vs 60% in 2010)',
          'Dubai: Oil GDP share under 1% — virtually oil-free',
          'Abu Dhabi: Non-oil sector growth 9.1% (2023)',
          'GDP growth drivers: Tourism, logistics, finance, real estate',
        ],
        significance: 'Achieved GCC-leading economic diversification, reduced oil price vulnerability',
      },
      {
        title: 'Tourism/Logistics/Finance Hub Strengthening',
        description: 'Three major service industries accelerating',
        details: [
          'Tourism: Dubai 17M+ annual visitors (2023), world #4',
          'Logistics: DP World global #6, Jebel Ali world #9 container port',
          'Finance: ADGM/DIFC assets $190B+, emerging fintech hub',
          'Aviation: Emirates/Etihad global hub role',
        ],
        significance: 'Sustainable growth engines post-oil established',
      },
    ],
  },
  {
    id: 'ai-datacenter',
    icon: '🤖',
    title: 'AI & Data Center Boom',
    items: [
      {
        title: '$100B+ AI Infrastructure Investment',
        description: 'Strategy to become global AI hub',
        details: [
          'Stargate Project: $500B (MGX/SoftBank/OpenAI partnership)',
          'xAI $26B investment, Anthropic $3.5B investment',
          'Khazna data centers: 70%+ UAE market share',
          'Microsoft $1.5B G42 investment → Azure Middle East hub',
        ],
        significance: 'Strategic pivot from oil → AI infrastructure',
      },
      {
        title: 'Microsoft/G42/OpenAI Partnerships',
        description: 'Strategic alliances with global big tech',
        details: [
          'G42: Led by Tahnoun bin Zayed, core of national AI strategy',
          'Microsoft: $1.5B G42 investment + China tech separation condition',
          'Core42: Sovereign cloud + LLM infrastructure provider',
          'Falcon LLM: Open-source LLM development (TII)',
        ],
        significance: 'Balance diplomacy amid US-China tech rivalry + building own capabilities',
      },
    ],
  },
  {
    id: 'swf-diversification',
    icon: '💼',
    title: 'Sovereign Wealth Fund Diversification',
    items: [
      {
        title: 'ADIA/Mubadala Portfolio Transition',
        description: 'Traditional assets → Tech/Healthcare/Entertainment',
        details: [
          'ADIA ($1.18T): Expanding private equity/infrastructure allocation',
          'Mubadala ($330B): Focusing on GlobalFoundries, AMD, biotech',
          "L'imad ($263B): Dual-track local economy + international investment",
          'IHC ($240B): Aggressive M&A-based diversification',
        ],
        significance: 'Long-term revenue diversification, post-oil wealth preservation strategy',
      },
      {
        title: 'Tech/Healthcare/Entertainment Investment Expansion',
        description: 'Pre-empting future growth industries',
        details: [
          'Tech: AI startups, data centers, fintech focus',
          'Healthcare: Cleveland Clinic Abu Dhabi, biotech investments',
          'Entertainment: Media, gaming, sports (Manchester City owners)',
          'Space: UAE Mars mission, satellite industry investment',
        ],
        significance: 'Breaking oil dependence, reshaping global investment portfolio',
      },
    ],
  },
  {
    id: 'digital-dirham',
    icon: '💳',
    title: 'Dirham Digitalization',
    items: [
      {
        title: 'CBUAE Digital Dirham Pilot',
        description: 'CBDC development and international payment innovation',
        details: [
          'mBridge Project: Joint development with BIS/China/Thailand/Hong Kong',
          'Wholesale CBDC: Targeting interbank settlement efficiency',
          'Retail CBDC: Consumer payment phase 2 planned',
          'UAE-Saudi joint CBDC research "Aber" project',
        ],
        significance: 'Reducing dollar settlement dependence, securing yuan payment alternative',
      },
      {
        title: 'Fintech & Payment Innovation',
        description: 'Advancing digital financial infrastructure',
        details: [
          'Aani: Real-time payment system (2024 launch)',
          'CBUAE Fintech Sandbox: Regulatory innovation',
          'Stablecoin regulatory framework under development',
          'Virtual asset regulation: VARA (Dubai), FSRA (ADGM)',
        ],
        significance: 'Global financial hub + digital payment leadership',
      },
    ],
  },
  {
    id: 'cepa-effect',
    icon: '🤝',
    title: 'CEPA Effect',
    items: [
      {
        title: 'Korea-UAE CEPA Effective (Jan 2025)',
        description: 'Expected bilateral trade and investment expansion',
        details: [
          '99%+ Korean goods tariff elimination/reduction',
          'UAE → Korea: Expanded oil/gas/aluminum exports',
          'Korea → UAE: Enhanced auto/electronics/chemical market access',
          'Services/Investment chapters: Finance/construction/healthcare opportunities',
        ],
        significance: 'First GCC FTA partner, strategic economic partnership',
      },
      {
        title: 'Global CEPA Network Expansion',
        description: 'Becoming multilateral trade agreement hub',
        details: [
          'India CEPA (2022): $85B bilateral trade target',
          'Turkey CEPA (2023): Expanded tariff-free trade',
          'Indonesia CEPA (2022): Islamic economy connectivity',
          'Future: Japan, Australia, UK negotiations ongoing',
        ],
        significance: 'Traditional oil exports → multilateral trade partnership diversification',
      },
    ],
  },
  {
    id: 'real-estate-concern',
    icon: '🏠',
    title: 'Real Estate Overheating Concerns',
    items: [
      {
        title: 'Dubai Property Price Surge',
        description: '50%+ increase since 2020, bubble concerns',
        details: [
          '2023 Dubai residential prices up 20%+',
          'Luxury villas: Palm Jumeirah etc. hitting all-time highs',
          'Foreign/Russian capital inflow surge (post-2022 Ukraine war)',
          'Golden Visa effect: Increased demand from long-term residents',
        ],
        significance: 'Experienced 2008 financial crisis crash, soft landing management challenge',
      },
      {
        title: 'Housing Affordability Decline',
        description: 'Rising living cost burden for regular residents',
        details: [
          'Rental increases: 30-50% surge in some areas',
          'Middle class/young professionals exodus concerns',
          'Government response: Partial rent caps implemented',
          'New supply: Major projects completing by 2025',
        ],
        significance: 'Balancing talent attraction competitiveness vs living costs needed',
      },
    ],
  },
] as const
