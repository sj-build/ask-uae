import type { CategoryHotIssue } from './category-hot-issues'

export const categoryHotIssues: readonly CategoryHotIssue[] = [
  {
    id: 'politics',
    category: 'Politics',
    icon: '🏛️',
    accentColor: '#ef4444',
    items: [
      { title: 'MBZ Secures Third Term', description: '2024.10 — Strengthened governance stability; crown prince not yet designated' },
      { title: 'Rise of Sheikh Tahnoun', description: 'Oversees security, AI, and investment; de facto #2' },
      { title: 'GCC Security Realignment', description: 'Active Gulf defence framework discussions following the 2025 Doha incident' },
    ],
  },
  {
    id: 'economy',
    category: 'Economy',
    icon: '💰',
    accentColor: '#c8a44e',
    items: [
      { title: '9% Corporate Tax Era', description: 'Corporate restructuring underway since 2023 introduction' },
      { title: 'Stargate UAE 5GW', description: 'Largest AI infrastructure outside the US; power supply is the key issue' },
      { title: 'SWF Global Investment Acceleration', description: 'MGX $2B Binance; ADIA/Mubadala Bitcoin ETF allocations' },
    ],
  },
  {
    id: 'society',
    category: 'Society & Culture',
    icon: '🕌',
    accentColor: '#34d399',
    items: [
      { title: 'Casino Legalisation Push', description: 'Wynn opening in 2026 — first in an Islamic nation' },
      { title: 'Accelerating Social Liberalisation', description: 'Cohabitation permitted, alcohol regulations eased, divorce law simplified' },
      { title: 'K-Wave Expansion', description: 'K-beauty, K-pop, K-food boom; Korean Wave marketing opportunities' },
    ],
  },
] as const
