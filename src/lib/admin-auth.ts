import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'Whinkproducts@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'whink-admin-2026'
const ADMIN_SESSION_KEY = 'whink_admin_session'

// Simple token: sign email+timestamp with ADMIN_PASSWORD
import crypto from 'crypto'

export function signAdminToken(): string {
  const payload = `${ADMIN_EMAIL}:${Date.now()}`
  const sig = crypto.createHmac('sha256', ADMIN_PASSWORD).update(payload).digest('hex')
  return Buffer.from(`${payload}:${sig}`).toString('base64')
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const parts = decoded.split(':')
    if (parts.length < 3) return false
    const sig = parts.pop()!
    const payload = parts.join(':')
    const expected = crypto.createHmac('sha256', ADMIN_PASSWORD).update(payload).digest('hex')
    if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return false
    // Token valid for 8 hours
    const ts = parseInt(parts[1])
    if (Date.now() - ts > 8 * 60 * 60 * 1000) return false
    return true
  } catch {
    return false
  }
}

export async function requireAdmin(req?: NextRequest): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_SESSION_KEY)?.value
    if (!token) return false
    return verifyAdminToken(token)
  } catch {
    return false
  }
}

export { ADMIN_SESSION_KEY, ADMIN_EMAIL, ADMIN_PASSWORD }
