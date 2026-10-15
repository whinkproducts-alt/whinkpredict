import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/marketing/Navbar'
import PredictionCard from '@/components/ui/PredictionCard'
import {
  Brain, BarChart3, Shield, Zap,
  TrendingUp, CheckCircle, ArrowRight,
  Star, Activity, Flame, ChevronDown, Database, Eye
} from 'lucide-react'

const DEMO_PREDICTIONS = [
  { homeTeam: 'Man City', awayTeam: 'Man Utd', league: 'Premier League', country: 'England', prediction: 'O2.5', confidence: 94, tier: 'optimal', odds: 1.85, isPremium: false },
  { homeTeam: 'Lakers', awayTeam: 'Celtics', league: 'NBA', country: 'USA', prediction: 'O220.5', confidence: 91, tier: 'high', odds: 1.92, isPremium: false },
  { homeTeam: 'Barcelona', awayTeam: 'PSG', league: 'Champions League', country: 'Europe', prediction: 'O1.5', confidence: 93, tier: 'optimal', odds: 1.72, isPremium: false },
  { homeTeam: 'KC Chiefs', awayTeam: 'Eagles', league: 'NFL', country: 'USA', prediction: '-3', confidence: 92, tier: 'optimal', odds: 1.91, isPremium: false },
]

const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    badge: 'Live Data',
    desc: 'Our engine pulls real-time odds from major bookmakers across 5+ sports, converting market signals into actionable confidence scores. Every pick is driven by data — not gut feeling.',
    color: '#38B6FF',
  },
  {
    icon: Eye,
    title: 'Full Transparency',
    badge: 'No Black Boxes',
    desc: 'Every prediction shows you the exact confidence score, the implied probability behind it, and why the model favours that outcome. You see the reasoning — always.',
    color: '#00E5A0',
  },
  {
    icon: BarChart3,
    title: 'Performance Tracking',
    badge: 'Your Dashboard',
    desc: 'Track every pick you follow over time. Visualise your win rate, ROI, and betting history with interactive charts. Know what\'s working before you commit another stake.',
    color: '#CC944B',
  },
  {
    icon: Shield,
    title: 'Responsible by Design',
    badge: 'Bet Safely',
    desc: 'No guaranteed wins. No inflated claims. WhinkPredict surfaces high-confidence opportunities — what you do with them is your decision. We build tools for informed bettors.',
    color: '#38B6FF',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Live Odds Ingested', desc: 'Our engine continuously pulls odds from multiple bookmakers across football, basketball, NFL and more. When odds move, we know.' },
  { step: '02', title: 'Confidence Scoring', desc: 'Implied probabilities are extracted from market odds, cross-referenced across bookmakers, and scored. Only picks clearing 90%+ confidence make the cut.' },
  { step: '03', title: 'You Pick Your Plays', desc: 'Browse predictions by sport, confidence tier, or Naye\'s curated weekly shortlist. All picks come with transparent reasoning — you decide what to back.' },
]

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['3 picks per day', 'Basic confidence scoring', 'Worth Watching tier', 'Weekly performance reports'],
    cta: 'Start Free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$19',
    period: 'per month',
    features: ["Naye's Weekly Picks (exclusive)", 'Unlimited picks', 'Full confidence scoring', 'Real-time odds monitoring', 'Advanced analytics dashboard', 'Performance tracking'],
    cta: 'Upgrade to Premium',
    href: '/register?plan=premium',
    highlight: true,
  },
]

const FAQ = [
  {
    q: 'How does WhinkPredict generate predictions?',
    a: 'We pull live odds from major bookmakers and use implied probability to score each outcome. When the market strongly favours a result across multiple books, that becomes a high-confidence pick. It\'s systematic — not editorial. No tips from insiders, no hot takes.',
  },
  {
    q: 'Are the predictions guaranteed to win?',
    a: 'No. Sports betting always carries risk, and no prediction system eliminates it. Our confidence scores reflect statistical probability based on market data — high-confidence picks have a strong signal behind them, but outcomes are never certain. Bet only what you can afford to lose.',
  },
  {
    q: 'What sports does WhinkPredict cover?',
    a: 'Currently: football (soccer) including EPL, La Liga and Champions League; NBA basketball; NFL. More sports are added as we expand our data coverage.',
  },
  {
    q: "What is Naye's Picks?",
    a: "Naye is WhinkPredict's AI prediction character. Every Friday at midnight, Naye curates a shortlist of 5–10 high-conviction picks for the coming week — all clearing 90%+ confidence — across all available sports. It's our editorial layer on top of the model.",
  },
  {
    q: 'Can I cancel my Premium subscription?',
    a: 'Yes. Cancel anytime from your account dashboard under Settings. Your Premium access continues until the end of your current billing period. See our Refund Policy for the 7-day money-back guarantee.',
  },
  {
    q: 'How often are predictions updated?',
    a: "Predictions sync from live odds every 6 hours. Naye's weekly picks refresh every Friday at midnight. You're always seeing current market-derived signals, not stale data.",
  },
]

