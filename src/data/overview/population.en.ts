import type { PopulationGroup, AgeGroup } from './population'

export const populationGroups: readonly PopulationGroup[] = [
  { flag: '🇮🇳', label: 'Indian', percentage: 38, count: '~4M', color: 'linear-gradient(90deg,#f59e0b,#d97706)' },
  { flag: '🇵🇰', label: 'Pakistani', percentage: 17, count: '~1.75M', color: 'linear-gradient(90deg,#34d399,#059669)' },
  { flag: '🇦🇪', label: 'Emirati', percentage: 11.5, count: '~1.31M', color: 'linear-gradient(90deg,#c8a44e,#e8c85a)', bold: true },
  { flag: '🇧🇩', label: 'Bangladeshi', percentage: 7, count: '~750K', color: '#22d3ee' },
  { flag: '🇵🇭', label: 'Filipino', percentage: 5, count: '~550K', color: '#a78bfa' },
  { flag: '🇪🇬', label: 'Egyptian+Arab', percentage: 8, count: '~900K', color: '#ef4444' },
  { flag: '🌍', label: 'Western', percentage: 5, count: '~550K', color: '#4b5563' },
  { flag: '🇰🇷', label: 'Korean', percentage: 0.3, count: '~12K', color: '#4a9eff' },
] as const

export const ageGroups: readonly AgeGroup[] = [
  { label: '0~14', percentage: '20.4%', count: '~2.2M · Future consumer base', color: '#22d3ee' },
  { label: '15~64', percentage: '78.7%', count: '~8.4M · Core workforce', color: '#34d399' },
  { label: '65+', percentage: '0.9%', count: '~100K · Virtually no aging population', color: '#ef4444' },
  { label: 'Median Age', percentage: '31.6', count: 'Very young compared to Korea\'s 44.9', color: '#c8a44e' },
] as const

export const demographicInsights: readonly string[] = [
  'Gender ratio: Male 7.24M (64%) vs Female 4.11M (36%) — driven by male construction/logistics labor inflow',
  'Urbanization: 81.2% (concentrated in Abu Dhabi, Dubai, Sharjah)',
  'Literacy: 95%+ · Residents from 200+ nationalities',
] as const

export const businessImplications: readonly string[] = [
  'UAE consumer market is 88% foreign residents, not Emiratis',
  'Indian population (38%) holds the greatest influence on consumer trends',
  'K-Beauty and K-Entertainment can target Indian, Filipino, and Arab fan bases simultaneously',
  '0% aging population — no senior market. Youth and family segments are key',
] as const
