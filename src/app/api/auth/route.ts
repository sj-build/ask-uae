import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  verifyPassword,
  createSessionToken,
  isRateLimited,
  recordFailedAttempt,
  clearAttempts,
  getClientIP,
} from '@/lib/auth'

const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: Request) {
  const clientIP = getClientIP(request)

  // Check rate limiting
  const rateLimitStatus = isRateLimited(clientIP)
  if (rateLimitStatus.limited) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many login attempts. Please try again in 15 minutes.',
      },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const parsed = loginSchema.parse(body)

    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Use timing-safe password comparison
    if (!verifyPassword(parsed.password, adminPassword)) {
      recordFailedAttempt(clientIP)
      const remaining = rateLimitStatus.remainingAttempts - 1

      return NextResponse.json(
        {
          success: false,
          error: remaining > 0
            ? `Invalid password. ${remaining} attempts remaining.`
            : 'Invalid password. Too many attempts - please wait 15 minutes.',
        },
        { status: 401 }
      )
    }

    // Clear rate limit on successful login
    clearAttempts(clientIP)

    // Create signed session token
    const sessionToken = createSessionToken()

    const response = NextResponse.json({ success: true })

    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true })

    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return response
  } catch {
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}
