import type { MacroRisk } from './macro-risks'

export const macroRisks: readonly MacroRisk[] = [
  {
    title: '🛢️ Oil Price Volatility',
    titleColor: '#ef4444',
    borderColor: '#ef4444',
    summary: 'Oil below $60 long-term could trigger SWF investment cuts, project delays',
  },
  {
    title: '🌍 Geopolitical Risk',
    titleColor: '#f59e0b',
    borderColor: '#f59e0b',
    summary: 'Iran tensions (Strait of Hormuz), Houthi drone attacks from Yemen',
  },
  {
    title: '🏠 Real Estate Overheating',
    titleColor: '#a78bfa',
    borderColor: '#a78bfa',
    summary: '+60% since 2022, 210K units pipeline 2025-27, up to 15% correction possible',
  },
  {
    title: '🏢 Saudi Competition',
    titleColor: '#4a9eff',
    borderColor: '#4a9eff',
    summary: 'Vision 2030, HUMAIN $100B AI, Riyadh foreign real estate opens 2026',
  },
  {
    title: '📊 Regulatory Tightening',
    titleColor: '#34d399',
    borderColor: '#34d399',
    summary: 'Corporate tax (2023~), potential VAT hike, stricter Emiratisation penalties',
  },
  {
    title: '⚡ Power Constraints',
    titleColor: '#c8a44e',
    borderColor: '#c8a44e',
    summary: 'Stargate 5GW + DC demand surge, grid limits, short-term fix difficult',
  },
] as const
