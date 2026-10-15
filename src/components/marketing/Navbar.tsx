'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(178,178,180,0.98)' : '#b2b2b4',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(0,0,0,0.12)',
      }}>
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo size="sm" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {[
            { label: 'Home', href: '/' },
            { label: "Naye's Picks", href: '/nayes-picks' },
            { label: 'Pricing', href: '#pricing' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="px-3 py-2 text-sm font-medium text-black/80 hover:text-black transition-colors">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="rounded-lg border border-[#3153d7] px-5 py-2 text-sm font-medium text-[#183aab] transition-colors hover:bg-white/35">Login</Link>
          <Link href="/register" className="rounded-lg bg-[#3153e8] px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2546cf]">
            Join Pro
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden btn-ghost p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 space-y-1"
          style={{ background: '#b2b2b4', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
          {[
            { label: 'Home', href: '/' },
            { label: "Naye's Picks", href: '/nayes-picks' },
            { label: 'Pricing', href: '#pricing' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="block py-3 text-black/80 text-sm border-b border-black/10"
              onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4">
            <Link href="/login" className="rounded-lg border border-[#3153d7] px-5 py-2 text-center text-sm font-medium text-[#183aab]">Login</Link>
            <Link href="/register" className="rounded-lg bg-[#3153e8] px-5 py-2 text-center text-sm font-medium text-white">Join Pro</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
