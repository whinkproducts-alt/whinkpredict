'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

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

  useEffect(() => {
    if (!key) return
    posthog.init(key, {
      api_host: host,
      person_profiles: 'identified_only',
      capture_pageview: false, // handled manually above
      capture_pageleave: true,
    })
  }, [key, host])

  if (!key) return <>{children}</>

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  )
}
