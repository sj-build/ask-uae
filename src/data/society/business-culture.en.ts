import type { WastaItem, MajlisItem, MeetingComparison, DressCode, HierarchyTier } from './business-culture'

export const wastaConcepts: readonly WastaItem[] = [
  {
    concept: 'Wasta',
    arabic: 'Wasta',
    description: 'Arabic for "mediation/connection." Similar to Korean "connections" but in the UAE it is an official and legitimate social system',
  },
  {
    concept: 'Mojamala',
    arabic: 'Reciprocity',
    description: 'Favors given will always be returned -- be the first to offer help',
  },
  {
    concept: 'Hamola',
    arabic: 'Owed Favor',
    description: 'Received help must always be repaid -- a relational debt',
  },
  {
    concept: 'Somah',
    arabic: 'Accumulated Trust',
    description: 'Built over time. Cannot be formed from a single meeting',
  },
] as const

export const wastaPrinciple = 'No trust, no deal -- relationships come before contracts' as const

export const wastaTips: readonly string[] = [
  'First meeting = trust building: Do not jump straight to business. Start with family, health, and general greetings',
  'Importance of the introducer (Waseet): Who made the introduction defines the nature of the meeting. Cold calls rarely work',
  'Patience: Decision-making is slow. "Inshallah" = a polite "maybe" or "no." Rushing will damage the relationship',
  'Gift culture: High-end gifts are welcome. However, alcohol is off-limits. Korean traditional crafts or premium tea sets are appropriate',
] as const

export const majlisInfo: readonly MajlisItem[] = [
  { label: 'Definition', content: 'Arabic for "a place to sit." A traditional forum where rulers/notables directly meet citizens for petitions' },
  { label: 'Modern Role', content: 'The most traditional channel for accessing royalty/senior government officials. Modernized to operate by appointment' },
  { label: 'Business Context', content: 'An Emirati businessman\'s Majlis = a social gathering. If invited, attendance is essential' },
  { label: 'Etiquette', content: 'Show respect to elders. Arabic coffee (Gahwa) and dates are served -- always accept them' },
] as const

export const meetingComparisons: readonly MeetingComparison[] = [
  { situation: 'First Meeting', korea: 'Quickly get to the point', uae: '30 min to 1 hour of relationship building before discussing business' },
  { situation: 'Decision-Making Speed', korea: 'Fast (hierarchical decisions)', uae: 'Slow (consensus + repeated upper-level approvals). "Bukra" = later' },
  { situation: 'Punctuality', korea: 'Strictly on time', uae: '15-30 min delay is normal. "Arab time"' },
  { situation: 'Contracts', korea: 'Written contracts are primary', uae: 'Verbal agreements are also important. Trust relationship must precede contracts' },
  { situation: 'Saying No', korea: 'Direct refusal is acceptable', uae: 'Never say "No" directly. "Inshallah," "We will see" = rejection signals' },
  { situation: 'Dining Meetings', korea: 'Both lunch and dinner', uae: 'Dinner meetings preferred. During Ramadan, Iftar meetings are key social events' },
  { situation: 'Business Cards', korea: 'Both hands or one hand', uae: 'Use right hand (left hand is considered unclean). Arabic-translated cards make a strong impression' },
] as const

export const dressCodes: readonly DressCode[] = [
  { who: 'Emirati Men', description: 'Kandura (white traditional robe) + Ghutra (headdress). Worn for both business and formal occasions', icon: '👳' },
  { who: 'Emirati Women', description: 'Abaya (black outer garment) + Shayla (headscarf). Increasingly fashionable (designer abaya market growing)', icon: '🧕' },
  { who: 'Foreign Men', description: 'Suits (for business meetings). Smart casual for informal settings', icon: '👔' },
  { who: 'Foreign Women', description: 'Modest business attire. Avoid exposing shoulders/knees. Head covering required when visiting mosques', icon: '👗' },
] as const

export const dressWarning = 'Foreigners are not required to wear traditional clothing. However, excessive exposure in public spaces may result in fines' as const

export const hierarchyTiers: readonly HierarchyTier[] = [
  {
    rank: 1,
    name: 'Ruling Family',
    members: 'Al Nahyan (Abu Dhabi), Al Maktoum (Dubai), etc.',
    description: 'Absolute power and wealth. Final approvers of all major decisions',
    color: '#c8a44e',
  },
  {
    rank: 2,
    name: 'Prominent Emirati Families',
    members: 'Al Otaiba, Al Qemzi, Al Mubarak, etc.',
    description: 'Key figures in business/government. Close ties to ruling families',
    color: '#e8c85a',
  },
  {
    rank: 3,
    name: 'General Emiratis',
    members: '~1.2M',
    description: 'Government jobs, free housing/education/healthcare, marriage grants, and extensive welfare benefits',
    color: '#f59e0b',
  },
  {
    rank: 4,
    name: 'Arab Expatriates',
    members: 'Egypt, Jordan, Lebanon, etc.',
    description: 'Many professionals. Preferred for middle management due to cultural affinity',
    color: '#ef4444',
  },
  {
    rank: 5,
    name: 'Western Expatriates',
    members: 'US, UK, Europe',
    description: 'Senior executives, finance, consulting. High compensation packages',
    color: '#4a9eff',
  },
  {
    rank: 6,
    name: 'Asian Professionals',
    members: 'India, Pakistan, Korea, Japan, etc.',
    description: 'IT, healthcare, education, engineering',
    color: '#a78bfa',
  },
  {
    rank: 7,
    name: 'Asian/African Workers',
    members: 'India, Bangladesh, Pakistan, Nepal, Africa',
    description: 'Construction, domestic work, service industry. The most vulnerable group',
    color: '#6b7280',
  },
] as const

export const hierarchyInsights: readonly string[] = [
  'Without Emirati connections, government/SWF business is virtually impossible',
  '"Who introduced you" determines your position in the hierarchy',
  'Korea has a fairly positive image in the UAE (technological capability, K-culture, Barakah Nuclear Power Plant)',
] as const
