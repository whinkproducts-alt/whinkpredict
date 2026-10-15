'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const CONSENT_KEY = 'whink_cookie_consent'

function getStoredConsent(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY)
  } catch {
    return null
  }
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const client = usePostHog()
  const lastPath = useRef<string>('')

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    if (url === lastPath.current) return
    lastPath.current = url
    client.capture('$pageview', { $current_url: window.location.href })
  }, [pathname, searchParams, client])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!key) return

    const consent = getStoredConsent()

    posthog.init(key, {
      api_host: host,
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      // If user previously declined, start opted-out
      opt_out_capturing_by_default: consent === 'declined',
    })

    // If consent was already given, make sure we're opted in
    if (consent === 'accepted') {
      posthog.opt_in_capturing()
    }

    setReady(true)

    // Listen for future consent changes via localStorage events (cross-tab)
    function onStorage(e: StorageEvent) {
      if (e.key !== CONSENT_KEY) return
      if (e.newValue === 'accepted') posthog.opt_in_capturing()
      if (e.newValue === 'declined') posthog.opt_out_capturing()
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key, host])

  if (!key) return <>{children}</>

  return (
    <PHProvider client={posthog}>
      {ready && <PostHogPageView />}
      {children}
    </PHProvider>
  )
}
