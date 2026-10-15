import { cookies } from 'next/headers'
import { validateSession } from '@/lib/auth'
import { getPredictions, getStats, seedPredictions } from '@/lib/predictions'
import PredictionCard from '@/components/ui/PredictionCard'
import { getNayesPicks } from '@/lib/nayes-picks'
import Link from 'next/link'
import {
  TrendingUp, Target, Trophy, Zap, ArrowRight,
  Flame, Activity, Star, BarChart3, Clock, CheckCircle2
} from 'lucide-react'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('whink_session')?.value!
  const user = (await validateSession(token))!

  await seedPredictions()
  const predictions = await getPredictions(user.plan, 6)
  const stats = getStats()
  const nayePicks = getNayesPicks().slice(0, 3)

  const statCards = [
    { label: 'Win Rate', value: `${stats.winRate}%`, sub: '+2.4% vs last week', icon: Trophy, color: '#00E5A0' },
    { label: "Today's Picks", value: stats.todaysPicks, sub: 'Updated live', icon: Target, color: '#38B6FF' },
    { label: 'Avg Confidence', value: `${stats.avgConfidence}%`, sub: 'Across all tiers', icon: TrendingUp, color: '#CC944B' },
    { label: 'Active Users', value: stats.activeUsers.toLocaleString(), sub: 'Predicting right now', icon: Activity, color: '#38B6FF' },
  ]

  const firstName = (user.name ?? 'User').split(' ')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* Hero header bar */}
      <div className="relative overflow-hidden px-6 lg:px-8 pt-8 pb-10"
        style={{
          background: 'linear-gradient(135deg, rgba(56,182,255,0.05) 0%, rgba(0,229,160,0.03) 50%, rgba(204,148,75,0.02) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
        <div className="absolute top-0 right-0 w-96 h-64 rounded-full pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(ellipse, rgba(56,182,255,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5 text-xs text-slate-600">
            <span style={{ color: 'rgba(56,182,255,0.5)' }}>Whink Group</span>
            <span>›</span>
            <span style={{ color: 'rgba(0,229,160,0.5)' }}>Whink Apps</span>
            <span>›</span>
            <span className="text-slate-400">WhinkPredict</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                  style={{ background: 'linear-gradient(135deg, #38B6FF, #00E5A0)', color: '#070B12' }}>
                  {firstName[0]}
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{greeting}</p>
                  <h1 className="text-2xl font-black text-white">{firstName} <span className="gradient-text">·</span> Dashboard</h1>
                </div>
              </div>
              <p className="text-slate-500 text-sm ml-0">
                {stats.todaysPicks} picks loaded · AI confidence updated 4 min ago
                <span className="inline-flex items-center gap-1 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 font-semibold">Live</span>
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {user.plan === 'free' && (
                <Link href="/dashboard/settings#upgrade"
                  className="btn-primary text-sm py-2 px-5">
                  <Zap size={14} />
                  Go Premium
                </Link>
              )}
              <Link href="/nayes-picks"
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold"
                style={{ background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.25)', color: '#00E5A0' }}>
                <Flame size={14} />
                Naye&apos;s Picks
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-8">

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="glass-card glass-card-hover p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(ellipse, ${color}20, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                  <Icon size={15} style={{ color }} />
                </div>
              </div>
              <div className="text-3xl font-black mb-1" style={{ color }}>{value}</div>
              <div className="text-xs text-slate-600">{sub}</div>
            </div>
          ))}
        </div>

        {/* Upgrade banner for free users */}
        {user.plan === 'free' && (
          <div className="relative overflow-hidden rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(56,182,255,0.08), rgba(0,229,160,0.05))',
              border: '1px solid rgba(56,182,255,0.2)',
            }}>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-10 font-black"
              style={{ color: '#38B6FF' }}>PRO</div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(56,182,255,0.15)', border: '1px solid rgba(56,182,255,0.25)' }}>
                  <Zap size={18} style={{ color: '#38B6FF' }} />
                </div>
                <div>
                  <p className="font-bold text-white">You&apos;re on the Free plan</p>
                  <p className="text-sm text-slate-400">Unlock Naye&apos;s Picks, optimal confidence scores &amp; full analytics</p>
                </div>
              </div>
              <Link href="/dashboard/settings#upgrade"
                className="btn-primary shrink-0 text-sm py-2.5 px-6">
                Upgrade — $19/mo <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Two column layout */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Picks — main area */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Today&apos;s Top Picks</h2>
                <p className="text-xs text-slate-500 mt-0.5">AI-ranked by confidence score</p>
              </div>
              <Link href="/dashboard/predictions"
                className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: '#38B6FF' }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {predictions.slice(0, 4).map((p, i) => (
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

          {/* Right sidebar */}
          <div className="space-y-5">

            {/* Naye widget */}
            <div className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: 'rgba(14,21,32,0.8)',
                border: '1px solid rgba(0,229,160,0.2)',
                boxShadow: '0 0 30px rgba(0,229,160,0.06)',
              }}>
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(0,229,160,0.4), transparent 60%)' }} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                    style={{ background: 'linear-gradient(135deg, rgba(0,229,160,0.2), rgba(56,182,255,0.2))', border: '1px solid rgba(0,229,160,0.3)' }}>
                    <span className="text-lg font-black" style={{ color: '#00E5A0' }}>N</span>
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">Naye&apos;s Picks</div>
                    <div className="text-xs font-semibold" style={{ color: '#00E5A0' }}>90%+ confidence only</div>
                  </div>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(0,229,160,0.12)', color: '#00E5A0', border: '1px solid rgba(0,229,160,0.25)' }}>
                    Live
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {nayePicks.map((pick, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl"
                      style={{ background: 'rgba(7,11,18,0.5)', border: '1px solid rgba(0,229,160,0.08)' }}>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-300 truncate">{pick.homeTeam} vs {pick.awayTeam}</div>
                        <div className="text-xs text-slate-600">{pick.sport}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded-lg"
                          style={{ background: 'rgba(0,229,160,0.12)', color: '#00E5A0' }}>
                          {pick.prediction}
                        </span>
                        <span className="text-xs font-bold" style={{ color: '#00E5A0' }}>{pick.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/nayes-picks"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: 'linear-gradient(135deg, rgba(0,229,160,0.15), rgba(56,182,255,0.1))', border: '1px solid rgba(0,229,160,0.2)', color: '#00E5A0' }}>
                  <Flame size={14} />
                  See all {getNayesPicks().length} picks
                </Link>
              </div>
            </div>

            {/* Quick stats card */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                <BarChart3 size={14} className="text-slate-500" />
                Your Performance
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Win Streak', val: '7 days', color: '#00E5A0' },
                  { label: 'Best Sport', val: 'Football', color: '#38B6FF' },
                  { label: 'ROI This Month', val: '+18.2%', color: '#CC944B' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-sm font-bold" style={{ color }}>{val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <Link href="/dashboard/analytics"
                  className="flex items-center justify-between text-xs font-semibold transition-colors"
                  style={{ color: '#38B6FF' }}>
                  Full analytics
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Recent activity */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                <Clock size={14} className="text-slate-500" />
                Recent Results
              </h3>
              <div className="space-y-2.5">
                {[
                  { match: 'Man City vs Arsenal', pick: '1X', result: 'WIN', color: '#00E5A0' },
                  { match: 'Lakers vs Warriors', pick: 'O220.5', result: 'WIN', color: '#00E5A0' },
                  { match: 'Djokovic vs Alcaraz', pick: 'DJOK', result: 'WIN', color: '#00E5A0' },
                  { match: 'Bayern vs Dortmund', pick: 'O2.5', result: 'LOSS', color: '#FF3B24' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-xs text-slate-300 truncate">{item.match}</div>
                      <div className="text-xs text-slate-600">{item.pick}</div>
                    </div>
                    <span className="text-xs font-black shrink-0 ml-2 px-2 py-0.5 rounded-full"
                      style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}25` }}>
                      {item.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom picks row */}
        {predictions.length > 4 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">More Picks</h2>
              <span className="text-xs text-slate-500">AI-curated for today</span>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {predictions.slice(4).map((p, i) => (
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
        )}

      </div>
    </div>
  )
}
