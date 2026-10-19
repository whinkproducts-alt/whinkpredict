import { cookies } from 'next/headers'
import { validateSession } from '@/lib/auth'
import { normalisePlan } from '@/lib/stripe'
import Link from 'next/link'
import { Check, Zap, Bell, Flame, Star } from 'lucide-react'
import UpgradeButton from '@/components/ui/UpgradeButton'

export const dynamic = 'force-dynamic'

const TIERS = [
  {
    id: 'scout',
    name: 'Scout',
    price: '$0',
    period: 'forever',
    tagline: 'Start here. See what the model sees.',
    color: '#64748b',
    icon: Star,
    features: [
      '1 pick per day',
      'Basic confidence score',
      'All sports covered',
      'No credit card required',
    ],
    cta: null, // Free — no button
    plan: null,
  },
  {
    id: 'edge',
    name: 'Edge',
    price: '$4.99',
    period: '/month',
    tagline: '$5 gets you the advantage. No guessing.',
    color: '#38B6FF',
    icon: Zap,
    features: [
      '10 picks per day',
      'Full confidence scoring',
      'All sports — EPL, NBA, NFL, UCL, La Liga',
      'Performance tracking dashboard',
      '7-day free trial',
    ],
    cta: 'Get Edge',
    plan: 'edge' as const,
  },
  {
    id: 'sharp',
    name: 'Sharp',
    price: '$12',
    period: '/month',
    tagline: 'The line moved. Did you see it before it did?',
    color: '#00E5A0',
    icon: Bell,
    highlight: true,
    features: [
      'Unlimited picks',
      'Real-time line movement alerts',
      'Full analytics dashboard',
      'All Edge features included',
      '7-day free trial',
    ],
    cta: 'Go Sharp',
    plan: 'sharp' as const,
  },
  {
    id: 'naye',
    name: 'Naye',
    price: '$19',
    period: '/month',
    tagline: "Every Friday, Naye's highest conviction picks drop. Exclusively here.",
    color: '#CC944B',
    icon: Flame,
    features: [
      "Naye's Weekly Picks — Friday drops",
      'Highest conviction picks only',
      'All Sharp features included',
      'Real-time odds alerts',
      '7-day free trial',
    ],
    cta: 'Join Naye',
    plan: 'naye' as const,
  },
]

export default async function PricingPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('whink_session')?.value
  const user = token ? await validateSession(token) : null
  const currentPlan = normalisePlan(user?.plan)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* Header */}
      <div className="text-center px-6 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: 'rgba(56,182,255,0.1)', border: '1px solid rgba(56,182,255,0.2)', color: '#38B6FF' }}>
          Simple, honest pricing
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
          Pick your <span className="gradient-text">advantage</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Start free. Upgrade when you need more signal. No lock-in. Cancel any time.
        </p>
      </div>

      {/* Tier grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {TIERS.map((tier) => {
            const Icon = tier.icon
            const isCurrent = currentPlan === tier.id
            const isHighlight = tier.highlight

            return (
              <div
                key={tier.id}
                className="relative flex flex-col rounded-2xl p-6 overflow-hidden"
                style={{
                  background: isHighlight
                    ? `linear-gradient(160deg, rgba(0,229,160,0.08), rgba(56,182,255,0.04))`
                    : 'rgba(14,21,32,0.8)',
                  border: isHighlight
                    ? `1px solid rgba(0,229,160,0.35)`
                    : `1px solid rgba(255,255,255,0.06)`,
                  boxShadow: isHighlight ? '0 0 40px rgba(0,229,160,0.08)' : 'none',
                }}
              >
                {isHighlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-black"
                    style={{ background: 'linear-gradient(135deg, #00E5A0, #38B6FF)', color: '#070B12' }}>
                    Most Popular
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: `${tier.color}18`, color: tier.color, border: `1px solid ${tier.color}30` }}>
                    Your plan
                  </div>
                )}

                {/* Icon + name */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${tier.color}15`, border: `1px solid ${tier.color}25` }}>
                    <Icon size={18} style={{ color: tier.color }} />
                  </div>
                  <div>
                    <div className="text-lg font-black text-white">{tier.name}</div>
                    <div className="text-xs text-slate-500">{tier.tagline}</div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black" style={{ color: tier.color }}>{tier.price}</span>
                    <span className="text-sm text-slate-500">{tier.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={14} className="mt-0.5 shrink-0" style={{ color: tier.color }} />
                      <span className="text-sm text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {tier.cta && tier.plan && !isCurrent ? (
                  <UpgradeButton
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${
                      isHighlight ? 'btn-primary' : ''
                    }`}
                    label={tier.cta}
                    plan={tier.plan}
                  />
                ) : isCurrent ? (
                  <div className="w-full py-3 rounded-xl text-sm font-bold text-center"
                    style={{ background: `${tier.color}10`, color: tier.color, border: `1px solid ${tier.color}20` }}>
                    Current plan
                  </div>
                ) : !user && tier.id === 'scout' ? (
                  <Link href="/register"
                    className="w-full py-3 rounded-xl text-sm font-bold text-center block transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Get started free
                  </Link>
                ) : (
                  <div className="w-full py-3 rounded-xl text-sm font-bold text-center"
                    style={{ background: 'rgba(255,255,255,0.03)', color: '#64748b', border: '1px solid rgba(255,255,255,0.05)' }}>
                    Free forever
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Naye preview note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Naye&apos;s picks go live with a full public track record. Every pick is logged with the date, the call, and the result.
            You see the ledger before you pay.
          </p>
        </div>

        {/* Responsible gambling footer */}
        <div className="mt-10 p-4 rounded-xl text-xs text-slate-500 leading-relaxed max-w-lg mx-auto text-center"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <strong className="text-slate-400">Bet responsibly.</strong> WhinkPredict is an informational tool.
          Predictions are based on statistical analysis of live market odds — they are not guarantees.
          Gambling involves risk. Only bet what you can afford to lose.{' '}
          <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer"
            className="underline hover:text-slate-300 transition-colors">BeGambleAware.org</a>
        </div>
      </div>
    </div>
  )
}
