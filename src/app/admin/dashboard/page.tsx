'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, TrendingUp, Zap, Shield, Download,
  LogOut, RefreshCw, Search, ChevronUp, ChevronDown,
  BarChart3, MapPin, Mail
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string | null
  plan: string
  subscription_status: string | null
  stripe_customer_id: string | null
  created_at: string
  last_login: string | null
  login_count: number
  last_ip: string | null
  last_country: string | null
  last_city: string | null
}

interface Stats {
  totals: {
    total_users: number
    premium_users: number
    free_users: number
  }
  signupsByDay: { date: string; signups: number }[]
  loginsByDay: { date: string; logins: number }[]
}

type SortKey = 'created_at' | 'last_login' | 'plan' | 'name' | 'email' | 'login_count'
type SortDir = 'asc' | 'desc'

export default function AdminDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'premium'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [exporting, setExporting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [uRes, sRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/stats'),
      ])
      if (uRes.status === 401 || sRes.status === 401) {
        router.push('/admin')
        return
      }
      const uData = await uRes.json()
      const sData = await sRes.json()
      setUsers(uData.users || [])
      setStats(sData)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { load() }, [load])

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/admin/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `whinkpredict-users-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  const filtered = users
    .filter(u => {
      const q = search.toLowerCase()
      const matchSearch = !q || u.email.toLowerCase().includes(q) || (u.name ?? '').toLowerCase().includes(q)
      const matchPlan = planFilter === 'all' || u.plan === planFilter
      return matchSearch && matchPlan
    })
    .sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })

  function fmt(date: string | null) {
    if (!date) return '—'
    return new Date(date).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })
  }

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronUp size={11} style={{ opacity: 0.3 }} />
    return sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />
  }

  const total = stats?.totals.total_users ?? 0
  const premium = stats?.totals.premium_users ?? 0
  const free = stats?.totals.free_users ?? 0
  const convRate = total > 0 ? ((premium / total) * 100).toFixed(1) : '0.0'

  return (
    <div style={{ minHeight: '100vh', background: '#070B12', color: '#fff' }}>

      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 1.5rem',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Shield size={16} color="#38B6FF" />
          <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>WhinkPredict Admin</span>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem',
            borderRadius: 999, background: 'rgba(204,148,75,0.15)',
            border: '1px solid rgba(204,148,75,0.3)', color: '#CC944B',
          }}>INTERNAL</span>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button onClick={load} style={btnStyle('#38B6FF')}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={handleExport} disabled={exporting} style={btnStyle('#00E5A0')}>
            <Download size={13} /> {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
          <button onClick={handleLogout} style={btnStyle('#f87171')}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>

        {/* Stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Users', value: total, icon: Users, color: '#38B6FF' },
            { label: 'Premium', value: premium, icon: Zap, color: '#00E5A0' },
            { label: 'Free', value: free, icon: Users, color: '#64748b' },
            { label: 'Conversion Rate', value: `${convRate}%`, icon: TrendingUp, color: '#CC944B' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                <Icon size={14} color={color} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color }}>{loading ? '—' : value}</div>
            </div>
          ))}
        </div>

        {/* Mini charts */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <MiniBarChart label="Signups (last 30 days)" data={stats.signupsByDay} valueKey="signups" color="#38B6FF" />
            <MiniBarChart label="Logins (last 30 days)" data={stats.loginsByDay} valueKey="logins" color="#00E5A0" />
          </div>
        )}

        {/* Users table */}
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 200 }}>
              <Search size={13} color="#64748b" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                style={{
                  background: 'none', border: 'none', outline: 'none',
                  color: '#fff', fontSize: '0.8rem', width: '100%',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {(['all', 'free', 'premium'] as const).map(p => (
                <button key={p} onClick={() => setPlanFilter(p)} style={{
                  padding: '0.3rem 0.75rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
                  background: planFilter === p ? (p === 'premium' ? 'rgba(0,229,160,0.15)' : p === 'free' ? 'rgba(56,182,255,0.15)' : 'rgba(255,255,255,0.1)') : 'transparent',
                  border: planFilter === p ? `1px solid ${p === 'premium' ? 'rgba(0,229,160,0.3)' : p === 'free' ? 'rgba(56,182,255,0.3)' : 'rgba(255,255,255,0.2)'}` : '1px solid rgba(255,255,255,0.06)',
                  color: planFilter === p ? '#fff' : '#64748b',
                  textTransform: 'capitalize',
                }}>
                  {p} {p !== 'all' && `(${p === 'premium' ? premium : free})`}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#475569' }}>{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  {(
                    [
                      { key: 'name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'plan', label: 'Plan' },
                      { key: 'login_count', label: 'Sessions' },
                      { key: 'created_at', label: 'Registered' },
                      { key: 'last_login', label: 'Last Login' },
                    ] as { key: SortKey; label: string }[]
                  ).map(({ key, label }) => (
                    <th key={key}
                      onClick={() => handleSort(key)}
                      style={{
                        padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700,
                        color: sortKey === key ? '#38B6FF' : '#64748b',
                        cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
                        textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.65rem',
                      }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        {label} <SortIcon k={key} />
                      </span>
                    </th>
                  ))}
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Location
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Stripe
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#475569' }}>Loading…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#475569' }}>No users found</td></tr>
                ) : filtered.map((u, i) => (
                  <tr key={u.id} style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}>
                    <td style={{ padding: '0.75rem 1rem', color: '#e2e8f0', fontWeight: 600 }}>
                      {u.name || <span style={{ color: '#475569' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <a href={`mailto:${u.email}`} style={{ color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none' }}>
                        <Mail size={11} /> {u.email}
                      </a>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        display: 'inline-block', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.6rem',
                        borderRadius: 999,
                        background: u.plan === 'premium' ? 'rgba(0,229,160,0.12)' : 'rgba(255,255,255,0.06)',
                        border: u.plan === 'premium' ? '1px solid rgba(0,229,160,0.25)' : '1px solid rgba(255,255,255,0.08)',
                        color: u.plan === 'premium' ? '#00E5A0' : '#64748b',
                        textTransform: 'capitalize',
                      }}>
                        {u.plan === 'premium' ? '⚡ ' : ''}{u.plan}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', textAlign: 'right' }}>
                      {u.login_count}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b', whiteSpace: 'nowrap' }}>{fmt(u.created_at)}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b', whiteSpace: 'nowrap' }}>{fmt(u.last_login)}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {(u.last_country || u.last_city) ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                          <MapPin size={10} color="#64748b" />
                          {[u.last_city, u.last_country].filter(Boolean).join(', ')}
                        </span>
                      ) : (
                        <span style={{ color: '#334155', fontSize: '0.75rem' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {u.stripe_customer_id ? (
                        <a
                          href={`https://dashboard.stripe.com/customers/${u.stripe_customer_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.65rem', color: '#38B6FF', fontFamily: 'monospace' }}>
                          {u.stripe_customer_id.slice(0, 14)}…
                        </a>
                      ) : <span style={{ color: '#334155' }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniBarChart({
  label, data, valueKey, color,
}: {
  label: string
  data: { date: string; [k: string]: string | number }[]
  valueKey: string
  color: string
}) {
  const max = Math.max(...data.map(d => Number(d[valueKey])), 1)
  const total = data.reduce((s, d) => s + Number(d[valueKey]), 0)

  return (
    <div style={{ ...cardStyle }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={13} color={color} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8' }}>{label}</span>
        </div>
        <span style={{ fontSize: '1.1rem', fontWeight: 900, color }}>{total}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 48 }}>
        {data.map(d => {
          const h = Math.max((Number(d[valueKey]) / max) * 48, 2)
          return (
            <div key={d.date} title={`${d.date}: ${d[valueKey]}`} style={{
              flex: 1, height: h, borderRadius: 2,
              background: color,
              opacity: 0.75,
              cursor: 'default',
              transition: 'opacity 0.1s',
            }} />
          )
        })}
        {data.length === 0 && (
          <span style={{ color: '#475569', fontSize: '0.75rem', margin: 'auto' }}>No data yet</span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.6rem', color: '#334155' }}>{data[0]?.date ?? ''}</span>
        <span style={{ fontSize: '0.6rem', color: '#334155' }}>{data[data.length - 1]?.date ?? ''}</span>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '0.875rem',
  padding: '1.25rem',
}

function btnStyle(color: string): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
    padding: '0.4rem 0.875rem', borderRadius: '0.5rem', border: 'none',
    background: `${color}18`, color, fontWeight: 700, fontSize: '0.75rem',
    cursor: 'pointer',
  }
}
