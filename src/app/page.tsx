import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/marketing/Navbar'
import PredictionCard from '@/components/ui/PredictionCard'
import {
  Brain, BarChart3, Shield, Zap,
  TrendingUp, Target, CheckCircle, ArrowRight,
  Star, Trophy, Activity, Flame, ChevronDown
} from 'lucide-react'

const DEMO_PREDICTIONS = [
  { homeTeam: 'Man City', awayTeam: 'Man Utd', league: 'Premier League', country: 'England', prediction: 'O2.5', confidence: 94, tier: 'optimal', odds: 1.85, isPremium: false },
  { homeTeam: 'Lakers', awayTeam: 'Celtics', league: 'NBA 2026', country: 'USA', prediction: 'O220.5', confidence: 91, tier: 'high', odds: 1.92, isPremium: false },
  { homeTeam: 'Barcelona', awayTeam: 'PSG', league: 'La Liga 2026', country: 'Spain', prediction: 'O1.5', confidence: 93, tier: 'optimal', odds: 1.72, isPremium: false },
  { homeTeam: 'KC Chiefs', awayTeam: 'Eagles', league: 'NFL 2026', country: 'USA', prediction: '-3', confidence: 92, tier: 'optimal', odds: 1.91, isPremium: false },
]

const STATS = [
  { val: '90%+', label: 'Confidence Floor', color: '#38B6FF' },
  { val: '50K+', label: 'Predictions Made', color: '#00E5A0' },
  { val: '5K+', label: 'Active Users', color: '#CC944B' },
  { val: 'Every Fri', label: "Naye's Drops", color: '#38B6FF' },
]

