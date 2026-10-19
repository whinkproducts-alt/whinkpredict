'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'

interface UpgradeButtonProps {
  className?: string
  label?: string
  plan?: 'edge' | 'sharp' | 'naye'
}

export default function UpgradeButton({
  className = 'btn-primary w-full justify-center py-3 text-sm',
  label = 'Upgrade to Naye — $19/mo',
  plan = 'naye',
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpgrade() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className={className}
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
      >
        <Zap size={14} />
        {loading ? 'Redirecting to checkout…' : label}
      </button>
      {error && (
        <p className="text-xs text-red-400 text-center mt-2">{error}</p>
      )}
    </div>
  )
}
