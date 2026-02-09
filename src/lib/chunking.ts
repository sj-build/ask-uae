/**
 * Text chunking utility for RAG pipeline
 * Splits documents into overlapping chunks suitable for embedding
 */

export interface ChunkOptions {
  readonly maxTokens: number
  readonly overlapTokens: number
  readonly minChunkSize: number
}

export interface TextChunk {
  readonly content: string
  readonly index: number
  readonly tokenCount: number
}

const DEFAULT_OPTIONS: ChunkOptions = {
  maxTokens: 800,
  overlapTokens: 100,
  minChunkSize: 50,
}

/**
 * Rough token estimation (avg 4 chars per token for English, 2 for Korean)
 * This is a heuristic - actual tokenization depends on the model
 */
function estimateTokenCount(text: string): number {
  const koreanRegex = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g
  const koreanChars = (text.match(koreanRegex) || []).length
  const otherChars = text.length - koreanChars

  // Korean: ~2 chars per token, English: ~4 chars per token
  return Math.ceil(koreanChars / 2 + otherChars / 4)
}

/**
 * Find natural break points in text (paragraphs, sentences)
 */
function findBreakPoint(text: string, targetPos: number, searchRange: number): number {
  const searchStart = Math.max(0, targetPos - searchRange)
  const searchEnd = Math.min(text.length, targetPos + searchRange)
  const searchText = text.slice(searchStart, searchEnd)

  // Priority: paragraph break > sentence end > word boundary
  const breakPatterns = [
    /\n\n/g,           // Paragraph break
    /\n/g,             // Line break
    /[.!?]\s+/g,       // Sentence end
    /[,;:]\s+/g,       // Clause break
    /\s+/g,            // Word boundary
  ]

  for (const pattern of breakPatterns) {
    let match
    let bestBreak = -1
    let bestDistance = Infinity

    pattern.lastIndex = 0
    while ((match = pattern.exec(searchText)) !== null) {
      const absolutePos = searchStart + match.index + match[0].length
      const distance = Math.abs(absolutePos - targetPos)

      if (distance < bestDistance) {
        bestDistance = distance
        bestBreak = absolutePos
      }
    }

    if (bestBreak !== -1) {
      return bestBreak
    }
  }

  return targetPos
}

/**
 * Split text into overlapping chunks
 */
export function chunkText(
  text: string,
  options: Partial<ChunkOptions> = {}
): readonly TextChunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const chunks: TextChunk[] = []

  // Clean and normalize text
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim()

  if (!cleanedText) {
    return []
  }

  const totalTokens = estimateTokenCount(cleanedText)

  // If text fits in one chunk, return as-is
  if (totalTokens <= opts.maxTokens) {
    return [{
      content: cleanedText,
      index: 0,
      tokenCount: totalTokens,
    }]
  }

  // Calculate approximate chars per token for this text
  const charsPerToken = cleanedText.length / totalTokens
  const targetChunkChars = Math.floor(opts.maxTokens * charsPerToken)
  const overlapChars = Math.floor(opts.overlapTokens * charsPerToken)

  let currentPos = 0
  let chunkIndex = 0

  while (currentPos < cleanedText.length) {
    // Find end position for this chunk
    let endPos = currentPos + targetChunkChars

    if (endPos >= cleanedText.length) {
      // Last chunk - take everything remaining
      endPos = cleanedText.length
    } else {
      // Find natural break point
      endPos = findBreakPoint(cleanedText, endPos, Math.floor(targetChunkChars * 0.2))
    }

    const chunkContent = cleanedText.slice(currentPos, endPos).trim()
    const chunkTokens = estimateTokenCount(chunkContent)

    // Only add chunk if it meets minimum size
    if (chunkTokens >= opts.minChunkSize || currentPos + targetChunkChars >= cleanedText.length) {
      chunks.push({
        content: chunkContent,
        index: chunkIndex,
        tokenCount: chunkTokens,
      })
      chunkIndex++
    }

    // Move position with overlap
    currentPos = endPos - overlapChars
    const lastChunkLength = chunks[chunks.length - 1]?.content.length ?? 0
    if (currentPos <= lastChunkLength) {
      currentPos = endPos // Prevent infinite loop
    }

    // Safety check
    if (chunks.length > 1000) {
      console.warn('Chunking exceeded 1000 chunks, stopping')
      break
    }
  }

  return chunks
}

/**
 * Create chunks from a document with metadata
 */
export function chunkDocument(
  title: string,
  content: string,
  options: Partial<ChunkOptions> = {}
): readonly TextChunk[] {
  // Prepend title to first chunk for context
  const fullText = `${title}\n\n${content}`
  return chunkText(fullText, options)
}

/**
 * Estimate total chunks for a document (useful for progress tracking)
 */
export function estimateChunkCount(text: string, maxTokens = 800): number {
  const totalTokens = estimateTokenCount(text)
  return Math.max(1, Math.ceil(totalTokens / (maxTokens * 0.8))) // Account for overlap
}
