import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SESSION_KEY, signAdminToken } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (
    email?.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase() ||
    password !== ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = signAdminToken()
  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_SESSION_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_SESSION_KEY, '', { maxAge: 0, path: '/' })
  return res
}
