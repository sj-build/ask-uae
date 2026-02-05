import type { TaxType, CountryComparison, FreeZoneBenefit, TransferPricingRule, CorporateTaxTimeline } from './tax'

export const taxTypes: readonly TaxType[] = [
  {
    name: 'Corporate Tax',
    rate: '9%',
    effectiveDate: 'June 2023',
    details: [
      '9% applies to taxable income exceeding AED 375,000/year',
      '0% for income up to AED 375,000',
      'Response to OECD Pillar 2 (global minimum tax 15%)',
    ],
    exemptions: [
      'Qualifying Free Zone entities (0% maintained)',
      'Oil/gas extraction (existing special rates)',
      'Personal income, salaries, investment returns (non-taxable)',
    ],
    color: '#c8a44e',
  },
  {
    name: 'Value Added Tax (VAT)',
    rate: '5%',
    effectiveDate: 'January 2018',
    details: [
      'GCC common framework',
      'Applies to most goods/services',
      'Registration mandatory for annual revenue above AED 375,000',
    ],
    exemptions: [
      'Certain financial services',
      'Residential real estate (first 3 years)',
      'Essential healthcare/education',
      'Exports (0% rate)',
    ],
    color: '#4a9eff',
  },
  {
    name: 'Personal Income Tax',
    rate: '0%',
    effectiveDate: '-',
    details: [
      'No income tax on individual salaries or investment income',
      'One of the lowest personal tax rates globally',
      'Key factor in attracting high-income professionals',
    ],
    exemptions: undefined,
    color: '#34d399',
  },
  {
    name: 'Capital Gains Tax',
    rate: '0%',
    effectiveDate: '-',
    details: [
      'No tax on capital gains from stocks, real estate, etc.',
      'Core element of investor-friendly environment',
    ],
    exemptions: undefined,
    color: '#a78bfa',
  },
] as const

export const taxComparison: readonly CountryComparison[] = [
  {
    country: 'UAE',
    flag: '🇦🇪',
    corporateTax: '9% (over AED 375K)',
    personalIncomeTax: '0%',
    vat: '5%',
    capitalGains: '0%',
    notes: 'Free zones 0%, no personal income tax',
  },
  {
    country: 'Korea',
    flag: '🇰🇷',
    corporateTax: '9-24%',
    personalIncomeTax: '6-45%',
    vat: '10%',
    capitalGains: '20-25%',
    notes: 'Progressive rates, comprehensive taxation',
  },
  {
    country: 'Singapore',
    flag: '🇸🇬',
    corporateTax: '17%',
    personalIncomeTax: '0-22%',
    vat: '9% (GST)',
    capitalGains: '0%',
    notes: 'Flat corporate rate, territorial system',
  },
  {
    country: 'Hong Kong',
    flag: '🇭🇰',
    corporateTax: '8.25-16.5%',
    personalIncomeTax: '2-17%',
    vat: '0%',
    capitalGains: '0%',
    notes: 'No VAT, territorial system',
  },
] as const

export const freeZoneBenefits: readonly FreeZoneBenefit[] = [
  {
    benefit: 'Corporate Tax Exemption',
    description: '0% corporate tax on qualifying income (9% on non-qualifying income)',
    duration: '50-year guarantee (some free zones)',
    icon: '💰',
  },
  {
    benefit: '100% Foreign Ownership',
    description: 'Full foreign ownership without local partner/sponsor',
    duration: 'Indefinite',
    icon: '🏢',
  },
  {
    benefit: 'Free Capital/Profit Repatriation',
    description: 'No restrictions on repatriating profits, dividends, or capital',
    duration: 'Indefinite',
    icon: '💸',
  },
  {
    benefit: 'Customs Duty Exemption',
    description: 'No customs duty on imports within free zone. Easy re-export offshore',
    duration: 'Indefinite',
    icon: '📦',
  },
  {
    benefit: 'Independent Regulations',
    description: 'DIFC, ADGM operate under independent legal/court systems (English common law)',
    duration: 'Indefinite',
    icon: '⚖️',
  },
] as const

export const transferPricingRules: readonly TransferPricingRule[] = [
  { title: 'Arm\'s Length Principle', content: 'Related party transactions must be conducted under the same conditions as independent party transactions' },
  { title: 'Documentation Requirements', content: 'Master File and Local File preparation mandatory. Companies with revenue >AED 200M must submit Country-by-Country Report (CbCR)' },
  { title: 'OECD Guidelines', content: 'Compliance with OECD Transfer Pricing Guidelines required. Comparability analysis, functional/risk analysis needed' },
  { title: 'Advance Pricing Agreement', content: 'APA negotiation available with Federal Tax Authority' },
] as const

export const taxInsights: readonly string[] = [
  'Corporate Tax 9%: Very low compared to Korea. However, mainland companies outside free zones are taxable',
  'Free Zone Utilization: DIFC, ADGM, JAFZA maintain 0% corporate tax. Advantageous for holding companies and financial firms',
  'Personal Income Tax 0%: Effective income increase for high earners. Key factor in talent attraction',
  'Transfer Pricing: Arm\'s length documentation is essential for transactions with Korean HQ. Prepare for tax audits',
  'Global Minimum Tax: MNEs with revenue >EUR 750M expected to face 15% minimum tax',
] as const

export const corporateTaxTimeline: readonly CorporateTaxTimeline[] = [
  { year: '2022.01', event: 'Corporate Tax Announced', detail: 'UAE Ministry of Finance announces 9% corporate tax from June 2023' },
  { year: '2022.12', event: 'Tax Law Enacted', detail: 'Federal Decree-Law No. 47/2022' },
  { year: '2023.06', event: 'Corporate Tax Effective', detail: 'Sequential application based on fiscal year begins' },
  { year: '2024', event: 'OECD Pillar 2 Response', detail: 'Global minimum tax rate of 15% under consideration' },
] as const
