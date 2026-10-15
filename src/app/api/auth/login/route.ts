import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import {
  verifyPassword,
  createSession,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
} from '@/lib/auth'
import { captureServerEvent } from '@/lib/posthog'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const rateLimitKey = `login:${ip}:${email.toLowerCase().trim()}`
    const rateCheck = await checkRateLimit(rateLimitKey)

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${Math.ceil((rateCheck.retryAfter || 1800) / 60)} minutes.` },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfter || 1800) },
        }
      )
    }

    const users = await query<{
      id: string
      name: string | null
      email: string
      password: string
      plan: string
    }>('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()])

    const user = users[0]

    if (!user || !verifyPassword(password, user.password)) {
      await recordFailedAttempt(rateLimitKey)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Successful login: clear rate limit, create session
    await clearRateLimit(rateLimitKey)
    const token = await createSession(user.id)

    captureServerEvent(user.id, 'user_logged_in', {
      email: user.email,
      plan: user.plan,
    })

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
    })

    res.cookies.set('whink_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
