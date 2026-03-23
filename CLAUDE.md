# CLAUDE.md — TrackFlow Development Instructions

## Project Overview
TrackFlow is a multi-project command center and developer identity platform for anyone who ships. It helps solo builders manage multiple concurrent projects from one dashboard, showcase their work through a public profile, and communicate with clients via AI-powered bot assistants. TrackFlow operates on a freemium model: a generous free tier for individual builders and a Pro plan ($9/mo) for power features including bot assistants, portfolio analytics, AI context generation, and custom client portals.

## Critical: Read Before Any Work
Before writing ANY code, styling, or component, read `BRANDBOOK.md` in the project root. It contains every design token, color, font, spacing value, and component pattern. **Never invent colors, spacing, or font sizes not defined in the brand book.**

## Tech Stack

### Core
- **Framework**: Next.js 14+ (App Router) with TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Fonts**: Geist Sans (UI) + JetBrains Mono (data) via `next/font`
- **Auth**: NextAuth.js v5 — GitHub OAuth primary, Google OAuth secondary
- **Database**: PostgreSQL on Neon, ORM via Prisma
- **Validation**: Zod (shared client/server schemas)
- **URL State**: nuqs
- **Motion**: Framer Motion (Kanban drag + page transitions only)
- **Icons**: Lucide React (stroke-only, no filled, no emoji)
- **File uploads**: Uploadthing
- **OG images**: next/og (Satori)
- **GitHub API**: Octokit (REST + GraphQL)
- **Package manager**: pnpm
- **Deployment**: Vercel

### Monetization & payments
- **Billing**: Stripe (Checkout, Customer Portal, Webhooks)
- **Plans**: Free + Pro ($9/mo). No third tier. See plan definitions in Phases.md.

### AI / LLM layer (Pro features only)
- **Provider**: Anthropic API (Claude Haiku 4.5)
- **Pricing**: $1 input / $5 output per million tokens
- **Used for**: Bot message classification (intent detection), AI context generator (project brain → structured context export)
- **Rule**: Always use Haiku for cost efficiency. Never use Sonnet/Opus for automated features. Keep prompt templates short. Use prompt caching where possible for repeated system prompts.

### Bot assistant integrations (Pro only)
- **Telegram**: Bot API (grammy or telegraf library)
- **Slack**: Slack App with OAuth, Events API, Block Kit
- **Discord**: discord.js with slash commands
- **Architecture**: Platform webhook → Next.js API route → LLM classify intent → route to action

## Architecture Rules
1. **Server Components by default.** Only use `"use client"` when the component needs interactivity (onClick, useState, forms, drag-and-drop).
2. **Server Actions for mutations.** No separate API layer. Use Zod for validation in server actions.
3. **API Route Handlers only for**: public profile data, OG image generation, GitHub webhooks, client share links, Stripe webhooks, bot platform webhooks (Telegram/Slack/Discord), analytics tracking pixel.
4. **No Zustand, no Redux, no global state library.** Use React Server Components for server data, `nuqs` for URL-synced state, `useState`/`useContext` for local UI state.
5. **No tRPC.** Server Components already provide end-to-end type safety.
6. **No real-time / WebSockets.** Use `useOptimistic` for instant UI feedback on mutations.
7. **Prisma for all database access.** Never write raw SQL unless Prisma can't express the query. Exception: PostgreSQL full-text search (tsvector) for cross-project search may require raw queries.
8. **Plan gating via middleware.** Check user subscription status before granting access to Pro features. Use a shared `checkPlan()` utility, not ad-hoc checks scattered through components.
9. **LLM calls are server-side only.** Never expose the Anthropic API key to the client. All LLM classification and generation happens in API routes or server actions.