export default function HomePage() {
  return (
    <div className="marketing-site min-h-screen">
      <Navbar />

      {/* ========== HERO ========== */}
      <section className="relative pt-36 pb-0 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0b0c0e 0%, #111820 100%)' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-12 px-6 pb-20 relative z-10">
          <div className="max-w-2xl">
            {/* Category badge */}
            <div className="inline-flex items-center gap-2 py-2 mb-6 text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: '#77a4ff' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI Sports Intelligence · By Whink Apps
            </div>

            {/* Main headline */}
            <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-6 leading-[0.94]">
              <span className="block text-white">Stop Guessing.</span>
              <span className="block" style={{
                background: 'linear-gradient(135deg, #38B6FF 0%, #00E5A0 50%, #CC944B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Start Knowing.</span>
            </h1>

            <p className="text-xl text-slate-300 max-w-xl mb-9 leading-relaxed">
              AI-powered sports predictions built on live bookmaker odds.
              <strong className="text-white"> See the confidence score. See the reasoning. Decide for yourself.</strong>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Link href="/register" className="btn-primary text-base px-10 py-4 rounded-xl">
                <Zap size={18} />
                Start Free — No Card Needed
              </Link>
              <Link href="/nayes-picks" className="btn-secondary text-base px-10 py-4 rounded-xl relative overflow-hidden group">
                <span className="flex items-center gap-2">
                  <Flame size={18} style={{ color: '#00E5A0' }} />
                  See Naye&apos;s Picks
                </span>
              </Link>
            </div>

            {/* Trust micro-badges */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
              {[
                { icon: Database, label: 'Live odds data' },
                { icon: Eye, label: 'Full reasoning shown' },
                { icon: Star, label: 'Free to start' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={15} className="text-green-400" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="prediction-console" aria-label="WhinkPredict AI analytics interface">
            <div className="console-panel one"><p>Live signal</p><span style={{ '--level': '82%' } as React.CSSProperties} /><span style={{ '--level': '63%' } as React.CSSProperties} /><span style={{ '--level': '91%' } as React.CSSProperties} /></div>
            <div className="console-panel two"><p>Model confidence</p><span style={{ '--level': '94%' } as React.CSSProperties} /><span style={{ '--level': '76%' } as React.CSSProperties} /><span style={{ '--level': '88%' } as React.CSSProperties} /></div>
            <div className="console-ring" />
            <div className="console-panel three"><p>Prediction engine</p><span style={{ '--level': '72%' } as React.CSSProperties} /><span style={{ '--level': '85%' } as React.CSSProperties} /><span style={{ '--level': '57%' } as React.CSSProperties} /></div>
            <div className="console-panel four"><p>Market data</p><span style={{ '--level': '68%' } as React.CSSProperties} /><span style={{ '--level': '89%' } as React.CSSProperties} /><span style={{ '--level': '74%' } as React.CSSProperties} /></div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-xs text-slate-600 font-semibold uppercase tracking-widest">Scroll</span>
          <ChevronDown size={16} className="text-slate-600" />
        </div>
      </section>

      {/* ========== LIVE TICKER ========== */}
      <section className="py-4 overflow-hidden"
        style={{
          borderTop: '1px solid rgba(56,182,255,0.08)',
          borderBottom: '1px solid rgba(56,182,255,0.08)',
          background: 'rgba(56,182,255,0.03)',
        }}>
        <div className="ticker-wrap">
          <div className="ticker-content gap-3 px-4">
            {[...DEMO_PREDICTIONS, ...DEMO_PREDICTIONS, ...DEMO_PREDICTIONS].map((p, i) => (
              <div key={i} className="inline-flex items-center gap-3 px-5 py-2 rounded-full mr-3"
                style={{ background: 'rgba(14,21,32,0.8)', border: '1px solid rgba(56,182,255,0.1)' }}>
                <span className="text-xs text-slate-500 font-semibold">{p.league}</span>
                <span className="text-xs text-white font-bold">{p.homeTeam} vs {p.awayTeam}</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,229,160,0.15)', color: '#00E5A0' }}>
                  {p.prediction}
                </span>
                <span className="text-xs font-black" style={{ color: '#38B6FF' }}>{p.confidence}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              How It Works
            </div>
            <h2 className="text-4xl font-black mb-4">From live odds to clear picks</h2>
            <p className="text-slate-400 max-w-xl mx-auto">No magic. No vague AI claims. Here&apos;s exactly what happens under the hood.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="glass-card glass-card-hover p-8 flex gap-5 group">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(56,182,255,0.15), rgba(0,229,160,0.1))',
                      border: '1px solid rgba(56,182,255,0.2)',
                      color: '#38B6FF',
                    }}>
                    {step.step}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 text-lg">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PREDICTIONS SHOWCASE ========== */}
      <section id="predictions" className="py-24 px-6"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(56,182,255,0.02), transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <TrendingUp size={12} />
              Sample Picks
            </div>
            <h2 className="text-4xl font-black mb-4">What the AI is surfacing</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Confidence scores, prediction type, and live odds — fully visible on every card.</p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
            {DEMO_PREDICTIONS.map((p, i) => (
              <PredictionCard key={i} {...p} compact />
            ))}
          </div>

          <div className="text-center">
            <Link href="/register" className="btn-primary text-base px-8 py-3.5">
              Unlock All Predictions
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== NAYE'S PICKS PROMO ========== */}
      <section className="py-24 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(0,229,160,0.04) 0%, rgba(56,182,255,0.04) 100%)' }}>
        <div className="absolute top-0 left-0 w-full h-1"
          style={{ background: 'linear-gradient(90deg, transparent, #00E5A0, #38B6FF, transparent)' }} />

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-bold uppercase tracking-wider"
                style={{ background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.2)', color: '#00E5A0' }}>
                <Flame size={12} />
                Premium Feature
              </div>
              <h2 className="text-5xl font-black mb-4 leading-tight">
                Meet{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #00E5A0, #38B6FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Naye
                </span>
                <span className="text-white">.</span>
              </h2>
              <p className="text-xl text-slate-400 mb-6 leading-relaxed">
                WhinkPredict&apos;s AI prediction character. Every Friday at midnight, Naye curates a shortlist of the
                highest-conviction picks for the coming week across all covered sports.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Refreshes every Friday at midnight',
                  'Covers all available sports',
                  '5–10 picks — only the strongest signals',
                  '90%+ confidence threshold, no exceptions',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(0,229,160,0.15)', border: '1px solid rgba(0,229,160,0.3)' }}>
                      <CheckCircle size={12} style={{ color: '#00E5A0' }} />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/nayes-picks" className="btn-primary text-base px-8 py-4 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #00E5A0, #38B6FF)' }}>
                See This Week&apos;s Picks
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right: Naye avatar card */}
            <div className="relative">
              <div className="naye-card p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-40"
                  style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(0,229,160,0.3), transparent 60%)' }} />
                <div className="absolute inset-0 opacity-20"
                  style={{ background: 'radial-gradient(ellipse at 70% 80%, rgba(56,182,255,0.4), transparent 60%)' }} />

                <div className="relative z-10">
                  <div className="flex flex-col items-center mb-5">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl animate-pulse"
                        style={{ background: 'radial-gradient(ellipse, rgba(0,229,160,0.25), transparent 70%)', filter: 'blur(16px)' }} />
                      <Image
                        src="/brand/naye.png"
                        alt="Naye — WhinkPredict AI"
                        width={220}
                        height={280}
                        className="relative z-10 mx-auto"
                        style={{ objectFit: 'contain', maxHeight: 260 }}
                      />
                    </div>
                    <div className="text-xl font-black text-white mt-3 mb-0.5">Naye</div>
                    <div className="text-xs font-semibold" style={{ color: '#00E5A0' }}>
                      AI Prediction Character · WhinkPredict
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { sport: '⚽ Football', pick: 'Real Madrid — WIN', conf: '94%' },
                      { sport: '🏀 Basketball', pick: 'Lakers — O210.5', conf: '91%' },
                      { sport: '🏈 NFL', pick: 'Chiefs — -3', conf: '93%' },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: 'rgba(7,11,18,0.6)', border: '1px solid rgba(0,229,160,0.15)' }}>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">{p.sport}</span>
                          <span className="text-xs font-bold text-slate-200">{p.pick}</span>
                        </div>
                        <span className="text-xs font-black px-2 py-1 rounded-full"
                          style={{ background: 'rgba(0,229,160,0.15)', color: '#00E5A0' }}>
                          {p.conf}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-xs text-slate-600 font-semibold text-center">
                    Refreshes Friday midnight · Premium feature
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1"
          style={{ background: 'linear-gradient(90deg, transparent, #38B6FF, #00E5A0, transparent)' }} />
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Platform Features
            </div>
            <h2 className="text-4xl font-black mb-4">Built for serious bettors</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Data-driven insights, full transparency, and performance tracking — everything you need to bet smarter.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass-card glass-card-hover p-8 group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${f.color}12`,
                      border: `1px solid ${f.color}25`,
                      boxShadow: `0 0 20px ${f.color}10`,
                    }}>
                    <f.icon size={24} style={{ color: f.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-white text-lg">{f.title}</h3>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full"
                        style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}25` }}>
                        {f.badge}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY DATA BEATS TIPS ========== */}
      <section className="py-24 px-6 relative overflow-hidden"
        style={{
          background: 'rgba(56,182,255,0.03)',
          borderTop: '1px solid rgba(56,182,255,0.08)',
          borderBottom: '1px solid rgba(56,182,255,0.08)',
        }}>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(56,182,255,0.06), transparent 50%)' }} />

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-xs font-bold"
              style={{ background: 'rgba(56,182,255,0.1)', border: '1px solid rgba(56,182,255,0.2)', color: '#38B6FF' }}>
              <Brain size={12} />
              Our Methodology
            </div>
            <h2 className="text-4xl font-black mb-4 leading-tight">
              Market odds already<br />
              <span style={{
                background: 'linear-gradient(135deg, #38B6FF, #00E5A0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>encode the signal</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-lg">
              Professional bookmakers employ teams of analysts and models. The odds they publish reflect enormous amounts of information. WhinkPredict reads those markets systematically — surfacing implied probabilities and flagging where multiple books agree on a strong outcome.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-lg">
              We don&apos;t claim to beat the market. We help you read it clearly, with confidence scores grounded in real data and reasoning you can see.
            </p>
            <Link href="/register" className="btn-primary inline-flex px-8 py-4 rounded-xl">
              Access the Data
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '5+', label: 'Sports Covered', color: '#38B6FF', sub: 'EPL · NBA · NFL · UCL · La Liga' },
                { val: '90%+', label: 'Confidence Floor', color: '#00E5A0', sub: 'Minimum threshold for any pick' },
                { val: '6hr', label: 'Sync Interval', color: '#CC944B', sub: 'Live odds refreshed automatically' },
                { val: '24/7', label: 'Always On', color: '#38B6FF', sub: 'Data never sleeps' },
              ].map(({ val, label, color, sub }) => (
                <div key={label} className="glass-card p-5 glass-card-hover">
                  <div className="text-3xl font-black mb-1" style={{ color }}>{val}</div>
                  <div className="text-sm font-bold text-white mb-1">{label}</div>
                  <div className="text-[11px] text-slate-600 leading-relaxed">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400">Start free. Go all in when you&apos;re ready.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PRICING.map((plan) => (
              <div key={plan.name} className={`glass-card p-8 relative ${plan.highlight ? 'glow-azure' : ''}`}
                style={plan.highlight ? {
                  border: '1px solid rgba(56,182,255,0.4)',
                  background: 'rgba(56,182,255,0.04)',
                } : {}}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"
                    style={{ background: 'linear-gradient(135deg, #38B6FF, #00E5A0)', color: '#070B12' }}>
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-7">
                  <div className="text-sm text-slate-400 font-semibold mb-2">{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className="text-slate-500 text-sm">/{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle size={15} className="text-green-400 shrink-0" />
                      {f === "Naye's Weekly Picks (exclusive)" ? (
                        <span className="flex items-center gap-2">
                          <Flame size={12} style={{ color: '#00E5A0' }} />
                          <span className="font-semibold" style={{ color: '#00E5A0' }}>{f}</span>
                        </span>
                      ) : f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className={`${plan.highlight ? 'btn-primary' : 'btn-secondary'} w-full justify-center py-3.5 rounded-xl`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Money-back note */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              Premium includes a 7-day money-back guarantee. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="py-24 px-6"
        style={{ background: 'rgba(14,21,32,0.4)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="glass-card group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-slate-200 pr-4">{q}</span>
                  <ChevronDown size={18} className="text-slate-500 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-6 text-sm text-slate-400 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BOTTOM ========== */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(56,182,255,0.08) 0%, transparent 70%)' }} />
        <div className="absolute top-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(56,182,255,0.4), transparent)' }} />

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">
            Ready to bet smarter?
          </div>
          <h2 className="text-6xl font-black mb-4 leading-tight">
            See the data.<br />
            <span style={{
              background: 'linear-gradient(135deg, #38B6FF, #00E5A0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Make the call.</span>
          </h2>
          <p className="text-slate-400 mb-12 text-lg">
            Free to start. Full confidence scores from day one. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/register" className="btn-primary text-base px-12 py-4 rounded-xl">
              <Zap size={18} />
              Get Started Free
            </Link>
            <Link href="/nayes-picks" className="btn-secondary text-base px-8 py-4 rounded-xl">
              <Flame size={16} style={{ color: '#00E5A0' }} />
              Naye&apos;s Picks
            </Link>
          </div>

          {/* Responsible gambling notice */}
          <div className="p-4 rounded-xl text-xs text-slate-500 leading-relaxed max-w-lg mx-auto"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <strong className="text-slate-400">Bet responsibly.</strong> WhinkPredict is an informational tool. Predictions are based on statistical analysis of live market odds — they are not guarantees. Gambling involves risk. Only bet what you can afford to lose. If gambling is causing harm,{' '}
            <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300 transition-colors">BeGambleAware.org</a> offers free, confidential support.
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(7,11,18,0.95)' }}>
        {/* Brand hierarchy bar */}
        <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ background: 'rgba(56,182,255,0.1)', border: '1px solid rgba(56,182,255,0.2)' }}>
                  <span className="text-[10px] font-black" style={{ color: '#38B6FF' }}>WG</span>
                </div>
                <span className="text-xs text-slate-500 font-semibold">Whink Group</span>
              </div>
              <span className="text-slate-700">›</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.2)' }}>
                  <span className="text-[10px] font-black" style={{ color: '#00E5A0' }}>WA</span>
                </div>
                <span className="text-xs text-slate-500 font-semibold">Whink Apps</span>
              </div>
              <span className="text-slate-700">›</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ background: 'rgba(204,148,75,0.1)', border: '1px solid rgba(204,148,75,0.2)' }}>
                  <span className="text-[10px] font-black" style={{ color: '#CC944B' }}>WP</span>
                </div>
                <span className="text-xs text-slate-400 font-bold">WhinkPredict</span>
              </div>
            </div>
            <div className="text-xs text-slate-600">Predict Smarter. Win Bigger.</div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="mb-4">
                <div className="text-xl font-black mb-2" style={{
                  background: 'linear-gradient(135deg, #38B6FF, #00E5A0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>WhinkPredict</div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                AI-powered sports prediction intelligence built on live bookmaker odds.
                Transparent confidence scores. No black boxes. A Whink Apps product.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">Product</div>
              <ul className="space-y-2">
                {["Naye's Picks", 'How It Works', 'Features', 'Predictions', 'Pricing'].map(l => (
                  <li key={l}>
                    <a href={l === "Naye's Picks" ? '/nayes-picks' : `#${l.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">Legal</div>
              <ul className="space-y-2">
                <li><Link href="/legal" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Terms of Service</Link></li>
                <li><Link href="/legal/privacy" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/cookies" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Cookie Policy</Link></li>
                <li><Link href="/legal/refund" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Refund Policy</Link></li>
              </ul>
              <div className="mt-4 text-sm text-slate-500">support@whinkpredict.com</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-xs text-slate-600">© 2026 WhinkPredict · A Whink Apps Product by Whink Group. All rights reserved.</div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="text-xs text-slate-700 text-center">
                ⚠️ For informational purposes only. Gambling involves risk. 18+
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <Link href="/legal" className="hover:text-slate-400 transition-colors">Terms</Link>
                <span>·</span>
                <Link href="/legal/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
                <span>·</span>
                <Link href="/legal/cookies" className="hover:text-slate-400 transition-colors">Cookies</Link>
                <span>·</span>
                <Link href="/legal/refund" className="hover:text-slate-400 transition-colors">Refunds</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
