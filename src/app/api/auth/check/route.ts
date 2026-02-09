import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')

    if (!session?.value) {
      return NextResponse.json({ authenticated: false })
    }

    // Verify the signed session token
    const { valid, expired } = verifySessionToken(session.value)

    if (!valid) {
      // Clear invalid/expired session cookie
      const response = NextResponse.json({
        authenticated: false,
        expired: expired ?? false,
      })

      response.cookies.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      })

      return response
    }

    return NextResponse.json({ authenticated: true })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
