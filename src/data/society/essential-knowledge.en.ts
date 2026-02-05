import type { LawComparison, VisaType, WelfareItem, WomenStatus, FoodItem, ClimateSeason } from './essential-knowledge'

export const lawComparisons: readonly LawComparison[] = [
  {
    category: 'Alcohol',
    uaeRule: 'Licensed in Abu Dhabi/Dubai. Completely banned in Sharjah',
    koreaDifference: 'Freely available in Korea',
    violation: 'Public intoxication = arrest/deportation possible',
    severity: 'high',
  },
  {
    category: 'Drugs',
    uaeRule: 'Zero tolerance. Possession of even trace amounts = minimum 4 years imprisonment',
    koreaDifference: 'Relatively lighter penalties in Korea',
    violation: 'Death penalty possible (large-scale trafficking)',
    severity: 'critical',
  },
  {
    category: 'Cohabitation',
    uaeRule: 'Unmarried cohabitation decriminalized (2020~)',
    koreaDifference: 'Previously a criminal offense',
    violation: 'Recently liberalized',
    severity: 'low',
  },
  {
    category: 'Social Media Posts',
    uaeRule: 'Criticizing government/royals on social media = criminal offense',
    koreaDifference: 'Korea has broad freedom of expression',
    violation: 'Fines/detention/deportation. No exceptions for foreigners',
    severity: 'critical',
  },
  {
    category: 'Photography',
    uaeRule: 'Photographing military facilities, government buildings, or people (especially women) without permission is prohibited',
    koreaDifference: 'Relatively free in Korea',
    violation: 'Fines/detention',
    severity: 'high',
  },
  {
    category: 'Public Displays of Affection',
    uaeRule: 'Holding hands is OK. Kissing/hugging = fines possible',
    koreaDifference: 'Freely accepted in Korea',
    violation: 'Fines/detention',
    severity: 'medium',
  },
  {
    category: 'Profanity/Gestures',
    uaeRule: 'Obscene gestures like the middle finger = criminal offense',
    koreaDifference: 'Social disapproval only',
    violation: 'Detention/deportation',
    severity: 'high',
  },
  {
    category: 'Bounced Checks',
    uaeRule: 'Criminal offense (trend toward decriminalization, but still serious)',
    koreaDifference: 'Civil matter in Korea',
    violation: 'Detention/entry ban possible',
    severity: 'high',
  },
] as const

export const visaTypes: readonly VisaType[] = [
  {
    name: 'Employment Visa',
    target: 'Employees',
    duration: '2-3 years (renewable)',
    keyCondition: 'Employer sponsorship required',
  },
  {
    name: 'Golden Visa',
    target: 'Investors/Professionals/Scientists/Top Students',
    duration: '5-10 years',
    keyCondition: 'AED 2M+ real estate investment or specialized field qualification. 250,000+ issued',
    highlight: true,
  },
  {
    name: 'Green Visa',
    target: 'Freelancers/Self-employed',
    duration: '5 years',
    keyCondition: 'Self-sponsored residency without employer sponsor',
  },
  {
    name: 'Job Seeker Visa',
    target: 'Job seekers',
    duration: '60-120 days',
    keyCondition: 'Enter the country without a sponsor to seek employment (new)',
  },
  {
    name: 'Free Zone Visa',
    target: 'Free zone company employees',
    duration: '2-3 years',
    keyCondition: 'Free zone company as sponsor',
  },
  {
    name: 'Tourist Visa',
    target: 'Visitors',
    duration: '30-90 days',
    keyCondition: 'Korean passport = 30-day visa-free entry',
  },
] as const

export const goldenVisaInsights: readonly string[] = [
  'Visa is not tied to an employer -- allows free business activities',
  'Family sponsorship available. Educational stability for children',
  'Signals long-term commitment to the UAE -- increases trust from local partners',
] as const

