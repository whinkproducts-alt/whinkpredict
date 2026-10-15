import { cookies } from 'next/headers'
import { validateSession } from '@/lib/auth'
import { User, Shield, CreditCard, Bell, Zap, Check, ChevronRight } from 'lucide-react'

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('whink_session')?.value!
  const user = (await validateSession(token))!

  const isPremium = user.plan === 'premium'
  const firstName = (user.name ?? 'User').split(' ')[0]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* Header */}
      <div className="relative overflow-hidden px-6 lg:px-8 pt-8 pb-8"
        style={{
          background: 'linear-gradient(135deg, rgba(56,182,255,0.04) 0%, rgba(0,229,160,0.02) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
        <div className="absolute top-0 left-0 w-64 h-40 pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(0,229,160,0.3), transparent 70%)', filter: 'blur(40px)' }} />
        <div className="relative z-10">
          <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wider">WhinkPredict</p>
          <h1 className="text-2xl font-black text-white">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        <div className="max-w-2xl space-y-6">

          {/* Profile card */}
          <div className="glass-card overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(56,182,255,0.12)', border: '1px solid rgba(56,182,255,0.2)' }}>
                <User size={14} style={{ color: '#38B6FF' }} />
              </div>
              <span className="text-sm font-bold text-white">Profile</span>
            </div>

            <div className="p-6 space-y-5">
              {/* Avatar row */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black shrink-0"
                  style={{ background: 'linear-gradient(135deg, #38B6FF, #00E5A0)', color: '#070B12' }}>
                  {firstName[0]}
                </div>
                <div>
                  <div className="font-bold text-white">{user.name ?? 'User'}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold capitalize"
                      style={{
                        background: isPremium ? 'rgba(0,229,160,0.12)' : 'rgba(255,255,255,0.06)',
                        color: isPremium ? '#00E5A0' : '#94a3b8',
                        border: isPremium ? '1px solid rgba(0,229,160,0.2)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                      {isPremium ? '⚡ Premium' : 'Free plan'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input defaultValue={user.name ?? ''} className="input-field text-sm" readOnly />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Email</label>
                  <input defaultValue={user.email} className="input-field text-sm" readOnly />
                </div>
              </div>

              <div className="flex gap-3">
                <button className="btn-secondary text-sm py-2 px-4">Save Changes</button>
              </div>
            </div>
          </div>

          {/* Subscription card */}
          <div id="upgrade" className="glass-card overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(204,148,75,0.12)', border: '1px solid rgba(204,148,75,0.2)' }}>
                <CreditCard size={14} style={{ color: '#CC944B' }} />
              </div>
              <span className="text-sm font-bold text-white">Subscription</span>
            </div>

            <div className="p-6 space-y-5">
              {/* Current plan chip */}
              <div className="flex items-center justify-between p-4 rounded-xl"
                style={{
                  background: isPremium ? 'rgba(0,229,160,0.06)' : 'rgba(255,255,255,0.03)',
                  border: isPremium ? '1px solid rgba(0,229,160,0.18)' : '1px solid rgba(255,255,255,0.07)',
                }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: isPremium ? 'rgba(0,229,160,0.12)' : 'rgba(255,255,255,0.06)' }}>
                    <Zap size={15} style={{ color: isPremium ? '#00E5A0' : '#64748b' }} />
                  </div>
                  <div>
                    <div className="font-bold text-white capitalize">{user.plan} Plan</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {isPremium ? "Full access · All sports · Naye's Picks" : '3 free picks per day · Basic analytics'}
                    </div>
                  </div>
                </div>
                {isPremium && (
                  <span className="text-xs px-3 py-1 rounded-full font-bold"
                    style={{ background: 'rgba(0,229,160,0.15)', color: '#00E5A0', border: '1px solid rgba(0,229,160,0.25)' }}>
                    Active
                  </span>
                )}
              </div>

              {/* Upgrade panel */}
              {!isPremium && (
                <div className="relative rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(56,182,255,0.07), rgba(0,229,160,0.05))',
                    border: '1px solid rgba(56,182,255,0.15)',
                  }}>
                  <div className="absolute right-5 top-5 text-7xl font-black opacity-[0.04] select-none"
                    style={{ color: '#38B6FF' }}>PRO</div>

                  <div className="p-5 relative z-10">
                    <div className="flex items-baseline gap-2 mb-5">
                      <Zap size={16} style={{ color: '#38B6FF' }} />
                      <span className="text-lg font-black" style={{
                        background: 'linear-gradient(135deg, #38B6FF, #00E5A0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>Premium</span>
                      <span className="text-3xl font-black text-white">$19</span>
                      <span className="text-slate-500 text-sm">/month</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 mb-5">
                      {[
                        'Unlimited premium predictions',
                        'Detailed AI reasoning per pick',
                        'Naye\'s weekly elite picks',
                        'Advanced analytics dashboard',
                        'Priority new features',
                        'Email alerts for high-confidence picks',
                      ].map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                          <Check size={13} style={{ color: '#00E5A0' }} />
                          {f}
                        </div>
                      ))}
                    </div>

                    <button className="btn-primary w-full justify-center py-3 text-sm">
                      <Zap size={14} />
                      Upgrade to Premium — $19/mo
                    </button>
                    <p className="text-center text-xs text-slate-600 mt-2">Cancel anytime · Secure payment via Stripe</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-card overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(56,182,255,0.12)', border: '1px solid rgba(56,182,255,0.2)' }}>
                <Bell size={14} style={{ color: '#38B6FF' }} />
              </div>
              <span className="text-sm font-bold text-white">Notifications</span>
            </div>

            <div className="p-6 space-y-1">
              {[
                {
                  label: 'Email alerts for optimal picks',
                  sub: 'Get notified when 90%+ confidence picks are available',
                  on: true,
                  color: '#38B6FF',
                },
                {
                  label: 'Daily summary digest',
                  sub: 'Morning email with today\'s top 3 picks',
                  on: true,
                  color: '#38B6FF',
                },
                {
                  label: 'Naye\'s weekly drop',
                  sub: 'Friday alert when Naye\'s new picks are live',
                  on: false,
                  color: '#00E5A0',
                },
              ].map(({ label, sub, on, color }) => (
                <div key={label} className="flex items-center justify-between gap-4 py-3.5 border-b border-white/[0.04] last:border-0">
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{label}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{sub}</div>
                  </div>
                  {/* Toggle */}
                  <div className="w-11 h-6 rounded-full flex items-center cursor-pointer shrink-0 transition-all"
                    style={{
                      background: on ? `${color}40` : 'rgba(255,255,255,0.08)',
                      border: on ? `1px solid ${color}50` : '1px solid rgba(255,255,255,0.1)',
                      padding: '2px',
                      justifyContent: on ? 'flex-end' : 'flex-start',
                    }}>
                    <div className="w-4 h-4 rounded-full transition-all"
                      style={{ background: on ? color : '#475569' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="glass-card overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(204,148,75,0.12)', border: '1px solid rgba(204,148,75,0.2)' }}>
                <Shield size={14} style={{ color: '#CC944B' }} />
              </div>
              <span className="text-sm font-bold text-white">Security</span>
            </div>

            <div className="p-6 space-y-3">
              {[
                { label: 'Change password', sub: 'Update your login credentials' },
                { label: 'Two-factor authentication', sub: 'Add an extra layer of security' },
              ].map(({ label, sub }) => (
                <button key={label}
                  className="w-full flex items-center justify-between gap-3 p-3.5 rounded-xl text-left transition-all hover:bg-white/5"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{label}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{sub}</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
