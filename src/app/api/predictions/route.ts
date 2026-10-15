import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getPredictions, seedPredictions, getStats } from '@/lib/predictions'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('whink_session')?.value
  const user = token ? await validateSession(token) : null

  await seedPredictions()

  const plan = user?.plan || 'free'
  const url = new URL(req.url)
  const limit = parseInt(url.searchParams.get('limit') || '20')

  const predictions = await getPredictions(plan, limit)
  const stats = getStats()

  return NextResponse.json({ predictions, stats, plan })
}