export const emiratiWelfare: readonly WelfareItem[] = [
  { category: 'Education', description: 'Free from kindergarten through university (including overseas study scholarships)', icon: '🎓' },
  { category: 'Healthcare', description: 'Fully free healthcare', icon: '🏥' },
  { category: 'Housing', description: 'Government-provided housing or housing subsidies (land + construction grants for newlyweds)', icon: '🏠' },
  { category: 'Marriage Grant', description: 'AED 70,000+ marriage support grant (for marriages between Emiratis)', icon: '💍' },
  { category: 'Pension', description: 'Generous government pension', icon: '💰' },
  { category: 'Employment', description: 'Priority hiring in government/state-owned enterprises. Nafis program (private sector employment incentives)', icon: '💼' },
  { category: 'Utilities', description: 'Electricity/water subsidies', icon: '⚡' },
] as const

export const welfareInsight = 'This welfare system is the core of the social contract between the ruling family and citizens. Citizens provide political loyalty in exchange for welfare benefits. Understanding this structure is essential to understanding UAE political stability.' as const

export const womenStatus: readonly WomenStatus[] = [
  { category: 'Parliament', status: 'Federal National Council (FNC) female representation at 50% (quota since 2019)' },
  { category: 'Cabinet', status: '9 female ministers (as of 2024 cabinet, ~27% of total)' },
  { category: 'Education', status: '70%+ of university graduates are women. Highest female STEM participation rate in the GCC' },
  { category: 'Economic Activity', status: 'Female labor force participation ~57%. Highest in the GCC' },
  { category: 'Military', status: 'Women permitted in compulsory military service (since 2023)' },
  { category: 'Business', status: 'Rising proportion of female entrepreneurs. Sheikha Shamma = key figure in UAE youth/environmental policy' },
] as const

export const womenCaveat = 'Patriarchal family structures persist. Male preference in inheritance law. Informal glass ceiling exists' as const

export const womenInsights: readonly string[] = [
  'Growing number of female decision-makers -- female-targeted marketing is crucial for K-Beauty, fashion, education, and healthcare market entry',
  'Emirati women = high education level + high spending power. A core consumer segment',
] as const

export const foodCulture: readonly FoodItem[] = [
  { category: 'Traditional Food', content: 'Al Harees (wheat+meat porridge), Machboos (spiced rice), Luqaimat (honey dumplings), Gahwa (Arabic coffee) + Dates', icon: '🍽️' },
  { category: 'Dining Market', content: 'Dubai alone has 40,000+ restaurants. Among the highest per capita dining expenditure in the world', icon: '🍴' },
  { category: 'Halal Required', content: '76% Muslim population -- all food requires halal certification. Pork sold only in designated Pork Sections', icon: '✅' },
  { category: 'Delivery Culture', content: 'Talabat, Deliveroo, Careem growing rapidly. Summers at 45C+ drive extremely high delivery dependence', icon: '🛵' },
  { category: 'Friday Brunch', content: 'A cornerstone of expat culture. Hotel Friday brunch = key business socializing venue (AED 200-500+/person)', icon: '🥂' },
  { category: 'K-Food', content: '100+ Korean restaurants in Dubai. Kimchi/tteokbokki/Korean fried chicken popular. Halal certification for Korean food remains a challenge', icon: '🇰🇷' },
  { category: 'Arabic Coffee Etiquette', content: 'When served Gahwa -- shaking the cup signals "enough." Holding it still means a refill', icon: '☕' },
] as const

export const climateSeasons: readonly ClimateSeason[] = [
  {
    season: 'Summer (Jun-Sep)',
    temperature: '40-50C, humidity 90%+',
    impact: 'Outdoor activity virtually impossible. A/C is a survival necessity. Malls become the center of social life. Outdoor labor legally restricted 10am-4pm',
    icon: '🌡️',
    color: '#ef4444',
  },
  {
    season: 'Winter (Nov-Mar)',
    temperature: '18-28C',
    impact: 'Peak season. Tourism high season. Outdoor events concentrated here. Business meetings most active',
    icon: '☀️',
    color: '#34d399',
  },
  {
    season: 'Ramadan Period',
    temperature: 'Variable',
    impact: 'Shortened work hours + increased nighttime activity. Distinct shift in daily rhythms',
    icon: '🌙',
    color: '#c8a44e',
  },
] as const

export const climateInsights: readonly string[] = [
  'October-March is the business golden period. Concentrate trips and events during this time',
  'Summer = off-season: Decision-makers are on overseas holidays. Scheduling important meetings is difficult',
  'Mall culture: 80%+ of UAE consumption occurs in shopping malls -- a key factor in offline channel strategy',
] as const
