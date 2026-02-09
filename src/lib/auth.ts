import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

const SESSION_SECRET = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || 'fallback-secret-change-me'
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

// In-memory rate limiting store
// For production, use Redis or similar
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5

/**
 * Check if an IP is rate limited
 */
export function isRateLimited(ip: string): { limited: boolean; remainingAttempts: number } {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)

  if (!attempts) {
    return { limited: false, remainingAttempts: MAX_ATTEMPTS }
  }

  // Reset if window has passed
  if (now - attempts.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.delete(ip)
    return { limited: false, remainingAttempts: MAX_ATTEMPTS }
  }

  const remaining = MAX_ATTEMPTS - attempts.count
  return {
    limited: attempts.count >= MAX_ATTEMPTS,
    remainingAttempts: Math.max(0, remaining),
  }
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)

  if (!attempts || now - attempts.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now })
  } else {
    attempts.count++
  }
}

/**
 * Clear login attempts on successful login
 */
export function clearAttempts(ip: string): void {
  loginAttempts.delete(ip)
}

/**
 * Securely compare passwords using timing-safe comparison
 */
export function verifyPassword(input: string, stored: string): boolean {
  if (!input || !stored) return false

  // Use timing-safe comparison to prevent timing attacks
  const inputBuffer = Buffer.from(input)
  const storedBuffer = Buffer.from(stored)

  if (inputBuffer.length !== storedBuffer.length) {
    // Perform comparison anyway to maintain constant time
    // But will return false due to length mismatch
    timingSafeEqual(
      Buffer.alloc(Math.max(inputBuffer.length, storedBuffer.length)),
      Buffer.alloc(Math.max(inputBuffer.length, storedBuffer.length))
    )
    return false
  }

  return timingSafeEqual(inputBuffer, storedBuffer)
}

interface SessionPayload {
  iat: number // issued at
  exp: number // expires at
  sid: string // session id (random)
}

/**
 * Create a signed session token
 */
export function createSessionToken(): string {
  const payload: SessionPayload = {
    iat: Date.now(),
    exp: Date.now() + SESSION_EXPIRY_MS,
    sid: randomBytes(16).toString('hex'),
  }

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', SESSION_SECRET)
    .update(payloadStr)
    .digest('base64url')

  return `${payloadStr}.${signature}`
}

/**
 * Verify and decode a session token
 */
export function verifySessionToken(token: string): { valid: boolean; expired?: boolean } {
  if (!token || !token.includes('.')) {
    return { valid: false }
  }

  const [payloadStr, signature] = token.split('.')

  // Verify signature
  const expectedSignature = createHmac('sha256', SESSION_SECRET)
    .update(payloadStr)
    .digest('base64url')

  const sigBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false }
  }

  // Decode and check expiry
  try {
    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadStr, 'base64url').toString()
    )

    if (Date.now() > payload.exp) {
      return { valid: false, expired: true }
    }

    return { valid: true }
  } catch {
    return { valid: false }
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown'
}
