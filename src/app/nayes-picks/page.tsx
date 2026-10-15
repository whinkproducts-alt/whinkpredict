import Link from 'next/link'
import Navbar from '@/components/marketing/Navbar'
import { getNayesPicks, getNextFriday, getWeekRange } from '@/lib/nayes-picks'
import { Flame, Target, Trophy, Zap, ArrowLeft, Calendar, Clock, TrendingUp, Star, Lock } from 'lucide-react'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const SPORT_EMOJI: Record<string, string> = {
  Football: '⚽',
  Basketball: '🏀',
  Tennis: '🎾',
  'American Football': '🏈',
  Baseball: '⚾',
  Hockey: '🏒',
  MMA: '🥊',
  Cricket: '🏏',
  Rugby: '🏉',
  Volleyball: '🏐',
}

const TIER_CONFIG = {
  optimal: {
    label: 'Optimal Pick',
    icon: Trophy,
    color: '#CC944B',
    bg: 'rgba(204,148,75,0.12)',
    border: 'rgba(204,148,75,0.3)',
    badge: '🏆',
  },
  high: {
    label: 'High Confidence',
    icon: Flame,
    color: '#00E5A0',
    bg: 'rgba(0,229,160,0.1)',
    border: 'rgba(0,229,160,0.25)',
    badge: '🔥',
  },
}

