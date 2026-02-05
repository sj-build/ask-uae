import type { SovereignWealthFund, SWFInsight, GovernanceItem } from './sovereign-wealth'

export const sovereignWealthFunds: readonly SovereignWealthFund[] = [
  {
    name: 'Abu Dhabi Investment Authority',
    shortName: 'ADIA',
    aum: '$1.0T+',
    aumValue: 1000,
    founded: '1976',
    location: 'Abu Dhabi',
    globalRank: '3rd Globally',
    focusAreas: ['Global Equities', 'Bonds', 'Real Estate', 'Infrastructure', 'Alternatives'],
    keyInvestments: ['Globally diversified portfolio', 'Long-term intergenerational wealth preservation'],
    governance: '100% Abu Dhabi government-owned, independently operated',
    color: '#c8a44e',
  },
  {
    name: 'Mubadala Investment Company',
    shortName: 'Mubadala',
    aum: '$300B+',
    aumValue: 300,
    founded: '2002 (Merged with IPIC in 2017)',
    location: 'Abu Dhabi',
    globalRank: '14th Globally',
    focusAreas: ['Technology', 'Aerospace', 'Healthcare', 'Financial Services', 'ICT'],
    keyInvestments: ['GlobalFoundries', 'AMD', 'Softbank Vision Fund', 'Cepsa'],
    governance: 'Khaldoon Al Mubarak (MBZ confidant) serves as CEO',
    color: '#4a9eff',
  },
  {
    name: 'Abu Dhabi Developmental Holding',
    shortName: 'ADQ',
    aum: '$200B+',
    aumValue: 200,
    founded: '2018',
    location: 'Abu Dhabi',
    globalRank: 'Top 20 Globally',
    focusAreas: ['Food/Agriculture', 'Energy/Utilities', 'Healthcare', 'Logistics', 'Tourism'],
    keyInvestments: ['Abu Dhabi Ports', 'ADNEC', 'Etihad Rail', 'Abu Dhabi Health Services'],
    governance: 'Focused on Abu Dhabi domestic strategic industry development',
    color: '#34d399',
  },
  {
    name: 'Investment Corporation of Dubai',
    shortName: 'ICD',
    aum: '$429B',
    aumValue: 429,
    founded: '2006',
    location: 'Dubai',
    globalRank: '9th Globally',
    focusAreas: ['Finance', 'Real Estate', 'Aviation', 'Retail', 'Leisure'],
    keyInvestments: ['Emirates NBD', 'Emirates Airline', 'Dubai World', 'Emaar Properties'],
    governance: 'Dubai Inc. holding company, owned by Sheikh Mohammed bin Rashid',
    color: '#a78bfa',
  },
  {
    name: 'Emirates Investment Authority',
    shortName: 'EIA',
    aum: '$100B+ (est.)',
    aumValue: 100,
    founded: '2007',
    location: 'Abu Dhabi (Federal)',
    globalRank: '-',
    focusAreas: ['Federal surplus management', 'Long-term investments'],
    keyInvestments: ['Undisclosed (federal-level investments)'],
    governance: 'Federally owned, manages UAE-wide surplus',
    color: '#f59e0b',
  },
] as const

export const swfInsights: readonly SWFInsight[] = [
  {
    title: 'Royal Family = Fund',
    content: 'SWF decision-makers = ruling families. ADIA, Mubadala, and ADQ are all under Abu Dhabi royal family (Al Nahyan) control',
    icon: '👑',
  },
  {
    title: 'Intergenerational Wealth',
    content: 'ADIA serves as savings for the post-oil era. Even at 4% annual returns, it can generate ~10% of UAE GDP',
    icon: '🏦',
  },
  {
    title: 'Strategic Industry Development',
    content: 'Mubadala: tech/aerospace, ADQ: domestic infrastructure. Not just profit-seeking, but tools for economic diversification',
    icon: '🎯',
  },
  {
    title: 'Dubai vs Abu Dhabi',
    content: 'ICD (Dubai) vs ADIA/Mubadala/ADQ (Abu Dhabi). Abu Dhabi holds ~80%+ of total SWF assets',
    icon: '⚖️',
  },
] as const

export const governanceStructure: readonly GovernanceItem[] = [
  { label: 'Ultimate Authority', content: 'Abu Dhabi Crown Prince (current UAE President MBZ) holds final decision-making power for most SWFs' },
  { label: 'Board of Directors', content: 'Composed of royal family members and senior government officials. Independent operations delegated to professional management' },
  { label: 'Transparency', content: 'ADIA, ICD, etc. do not disclose AUM. Based on estimates. Only some report to Sovereign Wealth Fund Institute' },
  { label: 'Investment Philosophy', content: 'Long-term investment, political neutrality (on the surface), preference for co-investment with local partners' },
] as const

export const investorTips: readonly string[] = [
  'Co-investment with SWFs is one of the most powerful leverages for entering UAE',
  'Mubadala is most active in tech/startup investments -- numerous collaboration cases with Korean companies',
  'ADQ focuses on food/agriculture/logistics -- opportunities for Korean companies in these sectors',
  'Government-to-government (G2G) channels are highly effective when seeking SWF investment',
] as const
