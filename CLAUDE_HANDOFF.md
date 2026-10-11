# WHINK Predict — Claude Handoff

## Current state

WHINK Predict is live at https://whinkpredict.onrender.com. Its repository is `https://github.com/whinkproducts-alt/whinkpredict.git`; the `main` branch deploys automatically to the Render web service named `whinkpredict` (Oregon/free plan). The current live commit is `db152fc`.

The public landing page was redesigned to follow the Wix reference direction at https://whinkproducts.wixsite.com/whinkpredict while retaining the existing application flows.

## Completed redesign

- Light-grey, minimal marketing navigation: Home, Naye’s Picks, Pricing, Login, Join Pro.
- Dark sports-intelligence hero with blue/lime accents, conversion CTAs, and an original CSS-built analytics console.
- Existing ticker, Naye promotion, predictions, feature sections, pricing, FAQ, legal links, login, registration, dashboards, and premium conversion paths remain.
- The hero uses no copied or remote design assets. Existing branded images remain in `public/brand/`.

Primary files:

- `src/app/page.tsx` — public landing page.
- `src/components/marketing/Navbar.tsx` — marketing navigation.
- `src/app/globals.css` — global, responsive, `.marketing-site`, and prediction-console styles.
- `public/brand/logo.png`, `public/brand/naye.png` — brand images.

## Stack

- Next.js 16.4.0, App Router, TypeScript, React 19.3.0.
- Tailwind CSS 3.4.x, PostCSS, Autoprefixer.
- SQLite using `better-sqlite3`.
- Custom token/cookie authentication using Node crypto/scrypt.
- Jest tests.

The README is stale: it still mentions WHINK Bet, Next 15, Tailwind 4, and an old URL. Use `package.json`, `render.yaml`, and this handoff as the current source of truth until that file is refreshed.

## Routes

| Purpose | Route |
| --- | --- |
| Marketing home | `/` |
| Login / registration | `/login`, `/register` |
| Naye feature | `/nayes-picks` |
| Dashboard | `/dashboard` |
| Dashboard pages | `/dashboard/predictions`, `/dashboard/analytics`, `/dashboard/favourites`, `/dashboard/settings` |
| Legal pages | `/legal`, `/legal/privacy`, `/legal/cookies`, `/legal/refund` |
| Auth APIs | `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/register` |
| Prediction API | `/api/predictions` |

## Code map

- `src/lib/db.ts`: SQLite connection and schema creation.
- `src/lib/auth.ts`: scrypt password hashing plus session creation, validation, and deletion.
- `src/lib/predictions.ts`: seeded demo matches, deterministic confidence scoring, prediction access, and statistics.
- `src/lib/nayes-picks.ts`: Naye weekly-pick data/rotation.
- `src/proxy.ts`: protected-page request behavior.
- `src/components/dashboard/Sidebar.tsx`: dashboard navigation.
- `src/components/ui/PredictionCard.tsx`: shared prediction card.

SQLite initializes `users`, `sessions`, `matches`, `predictions`, and `user_predictions` lazily. Prediction data is demo data; `seedPredictions()` inserts it only when no matches exist, and there is no live sports/odds feed.

Authentication uses seven-day custom token sessions. Before a paid or high-traffic launch, review rate limiting, validation, recovery, abuse controls, session security, entitlement verification, payment handling, and API security.

## Render deployment

`render.yaml` uses `npm ci --include=dev && npm run build` followed by `npm start`. Render variables include `NODE_ENV=production`, `NEXT_PUBLIC_APP_NAME=WhinkPredict`, `NEXTAUTH_SECRET`, `DATABASE_URL=/tmp/whinkpredict.db`, and `NEXT_PUBLIC_APP_URL=https://whinkpredict.onrender.com`.

### Critical port fix

Keep this `package.json` script exactly unless it is replaced by an equivalent port-aware command:

```json
"start": "next start -p $PORT"
```

Render assigns its own port. A plain `next start` listened on port 3000 and led to a port-scan timeout after a successful build. Binding to `$PORT` fixed the live release.

### Tailwind setup

- `tailwindcss` is version 3.4.x.
- `postcss.config.mjs` registers `tailwindcss` and `autoprefixer`.
- `tailwind.config.js` scans `src/app` and `src/components`.
- `src/app/globals.css` begins with `@tailwind base`, `@tailwind components`, and `@tailwind utilities`.

Do not revert to the prior Tailwind 4 / `@tailwindcss/postcss` configuration without a Render test. Its compiler package failed to resolve in Render builds.

### Persistence warning

`DATABASE_URL=/tmp/whinkpredict.db` is ephemeral. Registrations, sessions, and data can disappear after restarts or deploys. Use an attached disk or managed database before relying on persistence, with a migration and backup plan.

## Local workflow

Node 22+ is required.

```bash
npm ci
npm run dev
npm run build
npm test
npm run lint
PORT=3000 npm start
```

The production build and the explicit-port startup were both verified before the current release.

## Design guardrails

- Keep navigation concise and conversion-focused.
- Preserve the dark analytical visual system, bright blue primary actions, and restrained lime confidence accents.
- Keep the hero visual local/CSS-built unless licensed assets are intentionally introduced.
- Preserve working registration/login, Naye, prediction, dashboard, legal, and pricing flows unless explicitly asked to change them.
- Do not portray seeded accuracy values as independently verified real-world guarantees.

## Suggested next work

1. Update `README.md` with current branding, versions, commands, and public URL.
2. Implement durable database storage.
3. Add payment processing plus server-side Premium entitlement checks.
4. Replace demo predictions with a documented live data source and transparent accuracy methodology.
5. Add end-to-end coverage for auth, protected routes, premium gating, and mobile navigation.
6. Conduct a security review of custom authentication and public APIs.

## Recent commits

- `db152fc` — Bind Next server to Render port.
- `2afa77d` — Use compatible Tailwind compiler in production.
- `d5524b6` — Fix clean install command for Render.
- `da47033` — Use locked dependencies for Render builds.
- `e58d28b` — Align marketing site with Wix visual design.
