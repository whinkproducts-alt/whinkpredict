import { NextRequest, NextResponse } from 'next/server'
import { query, run } from '@/lib/db'
import { hashPassword, createSession, generateId, checkRateLimit, recordFailedAttempt } from '@/lib/auth'
import { captureServerEvent } from '@/lib/posthog'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Rate limit registrations per IP: max 5 per 15 minutes
    const rateLimitKey = `register:${ip}`
    const rateCheck = await checkRateLimit(rateLimitKey)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Try again in ${Math.ceil((rateCheck.retryAfter || 1800) / 60)} minutes.` },
        { status: 429 }
      )
    }

    const emailLower = email.toLowerCase().trim()

    const existing = await query<{ id: string }>(
      'SELECT id FROM users WHERE email = ?',
      [emailLower]
    )

    if (existing.length > 0) {
      await recordFailedAttempt(rateLimitKey)
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const passwordHash = hashPassword(password)
    const userId = generateId()

    await run(
      'INSERT INTO users (id, name, email, password, plan) VALUES (?, ?, ?, ?, ?)',
      [userId, name.trim(), emailLower, passwordHash, 'free']
    )

    const token = await createSession(userId)

    captureServerEvent(userId, 'user_signed_up', {
      name: name.trim(),
      email: emailLower,
      plan: 'free',
    })

    const res = NextResponse.json(
      {
        success: true,
        user: { id: userId, name: name.trim(), email: emailLower, plan: 'free' },
      },
      { status: 201 }
    )

    res.cookies.set('whink_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return res
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
