import type { Bank, IslamicBankingInfo, FinancialHub, FintechRegulation } from './banking'

export const majorBanks: readonly Bank[] = [
  {
    name: 'First Abu Dhabi Bank',
    shortName: 'FAB',
    totalAssets: '$330B+',
    assetsValue: 330,
    type: 'hybrid',
    ownership: 'Mubadala Investment (NBAD + FGB merger)',
    headquarters: 'Abu Dhabi',
    founded: '2017 (merger)',
    characteristics: ['Largest UAE bank', 'Largest in MENA region', 'Actively expanding globally'],
    color: '#c8a44e',
  },
  {
    name: 'Emirates NBD',
    shortName: 'ENBD',
    totalAssets: '$220B+',
    assetsValue: 220,
    type: 'hybrid',
    ownership: 'ICD (Dubai Royal Family)',
    headquarters: 'Dubai',
    founded: '2007',
    characteristics: ['Largest Dubai bank', 'Strong retail banking', 'Acquired DenizBank (Turkey)'],
    color: '#4a9eff',
  },
  {
    name: 'Abu Dhabi Commercial Bank',
    shortName: 'ADCB',
    totalAssets: '$145B+',
    assetsValue: 145,
    type: 'conventional',
    ownership: 'Abu Dhabi Government',
    headquarters: 'Abu Dhabi',
    founded: '1985',
    characteristics: ['3rd largest in UAE', 'Merged with Union National Bank', 'Digital banking leader'],
    color: '#34d399',
  },
  {
    name: 'Mashreq Bank',
    shortName: 'Mashreq',
    totalAssets: '$55B+',
    assetsValue: 55,
    type: 'conventional',
    ownership: 'Al Ghurair Family (Private)',
    headquarters: 'Dubai',
    founded: '1967',
    characteristics: ['Largest private UAE bank', 'Fintech pioneer', 'Strong overseas network'],
    color: '#a78bfa',
  },
  {
    name: 'Dubai Islamic Bank',
    shortName: 'DIB',
    totalAssets: '$80B+',
    assetsValue: 80,
    type: 'islamic',
    ownership: 'ICD (Dubai Royal Family)',
    headquarters: 'Dubai',
    founded: '1975',
    characteristics: ['World\'s first Islamic bank', 'Merged with Noor Bank', 'Islamic finance leader'],
    color: '#22d3ee',
  },
  {
    name: 'Abu Dhabi Islamic Bank',
    shortName: 'ADIB',
    totalAssets: '$50B+',
    assetsValue: 50,
    type: 'islamic',
    ownership: 'Emirates Investment Authority',
    headquarters: 'Abu Dhabi',
    founded: '1997',
    characteristics: ['Largest Islamic bank in Abu Dhabi', 'Emirati customer focus', 'Strong retail presence'],
    color: '#f59e0b',
  },
] as const

export const islamicBankingInfo: readonly IslamicBankingInfo[] = [
  {
    title: 'Market Share',
    content: 'About 25% of UAE banking assets are Islamic financial products. Continuously growing',
    icon: '📊',
  },
  {
    title: 'Core Principles',
    content: 'Prohibition of interest (Riba), risk sharing, real asset-based transactions. Murabaha, Ijara, Sukuk, etc.',
    icon: '📜',
  },
  {
    title: 'Regulatory Body',
    content: 'Higher Sharia Authority under Central Bank of UAE certifies Sharia compliance',
    icon: '🏛️',
  },
  {
    title: 'Business Implications',
    content: 'Understanding Islamic finance is essential. Sharia compliance review is mandatory for installment/lease structure design',
    icon: '💡',
  },
] as const

export const financialHubs: readonly FinancialHub[] = [
  {
    name: 'DIFC',
    fullName: 'Dubai International Financial Centre',
    location: 'Dubai',
    founded: '2004',
    legalSystem: 'English common law-based (independent courts)',
    regulators: ['DFSA (Dubai Financial Services Authority)'],
    keyFeatures: [
      '100% foreign ownership allowed',
      '50-year corporate tax exemption guaranteed',
      'No profit repatriation restrictions',
      'Concentration of global financial institutions',
    ],
    registeredEntities: '5,600+',
    color: '#c8a44e',
  },
  {
    name: 'ADGM',
    fullName: 'Abu Dhabi Global Market',
    location: 'Abu Dhabi (Al Maryah Island)',
    founded: '2015',
    legalSystem: 'English common law-based (independent courts)',
    regulators: ['FSRA (Financial Services Regulatory Authority)'],
    keyFeatures: [
      'Fintech hub orientation',
      'Leading crypto regulatory framework',
      'Strong in asset management/private equity',
      'RegLab (regulatory sandbox) operation',
    ],
    registeredEntities: '2,000+',
    color: '#4a9eff',
  },
] as const

export const fintechRegulations: readonly FintechRegulation[] = [
  {
    topic: 'Cryptocurrency',
    status: 'Regulatory framework established',
    detail: 'VARA (Virtual Assets Regulatory Authority) established (2022). Exchange licenses issued. Global exchanges like Binance, OKX have entered',
  },
  {
    topic: 'Digital Banks',
    status: 'Growing',
    detail: 'Digital-only bank licenses issued to YAP, Zand, etc. Traditional banks also accelerating digital transformation',
  },
  {
    topic: 'Open Banking',
    status: 'Early adoption',
    detail: 'Central Bank\'s open banking framework announced (2023). API standardization in progress',
  },
  {
    topic: 'BNPL (Buy Now Pay Later)',
    status: 'Rapid growth',
    detail: 'Local and regional BNPL services like Tabby, Postpay, Tamara are thriving',
  },
] as const

export const bankingInsights: readonly string[] = [
  'Major banks like FAB, ENBD are government/royalty-owned -- essential partners for government project financing',
  'Understanding Islamic financial products is essential. Consider Sharia-compliant structures for installment sales, leases, and project financing',
  'DIFC/ADGM: Global-standard legal environment. Consider for holding companies, funds, and fintech establishment',
  'Fintech ecosystem is rapidly growing. UAE is suitable as a Middle East expansion base for Korean fintech companies',
] as const