const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Predictions',
    stat: '94% Accuracy',
    desc: 'Advanced ML models analyse thousands of data points in real-time to deliver betting recommendations with transparent confidence scores.',
    color: '#38B6FF',
    gradient: 'from-[#38B6FF]/20 to-transparent',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    stat: '+12% ROI',
    desc: 'Track performance metrics and win rates with live updates. Interactive dashboards give you complete visibility into your betting performance.',
    color: '#00E5A0',
    gradient: 'from-[#00E5A0]/20 to-transparent',
  },
  {
    icon: Activity,
    title: 'Performance Tracking',
    stat: '5K+ Users',
    desc: 'Visualise your betting history with detailed charts and comprehensive analytics. Monitor trends and optimise your strategy over time.',
    color: '#CC944B',
    gradient: 'from-[#CC944B]/20 to-transparent',
  },
  {
    icon: Shield,
    title: 'Transparent Insights',
    stat: '100% Clear',
    desc: 'Every prediction comes with clear reasoning and data sources. We show you exactly why our AI recommends each pick — no black boxes.',
    color: '#38B6FF',
    gradient: 'from-[#38B6FF]/20 to-transparent',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'AI Scans Matches', desc: 'Our engine scans every fixture across football, basketball, tennis, NFL, MLB and more — processing team form, injuries, odds movements, and historical head-to-head data in real time.' },
  { step: '02', title: 'Confidence Scoring', desc: 'Each match gets a precision confidence score. Only picks clearing the 90%+ threshold make it through. No noise, no filler — just the calls our model is most certain about.' },
  { step: '03', title: 'Elite Weekly Calls', desc: 'Every Friday at midnight, Naye publishes 5–10 elite picks for the week ahead. The highest-conviction calls, across all sports, delivered on a consistent schedule.' },
]

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['3 picks per day', 'Basic confidence scoring', 'Weekly performance reports', 'Worth Watching tier'],
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
  { q: 'How accurate are WhinkPredict predictions?', a: 'Our AI model only surfaces picks that clear the 90%+ confidence threshold. Every prediction is backed by real-time data analysis across 200+ signals including team form, injuries, odds movements, and historical matchups. No prediction is ever a guarantee — sports always carry inherent uncertainty.' },
  { q: 'What sports does WhinkPredict cover?', a: "WhinkPredict covers football (soccer), basketball, tennis, NFL, MLB, and more. Naye's Weekly Picks covers all major sports worldwide." },
  { q: "What is Naye's Picks?", a: "Naye is WhinkPredict's AI prediction mascot. Every Friday at midnight, Naye publishes 5–10 elite picks for the coming week — all clearing 90%+ confidence. These are the highest-conviction calls we publish, across all sports." },
  { q: 'Can I cancel my Premium subscription?', a: 'Yes. You can cancel anytime from your account dashboard under Settings. Your Premium access continues until the end of your current billing period. See our Refund Policy for details on the 7-day money-back guarantee.' },
  { q: 'How often are predictions updated?', a: 'Predictions are generated and updated in real time as new data comes in. Naye\'s elite weekly picks refresh every Friday at midnight. Daily picks are available each morning for the day\'s fixtures.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Navbar />

      {/* ========== HERO ========== */}
      <section className="relative pt-40 pb-28 px-6 overflow-hidden">
        {/* Layered background glows */}
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-glow-3" />
        {/* Grid overlay */}
        <div className="hero-grid" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Category badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-bold uppercase tracking-widest"
              style={{
                background: 'rgba(56,182,255,0.08)',
                border: '1px solid rgba(56,182,255,0.2)',
                color: '#38B6FF',
              }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI Sports Intelligence · By Whink Apps
            </div>

            {/* Main headline */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-[0.9]">
              <span className="block text-white">Win Smarter.</span>
              <span className="block" style={{
                background: 'linear-gradient(135deg, #38B6FF 0%, #00E5A0 50%, #CC944B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Predict Better.</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              AI-powered sports predictions across football, basketball, tennis, NFL and more.
              <strong className="text-white"> 90%+ confidence. Every pick, every week.</strong>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/register" className="btn-primary text-base px-10 py-4 rounded-xl">
                <Zap size={18} />
                Start Free
              </Link>
              <Link href="/nayes-picks" className="btn-secondary text-base px-10 py-4 rounded-xl relative overflow-hidden group">
                <span className="flex items-center gap-2">
                  <Flame size={18} style={{ color: '#00E5A0' }} />
                  See Naye&apos;s Picks
                </span>
              </Link>
            </div>

            {/* Trust micro-badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              {[
                { icon: CheckCircle, label: 'Verified accuracy' },
                { icon: Shield, label: 'Transparent insights' },
                { icon: Star, label: 'Free to start' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={15} className="text-green-400" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {STATS.map(({ val, label, color }) => (
              <div key={label} className="glass-card p-6 text-center relative overflow-hidden group glass-card-hover">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}15, transparent 70%)` }} />
                <div className="text-4xl font-black mb-1 relative z-10" style={{ color }}>{val}</div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider relative z-10">{label}</div>
              </div>
            ))}
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
                Exclusive Feature
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
                WhinkPredict&apos;s AI prediction mascot. Every Friday at midnight, Naye drops
                5–10 elite picks across all sports for the coming week.
                <strong className="text-white"> 90%+ confidence. No noise. Just winners.</strong>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Refreshes every Friday at 0:00 AM',
                  'Covers all major sports worldwide',
                  '5–10 highest conviction picks only',
                  '90%+ confidence threshold — zero compromises',
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
                {/* Glow bg */}
                <div className="absolute inset-0 opacity-40"
                  style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(0,229,160,0.3), transparent 60%)' }} />
                <div className="absolute inset-0 opacity-20"
                  style={{ background: 'radial-gradient(ellipse at 70% 80%, rgba(56,182,255,0.4), transparent 60%)' }} />

                <div className="relative z-10">
                  {/* Naye character image */}
                  <div className="flex flex-col items-center mb-5">
                    <div className="relative">
                      {/* Animated glow ring behind image */}
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
                      AI Prediction Mascot · WhinkPredict
                    </div>
                  </div>

                  {/* Sample pick cards */}
                  <div className="space-y-2.5">
                    {[
                      { sport: '⚽ Football', pick: 'Real Madrid — WIN', conf: '94%' },
                      { sport: '🏀 Basketball', pick: 'Lakers — O210.5', conf: '91%' },
                      { sport: '🎾 Tennis', pick: 'Djokovic — WIN', conf: '93%' },
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
                    Refreshes Friday 0:00 AM · Next refresh in <span className="text-slate-400">3 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1"
          style={{ background: 'linear-gradient(90deg, transparent, #38B6FF, #00E5A0, transparent)' }} />
      </section>

      {/* ========== PREDICTIONS SHOWCASE ========== */}
      <section id="predictions" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <TrendingUp size={12} />
              Latest Predictions
            </div>
            <h2 className="text-4xl font-black mb-4">What the AI is picking</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Full transparency on reasoning and confidence — see exactly what WhinkPredict recommends.</p>
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

      {/* ========== FEATURES ========== */}
      <section id="features" className="py-24 px-6"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(56,182,255,0.02), transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Platform Features
            </div>
            <h2 className="text-4xl font-black mb-4">Everything you need to win</h2>
            <p className="text-slate-400 max-w-xl mx-auto">AI-driven insights, real-time data, and transparent analytics — all in one prediction platform.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass-card glass-card-hover p-8 group relative overflow-hidden">
                {/* Hover gradient */}
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative"
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
                        {f.stat}
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

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Our Process
            </div>
            <h2 className="text-4xl font-black mb-4">How WhinkPredict works</h2>
            <p className="text-slate-400">From raw data to winning decisions — four precise steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
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

      {/* ========== AI POWER BANNER ========== */}
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
              Whink AI Engine
            </div>
            <h2 className="text-4xl font-black mb-4 leading-tight">
              The intelligence<br />
              <span style={{
                background: 'linear-gradient(135deg, #38B6FF, #00E5A0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>behind every pick</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-lg">
              Our AI analyses thousands of data points in real-time — team form, injuries, weather,
              historical matchups, market movements. Every prediction is a precision call, not a guess.
            </p>
            <Link href="/register" className="btn-primary inline-flex px-8 py-4 rounded-xl">
              Access the AI
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: '94%', label: 'Accuracy', color: '#38B6FF' },
                { val: '200+', label: 'Data Signals', color: '#00E5A0' },
                { val: '24/7', label: 'Live Updates', color: '#CC944B' },
                { val: '50K+', label: 'Predictions', color: '#38B6FF' },
                { val: '5K+', label: 'Users', color: '#00E5A0' },
                { val: '12%', label: 'Avg. ROI', color: '#CC944B' },
              ].map(({ val, label, color }) => (
                <div key={label} className="glass-card p-5 text-center glass-card-hover">
                  <div className="text-2xl font-black mb-1" style={{ color }}>{val}</div>
                  <div className="text-[11px] text-slate-600 font-semibold uppercase tracking-wide">{label}</div>
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
                      {f === "Naye's Picks (exclusive)" ? (
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
            Ready to Win?
          </div>
          <h2 className="text-6xl font-black mb-4 leading-tight">
            Start predicting.<br />
            <span style={{
              background: 'linear-gradient(135deg, #38B6FF, #00E5A0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Start winning.</span>
          </h2>
          <p className="text-slate-400 mb-12 text-lg">
            Join thousands of winners using WhinkPredict. Free to start. No credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-base px-12 py-4 rounded-xl">
              <Zap size={18} />
              Get Started Free
            </Link>
            <Link href="/nayes-picks" className="btn-secondary text-base px-8 py-4 rounded-xl">
              <Flame size={16} style={{ color: '#00E5A0' }} />
              Naye&apos;s Picks
            </Link>
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
                AI-powered sports prediction intelligence. Smarter decisions through data,
                transparency, and verified accuracy. A Whink Apps product.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">Product</div>
              <ul className="space-y-2">
                {["Naye's Picks", 'Features', 'How It Works', 'Predictions', 'Pricing'].map(l => (
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
                ⚠️ WhinkPredict is for informational purposes only. Bet responsibly.
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
