import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { query, run } from '@/lib/db'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

async function updateUserPlan(stripeCustomerId: string, plan: string, subscriptionId: string | null, status: string) {
  const users = await query<{ id: string }>(
    'SELECT id FROM users WHERE stripe_customer_id = ?',
    [stripeCustomerId]
  )

  if (users.length === 0) {
    console.error('No user found for Stripe customer:', stripeCustomerId)
    return
  }

  await run(
    `UPDATE users
     SET plan = ?, stripe_subscription_id = ?, subscription_status = ?, updated_at = datetime('now')
     WHERE stripe_customer_id = ?`,
    [plan, subscriptionId, status, stripeCustomerId]
  )
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
          await updateUserPlan(
            session.customer as string,
            'premium',
            session.subscription as string,
            'active'
          )
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const isActive = ['active', 'trialing'].includes(sub.status)
        await updateUserPlan(
          sub.customer as string,
          isActive ? 'premium' : 'free',
          sub.id,
          sub.status
        )
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await updateUserPlan(
          sub.customer as string,
          'free',
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
            'free',
            invoice.subscription || null,
            'past_due'
          )
        }
        break
      }

      default:
        // Unhandled event type — log and ignore
        console.log('Unhandled Stripe event:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook processing error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
