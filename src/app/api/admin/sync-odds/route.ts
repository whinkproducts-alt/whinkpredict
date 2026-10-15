import { NextRequest, NextResponse } from 'next/server'
import { fetchAllLiveOdds, oddsEventToPrediction } from '@/lib/odds-api'
import { query, run } from '@/lib/db'
import { generateId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Protect with admin secret
  const adminKey = req.headers.get('x-admin-key')
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.ODDS_API_KEY) {
    return NextResponse.json({ error: 'ODDS_API_KEY not configured' }, { status: 503 })
  }

  try {
    const events = await fetchAllLiveOdds()
    let inserted = 0
    let skipped = 0

    for (const event of events) {
      const pred = oddsEventToPrediction(event)
      if (!pred) { skipped++; continue }

      // Check if this event already exists by external_id
      const existing = await query<{ id: string }>(
        'SELECT id FROM matches WHERE external_id = ?',
        [event.id]
      )

      if (existing.length > 0) { skipped++; continue }

      const matchId = generateId()
      const predId = generateId()

      await run(
        `INSERT INTO matches (id, external_id, home_team, away_team, home_team_logo, away_team_logo, league, country, match_date, status)
         VALUES (?, ?, ?, ?, '', '', ?, '', ?, 'upcoming')`,
        [matchId, event.id, pred.homeTeam, pred.awayTeam, pred.league, pred.matchDate]
      )

      await run(
        `INSERT INTO predictions (id, match_id, prediction, confidence, tier, reasoning, odds, result, is_premium)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
        [
          predId, matchId, pred.prediction, pred.confidence,
          pred.confidence >= 90 ? 'optimal' : pred.confidence >= 75 ? 'high' : 'watching',
          pred.reasoning, pred.odds, pred.isPremium ? 1 : 0
        ]
      )

      inserted++
    }

    return NextResponse.json({
      success: true,
      inserted,
      skipped,
      total: events.length,
    })
  } catch (err) {
    console.error('Odds sync error:', err)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
