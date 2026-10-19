import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { stripe, getPriceIdForPlan, isStripeEnabled, normalisePlan } from '@/lib/stripe'
import { query, run } from '@/lib/db'

const UPGRADEABLE_PLANS = ['edge', 'sharp', 'naye']

export async function POST(req: NextRequest) {
  if (!isStripeEnabled()) {
    return NextResponse.json({ error: 'Payment processing not configured' }, { status: 503 })
  }

  const token = req.cookies.get('whink_session')?.value
  if (!token) {
    return NextResponse.json({ error: 'You must be logged in to upgrade' }, { status: 401 })
  }

  const user = await validateSession(token)
  if (!user) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const requestedPlan: string = body.plan || 'naye'

  if (!UPGRADEABLE_PLANS.includes(requestedPlan)) {
    return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
  }

  const currentPlan = normalisePlan(user.plan)
  if (currentPlan === requestedPlan) {
    return NextResponse.json({ error: `You are already on the ${requestedPlan} plan` }, { status: 400 })
  }

  const priceId = getPriceIdForPlan(requestedPlan)
  if (!priceId) {
    return NextResponse.json(
      { error: `The ${requestedPlan} plan is not yet available. Check back soon.` },
      { status: 503 }
    )
  }

  try {
    // Find or create Stripe customer
    const users = await query<{ stripe_customer_id: string | null }>(
      'SELECT stripe_customer_id FROM users WHERE id = ?',
      [user.id]
    )
    let customerId = users[0]?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe!.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { whink_user_id: user.id },
      })
      customerId = customer.id
      await run(
        `UPDATE users SET stripe_customer_id = ?, updated_at = datetime('now') WHERE id = ?`,
        [customerId, user.id]
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://whinkpredict.onrender.com'

    const session = await stripe!.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?upgraded=true&plan=${requestedPlan}`,
      cancel_url: `${baseUrl}/pricing`,
      subscription_data: {
        trial_period_days: 7,
        metadata: { whink_user_id: user.id, plan: requestedPlan },
      },
      metadata: { whink_user_id: user.id, plan: requestedPlan },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