## Design Rules (Summary — full spec in BRANDBOOK.md)
1. **Never use `#FFFFFF` or `#000000`.** Use Cloud (`#FAFAF8`) and Ink (`#1C1C19`).
2. **Two font weights only**: 400 (regular) and 500 (medium). Never 600 or 700.
3. **Monospace for data, sans for UI.** If it comes from a database/API/git → JetBrains Mono. If it's UI text → Geist Sans.
4. **All spacing is multiples of 4px.** Steps: 4, 8, 12, 16, 20, 24, 32, 48, 64.
5. **Border width: 0.5px everywhere.** Exception: 1px for focused inputs.
6. **Border radius: 4px (sm), 8px (md), 12px (lg).** Use md for most elements.
7. **Sentence case everywhere.** Headings, buttons, nav, badges — never Title Case.
8. **Uppercase only for section labels** (11px + letter-spacing 0.04em).
9. **Color for emphasis, not bold.** Use Indigo 500 to highlight words, not font-weight.
10. **Status colors are quiet.** Desaturated 30% from typical UI kits.

## Color Quick Reference
```
Neutrals: Cloud #FAFAF8 | Mist #F4F4F1 | Fog #EAEAE6 | Stone #D4D4CE | Ash #9C9C95 | Slate #6B6B64 | Charcoal #3D3D38 | Ink #1C1C19
Accent:   Indigo 50 #EEEEF6 | 100 #C7C7E2 | 300 #8E8EC5 | 500 #6366A0 | 600 #4B4E84 | 800 #353764
Status:   Success #3D8B6E/#EBF3EE | Warning #C4956A/#FBF3EB | Danger #C26A6A/#FBEDED | Info #5B8CA8/#EBF2F7
Dark bg:  Base #111110 | Surface #1A1A18 | Elevated #242422 | Border #2E2E2B
Dark fg:  Text #E0E0DC | Muted #8A8A84 | Accent #7B7BD0
```

## Project Structure
```
src/
├── app/
│   ├── (auth)/              # Login, callback pages
│   ├── (dashboard)/         # Protected app layout
│   │   ├── projects/        # /projects, /projects/[id]
│   │   ├── brain/           # /brain (project context store)
│   │   ├── bots/            # /bots (bot management — Pro)
│   │   ├── analytics/       # /analytics (portfolio analytics — Pro)
│   │   ├── search/          # /search (cross-project search — Pro)
│   │   ├── billing/         # /billing (plan management, Stripe portal)
│   │   └── settings/        # /settings
│   ├── (marketing)/         # Public marketing pages
│   │   ├── pricing/         # /pricing (Free vs Pro comparison)
│   │   └── landing/         # / (landing page)
│   ├── [username]/          # Public profile (ISR, revalidate: 300)
│   ├── share/[token]/       # Client share links (no auth)
│   └── api/
│       ├── og/              # Dynamic OG image generation
│       ├── webhooks/
│       │   ├── github/      # GitHub push events
│       │   ├── stripe/      # Subscription lifecycle events
│       │   ├── telegram/    # Telegram bot updates
│       │   ├── slack/       # Slack event subscriptions
│       │   └── discord/     # Discord interactions
│       ├── analytics/       # Tracking pixel endpoint
│       ├── ai/              # LLM classification + context generation
│       └── public/          # Public data endpoints
├── components/
│   ├── ui/                  # shadcn/ui base components
│   ├── dashboard/           # Dashboard-specific
│   ├── project/             # Project detail
│   ├── profile/             # Public profile
│   ├── bots/                # Bot management UI
│   ├── billing/             # Plan gates, upgrade prompts
│   └── analytics/           # Charts, stats cards
├── lib/
│   ├── db.ts                # Prisma client singleton
│   ├── auth.ts              # NextAuth config
│   ├── github.ts            # Octokit helpers
│   ├── stripe.ts            # Stripe client + helpers
│   ├── ai.ts                # Anthropic client (Haiku) + prompt templates
│   ├── bots/
│   │   ├── telegram.ts      # Telegram Bot API helpers
│   │   ├── slack.ts         # Slack API helpers
│   │   └── discord.ts       # Discord API helpers
│   ├── plan.ts              # Plan checking utilities (checkPlan, isPro, getPlanLimits)
│   ├── analytics.ts         # Analytics tracking helpers
│   └── validations.ts       # Zod schemas
├── actions/                 # Server Actions (mutations)
└── types/                   # Shared TypeScript types
```

