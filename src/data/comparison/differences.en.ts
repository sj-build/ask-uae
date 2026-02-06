import type { DifferenceItem } from './differences'

export const mustKnowDifferences: readonly DifferenceItem[] = [
  {
    id: 'decision-making',
    icon: '\u{1F3DB}',
    title: 'Decision-Making Structure',
    uae: {
      label: 'Top-Down',
      description: 'Rapid decisions directed by the royal family and government',
      detail: 'The ruler\'s vision is the national strategy. A decision by MBZ equals immediate execution. Intermediate consultation processes are minimised.',
    },
    korea: {
      label: 'Bottom-Up (Consensus-Based)',
      description: 'Multi-layered consultation and consensus process required',
      detail: 'Staged reporting and approval through the board, management, and working-level staff. Decisions can take several months.',
    },
    businessTip: 'In the UAE, a direct relationship with the decision-maker can make or break a deal.',
  },
  {
    id: 'business-speed',
    icon: '\u{1F91D}',
    title: 'Business Speed',
    uae: {
      label: 'Relationships First (Wasta)',
      description: 'Build trust \u2192 Relationship \u2192 Contract',
      detail: 'Wasta (personal connections) is the foundation of everything. From the first meeting to contract signing can take 6 months to 2 years. Dinner invitations and Majlis attendance are essential.',
    },
    korea: {
      label: 'Contract First',
      description: 'RFP \u2192 Proposal \u2192 Contract \u2192 Relationship',
      detail: 'Process-driven through competitive bidding, price comparison, and contract execution. Relationships form naturally after the contract is signed.',
    },
    businessTip: 'Don\'t rush. In the UAE, pushing a contract before sufficient relationship building can backfire.',
  },
  {
    id: 'labor-structure',
    icon: '\u{1F465}',
    title: 'Labour Structure',
    uae: {
      label: '88.5% Foreign Nationals',
      description: 'Emiratis concentrated in managerial roles',
      detail: 'Indian/Pakistani workers, Western professionals, and Emirati executives. Emiratisation policies are expanding mandatory national employment quotas.',
    },
    korea: {
      label: 'Domestic Workforce-Centric',
      description: 'Labour market centred on Korean nationals',
      detail: 'Foreign workers make up approximately 5%. Mostly E-9 visa holders in manual labour. A highly educated domestic workforce drives the economy.',
    },
    businessTip: 'When hiring local partners, understand the role allocation by nationality. Always verify Emiratisation obligations.',
  },
  {
    id: 'legal-system',
    icon: '\u{2696}',
    title: 'Legal System',
    uae: {
      label: 'Islamic Law + Civil Law Hybrid',
      description: 'Federal law and emirate-level law coexist',
      detail: 'Federal law + 7 emirate autonomous laws. ADGM/DIFC operate under English common law. What is legal in Dubai may not be legal in Sharjah (e.g., alcohol). Sharia applies to family and inheritance law.',
    },
    korea: {
      label: 'Unified Legal System',
      description: 'Single legal system applied uniformly nationwide',
      detail: 'Hierarchical system: Constitution \u2192 Statutes \u2192 Decrees \u2192 Ordinances. Uniform application of law across the country. No special zone concept.',
    },
    businessTip: 'Always verify the applicable jurisdiction: Free Zone, ADGM, or DIFC. Understand legal differences between emirates beforehand.',
  },
  {
    id: 'taxation',
    icon: '\u{1F4B0}',
    title: 'Taxation',
    uae: {
      label: 'Income Tax 0%',
      description: 'Corporate Tax 9%, VAT 5%',
      detail: 'Complete personal income tax exemption. Corporate tax at 9% (introduced 2023, on income exceeding AED 375K). Free zone entities may qualify for 0%. VAT at 5% (introduced 2018).',
    },
    korea: {
      label: 'Income Tax up to 45%',
      description: 'Corporate Tax 9-24%, VAT 10%',
      detail: '6-tier progressive tax rates (6%-45%). Corporate tax in 4 tiers (9%-24%). VAT at 10%. Additional taxes include comprehensive real estate tax and gift tax.',
    },
    businessTip: 'Setting up a free zone entity can provide 0% corporate tax benefits. However, always verify Transfer Pricing regulations.',
  },
  {
    id: 'real-estate',
    icon: '🏠',
    title: 'Real Estate/Mortgage',
    uae: {
      label: 'Expat LTV up to 80%',
      description: 'Liberal foreign property ownership',
      detail: 'First home ≤AED 5M: LTV 80%. First home >AED 5M: LTV 70%. Investment property: LTV 60%. Off-plan: LTV 50%. Max loan term 25 years. From Feb 2025, transaction fees must be paid upfront.',
    },
    korea: {
      label: 'Speculative zones LTV 40%',
      description: 'Strict lending restrictions',
      detail: 'All Seoul designated speculative (Oct 2025 policy). First-time buyers LTV 40%, existing homeowners 0%. First-time purchaser 70% (down from 80%). Properties ≤1.5B: max 600M loan, >2.5B: max 200M loan.',
    },
    businessTip: 'UAE is foreign investor-friendly for real estate. Korea has strict regulations limiting mortgage access. When investing in UAE property, always verify RERA registration.',
  },
  {
    id: 'cultural-code',
    icon: '\u{1F54C}',
    title: 'Cultural Code',
    uae: {
      label: 'Ramadan Observance Mandatory',
      description: 'Strict public behaviour norms',
      detail: 'Public eating and drinking prohibited during Ramadan. Dress codes enforced (especially in government buildings). Criticism of the royal family or religion is forbidden. Social media expressions are also subject to legal penalties.',
    },
    korea: {
      label: 'Relatively Liberal',
      description: 'Personal expression largely protected',
      detail: 'Freedom of expression guaranteed by the Constitution. Virtually no religion-related business restrictions. Freedom of dress.',
    },
    businessTip: 'Schedule meetings and events around Ramadan. Exercise particular caution regarding behaviour in public places.',
  },
] as const
