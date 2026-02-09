import crypto from 'crypto'

/**
 * Generate SHA256 hash for content deduplication
 */
export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex')
}

/**
 * Generate a shorter hash (first 16 chars of SHA256)
 */
export function shortHash(input: string): string {
  return sha256(input).slice(0, 16)
}
