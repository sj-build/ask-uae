import type { ReligionGroup, TolerancePolicy, RamadanItem, PrayerTime, FridayInfo, HalalItem, IslamicHoliday } from './religion'

export const religionGroups: readonly ReligionGroup[] = [
  { name: 'Islam (Sunni)', percentage: 63, note: 'State religion. Mainstream', color: '#34d399' },
  { name: 'Islam (Shia)', percentage: 7, note: 'Primarily Iranian community', color: '#22d3ee' },
  { name: 'Islam (Other)', percentage: 4, note: 'Ibadi, Sufi, etc.', color: '#4a9eff' },
  { name: 'Christianity', percentage: 13, note: 'Filipino and Western expat communities', color: '#a78bfa' },
  { name: 'Hinduism', percentage: 6, note: 'Indian community. BAPS Hindu Mandir (2024)', color: '#f59e0b' },
  { name: 'Buddhism', percentage: 3, note: 'Southeast Asian community', color: '#ef4444' },
  { name: 'Other', percentage: 4, note: 'Sikhism, Baha\'i, Judaism, Zoroastrianism, etc.', color: '#6b7280' },
] as const

export const tolerancePolicies: readonly TolerancePolicy[] = [
  {
    name: 'Ministry of Tolerance and Coexistence',
    description: 'Dedicated ministry for interfaith dialogue and tolerance policy development',
    icon: '🏛️',
  },
  {
    name: 'Abrahamic Family House (2023)',
    description: 'Abu Dhabi Saadiyat Island. Mosque + Church + Synagogue built in a single complex',
    icon: '🕌',
  },
  {
    name: 'BAPS Hindu Mandir (2024)',
    description: 'Abu Dhabi. First official Hindu temple in the GCC. Royal family donated the land',
    icon: '🛕',
  },
  {
    name: 'Abraham Accords (2020)',
    description: 'Normalized relations with Israel. Groundbreaking in the Arab-Islamic world',
    icon: '🤝',
  },
  {
    name: 'Religious Freedom',
    description: 'Non-Muslim worship permitted (at registered venues). Proselytizing is illegal. Christmas decorations are allowed/encouraged',
    icon: '⛪',
  },
] as const

export const ramadanInfo: readonly RamadanItem[] = [
  { label: 'Duration', content: '9th month of the Islamic calendar, approximately 29-30 days (Gregorian dates shift each year)' },
  { label: '2026 Estimate', content: 'Mid-February to mid-March (lunar-based, determined by moon sighting)' },
  { label: 'Core Rules', content: 'No food, drinks, or smoking during daylight hours (Fajr to Maghrib). Non-Muslims must also comply in public' },
  { label: 'Work Hours', content: 'Reduced hours (typically 10am-2pm or 6 hours). Government offices even shorter' },
  { label: 'Iftar', content: 'Sunset meal breaking the fast -- a key business networking opportunity' },
  { label: 'Suhoor', content: 'Pre-dawn meal before fasting begins. Late-night social activity is common' },
  { label: 'Eid Al Fitr', content: 'Festival marking the end of Ramadan. 3-5 day holiday. Greetings are essential ("Eid Mubarak")' },
] as const

export const ramadanBusinessTip = 'During Ramadan, non-Muslims should also refrain from eating and drinking in public. Expect reduced productivity. Schedule contract signings and major decisions before or after Ramadan' as const

export const prayerTimes: readonly PrayerTime[] = [
  { name: 'Fajr', nameAr: 'Fajr', time: 'Dawn (before sunrise)', businessImpact: 'None', position: 5 },
  { name: 'Dhuhr', nameAr: 'Dhuhr', time: 'Noon 12:00-1:30pm', businessImpact: 'Meetings may pause. Return after 15-20 min prayer', position: 30 },
  { name: 'Asr', nameAr: 'Asr', time: 'Afternoon 3:00-4:30pm', businessImpact: 'Meetings may pause', position: 55 },
  { name: 'Maghrib', nameAr: 'Maghrib', time: 'Sunset', businessImpact: 'After work hours. Iftar time (during Ramadan)', position: 75 },
  { name: 'Isha', nameAr: 'Isha', time: 'Night', businessImpact: 'None', position: 90 },
] as const

export const prayerEtiquette = 'If prayer time arrives during a meeting, wait naturally. Never rush anyone. Prayer rooms (Musalla) are available in every building.' as const

export const fridayInfo: readonly FridayInfo[] = [
  { label: 'Friday Congregational Prayer', content: '12:45pm (government-designated). Mandatory for Muslim men' },
  { label: 'Business Impact', content: 'Avoiding Friday afternoon meetings is customary. Schools end at 11:30am' },
  { label: 'Weekend', content: 'Saturday-Sunday (changed from Friday-Saturday in 2022 for global business alignment)' },
] as const

export const halalInfo: readonly HalalItem[] = [
  { category: 'Food', description: 'Pork is prohibited. Specific slaughter methods required. All imported food must have halal certification', icon: '🍖' },
  { category: 'Cosmetics/Skincare', description: 'Key issue for K-Beauty: Animal-derived ingredients must be verified. Halal certification significantly boosts competitiveness', icon: '💄' },
  { category: 'Finance', description: 'Islamic finance (Sukuk, Mudarabah, etc.) -- interest (Riba) is prohibited in principle. Islamic and conventional banks coexist', icon: '🏦' },
  { category: 'Certification Authority', description: 'Emirates Authority for Standardization and Metrology (ESMA)', icon: '📋' },
] as const

export const halalInsight = 'Halal certification is the essential gateway to the UAE (and the entire 2 billion Muslim market). Once obtained, expansion to Malaysia, Indonesia, and Saudi Arabia becomes possible' as const

export const islamicHolidays: readonly IslamicHoliday[] = [
  {
    name: 'Eid Al Fitr',
    timing: 'Immediately after Ramadan',
    description: 'Festival celebrating the end of fasting',
    businessImpact: 'Consumer spending surges (gifts, dining out, shopping)',
    days: '3-5 days',
  },
  {
    name: 'Eid Al Adha',
    timing: 'During Hajj',
    description: 'Festival of Sacrifice. The most important Islamic holiday',
    businessImpact: 'Family-centered gatherings',
    days: '4-5 days',
  },
  {
    name: 'Islamic New Year',
    timing: 'Muharram 1st',
    description: 'Islamic New Year',
    businessImpact: '1-day public holiday',
    days: '1 day',
  },
  {
    name: "Prophet's Birthday",
    timing: 'Rabi Al Awal 12th',
    description: "Birthday of Prophet Muhammad",
    businessImpact: '1-day public holiday',
    days: '1 day',
  },
  {
    name: "Isra and Mi'raj",
    timing: 'Rajab 27th',
    description: "The Prophet's Night Journey and Ascension",
    businessImpact: '1-day public holiday',
    days: '1 day',
  },
] as const

export const holidayNote = 'All Islamic holidays are based on the lunar calendar -- Gregorian dates shift earlier by ~11 days each year' as const
