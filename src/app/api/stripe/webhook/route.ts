import { NextRequest, NextResponse } from 'next/server'
import { stripe, planFromPriceId } from '@/lib/stripe'
import { query, run } from '@/lib/db'
import { captureServerEvent } from '@/lib/posthog'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

async function updateUserPlan(
  stripeCustomerId: string,
  plan: string,
  subscriptionId: string | null,
  status: string
) {
  const users = await query<{ id: string }>(
    'SELECT id FROM users WHERE stripe_customer_id = ?',
    [stripeCustomerId]
  )

  if (users.length === 0) {
    console.error('No user found for Stripe customer:', stripeCustomerId)
    return
  }

  const userId = users[0].id

  await run(
    `UPDATE users
     SET plan = ?, stripe_subscription_id = ?, subscription_status = ?, updated_at = datetime('now')
     WHERE stripe_customer_id = ?`,
    [plan, subscriptionId, status, stripeCustomerId]
  )

  if (plan !== 'scout' && status === 'active') {
    captureServerEvent(userId, 'user_upgraded', {
      plan,
      stripe_customer_id: stripeCustomerId,
      subscription_id: subscriptionId,
    })
  } else if (plan === 'scout') {
    captureServerEvent(userId, 'user_downgraded_to_scout', {
      stripe_customer_id: stripeCustomerId,
    })
  }
}

function getPlanFromSubscription(sub: Stripe.Subscription): string {
  // Try to get the plan from subscription metadata first (set at checkout)
  const metaPlan = sub.metadata?.plan
  if (metaPlan && ['edge', 'sharp', 'naye'].includes(metaPlan)) return metaPlan

  // Fall back to price ID lookup
  const priceId = sub.items?.data?.[0]?.price?.id
  if (priceId) return planFromPriceId(priceId)

  return 'scout'
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription' && session.customer) {
          // Prefer metadata plan from checkout session
          const plan = session.metadata?.plan || 'naye'
          await updateUserPlan(
            session.customer as string,
            plan,
            session.subscription as string,
            'active'
          )
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const isActive = ['active', 'trialing'].includes(sub.status)
        const plan = isActive ? getPlanFromSubscription(sub) : 'scout'
        await updateUserPlan(
          sub.customer as string,
          plan,
          sub.id,
          sub.status
        )
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await updateUserPlan(
          sub.customer as string,
          'scout',
          null,
          'cancelled'
        )
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null }
        if (invoice.customer) {
          await updateUserPlan(
            invoice.customer as string,
            'scout',
            invoice.subscription || null,
            'past_due'
          )
        }
        break
      }

      default:
        console.log('Unhandled Stripe event:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook processing error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
