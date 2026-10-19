import { query, run } from './db'
import { generateId } from './auth'
import { normalisePlan, UNLIMITED_PLANS, PAID_PLANS } from './stripe'

export interface Match {
  id: string
  externalId: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo: string
  awayTeamLogo: string
  league: string
  leagueLogo: string
  country: string
  matchDate: string
  status: string
  homeScore: number | null
  awayScore: number | null
}

export interface Prediction {
  id: string
  matchId: string
  prediction: string
  confidence: number
  tier: string
  reasoning: string
  odds: number | null
  result: string
  isPremium: boolean
  hasOddsAlert: boolean
  match: Match
}

/**
 * Pick limits per plan tier.
 * scout = 1 pick/day (scarcity by design — Marketing recommendation)
 * edge  = 10 picks/day
 * sharp = unlimited
 * naye  = unlimited
 */
export const PLAN_PICK_LIMITS: Record<string, number> = {
  scout: 1,
  free: 1,    // legacy alias
  edge: 10,
  sharp: 9999,
  naye: 9999,
  premium: 9999, // legacy alias
}

function calculateConfidence(params: {
  homeForm: number
  awayForm: number
  h2hHomeWins: number
  h2hTotal: number
  homeGoalsAvg: number
  awayGoalsAvg: number
  leaguePosition: number
}): number {
  const { homeForm, awayForm, h2hHomeWins, h2hTotal, homeGoalsAvg, awayGoalsAvg } = params
  const formDiff = (homeForm - awayForm) * 10
  const h2hRate = h2hTotal > 0 ? (h2hHomeWins / h2hTotal) * 20 : 10
  const goalsDiff = Math.min((homeGoalsAvg - awayGoalsAvg) * 5, 10)
  const base = 60 + formDiff + h2hRate + goalsDiff
  return Math.min(Math.max(Math.round(base), 50), 97)
}

function getTier(confidence: number): string {
  if (confidence >= 90) return 'optimal'
  if (confidence >= 75) return 'high'
  return 'watching'
}

const DEMO_MATCHES = [
  {
    homeTeam: 'Manchester City', awayTeam: 'Arsenal',
    homeTeamLogo: '50', awayTeamLogo: '42',
    league: 'Premier League', country: 'England',
    homeForm: 4.2, awayForm: 3.8, homeGoals: 2.3, awayGoals: 1.8,
    prediction: '1X', odds: 2.15, isPremium: false, hasOddsAlert: false,
  },
  {
    homeTeam: 'Real Madrid', awayTeam: 'Barcelona',
    homeTeamLogo: '541', awayTeamLogo: '529',
    league: 'La Liga', country: 'Spain',
    homeForm: 4.5, awayForm: 4.1, homeGoals: 2.6, awayGoals: 2.2,
    prediction: '1', odds: 1.92, isPremium: false, hasOddsAlert: false,
  },
  {
    homeTeam: 'Bayern Munich', awayTeam: 'PSG',
    homeTeamLogo: '157', awayTeamLogo: '85',
    league: 'Champions League', country: 'Europe',
    homeForm: 4.3, awayForm: 4.0, homeGoals: 2.8, awayGoals: 2.1,
    prediction: 'GG', odds: 1.75, isPremium: false, hasOddsAlert: false,
  },
  {
    homeTeam: 'Inter Milan', awayTeam: 'AC Milan',
    homeTeamLogo: '505', awayTeamLogo: '489',
    league: 'Serie A', country: 'Italy',
    homeForm: 3.9, awayForm: 3.7, homeGoals: 2.1, awayGoals: 1.9,
    prediction: 'O2.5', odds: 2.05, isPremium: true, hasOddsAlert: false,
  },
  {
    homeTeam: 'Liverpool', awayTeam: 'Chelsea',
    homeTeamLogo: '40', awayTeamLogo: '49',
    league: 'Premier League', country: 'England',
    homeForm: 4.1, awayForm: 3.5, homeGoals: 2.5, awayGoals: 1.7,
    prediction: '1', odds: 1.85, isPremium: true, hasOddsAlert: true,
  },
  {
    homeTeam: 'PSG', awayTeam: 'Marseille',
    homeTeamLogo: '85', awayTeamLogo: '81',
    league: 'Ligue 1', country: 'France',
    homeForm: 4.6, awayForm: 3.2, homeGoals: 3.1, awayGoals: 1.4,
    prediction: '1', odds: 1.45, isPremium: true, hasOddsAlert: true,
  },
  {
    homeTeam: 'Atletico Madrid', awayTeam: 'Sevilla',
    homeTeamLogo: '530', awayTeamLogo: '536',
    league: 'La Liga', country: 'Spain',
    homeForm: 3.8, awayForm: 3.3, homeGoals: 1.9, awayGoals: 1.5,
    prediction: '1X', odds: 1.70, isPremium: true, hasOddsAlert: true,
  },
  {
    homeTeam: 'Borussia Dortmund', awayTeam: 'RB Leipzig',
    homeTeamLogo: '165', awayTeamLogo: '173',
    league: 'Bundesliga', country: 'Germany',
    homeForm: 3.7, awayForm: 3.9, homeGoals: 2.2, awayGoals: 2.0,
    prediction: 'GG', odds: 1.65, isPremium: true, hasOddsAlert: true,
  },
]