export default async function NayesPicksPage() {
  // Check premium access
  const cookieStore = await cookies()
  const token = cookieStore.get('whink_session')?.value
  const user = token ? await validateSession(token) : null
  const isPremium = user?.plan === 'premium'

  const picks = getNayesPicks()
  const weekRange = getWeekRange()
  const nextFriday = getNextFriday()

  const optimalPicks = picks.filter(p => p.tier === 'optimal')
  const highPicks = picks.filter(p => p.tier === 'high')

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Navbar />

      {/* Header */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,229,160,0.4) 0%, transparent 65%)' }} />
        <div className="hero-grid opacity-50" />

        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8">
            <ArrowLeft size={16} />
            Back to WhinkPredict
          </Link>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1">
              {/* Naye avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,229,160,0.2), rgba(56,182,255,0.2))',
                    border: '2px solid rgba(0,229,160,0.4)',
                    boxShadow: '0 0 30px rgba(0,229,160,0.25)',
                  }}>
                  <div className="absolute inset-0 rounded-2xl animate-pulse opacity-30"
                    style={{ background: 'rgba(0,229,160,0.3)' }} />
                  <span className="text-3xl font-black relative z-10" style={{
                    background: 'linear-gradient(135deg, #00E5A0, #38B6FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>N</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">Naye&apos;s Picks</div>
                  <div className="text-sm font-semibold" style={{ color: '#00E5A0' }}>
                    AI Prediction Mascot · WhinkPredict
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
                This Week&apos;s{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #00E5A0, #38B6FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Elite Picks</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
                Naye drops only the sharpest picks — every sport, 90%+ confidence only.
                No noise. No filler. Just elite calls for the week ahead.
              </p>
            </div>

            {/* Meta card */}
            <div className="lg:w-72 glass-card p-6 shrink-0"
              style={{ border: '1px solid rgba(0,229,160,0.2)', background: 'rgba(0,229,160,0.03)' }}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(0,229,160,0.1)' }}>
                    <Calendar size={16} style={{ color: '#00E5A0' }} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Week Covered</div>
                    <div className="text-sm font-bold text-white">{weekRange}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(56,182,255,0.1)' }}>
                    <Clock size={16} style={{ color: '#38B6FF' }} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Next Refresh</div>
                    <div className="text-sm font-bold text-white">{nextFriday} · 0:00 AM</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(204,148,75,0.1)' }}>
                    <Target size={16} style={{ color: '#CC944B' }} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">Total Picks</div>
                    <div className="text-sm font-bold text-white">{picks.length} picks · 90%+ only</div>
                  </div>
                </div>

                <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    AI-generated picks · Live sports API coming soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-t border-b" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(14,21,32,0.5)' }}>
        <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-3 md:grid-cols-3 gap-6">
          {[
            { val: picks.length.toString(), label: 'Total Picks', icon: Target, color: '#38B6FF' },
            { val: '90%+', label: 'Min Confidence', icon: TrendingUp, color: '#00E5A0' },
            { val: optimalPicks.length.toString(), label: 'Optimal Tier', icon: Trophy, color: '#CC944B' },
          ].map(({ val, label, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color }}>{val}</div>
                <div className="text-xs text-slate-500 font-semibold">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Picks list */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Premium gate */}
          {!isPremium && (
            <div className="relative rounded-2xl overflow-hidden text-center py-16 px-8"
              style={{
                background: 'linear-gradient(135deg, rgba(56,182,255,0.06), rgba(0,229,160,0.04))',
                border: '1px solid rgba(56,182,255,0.2)',
              }}>
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle, #38B6FF 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(204,148,75,0.15)', border: '1px solid rgba(204,148,75,0.3)' }}>
                  <Lock size={26} style={{ color: '#CC944B' }} />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Premium Members Only</h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
                  Naye&apos;s Picks are exclusive to Premium subscribers. Upgrade now to access Naye&apos;s weekly elite selections, detailed reasoning, and 90%+ confidence picks.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/dashboard/settings#upgrade"
                    className="btn-primary px-8 py-3 text-sm font-bold">
                    <Zap size={14} />
                    Upgrade to Premium — $19/mo
                  </Link>
                  {!user && (
                    <Link href="/register"
                      className="btn-secondary px-8 py-3 text-sm font-bold">
                      Create Free Account
                    </Link>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-4">Cancel anytime · Secure payment via Stripe</p>
              </div>
            </div>
          )}

          {/* Optimal picks — premium only */}
          {isPremium && optimalPicks.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    background: 'rgba(204,148,75,0.1)',
                    border: '1px solid rgba(204,148,75,0.3)',
                  }}>
                  <Trophy size={16} style={{ color: '#CC944B' }} />
                  <span className="text-sm font-black" style={{ color: '#CC944B' }}>Optimal Picks</span>
                  <span className="text-xs text-slate-500">— 90%+ confidence</span>
                </div>
              </div>
              <div className="space-y-4">
                {optimalPicks.map((pick, i) => (
                  <PickCard key={i} pick={pick} index={i + 1} />
                ))}
              </div>
            </div>
          )}

          {/* High confidence picks — premium only */}
          {isPremium && highPicks.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    background: 'rgba(0,229,160,0.08)',
                    border: '1px solid rgba(0,229,160,0.2)',
                  }}>
                  <Flame size={16} style={{ color: '#00E5A0' }} />
                  <span className="text-sm font-black" style={{ color: '#00E5A0' }}>High Confidence</span>
                  <span className="text-xs text-slate-500">— 90–92% confidence</span>
                </div>
              </div>
              <div className="space-y-4">
                {highPicks.map((pick, i) => (
                  <PickCard key={i} pick={pick} index={optimalPicks.length + i + 1} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-xl mx-auto">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-3xl font-black mb-4">Get full access to Naye</h2>
          <p className="text-slate-400 mb-8">
            Premium members get exclusive access to Naye&apos;s Picks every week,
            plus unlimited predictions and the full analytics suite.
          </p>
          <Link href="/register?plan=premium" className="btn-primary text-base px-10 py-4 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #00E5A0, #38B6FF)' }}>
            <Zap size={18} />
            Go Premium — $19/mo
          </Link>
        </div>
      </section>
    </div>
  )
}

function PickCard({ pick, index }: {
  pick: {
    sport: string
    homeTeam: string
    awayTeam: string
    league: string
    matchDate: string
    prediction: string
    confidence: number
    odds: number
    tier: string
    reasoning: string
  },
  index: number
}) {
  const tier = TIER_CONFIG[pick.tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.high
  const emoji = SPORT_EMOJI[pick.sport] || '🏟️'

  return (
    <div className="glass-card glass-card-hover p-6 relative overflow-hidden group">
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: `linear-gradient(180deg, ${tier.color}, transparent)` }} />

      {/* Top accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }} />

      <div className="pl-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: match info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-lg">{emoji}</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{pick.sport}</span>
              <span className="text-slate-700">·</span>
              <span className="text-xs text-slate-500">{pick.league}</span>
              <span className="text-slate-700">·</span>
              <span className="text-xs text-slate-500">{pick.matchDate}</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-black text-white">{pick.homeTeam}</span>
              <span className="text-xs text-slate-600 font-bold">vs</span>
              <span className="text-sm font-black text-white">{pick.awayTeam}</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-lg">{pick.reasoning}</p>
          </div>

          {/* Right: pick details */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Pick number */}
            <div className="text-xs font-black text-slate-700 w-6 text-center">#{index}</div>

            {/* Prediction */}
            <div className="text-center">
              <div className="text-xs text-slate-500 font-semibold mb-1">Pick</div>
              <div className="text-2xl font-black px-4 py-2 rounded-xl"
                style={{
                  background: tier.bg,
                  border: `1px solid ${tier.border}`,
                  color: tier.color,
                }}>
                {pick.prediction}
              </div>
            </div>

            {/* Odds */}
            <div className="text-center">
              <div className="text-xs text-slate-500 font-semibold mb-1">Odds</div>
              <div className="text-xl font-black text-slate-200">{pick.odds.toFixed(2)}</div>
            </div>

            {/* Confidence */}
            <div className="text-center">
              <div className="text-xs text-slate-500 font-semibold mb-1">Confidence</div>
              <div className="flex items-center gap-1.5">
                <div className="text-2xl font-black" style={{ color: tier.color }}>{pick.confidence}%</div>
                <span className="text-base">{tier.badge}</span>
              </div>
              <div className="confidence-bar w-20 mt-1 h-1 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: `${pick.confidence}%`,
                    background: `linear-gradient(90deg, ${tier.color}, #38B6FF)`,
                  }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
