import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('whink_session')?.value
  if (token) await deleteSession(token)

  const res = NextResponse.json({ success: true })
  res.cookies.set('whink_session', '', { maxAge: 0, path: '/' })
  return res
}
