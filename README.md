<div align="center">
  <img src="public/Logo.svg" alt="GLM-Image Logo" width="120" />
</div>

# GLM-Image

AI-powered image generation platform using GLM-4.7 prompt optimization and GLM-Image rendering.

**Live**: [image-glm.vercel.app](https://image-glm.vercel.app)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  Next.js 16 App Router • React 19 • Tailwind CSS 4 • Clerk     │
├─────────────────────────────────────────────────────────────────┤
│  /              Landing page with feature cards                 │
│  /create        AI generation studio (MainCanvas + ControlPanel)│
│  /discover      Public gallery (masonry layout)                 │
│  /g/[id]        Single generation view                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE                                 │
│  Clerk Auth • Upstash Rate Limiting (10/min mutations)         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API ROUTES                                 │
│  POST /api/optimize     → GLM-4.7 (prompt enhancement)          │
│  POST /api/generate     → GLM-Image + Supabase upload + DB      │
│  GET  /api/history      → Paginated user generations            │
│  GET  /api/discovery    → Public feed (no auth)                 │
│  *    /api/generation/[id] → CRUD with ownership check          │
│  POST /api/webhooks/clerk  → User sync from Clerk               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│  Zhipu AI (GLM-4.7 + GLM-Image) • Supabase (DB + Storage)       │
│  Clerk (Auth) • Upstash (Redis rate limiting)                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Generation Pipeline

```
User Input → /api/optimize → GLM-4.7 → betterPrompt
                                           │
                                           ▼
                               /api/generate → GLM-Image → imageUrl
                                                              │
                                                              ▼
                                               Supabase Storage (persist)
                                                              │
                                                              ▼
                                               PostgreSQL (Generation record)
```

---

## New Features

### Daily Generation Limits

Implemented Redis-based daily limits with per-user customization:

```
Generation Request → Check Daily Limit (Redis INCR)
                                         │
                              ┌──────────┴──────────┐
                              │                     │
                         Limit OK             Limit Reached
                              │                     │
                              ▼                     ▼
                        Allow Generation    Show LimitExceededPopup
```

**Features:**
- **Atomic Redis Operations**: Race-condition proof counting using `INCR` + `EXPIRE`
- **Per-User Custom Limits**: Database field `dailyGenLimit` (default: 10)
- **24-Hour Rolling Window**: Limits reset automatically after 24 hours
- **Beautiful UI Feedback**: Animated popup when limit exceeded

**Implementation:**
```typescript
// lib/daily-limit.ts
checkDailyLimit(userId, limit) → { success, count, remaining }

// prisma/schema.prisma
model User {
  dailyGenLimit Int @default(10)  // Customizable per user
}

// API response when limit reached
HTTP 429: "Daily generation limit reached. Want to increase your limit? DM the developer."
```

**Database Field:**
- Admins can override limits per user via `dailyGenLimit` field
- Default: 10 generations/day
- Stored in PostgreSQL, checked in real-time via Redis

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Auth | Clerk |
| Database | PostgreSQL (Supabase) via Prisma 7 |
| Storage | Supabase Storage |
| Rate Limit | Upstash Redis |
| AI Models | GLM-4.7 (text), GLM-Image (generation) |
| Logging | Pino (structured, redacted) |

---

## Database Schema

```
User ──┬── Generation (1:N)
       │     dailyGenLimit: Int @default(10)
       └── ModerationLog (1:N)

Generation: id, userId, imageUrl, originalPrompt, betterPrompt,
            model, style, aspectRatio, detailLevel, isPublic,
            optimizationDelta, generationDuration, retryCount

ModerationLog: id, userId, prompt, reason, stage
ErrorLog: id, userId, endpoint, message, stack
```

---

## Security

- **Auth**: Clerk middleware on all routes (except webhooks)
- **Validation**: Zod schemas on all API inputs
- **Rate Limit**: 10 req/min mutations (Upstash Redis sliding window)
- **Daily Limits**: 10 generations/day per user (Redis INCR, custom limits via DB)
- **Logging**: Pino with auto-redaction of secrets/prompts
- **Ownership**: Users can only modify their own generations
- **Webhook**: Svix signature verification

---

## Environment Variables

```env
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# AI API
ZAI_API_KEY=sk-...

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Storage (Supabase)
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
```

---

## Local Development

```bash
# Install
npm install

# Generate Prisma client
npx prisma generate

# Run dev server
npm run dev

# Open Prisma Studio
npx prisma studio
```

---

## Deployment

Vercel auto-deploys on push. Ensure all env vars are set in Vercel dashboard.

```bash
# Manual deploy
vercel --prod
```

---

## License

Proprietary Software. All rights reserved.

---

<div align="center">
  <sub>A <a href="https://hasin.vercel.app">Hasin Raiyan</a> Creation</sub>
</div>
