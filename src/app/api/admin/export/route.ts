import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await query<{
    id: string
    email: string
    name: string | null
    plan: string
    subscription_status: string | null
    stripe_customer_id: string | null
    created_at: string
    last_login: string | null
    login_count: number
    last_ip: string | null
    last_country: string | null
    last_city: string | null
  }>(`
    SELECT
      u.id,
      u.email,
      u.name,
      u.plan,
      u.subscription_status,
      u.stripe_customer_id,
      u.created_at,
      MAX(s.created_at) AS last_login,
      COUNT(DISTINCT s.id) AS login_count,
      (SELECT s2.ip_address FROM sessions s2 WHERE s2.user_id = u.id ORDER BY s2.created_at DESC LIMIT 1) AS last_ip,
      (SELECT s2.country FROM sessions s2 WHERE s2.user_id = u.id ORDER BY s2.created_at DESC LIMIT 1) AS last_country,
      (SELECT s2.city FROM sessions s2 WHERE s2.user_id = u.id ORDER BY s2.created_at DESC LIMIT 1) AS last_city
    FROM users u
    LEFT JOIN sessions s ON s.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `)

  const header = [
    'ID',
    'Name',
    'Email',
    'Plan',
    'Subscription Status',
    'Stripe Customer ID',
    'Registered At',
    'Last Login',
    'Total Sessions',
    'Last IP',
    'Country',
    'City',
  ]

  const rows = users.map(u => [
    u.id,
    u.name ?? '',
    u.email,
    u.plan,
    u.subscription_status ?? '',
    u.stripe_customer_id ?? '',
    u.created_at,
    u.last_login ?? '',
    String(u.login_count),
    u.last_ip ?? '',
    u.last_country ?? '',
    u.last_city ?? '',
  ])

  const csv = [header, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="whinkpredict-users-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
