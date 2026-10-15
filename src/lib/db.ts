import { createClient, type Client } from '@libsql/client'

let client: Client | null = null

function getDb(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN

    if (!url) {
      throw new Error('TURSO_DATABASE_URL environment variable is required')
    }

    client = createClient({
      url,
      authToken: authToken || undefined,
    })
  }
  return client
}

export async function initSchema(): Promise<void> {
  const db = getDb()

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password TEXT,
      plan TEXT DEFAULT 'free',
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      subscription_status TEXT DEFAULT 'inactive',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      external_id TEXT UNIQUE,
      home_team TEXT NOT NULL,
      away_team TEXT NOT NULL,
      home_team_logo TEXT,
      away_team_logo TEXT,
      league TEXT NOT NULL,
      league_logo TEXT,
      country TEXT NOT NULL,
      match_date TEXT NOT NULL,
      status TEXT DEFAULT 'upcoming',
      home_score INTEGER,
      away_score INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS predictions (
      id TEXT PRIMARY KEY,
      match_id TEXT UNIQUE NOT NULL,
      prediction TEXT NOT NULL,
      confidence INTEGER NOT NULL,
      tier TEXT NOT NULL,
      reasoning TEXT NOT NULL,
      odds REAL,
      result TEXT DEFAULT 'pending',
      is_premium INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (match_id) REFERENCES matches(id)
    );

    CREATE TABLE IF NOT EXISTS user_predictions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      prediction_id TEXT NOT NULL,
      tracked INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (prediction_id) REFERENCES predictions(id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS rate_limits (
      key TEXT PRIMARY KEY,
      attempts INTEGER DEFAULT 0,
      locked_until TEXT,
      last_attempt TEXT DEFAULT (datetime('now'))
    );
  `)
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  args: (string | number | null | boolean)[] = []
): Promise<T[]> {
  const db = getDb()
  const result = await db.execute({ sql, args })
  return result.rows as unknown as T[]
}

export async function run(
  sql: string,
  args: (string | number | null | boolean)[] = []
): Promise<{ rowsAffected: number; lastInsertRowid: string | number | bigint | null }> {
  const db = getDb()
  const result = await db.execute({ sql, args })
  return {
    rowsAffected: result.rowsAffected,
    lastInsertRowid: result.lastInsertRowid ?? null,
  }
}

export default getDb
