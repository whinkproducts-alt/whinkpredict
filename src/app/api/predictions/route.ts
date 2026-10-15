import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getPredictions, seedPredictions, getStats } from '@/lib/predictions'
import { fetchAllLiveOdds, oddsEventToPrediction } from '@/lib/odds-api'
import { query, run } from '@/lib/db'
import { generateId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Track last sync time in-process (resets on cold start, fine for our purposes)
let lastSyncAt = 0
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000 // 6 hours — matches odds-api cache TTL

async function syncLiveOdds(): Promise<void> {
  if (!process.env.ODDS_API_KEY) return
  if (Date.now() - lastSyncAt < SYNC_INTERVAL_MS) return

  lastSyncAt = Date.now()

  try {
    const events = await fetchAllLiveOdds()

    for (const event of events) {
      const pred = oddsEventToPrediction(event)
      if (!pred) continue

      // Skip if this event is already in the DB
      const existing = await query<{ id: string }>(
        'SELECT id FROM matches WHERE external_id = ?',
        [event.id]
      )
      if (existing.length > 0) continue

      const matchId = generateId()
      const predId = generateId()

      await run(
        `INSERT INTO matches
           (id, external_id, home_team, away_team, home_team_logo, away_team_logo, league, league_logo, country, match_date, status)
         VALUES (?, ?, ?, ?, '', '', ?, '', ?, ?, 'upcoming')`,
        [matchId, event.id, pred.homeTeam, pred.awayTeam, pred.league, pred.country, pred.matchDate]
      )

      await run(
        `INSERT INTO predictions
           (id, match_id, prediction, confidence, tier, reasoning, odds, result, is_premium)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
        [
          predId,
          matchId,
          pred.prediction,
          pred.confidence,
          pred.confidence >= 90 ? 'optimal' : pred.confidence >= 75 ? 'high' : 'watching',
          pred.reasoning,
          pred.odds,
          pred.isPremium ? 1 : 0,
        ]
      )
    }

    // Purge matches older than 48 hours that are still 'upcoming' (event passed without result)
    await run(
      `DELETE FROM matches WHERE status = 'upcoming' AND match_date < datetime('now', '-48 hours')`
    )
  } catch (err) {
    console.error('Live odds auto-sync failed:', err)
    // Non-fatal — fall through to return whatever is in DB
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('whink_session')?.value
  const user = token ? await validateSession(token) : null
  const plan = user?.plan || 'free'

  // Try live odds first; if key not set or fetch fails, seed demo data
  await syncLiveOdds()
  await seedPredictions()

  const url = new URL(req.url)
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const predictions = await getPredictions(plan, limit)
  const stats = getStats()

  return NextResponse.json({
    predictions,
    stats,
    plan,
    live: !!process.env.ODDS_API_KEY,
  })
}
