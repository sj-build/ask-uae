import type { HotIssueData } from './hot-issues'

export const hotIssues: readonly HotIssueData[] = [
  {
    title: '🧠 AI / Data Centers', titleColor: '#a78bfa', borderColor: '#a78bfa',
    opportunities: [
      'Stargate UAE 5GW: Largest AI infrastructure outside the US. Phase 1 operational by 2026',
      'Microsoft $15.2B + Oracle supercluster + Nvidia GPU supply',
      'Khazna: 70% UAE DC market share, expanding globally (Turkey, France, Italy, Kenya)',
      'G42-OpenAI partnership developing sovereign AI models',
    ],
    risks: [
      'Power shortage: Explosive AI DC demand vs grid capacity limits — government established "Data Center Energy Review Team"',
      'Cooling costs: GPU cooling efficiency drops in 40C+ climate, driving up operating expenses',
      'US chip export controls: Trump administration eased restrictions, but policy uncertainty persists',
      'AI talent gap: Infrastructure exists but severe shortage of local AI engineers to operate it',
    ],
  },
  {
    title: '🏗️ Real Estate', titleColor: '#f59e0b', borderColor: '#f59e0b',
    opportunities: [
      'Dubai 2025 transactions surpassed $185B (+30% YoY)',
      'Population exceeded 4M (up 15% since 2020), with 200K+ annual inflow',
      'Golden Visa 250,000+ issued, strengthening end-user demand',
      'Yields of 5~9% — significantly above London/New York (2~4%)',
    ],
    risks: [
      'Supply glut: 210K units scheduled for 2025~27 (2x the prior 3 years) — ~100K unit delivery peak in 2026 — Fitch: up to 15% correction possible',
      'UBS bubble warning: Real prices at post-2014 highs, bubble risk upgraded for 2 consecutive years',
      'Saudi competition: Riyadh opening foreign real estate purchases from 2026, raising capital outflow concerns',
      'Off-plan at 58% — market volatility risk at delivery',
    ],
  },
  {
    title: '⚡ Energy', titleColor: '#c8a44e', borderColor: '#c8a44e',
    opportunities: [
      'Barakah nuclear plant fully operational: 5.6GW — largest in the Arab world, built by KEPCO (Korea)',
      'XRG launch: ADNOC\'s energy transition subsidiary, $80B+ enterprise value',
      'Masdar 50GW: Growing into a global renewable energy player',
      'ADNOC AI adoption: 30+ AI systems generating $500M in value',
    ],
    risks: [
      'Oil price risk: OPEC+ production cut uncertainty; fiscal pressure if oil stays below $60',
      'DC power demand surge: AI infrastructure absorbing power, straining industrial/residential supply balance',
      'Oil dependency: Non-oil GDP reached 75%, but oil remains the core revenue source',
      'Middle East geopolitics: Strait of Hormuz risk, Iran tensions',
    ],
  },
  {
    title: '💰 Crypto / Fintech', titleColor: '#22d3ee', borderColor: '#22d3ee',
    opportunities: [
      'MGX $2B into Binance: Largest single investment in a crypto company ever',
      'AED Stablecoin: State-backed stablecoin (IHC + ADQ + FAB)',
      'VARA + ADGM: Among the world\'s clearest crypto regulatory frameworks',
      'SWF crypto exposure totaling $4B+ (ADIA, Mubadala Bitcoin ETFs, etc.)',
    ],
    risks: [
      'Zero SWF LP precedent: SWFs invest in crypto directly but have never committed as LPs to crypto funds',
      'Regulatory duality: VARA (Dubai) vs ADGM (Abu Dhabi) regulatory competition creates confusion',
      'FATF gray list: Removed in 2024, but AML/KYC enforcement continues to tighten',
      'US regulatory linkage: SEC policy shifts also impact the UAE crypto ecosystem',
    ],
  },
  {
    title: '🏥 Healthcare / Biotech', titleColor: '#34d399', borderColor: '#34d399',
    opportunities: [
      'M42 (G42 + Mubadala): AI-powered healthcare — genomics, digital medicine',
      'Mandatory health insurance expanding nationwide (2025~), automatically growing the market',
      'Rapid population growth + affluent aging population fuels premium healthcare demand',
      'Growing medical tourism hub (patients from India, Africa, CIS countries)',
    ],
    risks: [
      'Healthcare workforce shortage: Doctors and nurses are almost 100% foreign-dependent',
      'Cost inflation: Insurance premiums rising 10~15% annually, increasing corporate burden',
      'Drug price controls: Government price ceilings squeezing pharmaceutical margins',
      'Data sovereignty: Tightening restrictions on overseas transfer of medical data',
    ],
  },
  {
    title: '🎭 Tourism / Entertainment', titleColor: '#f472b6', borderColor: '#f472b6',
    opportunities: [
      'Wynn casino opening 2026: Paradigm shift for UAE tourism — potential annual GGR of $6~8B',
      'Abu Dhabi tourism: Louvre, Guggenheim (under construction), Yas Island expansion',
      'Dubai Parks: DXB airport handling 90M+ passengers/year, cruise hub growth',
      'E-sports/gaming: AD Gaming established, $6B+ market',
    ],
    risks: [
      'Saudi competition: NEOM, Riyadh Season, Diriyah Gate — surging tourism investment',
      'Casino social backlash: 34% of residents concerned about gambling addiction, 28% about cultural identity',
      'Middle East geopolitics: Tourism drops sharply if regional conflicts escalate',
      'Climate: Summer 45C+ temperatures skew tourism heavily toward peak season (Oct~Apr)',
    ],
  },
  {
    title: '💄 Beauty / Fashion / Luxury', titleColor: '#f472b6', borderColor: '#f472b6',
    opportunities: [
      'UAE beauty market $4.2B growing to $6.8B (2030E), CAGR 8~10%',
      'K-Beauty wave: Halal certification demand + Hallyu cultural influence',
      'Accelerating HNWI inflow — 9,800 millionaires relocating annually',
      'E-commerce: Noon, Namshi growth enabling easier D2C market entry',
    ],
    risks: [
      'Chalhoub/Al Tayer duopoly: Very high barriers to retail distribution entry',
      'Saudi market opening: Vision 2030 positioning Riyadh as a retail hub',
      'Halal certification complexity: Standards vary by country, product reformulation required',
      'Counterfeits: Parallel imports and knockoffs remain pervasive',
    ],
  },
  {
    title: '🛡️ Defense / Space / Robotics', titleColor: '#ef4444', borderColor: '#ef4444',
    opportunities: [
      'EDGE: $5B revenue, entered the global Top 25 defense companies',
      'Space42: G42 + Yahsat merger, AI-powered space communications',
      'Tawazun offset: Defense purchases mandate investment/technology transfer within the UAE',
      'Korean defense: Building on Cheongung-II export success, room for further collaboration',
    ],
    risks: [
      'US technology transfer restrictions: ITAR/EAR regulations limit advanced tech adoption',
      'Yemen conflict fallout: Houthi drone attack experience drives air defense demand, but draws international criticism',
      'Talent: Faisal Al Bannai\'s shift to AI causing talent drain from EDGE',
      'Geopolitical tension: GCC security realignment discussions following the 2025 Doha attack',
    ],
  },
] as const
