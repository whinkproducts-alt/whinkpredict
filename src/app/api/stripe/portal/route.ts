import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { stripe, isStripeEnabled } from '@/lib/stripe'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  if (!isStripeEnabled()) {
    return NextResponse.json({ error: 'Payment processing not configured' }, { status: 503 })
  }

  const token = req.cookies.get('whink_session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await validateSession(token)
  if (!user) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

  const users = await query<{ stripe_customer_id: string | null }>(
    'SELECT stripe_customer_id FROM users WHERE id = ?',
    [user.id]
  )

  const customerId = users[0]?.stripe_customer_id
  if (!customerId) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://whinkpredict.onrender.com'

  const portalSession = await stripe!.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/dashboard`,
  })

  return NextResponse.json({ url: portalSession.url })
}
