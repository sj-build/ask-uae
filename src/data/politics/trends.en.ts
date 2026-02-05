import type { TrendCategory } from './trends'

export const politicalTrends: readonly TrendCategory[] = [
  {
    id: 'succession',
    icon: '👑',
    title: 'MBZ Succession Planning — Historic Turning Point',
    items: [
      {
        title: '⚠️ Shift from Brother to Son Succession',
        description: 'Historic transition from traditional "lateral succession" to "lineal succession"',
        details: [
          'Traditional: Arab monarchies pass power brother→brother (lateral succession)',
          'Change: MBZ appointed eldest son Khaled as Crown Prince (March 2023)',
          '10-month internal consensus: Required negotiations with 5 full brothers (Bani Fatima)',
          'Saudi influence: MBS also abandoned lateral succession → moved to lineal',
          'Power fracture risk: Brothers\' potential discontent → compensated with key positions',
        ],
        significance: 'Power centralization + generational shift, but latent inter-sibling tensions',
      },
      {
        title: 'Rise of Sheikh Khaled bin Mohamed',
        description: 'MBZ\'s eldest son, Abu Dhabi Crown Prince (appointed March 2023)',
        details: [
          'L\'imad Holding (formerly ADQ) Chairman — $263B AUM',
          'Abu Dhabi Executive Council Chairman',
          'Early 40s, Oxford/Sandhurst educated',
          'Khaldoon Al Mubarak on L\'imad board → generational transition bridge',
        ],
        significance: 'Building practical experience, preparing for leadership transition in 5-10 years',
      },
      {
        title: 'Sheikh Tahnoun\'s Power — "Compensating the Brothers"',
        description: 'MBZ\'s brother, National Security Advisor — passed over for Crown Prince but controls real power',
        details: [
          'ADIA Chairman ($1.18T) + G42 Chairman + FAB Chairman',
          'MGX founding support → leading AI/tech investments',
          'Royal Group → 61% IHC control → $240B market cap',
          'Mansour (MBZ brother): Promoted to Vice President, Man City owner',
          'Hazza (MBZ brother): Appointed Abu Dhabi Deputy Ruler',
        ],
        significance: 'Supporting Crown Prince Khaled while controlling economic levers — mechanism to maintain brother loyalty',
      },
    ],
  },
  {
    id: 'saudi-relations',
    icon: '🤝',
    title: 'UAE-Saudi Competition/Cooperation Dynamics',
    items: [
      {
        title: 'Intensifying Economic Competition',
        description: 'Vision 2030 vs We the UAE 2031',
        details: [
          'Saudi: Riyadh HQ mandate → pressuring multinationals "Riyadh or no business"',
          'UAE: Defending Dubai\'s hub status + Abu Dhabi finance/tech investments',
          'Tourism: Saudi Red Sea/Neom vs UAE\'s existing infrastructure',
          'OPEC+: Production quota conflicts (UAE seeking increase vs Saudi-led cuts)',
        ],
        significance: 'Intra-GCC hegemony competition, but united front against West',
      },
      {
        title: 'Security/Diplomatic Cooperation',
        description: 'Iran containment, Yemen intervention, US relations',
        details: [
          'Yemen War: UAE supports southern separatists vs Saudi backs Hadi government → tension',
          'Iran: Both contain but UAE maintains economic ties (re-exports)',
          'Abraham Accords: UAE led → Saudi watching',
          'US Relations: Both competitively pursuing US defense/tech partnerships',
        ],
        significance: 'Avoiding open conflict, but diverging interests increasing',
      },
    ],
  },
  {
    id: 'regional-influence',
    icon: '🌍',
    title: 'Regional Influence Expansion',
    items: [
      {
        title: 'BRICS Membership (January 2024)',
        description: 'Multipolar strategy beyond the West',
        details: [
          'Economic bloc with China/Russia/India/Brazil/South Africa',
          'Joined alongside Saudi, Iran, Egypt, Ethiopia',
          'Participating in dollar hegemony alternative discussions',
          'Potential expansion of yuan-denominated settlements',
        ],
        significance: 'Diversifying from US-centric approach, enhancing bargaining power',
      },
      {
        title: 'Abraham Accords Leverage',
        description: 'Israel normalization (August 2020)',
        details: [
          'Trade: UAE-Israel bilateral trade $2.5B+ (2023)',
          'Investment: Abu Dhabi SWFs → Israeli tech investments',
          'Security: Intelligence sharing, cyber cooperation',
          'Tourism: Direct flights, 300K+ annual travelers',
        ],
        significance: 'GCC first, pursuing pragmatic gains while sidelining Palestinian issue',
      },
      {
        title: 'Africa Expansion',
        description: 'DP World, investments, diplomacy',
        details: [
          'DP World: Expanding East/West African port operations',
          'Agriculture: Egypt, Sudan, Morocco farmland investments',
          'Security: Libya, Somalia, Eritrea relationships',
          'Investment: Infrastructure, telecom, energy across Africa',
        ],
        significance: 'First-mover advantage vs GCC competitors in Africa',
      },
    ],
  },
  {
    id: 'government-restructuring',
    icon: '🏛️',
    title: 'Government Restructuring Trends',
    items: [
      {
        title: 'Ministry Consolidation & Efficiency',
        description: 'Smaller government, faster decisions',
        details: [
          '2023-2024 Cabinet reshuffle: Some ministries merged',
          'ADQ → L\'imad rebranding (Jan 2026): Next-generation image',
          'EGA + Dubal merger → Emirates Global Aluminium',
          'Expanded state enterprise IPOs: DEWA, ADNOC Drilling, Salik, etc.',
        ],
        significance: 'Reducing bureaucracy, introducing private sector efficiency',
      },
      {
        title: 'Digital Government Acceleration',
        description: 'AI strategy, smart services',
        details: [
          'World\'s first AI Minister position (2017)',
          'ChatGPT app adopted as official government channel',
          '90%+ government services online',
          'G42/Core42 building government AI infrastructure',
        ],
        significance: 'Administrative efficiency despite small population',
      },
    ],
  },
  {
    id: 'economic-diplomacy',
    icon: '💼',
    title: 'Economic Diplomacy Shifts',
    items: [
      {
        title: 'AI Infrastructure Hub Strategy',
        description: 'Stargate, MGX, G42-centric',
        details: [
          'OpenAI Stargate $500B partnership (SoftBank/Oracle/MGX)',
          'xAI $26B investment, Anthropic $3.5B investment',
          'Khazna data centers: 70%+ UAE market share',
          'Microsoft $1.5B G42 investment attracted',
        ],
        significance: 'Strategic pivot from oil → AI infrastructure',
      },
      {
        title: 'CEPA Network Expansion',
        description: 'Comprehensive Economic Partnership Agreements',
        details: [
          'India CEPA (2022): $85B bilateral trade target',
          'Turkey CEPA (2023): Expanded tariff-free trade',
          'Indonesia CEPA (2022): Islamic economy connectivity',
          'South Korea CEPA under negotiation',
        ],
        significance: 'Diversifying from traditional oil exports → multilateral trade partnerships',
      },
      {
        title: 'Green Energy Leadership',
        description: 'COP28 hosting, energy transition investments',
        details: [
          'COP28 President: Dr. Sultan Al Jaber (ADNOC CEO)',
          'Masdar: $30B clean energy investment plan',
          '2050 Net Zero declaration (GCC first)',
          'XRG (ADNOC spinoff): Low-carbon energy $80B+',
        ],
        significance: 'Claiming climate leadership while being oil producer — pragmatic transition',
      },
    ],
  },
] as const
