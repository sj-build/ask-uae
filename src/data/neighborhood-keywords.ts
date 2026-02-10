/**
 * Must-include keywords for filtering Unsplash search results per neighborhood.
 * A candidate photo must match at least 1 of these keywords in its
 * description/alt_description/tags to pass the relevance filter.
 */
export const NEIGHBORHOOD_KEYWORDS: Record<string, readonly string[]> = {
  // === Abu Dhabi ===
  'saadiyat-island': ['abu dhabi', 'saadiyat', 'louvre', 'cultural district', 'museum'],
  'al-maryah-island': ['abu dhabi', 'maryah', 'adgm', 'galleria', 'four seasons'],
  'downtown-corniche': ['abu dhabi', 'corniche', 'etihad towers', 'skyline'],
  'yas-island': ['abu dhabi', 'yas', 'ferrari world', 'yas marina', 'f1', 'circuit'],
  'al-reem-island': ['abu dhabi', 'reem', 'residential', 'towers'],
  'masdar-city': ['abu dhabi', 'masdar', 'sustainable', 'clean energy'],
  'kizad': ['abu dhabi', 'khalifa', 'industrial', 'port', 'kizad'],

  // === Dubai ===
  'difc': ['dubai', 'difc', 'financial', 'gate building', 'gate avenue'],
  'downtown-dubai': ['dubai', 'burj khalifa', 'khalifa', 'fountain', 'downtown'],
  'business-bay': ['dubai', 'business bay', 'canal', 'bay square'],
  'dubai-marina': ['dubai', 'marina', 'jbr', 'ain dubai', 'marina walk'],
  'jlt': ['dubai', 'jumeirah lake', 'jlt', 'lake towers', 'dmcc'],
  'internet-city-media-city': ['dubai', 'media city', 'internet city', 'knowledge village', 'tech'],
  'deira-old-dubai': ['dubai', 'creek', 'deira', 'souk', 'gold souk', 'spice', 'abra'],
  'dubai-south': ['dubai', 'expo', 'al maktoum', 'dubai south', 'expo city'],
} as const

/**
 * Negative keywords — photos containing these words get score penalty
 */
export const NEGATIVE_KEYWORDS: readonly string[] = [
  'office', 'meeting', 'laptop', 'workspace', 'typing', 'desk',
  'person', 'portrait', 'selfie', 'food', 'plate', 'coffee',
  'notebook', 'phone', 'indoor', 'interior',
] as const