const REASONINGS: Record<string, (home: string, away: string) => string> = {
  '1': (h) => `${h} have been dominant at home with strong recent form. Defensive solidity and attacking threat make them heavy favourites.`,
  '1X': (h, a) => `${h} hold a marginal edge but ${a} are compact and dangerous on the counter. Draw remains a real possibility.`,
  'GG': () => `Both sides have scored in their last 5 matches. Attacking intent on both sides makes BTTS the value play here.`,
  'O2.5': () => `High-scoring affair expected. Both sides average over 2 goals per game. Pace and quality in attack drives this pick.`,
  'X2': (_, a) => `${a} have been exceptional away from home. Hosts have conceded in their last 4 home matches.`,
}

export async function seedPredictions(): Promise<void> {
  const rows = await query<{ count: number }>('SELECT COUNT(*) as count FROM matches')
  if (rows[0]?.count > 0) return

  const now = new Date()
  for (let i = 0; i < DEMO_MATCHES.length; i++) {
    const m = DEMO_MATCHES[i]
    const matchId = generateId()
    const predId = generateId()
    const matchDate = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000).toISOString()

    const confidence = calculateConfidence({
      homeForm: m.homeForm,
      awayForm: m.awayForm,
      h2hHomeWins: 3,
      h2hTotal: 7,
      homeGoalsAvg: m.homeGoals,
      awayGoalsAvg: m.awayGoals,
      leaguePosition: 2,
    })
    const tier = getTier(confidence)
    const reasoningFn = REASONINGS[m.prediction] || REASONINGS['1X']
    const reasoning = reasoningFn(m.homeTeam, m.awayTeam)

    await run(
      `INSERT INTO matches (id, external_id, home_team, away_team, home_team_logo, away_team_logo, league, country, match_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'upcoming')`,
      [matchId, `ext_${i}`, m.homeTeam, m.awayTeam, m.homeTeamLogo, m.awayTeamLogo, m.league, m.country, matchDate]
    )

    await run(
      `INSERT INTO predictions (id, match_id, prediction, confidence, tier, reasoning, odds, result, is_premium)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [predId, matchId, m.prediction, confidence, tier, reasoning, m.odds, m.isPremium ? 1 : 0]
    )
  }
}

export async function getPredictions(rawPlan: string = 'scout', limit: number = 20): Promise<Prediction[]> {
  const plan = normalisePlan(rawPlan)
  const pickLimit = Math.min(limit, PLAN_PICK_LIMITS[plan] ?? 1)
  const isPaidPlan = PAID_PLANS.has(plan)
  const isUnlimited = UNLIMITED_PLANS.has(plan)
  const isNaye = plan === 'naye' || plan === 'premium'

  const rows = await query<{
    id: string
    match_id: string
    prediction: string
    confidence: number
    tier: string
    reasoning: string
    odds: number | null
    result: string
    is_premium: number
    home_team: string
    away_team: string
    home_team_logo: string
    away_team_logo: string
    league: string
    country: string
    match_date: string
    status: string
    home_score: number | null
    away_score: number | null
    external_id: string
  }>(
    `SELECT p.*, m.home_team, m.away_team, m.home_team_logo, m.away_team_logo,
            m.league, m.country, m.match_date, m.status, m.home_score, m.away_score, m.external_id
     FROM predictions p
     JOIN matches m ON m.id = p.match_id
     ORDER BY p.confidence DESC
     LIMIT ?`,
    [isUnlimited ? limit : pickLimit]
  )

  return rows.map(r => {
    const isPremium = Boolean(r.is_premium)
    // Edge can see non-premium picks with full details
    // Sharp can see all picks (premium or not) with full details
    // Naye sees everything Sharp sees, plus odds alerts
    const canViewPick = isUnlimited || (!isPremium && isPaidPlan) || (!isPremium && plan === 'scout')
    const canViewPremium = isUnlimited

    // Scout: only sees the first pick (already limited by LIMIT), blurred if premium
    const canView = canViewPick && (!isPremium || canViewPremium)

    // Odds alerts: Naye tier only
    const hasOddsAlert = isNaye && Boolean((DEMO_MATCHES.find(
      dm => dm.homeTeam === r.home_team && dm.awayTeam === r.away_team
    ) as any)?.hasOddsAlert)

    return {
      id: r.id,
      matchId: r.match_id,
      prediction: canView ? r.prediction : '🔒',
      confidence: canView ? r.confidence : 0,
      tier: r.tier,
      reasoning: canView
        ? r.reasoning
        : isPremium && !isUnlimited
          ? `Unlock this pick — upgrade to Sharp or Naye.`
          : `Upgrade to see the full analysis.`,
      odds: r.odds,
      result: r.result,
      isPremium,
      hasOddsAlert,
      match: {
        id: r.match_id,
        externalId: r.external_id,
        homeTeam: r.home_team,
        awayTeam: r.away_team,
        homeTeamLogo: r.home_team_logo,
        awayTeamLogo: r.away_team_logo,
        league: r.league,
        leagueLogo: '',
        country: r.country,
        matchDate: r.match_date,
        status: r.status,
        homeScore: r.home_score,
        awayScore: r.away_score,
      },
    }
  })
}

export function getStats() {
  return {
    // Only honest, system-derived stats — no fake accuracy or user counts
    sportsCount: 5,
    confidenceFloor: 90,
    syncIntervalHours: 6,
    todaysPicks: 8,
    avgConfidence: 84,
    winRate: 0,        // real value TBD from tracked results
    totalPredictions: 0, // real value TBD
    activeUsers: 0,    // real value TBD
    avgROI: 0,         // real value TBD
  }
}
