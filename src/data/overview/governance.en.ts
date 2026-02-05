import type { GovernanceItem } from './governance'

export const governanceConcepts: readonly GovernanceItem[] = [
  { title: 'Majlis', description: 'An open petition meeting where rulers meet citizens directly. A key channel for accessing the royal family.' },
  { title: 'Wasta', description: 'Connections and influence. Encompasses Mojamala (reciprocity), Hamola (owed favors), and Somah (accumulated trust). "No trust, no deal."' },
  { title: 'Emiratisation', description: 'Mandatory national employment quota. Private firms with 50+ employees must hire 2%+ Emiratis (expanding annually).' },
  { title: 'Free Zones (45+)', description: '100% foreign ownership, 0% customs duties. ADGM/DIFC (finance), DMCC (trade), Hub71 (startups).' },
  { title: 'Golden Visa', description: '10-year long-term visa for investors ($545K+), skilled professionals, and artists. Over 150K+ issued.' },
] as const

export const koreanDifferences: readonly GovernanceItem[] = [
  { title: 'No Separation of Religion & State', description: 'Islam is the state religion. Sharia law partially applied (family law/inheritance). ADGM/DIFC operate under common law.' },
  { title: 'Dual Power Structure', description: 'Federal law coexists with emirate-level autonomy. Legal in Dubai does not mean legal in Sharjah (e.g., alcohol).' },
  { title: 'Different PEP Norms', description: 'Royals and government officials owning businesses is normal. The Korean concept of conflict of interest does not apply. Spousal ownership is standard practice.' },
  { title: 'Contract Culture', description: 'Contracts are simpler than in the West. Trust and verbal agreements are preferred. Relying solely on legal protection without relationships has limitations.' },
  { title: 'Restricted Freedom of Expression', description: 'Criticism of the royal family, religion, or government is prohibited. Even social media posts can result in legal penalties. Exercise extreme caution.' },
] as const
