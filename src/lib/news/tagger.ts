import type { NewsItem, Keyword } from '@/types/news'

function normalizeForMatching(text: string): string {
  return text.toLowerCase().trim()
}

function textContainsKeyword(text: string, keyword: Keyword): boolean {
  const normalizedText = normalizeForMatching(text)
  const englishLabel = normalizeForMatching(keyword.en)
  const koreanLabel = normalizeForMatching(keyword.ko)

  if (normalizedText.includes(englishLabel)) {
    return true
  }

  if (normalizedText.includes(koreanLabel)) {
    return true
  }

  return false
}

function findMatchingTags(item: NewsItem, keywords: readonly Keyword[]): readonly string[] {
  const searchableText = [
    item.title,
    item.summary ?? '',
    item.publisher,
  ].join(' ')

  const matchedTags: string[] = []

  for (const keyword of keywords) {
    if (!keyword.active) {
      continue
    }

    if (textContainsKeyword(searchableText, keyword)) {
      const tag = `${keyword.category}:${keyword.en}`

      if (!matchedTags.includes(tag)) {
        matchedTags.push(tag)
      }
    }
  }

  return matchedTags
}

export function tagNews(item: NewsItem, keywords: readonly Keyword[]): NewsItem {
  const newTags = findMatchingTags(item, keywords)

  const mergedTags = [...item.tags]

  for (const tag of newTags) {
    if (!mergedTags.includes(tag)) {
      mergedTags.push(tag)
    }
  }

  return {
    ...item,
    tags: mergedTags,
  }
}

export function tagNewsBatch(items: readonly NewsItem[], keywords: readonly Keyword[]): readonly NewsItem[] {
  return items.map((item) => tagNews(item, keywords))
}
