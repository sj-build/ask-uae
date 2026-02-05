import type { EmirateData } from './emirates'

export const emirates: readonly EmirateData[] = [
  {
    icon: '🏛️', name: 'Abu Dhabi', nameAr: 'أبو ظبي · UAE Capital · 87% of UAE\'s land area',
    subtitle: '', badgeLabel: 'GDP 60%', badgeLevel: 'S', borderColor: '#c8a44e',
    details: [
      'Ruling family: Al Nahyan (since 1761)',
      'Ruler: Sheikh Mohamed bin Zayed = also serves as UAE President',
      'Crown Prince: Sheikh Khaled bin Mohamed (MBZ\'s eldest son, since Mar 2023)',
      'Population: ~3.8M (Emiratis ~500K, 16%)',
      'Area: 67,340 km² (87% of UAE, 67% of South Korea\'s area)',
      'GDP contribution: ~60% of UAE total = ~$320B',
      'Oil reserves: 96% of UAE total = 6th largest globally',
      'SWF: ADIA $1.18T + Mubadala $330B + L\'imad $263B + IHC $240B',
      'Key trait: Funds ~70% of the federal budget. Effectively the emirate that bankrolls the UAE',
      'Analogy: The political center and economic engine combined',
    ],
  },
  {
    icon: '✨', name: 'Dubai', nameAr: 'دبي · Commercial Capital · Global Hub',
    subtitle: '', badgeLabel: 'GDP 26%', badgeLevel: 'A', borderColor: '#ef4444',
    details: [
      'Ruling family: Al Maktoum (since 1833)',
      'Ruler: Sheikh Mohammed bin Rashid (MBR) = also UAE Vice President & Prime Minister',
      'Crown Prince: Sheikh Hamdan bin Mohammed (Fazza, since 2008)',
      'Population: ~3.81M (Emiratis ~270K, 6% — 94% are foreigners)',
      'Area: 4,114 km² (6.8x the size of Seoul)',
      'GDP contribution: ~26% of UAE = ~$140B',
      'Oil: Almost none — pivoted early to a non-oil economy',
      'SWF: ICD ~$429B',
      'Key trait: Tourism, finance, logistics, real estate. Built on brand power without oil. Received $25B bailout from Abu Dhabi during 2009 debt crisis — effectively subordinate to Abu Dhabi',
      'Analogy: The commercial city with higher global recognition than the capital',
    ],
  },
  {
    icon: '📚', name: 'Sharjah', nameAr: 'الشارقة · Cultural Capital · Islamic Culture Hub',
    subtitle: '', badgeLabel: 'GDP 8%', badgeLevel: 'B', borderColor: '#4a9eff',
    details: [
      'Ruling family: Al Qasimi (since 1600, oldest ruling family among the 7)',
      'Ruler: Sheikh Sultan bin Mohammed Al Qasimi (since 1972, 53 years of rule!)',
      'Population: ~1.8M · Area: 2,590 km²',
      'Key trait: UNESCO Cultural Capital. Total alcohol ban (completely different atmosphere from neighboring Dubai). University district, manufacturing base. Serves as a bedroom community for Dubai commuters',
      'Analogy: Cultural heritage city + industrial zone + suburban commuter area',
    ],
  },
  {
    icon: '🏖️', name: 'Ras Al Khaimah', nameAr: 'رأس الخيمة · Manufacturing + Tourism Growth Story',
    subtitle: '', badgeLabel: 'GDP 3%', badgeLevel: 'C', borderColor: '#a78bfa',
    details: [
      'Ruling family: Al Qasimi (a separate branch of the same family as Sharjah)',
      'Ruler: Sheikh Saud bin Saqr Al Qasimi (since 2010)',
      'Population: ~400K · Area: 1,684 km²',
      'Key trait: Wynn Al Marjan Island (casino resort, $3.9B, opening 2027) — the Middle East\'s first legal casino. RAK Ceramics (one of the world\'s largest tile manufacturers), 3 free trade zones. One of the fastest-growing emirates',
      'Analogy: Tourism + special zone experimentation, different regulations from the mainland',
    ],
  },
  {
    icon: '🏘️', name: 'Ajman', nameAr: 'عجمان · Smallest Emirate (by area)',
    subtitle: '', badgeLabel: 'GDP 1.5%', badgeLevel: 'C', borderColor: '#22d3ee',
    details: [
      'Ruling family: Al Nuaimi',
      'Ruler: Sheikh Humaid bin Rashid Al Nuaimi (since 1981, 44 years)',
      'Population: ~500K · Area: 259 km² (half the size of Seoul)',
      'Key trait: Smallest emirate in the UAE. Affordable housing draws Dubai commuters. Has a free trade zone. SME-focused economy',
      'Analogy: An outer suburban bedroom community in the capital metro area',
    ],
  },
  {
    icon: '⛰️', name: 'Fujairah', nameAr: 'الفجيرة · Only East Coast Emirate',
    subtitle: '', badgeLabel: 'GDP 1%', badgeLevel: 'C', borderColor: '#f59e0b',
    details: [
      'Ruling family: Al Sharqi',
      'Ruler: Sheikh Hamad bin Mohammed Al Sharqi (since 1974, 51 years)',
      'Population: ~260K · Area: 1,166 km²',
      'Key trait: The only emirate on the Gulf of Oman coast. Strategically located oil export port bypassing the Strait of Hormuz. Terminus of ADNOC\'s crude oil pipeline',
      'Analogy: Industrial port city + strategic coastal position',
    ],
  },
  {
    icon: '🐚', name: 'Umm Al Quwain', nameAr: 'أم القيوين · Quietest Emirate',
    subtitle: '', badgeLabel: 'GDP 0.5%', badgeLevel: 'C', borderColor: '#4b5563',
    details: [
      'Ruling family: Al Mualla',
      'Ruler: Sheikh Saud bin Rashid Al Mualla (since 2009)',
      'Population: ~50K (0.5% of UAE total) · Area: 777 km²',
      'Key trait: Smallest population, archaeological sites (Al Dur), 1 free trade zone. Quiet, rural atmosphere',
      'Analogy: A tranquil coastal small town',
    ],
  },
] as const
