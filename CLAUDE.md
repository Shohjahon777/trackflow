# CLAUDE.md — TrackFlow

## What is TrackFlow
Multi-project command center and developer identity platform for solo builders. Freemium: Free + Pro ($9/mo). No third tier. Four personas: vibe coders, freelancers, indie hackers, CS students.

## Read before working
- **UI/styling work** → read `docs/BRANDBOOK.md` first. Never invent colors, spacing, or fonts.
- **New feature** → check `docs/DECISIONS.md` (settled decisions) and `docs/ROADMAP.md` (existing specs).
- **Database work** → check `docs/SCHEMA.md` for existing models.
- **Telegram bot work** → read `docs/TELEGRAM.md`.
- **Gamification/social** → read `docs/GAMIFICATION.md` or `docs/SOCIAL.md`.
- **Icon/badge work** → read `docs/ICONS.md`.

## Tech stack
Next.js 14+ (App Router), TypeScript (strict), Tailwind CSS v4, shadcn/ui, Prisma, PostgreSQL (Neon), NextAuth v5, Zod, nuqs, Framer Motion, Lucide React + @trackflow/icons, Stripe, grammY, Anthropic API (Haiku only), pnpm, Vercel.

## Architecture rules
1. Server Components by default. `"use client"` only for interactivity.
2. Server Actions for mutations. API routes only for: webhooks, public data, OG images, bot webhooks, analytics pixel.
3. No Zustand/Redux/tRPC/WebSockets.
4. Prisma for all DB. Raw SQL only for tsvector full-text search.
5. `checkPlan()` utility + `PlanGate` component for Pro feature gating.
6. LLM calls server-side only. Haiku only. Never Sonnet/Opus in production.

## Design rules (quick ref — full spec in docs/BRANDBOOK.md)
- Never `#FFFFFF` or `#000000`. Use Cloud `#FAFAF8` / Ink `#1C1C19`.
- Weights: 400, 500 only. Monospace for data, sans for UI.
- Spacing: 4px multiples. Borders: 0.5px (1px focused inputs). Radius: 4/8/12px.
- Sentence case everywhere. Color for emphasis, not bold.
- Colors: Cloud/Mist/Fog/Stone/Ash/Slate/Charcoal/Ink. Accent: Indigo 500 `#6366A0`.

## Naming
Files: kebab-case. Components: PascalCase. Functions: camelCase. Tables: snake_case. URLs: kebab-case.

## Commits
`feat:` / `fix:` / `style:` / `refactor:` / `docs:` — prefix with `(pro)` `(bot)` `(billing)` when scoped.

## Project structure
```
src/app/(dashboard)/     — Protected app (projects, brain, bots, analytics, billing, settings)
src/app/(marketing)/     — Public (landing, pricing)
src/app/[username]/      — Public profile (ISR, revalidate: 300)
src/app/share/[token]/   — Client share links (no auth)
src/app/api/webhooks/    — GitHub, Stripe, Telegram, Slack, Discord
src/app/api/ai/          — LLM classification + context generation
src/components/          — ui/, dashboard/, project/, profile/, bots/, billing/, analytics/
src/lib/                 — db.ts, auth.ts, github.ts, stripe.ts, ai.ts, plan.ts, bots/
src/actions/             — Server Actions
packages/icons/          — @trackflow/icons (internal pnpm workspace package)
docs/                    — Architecture docs (BRANDBOOK, ROADMAP, DECISIONS, SCHEMA, etc.)
```

## Status
Phases 1–11 mostly complete. Pending: Vercel deploy, LLM classification layer, Slack/Discord bots. See `docs/ROADMAP.md` for full status.