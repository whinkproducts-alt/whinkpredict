import crypto from 'crypto'
import { query, run } from './db'

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':')
    if (!salt || !hash) return false
    const inputHash = crypto.scryptSync(password, salt, 64).toString('hex')
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(inputHash, 'hex'))
  } catch {
    return false
  }
}

export function generateId(): string {
  return crypto.randomBytes(16).toString('hex')
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Rate limiting: max 5 attempts per IP per 15 minutes, then 30-min lockout
const MAX_ATTEMPTS = 5
const WINDOW_MINUTES = 15
const LOCKOUT_MINUTES = 30

export async function checkRateLimit(key: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const rows = await query<{
    attempts: number
    locked_until: string | null
    last_attempt: string
  }>('SELECT attempts, locked_until, last_attempt FROM rate_limits WHERE key = ?', [key])

  const now = new Date()

  if (rows.length > 0) {
    const row = rows[0]

    // Check if currently locked
    if (row.locked_until) {
      const lockedUntil = new Date(row.locked_until)
      if (now < lockedUntil) {
        const retryAfter = Math.ceil((lockedUntil.getTime() - now.getTime()) / 1000)
        return { allowed: false, retryAfter }
      }
    }

    // Check if window has expired — reset if so
    const lastAttempt = new Date(row.last_attempt)
    const windowExpiry = new Date(lastAttempt.getTime() + WINDOW_MINUTES * 60 * 1000)
    if (now > windowExpiry) {
      await run(
        'DELETE FROM rate_limits WHERE key = ?',
        [key]
      )
      return { allowed: true }
    }

    // Within window — check attempt count
    if (row.attempts >= MAX_ATTEMPTS) {
      const lockedUntil = new Date(now.getTime() + LOCKOUT_MINUTES * 60 * 1000).toISOString()
      await run(
        'UPDATE rate_limits SET locked_until = ? WHERE key = ?',
        [lockedUntil, key]
      )
      return { allowed: false, retryAfter: LOCKOUT_MINUTES * 60 }
    }
  }

  return { allowed: true }
}

export async function recordFailedAttempt(key: string): Promise<void> {
  const rows = await query<{ attempts: number }>(
    'SELECT attempts FROM rate_limits WHERE key = ?',
    [key]
  )

  if (rows.length === 0) {
    await run(
      'INSERT INTO rate_limits (key, attempts, last_attempt) VALUES (?, 1, datetime(\'now\'))',
      [key]
    )
  } else {
    await run(
      'UPDATE rate_limits SET attempts = attempts + 1, last_attempt = datetime(\'now\') WHERE key = ?',
      [key]
    )
  }
}

export async function clearRateLimit(key: string): Promise<void> {
  await run('DELETE FROM rate_limits WHERE key = ?', [key])
}

async function geoLookup(ip: string): Promise<{ country: string | null; city: string | null }> {
  // Skip private/loopback IPs
  if (!ip || ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1') {
    return { country: null, city: null }
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`, {
      signal: AbortSignal.timeout(2000),
    })
    const data = await res.json() as { status: string; country?: string; city?: string }
    if (data.status === 'success') {
      return { country: data.country ?? null, city: data.city ?? null }
    }
  } catch {
    // Geo lookup failed — non-fatal
  }
  return { country: null, city: null }
}

export async function createSession(userId: string, ipAddress?: string): Promise<string> {
  const token = generateToken()
  const id = generateId()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const ip = ipAddress || null

  const { country, city } = ip ? await geoLookup(ip) : { country: null, city: null }

  await run(
    'INSERT INTO sessions (id, user_id, token, expires_at, ip_address, country, city) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, userId, token, expiresAt, ip, country, city]
  )

  return token
}

export async function validateSession(
  token: string
): Promise<{ id: string; email: string; name: string | null; plan: string } | null> {
  const rows = await query<{
    user_id: string
    expires_at: string
    email: string
    name: string | null
    plan: string
  }>(
    `SELECT s.user_id, s.expires_at, u.email, u.name, u.plan
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = ?`,
    [token]
  )

  if (rows.length === 0) return null

  const session = rows[0]
  if (new Date(session.expires_at) < new Date()) {
    await run('DELETE FROM sessions WHERE token = ?', [token])
    return null
  }

  return {
    id: session.user_id,
    email: session.email,
    name: session.name,
    plan: session.plan,
  }
}

export async function deleteSession(token: string): Promise<void> {
  await run('DELETE FROM sessions WHERE token = ?', [token])
}

export async function rotateSession(oldToken: string, userId: string): Promise<string> {
  await deleteSession(oldToken)
  return createSession(userId)
}
