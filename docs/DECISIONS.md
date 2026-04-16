# TrackFlow — Architecture Decision Log

> Settled decisions. Do not re-litigate unless the founder explicitly reopens.
> Last updated: 2026-04-07

---

## Product Decisions

### PROD-001: Two pricing tiers only
- **Decision**: Free + Pro ($9/mo). No third tier.
- **Rationale**: Simplicity in pricing. Solo founder can't support tier complexity. Two tiers force a clean free/Pro split.
- **Date**: March 2026

### PROD-002: No WhatsApp bot
- **Decision**: Bot platforms are Telegram, Slack, Discord only. WhatsApp explicitly excluded.
- **Rationale**: WhatsApp Business API requires Meta business verification — too much friction for MVP. Defer indefinitely.
- **Date**: March 2026

### PROD-003: Telegram first for bot platform
- **Decision**: Build Telegram integration first, then Slack, then Discord.
- **Rationale**: Simplest API, most common for freelancer clients (especially in CIS/SEA markets). grammY library is TypeScript-native and webhook-friendly.
- **Date**: March 2026

### PROD-004: No team features
- **Decision**: No roles, permissions, team management, or multiplayer features.
- **Rationale**: TrackFlow is for solo builders. Team tools (Linear, Jira) already exist. Adding team features would dilute positioning.
- **Date**: March 2026

### PROD-005: Public profiles are always free
- **Decision**: The public profile (trackflow.dev/username) is free tier. Never paywall it.
- **Rationale**: Public profile is the viral growth surface. Paywalling it kills distribution. Pro features enhance profiles (pinned projects, custom themes) but the base profile is free.
- **Date**: March 2026

### PROD-006: Gamification is public by default
- **Decision**: XP, levels, proof-of-work scores, badges, streaks are all publicly visible on profiles. No opt-out.
- **Rationale**: Earned identity IS the product's value prop. Hiding gamification data defeats the purpose of a "proof of work" platform.
- **Date**: March 2026

### PROD-007: Ask Me is metric-gated, not application-based
- **Decision**: "Ask Me" unlocks automatically when: proof-of-work ≥ 60, 5+ shipped projects, Level 10+, account age ≥ 90 days.
- **Rationale**: No manual review process needed. Gamification system does the gatekeeping. Scales without founder intervention.
- **Date**: April 2026

### PROD-008: No content paywall on profiles
- **Decision**: All profile content (shelf, worklog, methods, projects) is free and public. Only "Ask Me" consultations charge money.
- **Rationale**: Free transparency builds network effects. Paid subscriptions to view someone's daily routine would create a content business TrackFlow doesn't want to operate. The profile is the discovery layer; Ask Me is the monetization layer.
- **Date**: April 2026

### PROD-009: No DMs, no follower counts, no algorithmic feed
- **Decision**: Social layer is discovery-based (search/filter), not engagement-based (feed/follow/like).
- **Rationale**: Prevents becoming a social media platform. Keeps focus on shipping, not scrolling. Vouch and stars are the engagement primitives — both backed by real activity.
- **Date**: April 2026

### PROD-010: HICOOL competition — apply but don't reshape roadmap
- **Decision**: Apply to HICOOL Global Entrepreneurship Competition if desired, but do not modify product roadmap to fit China-ecosystem orientation.
- **Rationale**: Low downside risk to apply. But TrackFlow's target personas are global/Western-leaning. Reshaping for HICOOL's China focus would distract from core users.
- **Date**: March 2026

### PROD-011: Vouch costs XP, not free weekly credits
- **Decision**: Vouching for a project costs 50 XP. No free regenerating credits.
- **Rationale**: Free credits = vouch-for-vouch spam within days. XP cost = real skin in the game. You can only vouch if you've shipped real work. Original design had 3 free credits/week — replaced after analysis showed it would be gamed immediately.
- **Date**: April 2026

### PROD-012: Client feedback uses XP-gated hiding, not deletion
- **Decision**: Developers cannot delete client comments. They can only hide them by spending XP (100 first, doubles each time). Hiding expires after 90 days.
- **Rationale**: Creates honesty flywheel — the best strategy is doing good work so positive reviews bury negative ones. Novel mechanic in developer tools space. Self-correcting system.
- **Date**: March 2026

### PROD-013: Four personas only
- **Decision**: Product serves exactly four personas: vibe coders, freelance developers, indie hackers, CS students.
- **Rationale**: Clear targeting prevents feature creep. Every feature must serve at least one persona. Senior engineers at large companies, non-technical PMs, and teams > 4 are explicitly out of scope.
- **Date**: March 2026

---

## Architecture Decisions

