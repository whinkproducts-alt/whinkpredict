import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set — payment features will be disabled')
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-09-30.endive' as any,
    })
  : null

// Plan tier names: 'scout' (free) | 'edge' | 'sharp' | 'naye'
// Legacy 'free' and 'premium' values are mapped on read for backward compatibility

export const PLAN_PRICE_IDS: Record<string, string> = {
  edge: process.env.STRIPE_EDGE_PRICE_ID || '',
  sharp: process.env.STRIPE_SHARP_PRICE_ID || '',
  naye: process.env.STRIPE_NAYE_PRICE_ID || '',
  // Legacy — kept for any existing subscribers on the old premium plan
  premium: process.env.STRIPE_PREMIUM_PRICE_ID || '',
}

// Reverse map: Stripe price ID → internal plan name
export function planFromPriceId(priceId: string): string {
  for (const [plan, id] of Object.entries(PLAN_PRICE_IDS)) {
    if (id && id === priceId) return plan
  }
  return 'scout'
}

export function getPriceIdForPlan(plan: string): string | null {
  return PLAN_PRICE_IDS[plan] || null
}

export function isStripeEnabled(): boolean {
  return Boolean(stripe)
}

/** Normalise legacy 'free' and 'premium' plan values to new tier names */
export function normalisePlan(plan: string | null | undefined): string {
  if (!plan || plan === 'free') return 'scout'
  if (plan === 'premium') return 'naye' // legacy premium → top tier
  return plan
}

/** Plans that have full pick access (unlimited, all features) */
export const UNLIMITED_PLANS = new Set(['sharp', 'naye', 'premium'])

/** Plans that have paid access (edge and above) */
export const PAID_PLANS = new Set(['edge', 'sharp', 'naye', 'premium'])
