import { cookies } from 'next/headers'
import { validateSession } from '@/lib/auth'
import { getPredictions, seedPredictions } from '@/lib/predictions'
import PredictionCard from '@/components/ui/PredictionCard'
import { SlidersHorizontal, Trophy, Flame, Eye, LayoutGrid } from 'lucide-react'

export default async function PredictionsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('whink_session')?.value!
  const user = (await validateSession(token))!

  await seedPredictions()
  const predictions = await getPredictions(user.plan, 50)

  const optimal = predictions.filter(p => p.tier === 'optimal')
  const high = predictions.filter(p => p.tier === 'high')
  const watching = predictions.filter(p => p.tier === 'watching')

  const tierGroups = [
    { tier: 'optimal', label: 'Optimal Picks', emoji: '🏆', icon: Trophy, color: '#CC944B', border: 'rgba(204,148,75,0.3)', bg: 'rgba(204,148,75,0.08)', picks: optimal },
    { tier: 'high', label: 'High Confidence', emoji: '🔥', icon: Flame, color: '#38B6FF', border: 'rgba(56,182,255,0.25)', bg: 'rgba(56,182,255,0.07)', picks: high },
    { tier: 'watching', label: 'Worth Watching', emoji: '👀', icon: Eye, color: '#00E5A0', border: 'rgba(0,229,160,0.25)', bg: 'rgba(0,229,160,0.06)', picks: watching },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* Header */}
      <div className="relative overflow-hidden px-6 lg:px-8 pt-8 pb-8"
        style={{
          background: 'linear-gradient(135deg, rgba(56,182,255,0.04) 0%, rgba(0,229,160,0.02) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
        <div className="absolute top-0 right-0 w-72 h-40 pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(56,182,255,0.4), transparent 70%)', filter: 'blur(40px)' }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wider">WhinkPredict</p>
            <h1 className="text-2xl font-black text-white">All Predictions</h1>
            <p className="text-slate-500 text-sm mt-1">
              {predictions.length} picks today
              <span className="ml-2 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-semibold text-xs">Live</span>
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <SlidersHorizontal size={14} />
            <span className="font-semibold">AI-ranked by confidence</span>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-10">

        {/* Quick stat pills */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'All Picks', count: predictions.length, color: '#38B6FF', bg: 'rgba(56,182,255,0.12)', border: 'rgba(56,182,255,0.25)', icon: LayoutGrid },
            { label: 'Optimal', count: optimal.length, color: '#CC944B', bg: 'rgba(204,148,75,0.1)', border: 'rgba(204,148,75,0.25)', icon: Trophy },
            { label: 'High Confidence', count: high.length, color: '#38B6FF', bg: 'rgba(56,182,255,0.08)', border: 'rgba(56,182,255,0.2)', icon: Flame },
            { label: 'Watching', count: watching.length, color: '#00E5A0', bg: 'rgba(0,229,160,0.08)', border: 'rgba(0,229,160,0.2)', icon: Eye },
          ].map(({ label, count, color, bg, border, icon: Icon }) => (
            <div key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: bg, border: `1px solid ${border}`, color }}>
              <Icon size={13} />
              {label}
              <span className="text-xs font-black px-1.5 py-0.5 rounded-full"
                style={{ background: `${color}20` }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Tiered groups */}
        {tierGroups.map(({ tier, label, emoji, icon: Icon, color, border, bg, picks }) => picks.length > 0 && (
          <div key={tier}>
            {/* Section header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: bg, border: `1px solid ${border}` }}>
                <Icon size={14} style={{ color }} />
                <span className="text-sm font-black" style={{ color }}>{emoji} {label}</span>
                <span className="text-xs text-slate-500">· {picks.length} picks</span>
              </div>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${border}, transparent)` }} />
            </div>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {picks.map((p, i) => (
                <PredictionCard key={i}
                  homeTeam={p.match.homeTeam}
                  awayTeam={p.match.awayTeam}
                  league={p.match.league}
                  country={p.match.country}
                  matchDate={p.match.matchDate}
                  prediction={p.prediction}
                  confidence={p.confidence}
                  tier={p.tier}
                  odds={p.odds}
                  isPremium={p.isPremium}
                  reasoning={p.reasoning}
                />
              ))}
            </div>
          </div>
        ))}

        {predictions.length === 0 && (
          <div className="glass-card p-16 flex flex-col items-center text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="font-black text-white mb-2">No predictions yet</h3>
            <p className="text-sm text-slate-500">Today's picks are being loaded. Check back soon.</p>
          </div>
        )}

      </div>
    </div>
  )
}
