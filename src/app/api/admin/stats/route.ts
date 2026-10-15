import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [totals, planBreakdown, signupsByDay, loginsByDay] = await Promise.all([
    query<{
      total_users: number
      premium_users: number
      free_users: number
      total_sessions: number
    }>(`
      SELECT
        COUNT(*) AS total_users,
        SUM(CASE WHEN plan = 'premium' THEN 1 ELSE 0 END) AS premium_users,
        SUM(CASE WHEN plan = 'free' THEN 1 ELSE 0 END) AS free_users,
        0 AS total_sessions
      FROM users
    `),
    query<{ plan: string; count: number }>(`
      SELECT plan, COUNT(*) AS count FROM users GROUP BY plan
    `),
    query<{ date: string; signups: number }>(`
      SELECT
        date(created_at) AS date,
        COUNT(*) AS signups
      FROM users
      WHERE created_at >= date('now', '-30 days')
      GROUP BY date(created_at)
      ORDER BY date ASC
    `),
    query<{ date: string; logins: number }>(`
      SELECT
        date(created_at) AS date,
        COUNT(*) AS logins
      FROM sessions
      WHERE created_at >= date('now', '-30 days')
      GROUP BY date(created_at)
      ORDER BY date ASC
    `),
  ])

  return NextResponse.json({
    totals: totals[0] || {},
    planBreakdown,
    signupsByDay,
    loginsByDay,
  })
}
