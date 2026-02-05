import type { Sector } from '@/types/sector'

// Data Sources:
// - AI: Statista AI Market Forecast UAE (2024)
// - Data Centers: Arizton UAE Data Center Market Report (2024)
// - Healthcare: Statista Hospitals UAE, Nexdigm Healthcare Report (2024)
// - Beauty: Mordor Intelligence UAE Cosmetic Products (2025)
// - Tourism: UAE Ministry of Economy, WTTC (2024)
// - Fintech: Mordor Intelligence UAE Fintech (2024)
// - Real Estate: Dubai Land Department, Abu Dhabi Real Estate (2024)
// - Energy: IMARC UAE Renewable Energy (2024)
// - Luxury: IMARC UAE Luxury Goods, Chalhoub Group (2024)
// - Defense: GlobalData UAE Defense (2025)
// - Stock Market: ADX, DFM Official Data (2024)

export const sectors: readonly Sector[] = [
  {
    icon: '🤖',
    name: 'AI · Technology · Data Centers',
    size: 'AI $950M (2024) → $4.3B (2030E) · DC $1.3B (2024) → $3.3B (2030E)',
    cagr: 'AI CAGR 28.5% · DC CAGR 17.6%',
    valueChain: [
      { label: 'Semiconductor/chip imports' },
      { label: 'Data center infrastructure' },
      { label: 'Cloud/AI platforms' },
      { label: 'AI models/services' },
      { label: 'Industry applications (finance/healthcare/logistics)' },
    ],
    players: [
      { name: 'G42 / Core42', owner: 'Sheikh Tahnoun', revenue: '24,000 employees', marketCapUsd: 'N/A (private)', valueChainPosition: 'AI platform', note: 'Falcon LLM, Cerebras partner' },
      { name: 'Khazna Data Centers', owner: 'G42 subsidiary', revenue: 'UAE DC 70%+', marketCapUsd: 'N/A', valueChainPosition: 'DC infrastructure', note: 'Dominant market share' },
      { name: 'MGX', owner: 'G42+Mubadala', revenueUsd: '$50B+ AUM', marketCapUsd: 'N/A (investment firm)', valueChainPosition: 'AI investment', note: 'OpenAI, xAI, Anthropic investments' },
      { name: 'Presight AI', owner: 'G42 (ADX listed)', revenueUsd: '$180M', marketCapUsd: '$4.2B', valueChainPosition: 'AI services', note: 'Government/security big data analytics' },
      { name: 'Stargate UAE', owner: 'G42+OpenAI+SoftBank', revenueUsd: '$500B global', marketCapUsd: 'N/A (JV)', valueChainPosition: 'DC infrastructure', note: '5GW AI campus, 200MW Phase 1 in 2026' },
      { name: 'e& (Etisalat)', owner: 'Abu Dhabi government 60%', revenueUsd: '$14.7B', marketCapUsd: '$58B', valueChainPosition: 'Cloud/telecom', note: '5G, cloud, AI services' },
    ],
  },
  {
    icon: '🏥',
    name: 'Healthcare · Biotech',
    size: 'Hospitals $9.5B (2024) → $13.4B (2029E) · Total healthcare ~$22B',
    cagr: 'CAGR 6.97%',
    valueChain: [
      { label: 'Pharmaceutical imports/production' },
      { label: 'Hospital/clinic networks' },
      { label: 'Insurance/payments' },
      { label: 'Digital health' },
      { label: 'Genomics/precision medicine' },
    ],
    players: [
      { name: 'M42 (G42 Healthcare)', owner: 'Sheikh Tahnoun', revenueUsd: 'N/A', marketCapUsd: 'N/A', valueChainPosition: 'Digital health', note: 'Genomics + AI diagnostics' },
      { name: 'SEHA (Abu Dhabi Health)', owner: "L'imad/ADQ", revenue: '12 hospitals', marketCapUsd: 'N/A (state-owned)', valueChainPosition: 'Hospital network', note: 'Abu Dhabi public healthcare' },
      { name: 'Mediclinic Middle East', owner: "Mediclinic Int'l", revenue: '7 hospitals', marketCapUsd: '$5.7B (parent)', valueChainPosition: 'Hospital network', note: 'Premium private healthcare' },
      { name: 'Burjeel Holdings', owner: 'ADX listed', revenueUsd: '$1.4B', marketCapUsd: '$3.8B', valueChainPosition: 'Hospital network', note: '83 facilities, key medical tourism player' },
      { name: 'NMC Health (under restructuring)', owner: 'Creditors', revenue: 'Under restructuring', marketCapUsd: 'N/A', valueChainPosition: 'Hospital network', note: 'Restructuring after $6.6B debt fraud' },
      { name: 'Aster DM Healthcare', owner: 'Indian-origin', revenueUsd: '$870M', marketCapUsd: '$2.1B', valueChainPosition: 'Hospital network', note: 'GCC + India network' },
    ],
  },
  {
    icon: '💄',
    name: 'Beauty · Cosmetics · Personal Care',
    size: 'Cosmetics $395M (2025) → $487M (2030E) · Beauty+Personal care $1.9B',
    cagr: 'CAGR 4.3%',
    valueChain: [
      { label: 'Brand/manufacturing (90%+ imported)' },
      { label: 'Distribution/logistics' },
      { label: 'Retail (department stores/online)' },
      { label: 'Beauty salons/spas' },
      { label: 'Consumers' },
    ],
    players: [
      { name: 'Chalhoub (Sephora)', owner: 'Chalhoub family', revenueUsd: '$3-5B group', marketCapUsd: 'N/A (private)', valueChainPosition: 'Distribution/retail', note: "Dior, Chanel, L'Oreal exclusive" },
      { name: 'Faces (Al Tayer)', owner: 'Al Tayer family', revenue: '~80 stores', marketCapUsd: 'N/A (private)', valueChainPosition: 'Retail', note: 'Multi-brand beauty retail chain' },
      { name: 'Huda Beauty', owner: 'Huda Kattan', revenueUsd: '$200M+', marketCapUsd: 'N/A (private)', valueChainPosition: 'Brand/manufacturing', note: 'Dubai-based global indie brand' },
      { name: 'Noon (Beauty)', owner: 'Emaar/MBR', revenue: 'MENA Amazon', marketCapUsd: 'N/A (private)', valueChainPosition: 'E-commerce', note: 'Rapidly growing online beauty segment' },
      { name: 'Paris Gallery', owner: 'UAE local', revenue: '50+ stores', marketCapUsd: 'N/A', valueChainPosition: 'Retail', note: 'Luxury perfume/cosmetics retail' },
    ],
    insight: 'K-Beauty opportunity: Ideal timing for Olive Young entry. UAE consumers spend $460+/year per capita on beauty (among the highest globally). Chalhoub/Al Tayer distribution partnership or independent entry possible. Noon online channel viable.',
  },
  {
    icon: '🎬',
    name: 'Entertainment · Media · Tourism',
    size: 'Tourism $61.3B (2024) · Visitor spending $70B · Dubai 18.7M visitors',
    cagr: 'CAGR 11%',
    valueChain: [
      { label: 'Content production' },
      { label: 'Streaming/distribution' },
      { label: 'Theme parks/experiences' },
      { label: 'Events/festivals' },
      { label: 'Gaming/esports' },
    ],
    players: [
      { name: 'Miral (Yas Island)', owner: "L'imad/ADQ", revenueUsd: '$4.1B invested', marketCapUsd: 'N/A (state-owned)', valueChainPosition: 'Theme parks', note: 'Ferrari World, Warner Bros, SeaWorld' },
      { name: 'twofour54', owner: 'Abu Dhabi government', revenue: 'Media hub', marketCapUsd: 'N/A', valueChainPosition: 'Content production', note: 'CNN, Sky News Arabia, MBC tenants' },
      { name: 'DWTC', owner: 'Dubai government', revenue: '500+ events/year', marketCapUsd: 'N/A', valueChainPosition: 'Events', note: 'GITEX, Gulfood and other mega exhibitions' },
      { name: 'VOX Cinemas', owner: 'Majid Al Futtaim', revenue: '600+ screens', marketCapUsd: 'N/A (private)', valueChainPosition: 'Streaming/distribution', note: 'MENA\'s largest cinema chain' },
      { name: 'AD Gaming (ADG)', owner: 'Abu Dhabi government', revenue: 'Esports hub', marketCapUsd: 'N/A', valueChainPosition: 'Gaming', note: 'Blast Premier, gaming visa program' },
      { name: 'Dubai Tourism (DTCM)', owner: 'Dubai government', revenue: '18M+ visitors', marketCapUsd: 'N/A', valueChainPosition: 'Tourism', note: '1.8M+ K-Pop fans in UAE/GCC' },
    ],
    insight: 'K-Entertainment opportunity: K-Pop concerts (Coca-Cola Arena 5,000-10,000 seats), K-Drama IP licensing, beauty + entertainment collaborations (MCN).',
  },
  {
    icon: '₿',
    name: 'Fintech · Crypto · Digital Assets',
    size: 'Fintech $3.0B (2024) → $6.4B (2030E) · Crypto trading $25B+',
    cagr: 'CAGR 13.8%',
    valueChain: [
      { label: 'Regulation (VARA/ADGM/CBUAE)' },
      { label: 'Infrastructure (blockchain/DC)' },
      { label: 'Exchanges/payments' },
      { label: 'Stablecoins/DeFi' },
      { label: 'Asset tokenization/RWA' },
    ],
    players: [
      { name: 'Binance (VARA license)', owner: 'CZ/MGX $2B', revenueUsd: '$12B+ (global)', marketCapUsd: '$80B+ (est.)', valueChainPosition: 'Exchange', note: 'Dubai HQ, VASP license' },
      { name: 'Phoenix Group', owner: 'IHC', revenueUsd: '$370M IPO', marketCapUsd: '$2.8B', valueChainPosition: 'Infrastructure/mining', note: '500MW BTC mining, ADX listed' },
      { name: 'AED Stablecoin', owner: 'IHC+ADQ+FAB', revenueUsd: '$120M investment', marketCapUsd: 'N/A', valueChainPosition: 'Stablecoin', note: 'ADI Foundation L2 blockchain' },
      { name: 'VARA', owner: 'Dubai government', revenue: '~23 VASPs', marketCapUsd: 'N/A (regulator)', valueChainPosition: 'Regulation', note: 'World\'s first dedicated crypto regulator' },
      { name: 'ADGM/FSRA', owner: 'Abu Dhabi', revenue: 'Pioneer since 2018', marketCapUsd: 'N/A (regulator)', valueChainPosition: 'Regulation', note: 'RegLab, Kraken chose ADGM' },
      { name: 'DMCC Crypto Centre', owner: 'Dubai government', revenue: '650+ crypto firms', marketCapUsd: 'N/A', valueChainPosition: 'Infrastructure', note: '12 license types' },
    ],
    insight: 'Key points: AED stablecoin as state-backed project (IHC+ADQ+FAB), ADGM fund license framework, Phoenix Group → IHC → Tahnoun connection.',
  },
  {
    icon: '🏗️',
    name: 'Real Estate · Construction',
    size: 'UAE total transactions $243B (2024) · Dubai $207B · Abu Dhabi $21.6B',
    cagr: 'Transaction volume +36% YoY (Dubai)',
    valueChain: [
      { label: 'Land development/master planning' },
      { label: 'Construction (Samsung Engineering, etc.)' },
      { label: 'Developers' },
      { label: 'Brokers/agents' },
      { label: 'Proptech/management' },
    ],
    players: [
      { name: 'Emaar Properties', owner: 'ICD/Dubai government', revenueUsd: '$9.5B', marketCapUsd: '$22B', valueChainPosition: 'Developer', note: 'Burj Khalifa, Dubai Mall' },
      { name: 'Aldar Properties', owner: 'Mubadala 25%', revenueUsd: '$4.5B', marketCapUsd: '$14B', valueChainPosition: 'Developer', note: 'Abu Dhabi\'s #1 developer' },
      { name: 'DAMAC', owner: 'Hussain Sajwani', revenueUsd: '$6.7B', marketCapUsd: '$10B', valueChainPosition: 'Developer', note: 'Trump brand partner' },
      { name: 'Nakheel', owner: 'Dubai government', revenue: 'Palm Jumeirah', marketCapUsd: 'N/A', valueChainPosition: 'Developer', note: 'Merged with Dubai Holding' },
      { name: 'Modon (formerly Eagle Hills)', owner: 'IHC subsidiary', revenueUsd: '$5.5B+', marketCapUsd: 'N/A', valueChainPosition: 'Developer', note: 'Saadiyat, Yas Bay development' },
    ],
  },
  {
    icon: '⚡',
    name: 'Energy · Oil & Gas · Renewables',
    size: 'Renewables $4.8B (2024) → $12B (2033E) · RE capacity 7.3GW (2025)',
    cagr: 'RE CAGR 10.8%',
    valueChain: [
      { label: 'Crude oil/gas production' },
      { label: 'Refining/petrochemicals' },
      { label: 'Transmission/distribution infrastructure' },
      { label: 'Renewables (solar/wind)' },
      { label: 'Hydrogen/nuclear' },
    ],
    players: [
      { name: 'ADNOC', owner: 'Abu Dhabi government', revenueUsd: '$49.7B', marketCapUsd: '$90B+ (partially listed)', valueChainPosition: 'Upstream - E&P', note: 'World\'s 12th largest oil reserves, $30B+ Korean contracts' },
      { name: 'XRG', owner: 'ADNOC spinoff', revenueUsd: 'N/A (newly formed)', marketCapUsd: '$80B+ (est.)', valueChainPosition: 'Low-carbon energy', note: 'Energy transition investment vehicle' },
      { name: 'Masdar', owner: 'Mubadala+ADNOC+TAQA', revenue: '50GW RE', marketCapUsd: 'N/A', valueChainPosition: 'Renewables', note: '100GW target by 2030' },
      { name: 'Barakah Nuclear', owner: 'ENEC/built by KEPCO', revenue: '5.6GW', marketCapUsd: 'N/A', valueChainPosition: 'Nuclear', note: 'Korean $23.8B contract (first Arab nuclear plant)' },
      { name: 'TAQA', owner: 'Abu Dhabi government 74%', revenueUsd: '$15.4B', marketCapUsd: '$28B', valueChainPosition: 'Utility', note: 'Water/electricity utility' },
      { name: 'DEWA', owner: 'ICD/Dubai', revenueUsd: '$8B', marketCapUsd: '$23B', valueChainPosition: 'Utility', note: 'Mohammed bin Rashid Solar Park (5GW)' },
    ],
    insight: 'Korean leverage: KEPCO Barakah $23.8B + Samsung Engineering $8B+ + SK E&C $1.2B = $30B+ Korean energy footprint in the UAE. A foundation for building trust with Korean investors.',
  },
  {
    icon: '👗',
    name: 'Fashion · Luxury · Retail',
    size: 'Luxury $4.2B (2024) · GCC Luxury $12.8B (UAE 48.6% share)',
    cagr: 'CAGR 5.5%',
    valueChain: [
      { label: 'Global brand sourcing' },
      { label: 'Local distributor exclusive contracts' },
      { label: 'Malls/department stores/boutiques' },
      { label: 'E-commerce (Noon/Namshi)' },
      { label: 'Consumers' },
    ],
    players: [
      { name: 'Chalhoub Group', owner: 'Chalhoub family', revenueUsd: '$3-5B', marketCapUsd: 'N/A (private)', valueChainPosition: 'Distribution', note: 'LVMH, Chanel, Dior exclusive distribution' },
      { name: 'Al Tayer Group', owner: 'Al Tayer family', revenueUsd: '$8B', marketCapUsd: 'N/A (private)', valueChainPosition: 'Distribution/retail', note: "Harvey Nichols, Bloomingdale's" },
      { name: 'Al Futtaim Group', owner: 'Al Futtaim family', revenueUsd: '$5B+', marketCapUsd: 'N/A (private)', valueChainPosition: 'Distribution/retail', note: 'IKEA, Marks & Spencer, Zara' },
      { name: 'Majid Al Futtaim', owner: 'MAF Group', revenueUsd: '$9.2B', marketCapUsd: 'N/A (private)', valueChainPosition: 'Retail/malls', note: 'Carrefour, Mall of Emirates' },
      { name: 'Lulu Hypermarket', owner: 'Yusuff Ali/ADQ', revenueUsd: '$8.4B', marketCapUsd: '$6.5B', valueChainPosition: 'Retail', note: '259 stores, ADX listed' },
      { name: 'Noon.com', owner: 'Emaar/MBR', revenue: 'MENA\'s largest e-commerce', marketCapUsd: 'N/A (private)', valueChainPosition: 'E-commerce', note: 'Noon Minutes quick commerce' },
    ],
    insight: 'K-Fashion opportunity: Chalhoub/Al Tayer = gatekeepers. For independent entry, leverage DMCC/DIFC free zones. D2C targeting the Korean Wave fanbase is also viable.',
  },
  {
    icon: '🦾',
    name: 'Robotics · Space · Defense',
    size: 'Defense budget $23.9B (2025) → $30.2B (2030E) · EDGE exports $2.3B',
    cagr: 'CAGR 4.7%',
    valueChain: [
      { label: 'R&D (ATRC/TIRA)' },
      { label: 'Defense manufacturing (EDGE)' },
      { label: 'Drones/unmanned systems' },
      { label: 'Satellites/space' },
      { label: 'Industrial automation/service robots' },
    ],
    players: [
      { name: 'EDGE Group', owner: 'UAE government', revenueUsd: '$5B', marketCapUsd: 'N/A', valueChainPosition: 'Defense manufacturing', note: 'World\'s 22nd largest defense firm, Faisal Al Bannai Chairman' },
      { name: 'Space42', owner: 'G42 subsidiary', revenue: 'Satellite AI', marketCapUsd: '$3.5B', valueChainPosition: 'Satellites/space', note: 'Bayanat + Yahsat merger' },
      { name: 'MBRSC', owner: 'Dubai government', revenue: 'Hope Probe', marketCapUsd: 'N/A', valueChainPosition: 'Space', note: 'UAE Mars mission, lunar exploration plans' },
      { name: 'Tawazun (IHC)', owner: 'IHC subsidiary', revenue: 'Defense investment', marketCapUsd: 'N/A', valueChainPosition: 'Defense investment', note: 'Offset program management' },
      { name: 'ASPIRE (ATRC)', owner: 'Abu Dhabi government', revenue: 'Challenge funding', marketCapUsd: 'N/A', valueChainPosition: 'R&D', note: 'MBZIRC robotics challenge' },
    ],
  },
] as const satisfies ReadonlyArray<Sector>
