'use client'

import { useEffect, useState } from 'react'
import { Shield, X } from 'lucide-react'

const CONSENT_KEY = 'whink_cookie_consent'

export type ConsentState = 'accepted' | 'declined' | null

export function useCookieConsent(): ConsentState {
  const [consent, setConsent] = useState<ConsentState>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (stored === 'accepted' || stored === 'declined') {
        setConsent(stored)
      }
    } catch {
      // localStorage unavailable (private mode, etc.)
    }
  }, [])

  return consent
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (!stored) setVisible(true)
    } catch {
      // noop
    }
  }, [])

  function accept() {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted')
    } catch {}
    setVisible(false)
    // PostHog is already initialised via PostHogProvider.
    // Nothing more needed — analytics is opt-in-by-default here.
  }

  function decline() {
    try {
      localStorage.setItem(CONSENT_KEY, 'declined')
    } catch {}
    setVisible(false)
    // Opt out of PostHog capture for this device
    try {
      // dynamically import to avoid SSR issues
      import('posthog-js').then(({ default: posthog }) => {
        posthog.opt_out_capturing()
      })
    } catch {}
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'min(560px, calc(100vw - 2rem))',
        background: 'rgba(10, 14, 22, 0.96)',
        border: '1px solid rgba(56,182,255,0.18)',
        borderRadius: '1rem',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
        padding: '1.25rem 1.25rem 1.25rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '0.5rem', flexShrink: 0,
          background: 'rgba(56,182,255,0.12)',
          border: '1px solid rgba(56,182,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={14} color="#38B6FF" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff', marginBottom: '0.25rem' }}>
            We use cookies &amp; analytics
          </p>
          <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
            WhinkPredict uses PostHog to understand how users interact with predictions — no personal data
            is sold. You can accept for the best experience or decline to opt out.{' '}
            <a href="/privacy" style={{ color: '#38B6FF', textDecoration: 'underline' }}>
              Privacy policy
            </a>
          </p>
        </div>
        <button
          onClick={decline}
          aria-label="Dismiss"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#475569', padding: 2, flexShrink: 0,
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Action row */}
      <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end' }}>
        <button
          onClick={decline}
          style={{
            fontSize: '0.8125rem', fontWeight: 600, padding: '0.5rem 1rem',
            borderRadius: '0.5rem', cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8',
          }}
        >
          Decline
        </button>
        <button
          onClick={accept}
          style={{
            fontSize: '0.8125rem', fontWeight: 700, padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem', cursor: 'pointer',
            background: 'linear-gradient(135deg, #38B6FF, #00E5A0)',
            border: 'none',
            color: '#070B12',
          }}
        >
          Accept all
        </button>
      </div>
    </div>
  )
}