### ARCH-001: Server Components by default
- **Decision**: React Server Components as default. "use client" only for interactivity (onClick, useState, forms, drag-and-drop).
- **Rationale**: Performance, security (no API key exposure), simpler data flow. Matches Next.js 14+ App Router best practices.
- **Date**: March 2026

### ARCH-002: Server Actions for mutations
- **Decision**: All internal mutations use Server Actions. No separate REST API layer.
- **Rationale**: End-to-end type safety, fewer files, no API versioning overhead.
- **Exception**: API Route Handlers for webhooks (GitHub, Stripe, Telegram, Slack, Discord), public data endpoints, OG images, analytics pixel, LLM classification.
- **Date**: March 2026

### ARCH-003: No global state library
- **Decision**: No Zustand, Redux, Jotai, or similar. RSC for server data, nuqs for URL-synced state, useState/useContext for local UI.
- **Rationale**: RSC eliminates most global state needs. Adding a state library adds complexity without benefit at this scale.
- **Date**: March 2026

### ARCH-004: Claude Haiku for all automated LLM features
- **Decision**: Use Claude Haiku 4.5 exclusively for bot classification and AI context generation in production.
- **Rationale**: Cost efficiency. $1/$5 per million tokens. Breakeven at ~7 Pro subscribers. Never use Sonnet/Opus for automated features — reserve for development only.
- **Date**: March 2026

### ARCH-005: @trackflow/icons as internal pnpm workspace package
- **Decision**: Custom icons and badges built as standalone package at packages/icons/. Same API as Lucide React.
- **Rationale**: Decoupled from app code. Survives full app rewrites. pnpm workspace linking. Tree-shakeable. All SVG, all code-generated, brand-compliant by construction.
- **Date**: April 2026

### ARCH-006: Webhook-based Telegram (not polling)
- **Decision**: Telegram bots use webhooks via dynamic route /api/telegram/[botId]. Not long-polling.
- **Rationale**: Serverless-compatible (Vercel). No persistent process needed. No WebSockets. Fully stateless handlers with database-driven bot registry.
- **Date**: March 2026

### ARCH-007: PostgreSQL full-text search for Cmd+K
- **Decision**: Use tsvector/tsquery for cross-project search. No external search service (Algolia, Elasticsearch, Meilisearch).
- **Rationale**: No extra infrastructure cost. Sufficient accuracy for MVP scale (< 10K projects). Raw SQL via Prisma.$queryRaw for tsvector queries.
- **Date**: March 2026

### ARCH-008: AES-256-GCM for bot token encryption
- **Decision**: Telegram bot tokens encrypted at rest using AES-256-GCM. Key in environment variable. Prisma middleware handles transparent encrypt/decrypt.
- **Rationale**: Bot tokens are credentials — must not be stored in plaintext. AES-256-GCM is standard, fast, and available in Node.js crypto module.
- **Date**: March 2026

### ARCH-009: One bot per project per platform
- **Decision**: Each project can have at most one Telegram bot, one Slack bot, one Discord bot. Not multiple per platform.
- **Rationale**: Simplifies data model and UI. Multiple bots per platform per project creates confusing UX with no clear benefit.
- **Date**: March 2026

### ARCH-010: ISR for public pages
- **Decision**: Public profile pages use ISR with revalidate: 300 (5 minutes). Not SSR, not static.
- **Rationale**: Balance between freshness and performance. Profile changes aren't real-time critical. 5 min cache reduces database load while keeping content reasonably fresh.
- **Date**: March 2026

---

## Rejected Ideas (do not re-propose)

| Idea | Why rejected | Date |
|---|---|---|
| Third pricing tier | Unnecessary complexity for solo founder | March 2026 |
| WhatsApp bot | Meta Business verification too heavy | March 2026 |
| Real-time / WebSockets | useOptimistic sufficient. No persistent connections on Vercel. | March 2026 |
| tRPC | RSC already provides e2e type safety | March 2026 |
| Native mobile app | Web-first. PWA if mobile needed. | March 2026 |
| Auto AI cost tracking via provider APIs | Too complex, unreliable across providers | March 2026 |
| Team/org features | Out of scope. Solo builders only. | March 2026 |
| Deployment API integrations (Vercel/Netlify) | Nice-to-have, not core value prop | March 2026 |
| Follower counts on profiles | Become vanity metrics instantly | April 2026 |
| DMs / in-app messaging | Telegram/Slack/Discord handle comms | April 2026 |
| Algorithmic feed | Discovery should be search-based, not engagement-optimized | April 2026 |
| Paid profile subscriptions | Creates content business TrackFlow doesn't want | April 2026 |
| Free vouch credits (3/week) | Would be gamed via vouch-for-vouch exchanges | April 2026 |

---

*Add new decisions immediately when made. Don't wait for a batch update.*
*Every decision needs: what, why, and when. No decisions without rationale.*