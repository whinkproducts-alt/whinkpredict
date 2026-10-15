import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('whink_session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await validateSession(token)
  if (!user) return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, plan: user.plan } })
}
