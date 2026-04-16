# TrackFlow

> Multi-project command center and developer identity platform for solo builders.

TrackFlow gives vibe coders, freelancers, indie hackers, and CS students a single place to run their projects, prove their work, and show it off — projects, tasks, time tracking, GitHub activity, a public profile, and a Telegram bot that pipes into your workflow.

---

## Features

### Project command center
- Unlimited projects (Free plan: 3 active; Pro: unlimited)
- Kanban board with drag-and-drop tasks, subtasks, milestones
- Tabbed project detail: overview, tasks, milestones, notes, activity, time
- Markdown notes with inline editing
- Project-level share links (public read-only view via `/share/[token]`)

### Developer identity
- Public profile at `trackflow.app/[username]` (ISR, 5-minute revalidation)
- XP + levels, streak tracking, league badges
- Proof-of-work score derived from shipped tasks, GitHub activity, and streaks
- OG image generation for sharing

### Time & focus
- Built-in Pomodoro timer with session logging
- Manual time entries per task
- Daily streak rollover (cron-driven)

### Integrations
- **GitHub** — commit/PR activity pulled via Octokit, counted toward streak + XP
- **Telegram** — personal bot per user (grammY), encrypted token storage, DM/group access policy
- **Stripe** — monthly + annual Pro billing with webhooks
- **Uploadthing** — avatars and attachments
- **Anthropic (Haiku)** — server-side task classification + context generation

### Analytics
- Profile view tracking (IP-hashed)
- Per-project activity feed
- Pixel endpoint for share-link analytics

---

## Tech stack

| Layer          | Choice                                                   |
|----------------|----------------------------------------------------------|
| Framework      | Next.js 16 (App Router, React 19, Server Components)     |
| Language       | TypeScript (strict)                                      |
| Styling        | Tailwind CSS v4 + shadcn/ui + Framer Motion              |
| Database       | PostgreSQL (Neon) via Prisma 6                           |
| Auth           | NextAuth v5 (GitHub OAuth)                               |
| Validation     | Zod                                                      |
| URL state      | nuqs                                                     |
| Payments       | Stripe                                                   |
| Bot            | grammY (Telegram)                                        |
| LLM            | Anthropic Haiku (server-side only)                       |
| Uploads        | Uploadthing                                              |
| Package mgr    | pnpm                                                     |
| Hosting        | Vercel                                                   |

---

## Project structure

```
src/
├── app/
│   ├── (auth)/           Sign-in flow
│   ├── (dashboard)/      Protected app (projects, brain, bots, analytics, billing, settings)
│   ├── (marketing)/      Public landing + pricing
│   ├── [username]/       Public profile (ISR)
│   ├── share/[token]/    Read-only share links
│   └── api/
│       ├── analytics/    Pixel endpoint
│       ├── auth/         NextAuth handlers
│       ├── cron/         Vercel Cron jobs (streak rollover, etc.)
│       ├── og/           Open Graph image generation
│       ├── telegram/     Bot webhooks
│       └── webhooks/     Stripe webhooks
├── actions/              Server Actions (all mutations)
├── components/           ui/, dashboard/, project/, profile/, bots/, billing/, analytics/
├── lib/                  db, auth, github, stripe, plan, xp, encryption, telegram/
└── types/
prisma/
└── schema.prisma
docs/                     BRANDBOOK, ROADMAP, DECISIONS, SCHEMA, GAMIFICATION, SOCIAL, TELEGRAM, ICONS
```

---

## Architecture rules

1. **Server Components by default.** `"use client"` only where interactivity is needed.
2. **Server Actions for mutations.** API routes reserved for webhooks, public data, OG images, bot webhooks, and the analytics pixel.
3. **No Zustand, Redux, tRPC, or WebSockets.** URL state via nuqs; realtime via polling or revalidation.
4. **Prisma for all DB access.** Raw SQL only for `tsvector` full-text search.
5. **Feature gating** via `checkPlan()` utility + `<PlanGate>` component.
6. **LLM calls server-side only, Haiku only.** No Sonnet/Opus in production paths.

Full design spec in [`docs/BRANDBOOK.md`](docs/BRANDBOOK.md). Settled decisions in [`docs/DECISIONS.md`](docs/DECISIONS.md). Schema doc in [`docs/SCHEMA.md`](docs/SCHEMA.md).

---

## Getting started

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL database (Neon recommended)
- GitHub OAuth app
- Stripe account (for billing features)
- Uploadthing account (for uploads)

### 1. Clone and install
```bash
git clone https://github.com/Shohjahon777/trackflow.git
cd trackflow
pnpm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```

Required:
```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."           # openssl rand -base64 32
AUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
UPLOADTHING_TOKEN="..."
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
STRIPE_PRO_MONTHLY_PRICE_ID="..."
STRIPE_PRO_ANNUAL_PRICE_ID="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
TELEGRAM_ENCRYPTION_KEY="..."   # node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Set up the database
```bash
pnpm prisma migrate dev
pnpm prisma generate
```

### 4. Run the dev server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command          | What it does                                |
|------------------|---------------------------------------------|
| `pnpm dev`       | Prisma generate + Next.js dev server        |
| `pnpm build`     | Prisma generate + production build          |
| `pnpm start`     | Build + start production server             |
| `pnpm lint`      | Run ESLint                                  |

---

## Plans

| Feature                  | Free          | Pro ($9/mo)      |
|--------------------------|---------------|------------------|
| Active projects          | 3             | Unlimited        |
| Pomodoro + time tracking | ✓             | ✓                |
| Public profile           | ✓             | ✓ + custom theme |
| Share links              | 1 active      | Unlimited        |
| Telegram bot             | —             | ✓                |
| AI task classification   | —             | ✓                |
| Analytics                | Basic         | Full             |

No third tier. Annual billing gets two months free.

---

## Deployment

TrackFlow is built for Vercel. `vercel.json` configures cron jobs (streak rollover, profile-view rollups). Set all env vars in the Vercel dashboard, connect the GitHub repo, and deploy.

Webhook endpoints to register after deploy:
- Stripe → `/api/webhooks/stripe`
- Telegram → `/api/telegram/[botId]`

---

## Contributing

This is a solo project, but PRs and issues are welcome. Before opening a PR:
- Read `CLAUDE.md` for the architecture and design rules
- Follow the commit prefix convention: `feat:`, `fix:`, `style:`, `refactor:`, `docs:` (scope with `(pro)`, `(bot)`, `(billing)` where applicable)
- Never introduce `#FFFFFF` / `#000000` — use the brand palette in `docs/BRANDBOOK.md`

---

## License

Proprietary — all rights reserved. Contact the maintainer for licensing inquiries.

---

Built by [@Shohjahon777](https://github.com/Shohjahon777).
