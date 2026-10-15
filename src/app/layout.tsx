import type { Metadata } from 'next'
import './globals.css'
import { initSchema } from '@/lib/db'
import { PostHogProvider } from '@/components/PostHogProvider'
import { Suspense } from 'react'

// Initialize database schema on server startup
// This runs once when the Next.js server boots
let schemaInitialized = false
async function ensureSchema() {
  if (schemaInitialized) return
  try {
    await initSchema()
    schemaInitialized = true
  } catch (err) {
    console.error('DB schema init failed:', err)
  }
}

// Kick off schema init immediately (fire-and-forget at module level)
ensureSchema()

export const metadata: Metadata = {
  title: 'WhinkPredict — AI Sports Predictions',
  description: 'AI-powered sports predictions by WhinkPredict. Predict Smarter. Win Bigger.',
  keywords: 'sports predictions, AI predictions, football analytics, WhinkPredict, sports betting tips',
  openGraph: {
    title: 'WhinkPredict — AI Sports Predictions',
    description: 'Predict Smarter. Win Bigger.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  )
}
