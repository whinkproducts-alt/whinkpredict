# WhinkPredict

**AI-powered sports predictions SaaS. Built by WHINK Group.**

Live URL: **https://whinkpredict.onrender.com**

---

## What it is

WhinkPredict delivers daily AI-generated sports picks with confidence scoring, premium tier access, and analyst picks ("Naye's Picks"). Users sign up free, view limited predictions, and can upgrade to Premium for full access.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.4 (App Router) + TypeScript |
| Styling | Custom WHINK Design System (CSS variables, no Tailwind class spam) |
| Database | Turso (libSQL / SQLite edge) |
| Auth | Custom scrypt sessions (httpOnly cookie) |
| Payments | Stripe Checkout + Webhooks (subscription billing) |
| Analytics | PostHog (GDPR-compliant, consent-gated) |
| Live Odds | The Odds API |
| Hosting | Render (web service + persistent disk) |

---

## Features

### Free tier
- 3 daily AI predictions with confidence scores
- Register / login with scrypt-hashed passwords
- Rate-limited auth (brute-force protection)

### Premium tier ($19/month)
- Unlimited predictions across all sports
- Detailed AI reasoning per pick
- Naye's weekly elite picks
- Advanced analytics dashboard
- Email alerts for high-confidence picks

### Platform
- Stripe Checkout redirect from every upgrade CTA (dashboard header, upgrade banner, settings page)
- Stripe Webhooks handle subscription lifecycle (active, past_due, cancelled)
- PostHog event tracking: `user_signed_up`, `user_logged_in`, `user_upgraded_to_premium`, `user_downgraded_to_free`
- GDPR cookie consent banner on first visit — PostHog respects opt-out via `opt_out_capturing()`
- Security: CSP headers, rate limiting, httpOnly session cookies, input sanitisation

---

## Local Setup

```bash
cp .env.example .env.local
# Fill in values (see Environment Variables section below)

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Set these in Render (or your `.env.local` locally):

| Variable | Description |
|---|---|
| `TURSO_DATABASE_URL` | libsql:// connection string from Turso |
| `TURSO_AUTH_TOKEN` | Turso JWT auth token |
| `SESSION_SECRET` | 32+ char random string for session signing |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_live_... or sk_test_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_PRICE_ID` | Stripe Price ID for the $19/mo subscription |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (whsec_...) |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key (phc_...) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host (default: https://us.i.posthog.com) |
| `ODDS_API_KEY` | The Odds API key for live sports data |
| `NEXT_PUBLIC_APP_URL` | Public base URL (e.g. https://whinkpredict.onrender.com) |

---

## Project Structure

```
src/
  app/
    api/
      auth/          # register, login, logout, me
      stripe/        # checkout, portal, webhook
      predictions/   # AI predictions endpoint
      admin/         # odds sync (admin-only)
    dashboard/       # main app (predictions, analytics, settings, favourites)
    (marketing)/     # landing page, Naye's picks
    legal/           # privacy, cookies, refund, terms
  components/
    ui/
      UpgradeButton.tsx    # client component — POSTs to /api/stripe/checkout
      PredictionCard.tsx
    PostHogProvider.tsx    # consent-aware analytics init
    CookieConsent.tsx      # GDPR banner (accept / decline)
  lib/
    db.ts            # Turso client + query helpers
    auth.ts          # scrypt, sessions, rate limiting
    stripe.ts        # Stripe singleton
    posthog.ts       # server-side PostHog (Node SDK)
    predictions.ts   # prediction engine
    nayes-picks.ts   # Naye's curated picks
```

---

## Deployment (Render)

The `render.yaml` file configures the web service automatically.

1. Connect the GitHub repo to Render
2. Render detects `render.yaml`
3. Add all environment variables listed above in the Render dashboard
4. Deploy — Render auto-deploys on every push to `main`

Webhook endpoint to register in Stripe:
```
https://whinkpredict.onrender.com/api/stripe/webhook
```

Events to enable: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## Key Decisions

- **Turso over SQLite file** — edge-compatible, survives Render restarts, no disk dependency
- **Custom auth over NextAuth** — fewer dependencies, full control of session shape
- **PostHog over Plausible** — generous free tier, full event tracking, GDPR-safe with consent gate
- **Stripe Checkout (hosted)** — no PCI scope, zero frontend payment UI to maintain
- **No Tailwind runtime** — pure CSS custom properties keep the bundle tiny and the design consistent

---

Built by [WHINK Group](https://whinkgroup.com) · CEO Victor Igboekwe
