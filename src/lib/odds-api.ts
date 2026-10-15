// The Odds API integration with in-memory cache
// Free tier: 500 requests/month. Cache aggressively.

export interface OddsEvent {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers: Array<{
    key: string
    title: string
    markets: Array<{
      key: string
      outcomes: Array<{
        name: string
        price: number
      }>
    }>
  }>
}

interface CacheEntry {
  data: OddsEvent[]
  fetchedAt: number
}

// Cache odds for 6 hours to conserve free tier quota
const CACHE_TTL_MS = 6 * 60 * 60 * 1000
const cache = new Map<string, CacheEntry>()

const SUPPORTED_SPORTS = [
  'soccer_epl',
  'soccer_spain_la_liga',
  'soccer_uefa_champs_league',
  'americanfootball_nfl',
  'basketball_nba',
]

export async function fetchLiveOdds(sportKey: string): Promise<OddsEvent[]> {
  const apiKey = process.env.ODDS_API_KEY
  if (!apiKey) return []

  const cached = cache.get(sportKey)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data
  }

  try {
    const url = new URL(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds`)
    url.searchParams.set('apiKey', apiKey)
    url.searchParams.set('regions', 'uk,eu')
    url.searchParams.set('markets', 'h2h')
    url.searchParams.set('oddsFormat', 'decimal')
    url.searchParams.set('dateFormat', 'iso')

    const res = await fetch(url.toString(), {
      next: { revalidate: 0 }, // Don't cache at Next.js level
    })

    if (!res.ok) {
      console.error(`Odds API error for ${sportKey}: ${res.status}`)
      return []
    }

    const data: OddsEvent[] = await res.json()
    cache.set(sportKey, { data, fetchedAt: Date.now() })

    const remaining = res.headers.get('x-requests-remaining')
    if (remaining) {
      console.log(`Odds API requests remaining: ${remaining}`)
    }

    return data
  } catch (err) {
    console.error(`Failed to fetch odds for ${sportKey}:`, err)
    return []
  }
}

export async function fetchAllLiveOdds(): Promise<OddsEvent[]> {
  const apiKey = process.env.ODDS_API_KEY
  if (!apiKey) return []

  const results = await Promise.all(
    SUPPORTED_SPORTS.map(sport => fetchLiveOdds(sport))
  )
  return results.flat()
}

export function extractBestOdds(event: OddsEvent): { home: number; draw: number | null; away: number } | null {
  if (!event.bookmakers?.length) return null

  let bestHome = 1
  let bestDraw: number | null = null
  let bestAway = 1

  for (const bookmaker of event.bookmakers) {
    const h2h = bookmaker.markets.find(m => m.key === 'h2h')
    if (!h2h) continue

    for (const outcome of h2h.outcomes) {
      if (outcome.name === event.home_team && outcome.price > bestHome) {
        bestHome = outcome.price
      } else if (outcome.name === event.away_team && outcome.price > bestAway) {
        bestAway = outcome.price
      } else if (outcome.name === 'Draw') {
        if (bestDraw === null || outcome.price > bestDraw) {
          bestDraw = outcome.price
        }
      }
    }
  }

  return { home: bestHome, draw: bestDraw, away: bestAway }
}

// Convert Odds API event into our internal prediction format
export function oddsEventToPrediction(event: OddsEvent): {
  homeTeam: string
  awayTeam: string
  league: string
  country: string
  matchDate: string
  prediction: string
  odds: number
  confidence: number
  reasoning: string
  isPremium: boolean
} | null {
  const bestOdds = extractBestOdds(event)
  if (!bestOdds) return null

  const { home, draw, away } = bestOdds

  // Derive prediction from implied probability
  const homeProb = 1 / home
  const awayProb = 1 / away
  const drawProb = draw ? 1 / draw : 0
  const total = homeProb + awayProb + drawProb

  const normHome = homeProb / total
  const normAway = awayProb / total

  let prediction: string
  let confidence: number
  let odds: number

  if (normHome > 0.55) {
    prediction = '1'
    confidence = Math.round(normHome * 100)
    odds = home
  } else if (normAway > 0.55) {
    prediction = '2'
    confidence = Math.round(normAway * 100)
    odds = away
  } else {
    prediction = 'X'
    confidence = Math.round((drawProb / total) * 100)
    odds = draw || home
  }

  // Minimum confidence floor
  confidence = Math.max(confidence, 55)

  const sport = event.sport_title
  const isPremium = confidence < 70

  const reasoning = `Live market data from ${event.bookmakers[0]?.title || 'multiple bookmakers'}. ${
    prediction === '1'
      ? `${event.home_team} are strong favourites with ${(normHome * 100).toFixed(0)}% implied probability.`
      : prediction === '2'
      ? `${event.away_team} are rated higher by the market at ${(normAway * 100).toFixed(0)}% implied probability.`
      : `Markets rate this as tight. Draw priced at ${draw?.toFixed(2) || 'N/A'}.`
  }`

  const sportLeagueMap: Record<string, { league: string; country: string }> = {
    'soccer_epl': { league: 'Premier League', country: 'England' },
    'soccer_spain_la_liga': { league: 'La Liga', country: 'Spain' },
    'soccer_uefa_champs_league': { league: 'Champions League', country: 'Europe' },
    'americanfootball_nfl': { league: 'NFL', country: 'USA' },
    'basketball_nba': { league: 'NBA', country: 'USA' },
  }

  const { league, country } = sportLeagueMap[event.sport_key] || { league: sport, country: 'International' }

  return {
    homeTeam: event.home_team,
    awayTeam: event.away_team,
    league,
    country,
    matchDate: event.commence_time,
    prediction,
    odds: parseFloat(odds.toFixed(2)),
    confidence,
    reasoning,
    isPremium,
  }
}