## Database Models (Prisma overview)

### Existing (Phases 1–8)
- `User`, `Account`, `Session` — NextAuth managed
- `Project` — name, slug, status, stack, repo URL, deploy URL, description
- `BrainNote` — project relation, title, content, type (ADR / prompt / note)
- `ShareLink` — project relation, token, active flag
- `TimeLog` — project relation, duration, description, date
- `Milestone` — project relation, title, completed flag

### New (Phases 10–11)
- `Plan` — user relation, type (free/pro), stripe customer ID, stripe subscription ID, status, billing cycle, current period end
- `BotConnection` — project relation, platform (telegram/slack/discord), bot token, channel ID, active flag, config JSON
- `BotMessage` — bot connection relation, platform message ID, content, intent (task/bug/status/general), processed flag, timestamp
- `AutoTask` — project relation, bot message relation, title, description, status (pending/approved/rejected), source context
- `ProfileView` — user relation, timestamp, referrer, country, path
- `ProjectClick` — project relation, timestamp, referrer
- `CustomDomain` — project relation, domain, verification status, verified at

## Plan Definitions (Free vs Pro)

### Free tier limits (enforce in middleware + UI)
- Up to 5 projects
- 1 client share link per project
- 10 brain notes per project
- Basic time logging (no export)
- No bots, no analytics, no cross-project search, no AI features

### Pro tier ($9/mo via Stripe)
- Unlimited projects, share links, brain notes
- Bot assistants (1 per project per platform)
- Portfolio analytics (views, clicks, referrers)
- AI context generator (brain → Cursor/Claude Code export)
- Cross-project search (Cmd+K)
- Client portal + custom domain
- Advanced time reports + PDF export
- Custom OG image themes
- Pinned projects on profile
- Remove "Powered by TrackFlow" branding
- Weekly digest to clients

### Plan gate patterns
```typescript
// In server actions / API routes:
import { checkPlan } from '@/lib/plan';
const plan = await checkPlan(userId);
if (!plan.isPro) throw new Error('Pro plan required');

// In components (show upgrade prompt):
import { PlanGate } from '@/components/billing/plan-gate';
<PlanGate feature="bots">
  <BotManager projectId={id} />
</PlanGate>
// PlanGate renders children for Pro users, upgrade CTA for free users
```

## Bot Assistant Architecture

### Message flow
```
Client sends message in Telegram/Slack/Discord
  → Platform webhook hits /api/webhooks/[platform]
  → Extract message text + metadata
  → Check if bot connection exists + is active
  → Send to /api/ai for classification
  → Claude Haiku classifies intent: task | bug | status_query | general
  → Route based on intent:
      task/bug → Create AutoTask (pending approval) + acknowledge in chat
      status_query → Fetch latest approved report → respond in chat
      general → Store message, optionally notify developer
  → Developer reviews AutoTasks in dashboard → approve/reject
  → Approved tasks become visible in project todo list + client share page
```

### LLM prompt template (intent classification)
```
System: You are a message classifier for a project management bot.
Classify the user message into exactly one category:
- task: feature request or new work item
- bug: bug report or something broken
- status_query: asking about project status or progress
- general: greeting, thank you, or unrelated message
Respond with only the category name, nothing else.
```

### Bot rules
- Never expose internal notes, prompts, or cost data through bot responses
- Bot responses should be concise (under 200 words)
- Status reports only show developer-approved content
- Rate limit: max 100 messages per bot per hour
- On Pro downgrade: bot connections pause (not deleted), resume on re-subscribe

## Target Users (for UX decisions)
When making UX choices, design for these four personas:
1. **Vibe Coders** — Ship fast with AI, need context persistence across sessions. Key Pro feature: AI context generator.
2. **Freelancers** — Need client share links, project categorization, time tracking. Key Pro feature: bot assistants + custom client portal.
3. **Indie Hackers** — Need portfolio view, deployment status, public proof of shipping. Key Pro feature: portfolio analytics + pinned projects.
4. **CS Students** — Need living portfolio, tech stack showcase, activity heatmap. Likely free tier users, potential Pro converts after landing first client.

