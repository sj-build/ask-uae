import type { MacroRisk } from './macro-risks'

export const macroRisks: readonly MacroRisk[] = [
  {
    title: '🛢️ Oil Price Volatility', titleColor: '#ef4444', borderColor: '#ef4444',
    description: 'Non-oil GDP is 75%, but oil remains the core fiscal revenue source. Prolonged oil prices below $60 could trigger SWF investment cutbacks and government project delays.',
  },
  {
    title: '🌍 Geopolitics', titleColor: '#f59e0b', borderColor: '#f59e0b',
    description: 'Iran tensions (Strait of Hormuz), Houthi rebel drones from Yemen, 2025 Doha attack. Fitch: "The cycle of regional geopolitical escalation is highly uncertain." Direct impact on Abu Dhabi oil infrastructure and Dubai tourism/trade.',
  },
  {
    title: '🏠 Real Estate Correction', titleColor: '#a78bfa', borderColor: '#a78bfa',
    description: 'Prices up 60% since 2022. 210K units in the supply pipeline for 2025~27. Fitch: up to 15% correction possible. UBS bubble risk upgraded for 2 consecutive years. However, population growth may absorb the surplus.',
  },
  {
    title: '🏢 Saudi Competition', titleColor: '#4a9eff', borderColor: '#4a9eff',
    description: 'Vision 2030, HUMAIN $100B AI, Riyadh opening foreign real estate purchases (from 2026), NEOM, Riyadh Season. Saudi Arabia is rapidly emerging as a rival to Abu Dhabi/Dubai in attracting talent, capital, and businesses.',
  },
  {
    title: '📊 Regulatory Risk', titleColor: '#34d399', borderColor: '#34d399',
    description: 'Corporate tax introduced (2023~), potential VAT increases, stricter Emiratisation penalties, FATF AML regulations. The regulatory environment is maturing rapidly — the appeal of low taxes and light regulation may gradually diminish.',
  },
  {
    title: '⚡ Power / Infrastructure', titleColor: '#c8a44e', borderColor: '#c8a44e',
    description: 'Stargate UAE 5GW + existing DC demand pushing grid limits. EMEA DC new supply down 11% YoY. Government established a Data Center Energy Review Team, but short-term resolution remains challenging.',
  },
] as const
