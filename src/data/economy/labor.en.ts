import type { WorkforceBreakdown, SectorEmployment, EmiraitizationRule, LaborLawItem, WPSInfo } from './labor'

export const workforceComposition: readonly WorkforceBreakdown[] = [
  {
    category: 'Foreign Workers',
    percentage: 88,
    description: 'India, Pakistan, Bangladesh, Philippines, etc. Across all sectors from construction, services, domestic work to finance and IT',
    color: '#4a9eff',
  },
  {
    category: 'Emiratis (Citizens)',
    percentage: 12,
    description: 'Primarily employed in government and state-owned enterprises. Gradually expanding to private sector through Emiratization',
    color: '#c8a44e',
  },
] as const

export const sectorEmployment: readonly SectorEmployment[] = [
  {
    sector: 'Construction / Infrastructure',
    employmentShare: 22,
    averageSalary: 'AED 2,000-15,000',
    salaryRangeAED: '~AED 50,000+ (Senior)',
    keyRoles: ['Site Workers', 'Engineers', 'Project Managers'],
    emiratizationRate: '2%',
    color: '#f59e0b',
  },
  {
    sector: 'Retail / Trade',
    employmentShare: 18,
    averageSalary: 'AED 3,000-12,000',
    salaryRangeAED: '~AED 40,000+ (Manager)',
    keyRoles: ['Sales', 'Logistics', 'Procurement'],
    emiratizationRate: '2%',
    color: '#4a9eff',
  },
  {
    sector: 'Finance / Insurance',
    employmentShare: 8,
    averageSalary: 'AED 8,000-35,000',
    salaryRangeAED: '~AED 100,000+ (Executive)',
    keyRoles: ['Bankers', 'Analysts', 'Insurance Agents'],
    emiratizationRate: '4%',
    color: '#34d399',
  },
  {
    sector: 'Hospitality / Tourism',
    employmentShare: 12,
    averageSalary: 'AED 2,500-10,000',
    salaryRangeAED: '~AED 30,000+ (GM)',
    keyRoles: ['Hoteliers', 'Travel Agents', 'Guides'],
    emiratizationRate: '2%',
    color: '#a78bfa',
  },
  {
    sector: 'Government / SOEs',
    employmentShare: 15,
    averageSalary: 'AED 15,000-40,000',
    salaryRangeAED: '~AED 80,000+ (Senior Officials)',
    keyRoles: ['Civil Servants', 'State Enterprise Employees'],
    emiratizationRate: '90%+',
    color: '#c8a44e',
  },
  {
    sector: 'IT / Technology',
    employmentShare: 6,
    averageSalary: 'AED 10,000-40,000',
    salaryRangeAED: '~AED 80,000+ (CTO/Director)',
    keyRoles: ['Developers', 'PMs', 'Data Scientists'],
    emiratizationRate: '2%',
    color: '#22d3ee',
  },
  {
    sector: 'Healthcare',
    employmentShare: 5,
    averageSalary: 'AED 8,000-50,000',
    salaryRangeAED: '~AED 120,000+ (Specialists)',
    keyRoles: ['Doctors', 'Nurses', 'Pharmacists'],
    emiratizationRate: '2%',
    color: '#ef4444',
  },
] as const

export const emiratizationRules: readonly EmiraitizationRule[] = [
  {
    title: 'Applicability',
    content: 'Private companies with 50+ employees (14 major sectors)',
    penalty: undefined,
  },
  {
    title: 'Annual Target',
    content: 'Mandatory 2% annual increase in Emirati employment (10% target by 2026)',
    penalty: 'AED 96,000/person/year penalty for non-compliance',
  },
  {
    title: '2024 Target',
    content: '6% skilled workers (2024), 7% (2025), 10% (2026)',
    penalty: undefined,
  },
  {
    title: 'Incentives',
    content: 'Priority in government contracts, license fee reductions for exceeding targets',
    penalty: undefined,
  },
  {
    title: 'Caution',
    content: 'Government approval required for Emirati termination. Severe penalties for fake employment (sponsorship trading)',
    penalty: undefined,
  },
] as const

export const laborLawUpdates: readonly LaborLawItem[] = [
  {
    topic: 'Unlimited Contracts Abolished',
    description: 'All employment contracts must convert to fixed-term (max 3 years). Renewable',
    effectiveDate: '2025.1.1',
    icon: '📋',
  },
  {
    topic: 'Flexible Work Recognized',
    description: 'Part-time, temporary, remote work officially recognized by law',
    effectiveDate: '2024',
    icon: '🏠',
  },
  {
    topic: 'WPS (Wage Protection System)',
    description: 'All salaries must be paid through UAE bank accounts. Auto-reported if delayed',
    effectiveDate: 'Strengthening',
    icon: '💳',
  },
  {
    topic: 'Golden Visa',
    description: '5-10 year long-term residence visa for investors, entrepreneurs, and exceptional talent. Independent stay without sponsor',
    effectiveDate: 'Expanding',
    icon: '🏆',
  },
  {
    topic: 'Dispute Resolution',
    description: 'MOHRE (Ministry of Labor) online dispute filing. Mediation within 14 days, court if unresolved',
    effectiveDate: 'Simplified',
    icon: '⚖️',
  },
] as const

export const wpsInfo: readonly WPSInfo[] = [
  { label: 'Definition', content: 'Wage Protection System. Mandates all UAE employers to pay worker salaries via bank transfer' },
  { label: 'Purpose', content: 'Prevent wage theft, protect worker rights, ensure wage payment transparency' },
  { label: 'Scope', content: 'All private companies (some domestic workers excluded)' },
  { label: 'Penalties', content: 'Non-compliance may result in work permit suspension, fines, and license cancellation' },
  { label: 'Business Implication', content: 'Payroll must be integrated with UAE bank accounts. Cash payments are not allowed' },
] as const

export const laborInsights: readonly string[] = [
  'Emiratization: Companies with 50+ employees must consider Emirati quotas when hiring. Significant fines for non-compliance',
  'WPS Compliance: Salaries must be paid through UAE bank accounts. Cash or overseas transfers not allowed',
  'Contract Required: All employment contracts must be registered with MOHRE. Arabic version is legally binding',
  'Golden Visa: Investors and entrepreneurs can obtain independent visas, eliminating sponsor dependency',
  'Termination Process: Government pre-approval required for Emirati staff termination. Notice periods must be observed for all foreign workers',
] as const