## Feature Priority (Current)
See `Phases.md` for full roadmap. Current status: Phases 1–8 complete, Phase 9 (polish) in progress.

### Immediate (Phase 9 — polish)
- Fix dashboard access after login (BUG-01 — critical)
- Improve client share pages with more project info (BUG-02)
- Build activity heatmap for public profile (BUG-03)
- Build markdown editor for project brain (BUG-04)
- Error boundaries, loading skeletons, empty states
- Landing page + SEO + deploy to Vercel

### Next (Phase 10 — monetization)
- Stripe integration (Checkout, Customer Portal, webhooks)
- Free vs Pro plan enforcement
- Pricing page
- Client portal + custom domain (Pro)
- Portfolio analytics (Pro)
- AI context generator (Pro)
- Cross-project search with Cmd+K (Pro)

### Later (Phase 11 — bot assistants)
- Core bot infrastructure + LLM classification layer
- Telegram bot integration (first platform)
- Slack bot integration (second platform)
- Discord bot integration (third platform)
- Weekly digest + bot analytics

## What NOT to Build
- Real-time collaboration / multiplayer
- Auto AI cost tracking via provider APIs
- Claude Task Master integration
- Native mobile app
- Team/org features (roles, permissions beyond solo use)
- Deployment API integrations (Vercel/Netlify auto-deploy)
- Third pricing tier (keep it simple: Free + Pro only)
- WhatsApp bot (Business API requires Meta verification — defer)

## Naming Conventions
- Files: kebab-case (`project-card.tsx`, `create-project.ts`)
- Components: PascalCase (`ProjectCard`, `DashboardLayout`, `PlanGate`)
- Functions/variables: camelCase (`getProjectById`, `isDeployed`, `checkPlan`)
- CSS/Tailwind: Follow shadcn/ui conventions
- Database tables: snake_case (Prisma will handle mapping)
- URL slugs: kebab-case (`/projects/my-saas-app`)
- Bot webhook routes: `/api/webhooks/telegram`, `/api/webhooks/slack`, `/api/webhooks/discord`
- AI routes: `/api/ai/classify`, `/api/ai/generate-context`

## Commit Message Format
```
feat: add project dashboard kanban view
feat(pro): add Stripe checkout integration
feat(bot): add Telegram message classification
fix: resolve GitHub OAuth callback redirect
fix(billing): handle failed Stripe webhook gracefully
style: update sidebar active state to match brand book
refactor: extract project card into reusable component
docs: update BRANDBOOK with dark mode semantic tokens
```

## Development Phases
See `Phases.md` for the full development roadmap with checkboxes. Update it after completing each task/phase. All backend logic lives inside Next.js (Server Actions + API Route Handlers) — no separate backend folder.

## Important Notes
- The public profile page (trackflow.dev/[username]) is the viral feature. It must be beautiful, fast (ISR), and generate proper OG meta tags for social sharing.
- Client share links require NO authentication. They use unique tokens, not user sessions.
- The "project brain" is a markdown editor per project — not a chat interface, not AI-powered (except the Pro "export as context" feature). It's a structured notepad for architecture decisions and saved prompts.
- Dashboard density is compact (40px rows, 16px card padding). Public profile uses spacious mode (see BRANDBOOK.md section 4.3).
- Upgrade prompts must be subtle and non-annoying. Show them when users hit a limit, not on every page load. Never block core functionality — free users should always have a great experience.
- Bot assistants are the highest-value Pro feature. Telegram first (simplest API, most common for freelancer clients), then Slack, then Discord.
- All LLM costs scale only with Pro users (bots + AI context generator). Free users generate zero LLM costs. This keeps unit economics healthy.
- Estimated infrastructure costs: ~$21/mo at launch, ~$55/mo at 500 users, ~$145/mo at 2,000 users. Breakeven at 7 Pro subscribers.