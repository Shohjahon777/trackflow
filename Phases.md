# TrackFlow — Development Phases

> Last updated: 2026-03-22
> Status: Phases 4–8 complete — Phase 9 (polish) in progress

---

## Phase 1: Foundation & Infrastructure
> Goal: Bulletproof project skeleton — everything wired, nothing broken.

- [x] Switch to pnpm, install all core dependencies
- [x] Set up `src/` directory structure per CLAUDE.md spec
- [x] Configure Tailwind v4 with brand tokens (colors, fonts, spacing, radii)
- [x] Set up fonts: Geist Sans (UI) + JetBrains Mono (data) via `next/font`
- [x] Create CSS custom properties (light + dark mode tokens from BRANDBOOK)
- [x] Configure TypeScript strict mode + path aliases (`@/`)
- [x] Set up Prisma with initial schema (User, Account, Session, Project)
- [x] Configure NextAuth v5 with GitHub OAuth provider
- [x] Create Prisma client singleton (`src/lib/db.ts`)
- [x] Create auth config (`src/lib/auth.ts`)
- [x] Create root layout with fonts, metadata, theme support
- [x] Verify `pnpm dev` runs clean with no errors

---

## Phase 2: Design System & Base Components
> Goal: All reusable UI primitives matching BRANDBOOK exactly.

- [x] Install + configure shadcn/ui with TrackFlow theme
- [x] Build base components: Button (primary/secondary/ghost/danger)
- [x] Build base components: Input, Badge (status/tech/neutral), Card (default/surface/ghost)
- [x] Build sidebar component (240px/56px collapse, active states)
- [x] Build top nav bar (48px fixed)
- [x] Build dashboard shell layout (sidebar + nav + content area)
- [x] Build modal component (overlay + animation)
- [x] Build table component (header style, row hover)
- [x] Dark mode toggle + persistence
- [ ] Responsive breakpoints verified (mobile/tablet/desktop/wide)

---

## Phase 3: Auth Flow & User Management
> Goal: Users can sign in with GitHub and have a profile.

- [x] GitHub OAuth sign-in page
- [x] Auth callback handling
- [x] Session management (server + client)
- [x] User profile auto-creation from GitHub data
- [x] Protected route middleware
- [x] Sign-out flow
- [x] Settings page (basic profile edit)

---

## Phase 4: Multi-Project Dashboard (MVP Core)
> Goal: Users can create, view, and manage multiple projects.

- [x] Project Prisma model (name, slug, status, stack, repo URL, deploy URL, description)
- [x] Create project server action + form
- [x] Project list view (table with 40px rows)
- [x] Project card grid view (auto-fill, minmax 320px)
- [x] View toggle (list/grid) with nuqs URL state
- [x] Project status badges (active, deployed, stale, archived)
- [x] Project detail page (`/projects/[id]`)
- [x] Edit project server action + form
- [x] Delete project (with confirmation modal)
- [x] Kanban board view (dnd-kit drag-and-drop)

---

## Phase 5: Project Brain (Context Store)
> Goal: Per-project markdown notepad for ADRs, prompts, notes.

- [x] Brain Prisma model (project relation, title, content, type)
- [ ] Markdown editor component
- [x] Note CRUD server actions
- [x] Note types: ADR, prompt, general note
- [x] Note list sidebar within project detail

---

## Phase 6: GitHub Integration
> Goal: Auto-pull repos, commits, activity from GitHub.

- [x] Octokit setup with user's GitHub token
- [x] Repo list + link to project
- [x] Recent commits display per project
- [x] Activity data for heatmap (contribution graph)
- [x] GitHub webhook handler for push events
- [x] Auto-detect stale projects (>3 days no commit → warning badge)

---

## Phase 7: Public Profile & Social
> Goal: trackflow.dev/[username] — the viral feature.

- [x] Username slug system
- [x] Public profile page (ISR, revalidate: 300)
- [x] Profile header (avatar, name, bio, GitHub, tech pills)
- [ ] Activity heatmap (52 weeks × 7 rows)
- [x] Shipped projects grid
- [x] Shipping streak counter
- [x] OG image generation (next/og, 1200×630)
- [x] Meta tags for social sharing

---

## Phase 8: Client Share Links
> Goal: Read-only public URLs per project for clients.

- [x] Share token generation (unique, unguessable)
- [x] Share page (`/share/[token]`) — no auth required
- [x] Shows: name, status, stack, deploy URL, owner
- [x] Hides: other projects, notes, prompts, costs
- [x] "Powered by TrackFlow" footer

---

## Phase 9: Polish & Launch Prep
> Goal: Production-ready quality.

- [ ] Error boundaries + fallback UI
- [ ] Loading skeletons (1.5s pulse animation)
- [ ] Empty states (ghost cards with CTA)
- [ ] Manual time & cost logging per project
- [ ] SEO optimization (all pages)
- [ ] Performance audit (Core Web Vitals)
- [ ] Deploy to Vercel
- [ ] Landing page

---

## Known Bugs & Issues
> Tracked here. Fix before or during Phase 9.

### BUG-01: Dashboard not accessible after login
- **Problem**: After signing in, users cannot navigate to or see the dashboard. Routing or layout issue preventing access to `/projects` or the main dashboard view.
- **Priority**: Critical — blocks entire app usage
- **Likely cause**: Protected route middleware redirect logic, missing default redirect after OAuth callback, or dashboard layout not rendering

### BUG-02: Client share pages lack useful information
- **Problem**: The `/share/[token]` pages are too bare — not informative enough for clients to understand project status at a glance.
- **Priority**: High — this is a key selling point for the freelancer persona
- **Improvements needed**:
  - [ ] Add project description section
  - [ ] Show milestone progress (completed/total with progress bar)
  - [ ] Show recent activity timeline (last 5–10 updates)
  - [ ] Show tech stack with proper badge styling
  - [ ] Add last updated timestamp
  - [ ] Add current phase/stage indicator
  - [ ] Better visual hierarchy — match BRANDBOOK spacious mode (24px card padding, 32px section gaps)

### BUG-03: Activity heatmap not implemented
- **Problem**: Public profile heatmap (52 weeks × 7 rows) is still missing.
- **Priority**: Medium — important for the viral profile feature

### BUG-04: Markdown editor missing
- **Problem**: Project brain note editor is not built yet. Notes can be created via server actions but there's no proper editing UI.
- **Priority**: Medium — core feature for vibe coder persona

---

## Phase 10: Pricing, Plans & Billing
> Goal: Monetization layer — free tier to get users in, Pro plan for power features.

### 10.1 Plan definitions

| Feature | Free | Pro ($9/mo) |
|---|---|---|
| Projects | Up to 5 | Unlimited |
| Public profile | Yes | Yes |
| Client share links | 1 per project | Unlimited + custom branding |
| Client portal + custom domain | — | Yes (`status.yourdomain.com`) |
| Project brain notes | 10 per project | Unlimited |
| Cross-project search (across all brains) | — | Yes |
| AI context generator (export brain → Cursor/Claude Code) | — | Yes |
| GitHub integration | Yes | Yes |
| Activity heatmap | Yes | Yes |
| Portfolio analytics (profile views, clicks, referrers) | — | Yes |
| Time & cost logging | Basic | Advanced (reports, PDF export) |
| Bot assistants (Telegram, Slack, Discord) | — | Yes (1 bot per project) |
| Weekly digest to clients | — | Yes |
| Custom OG image themes | — | Yes |
| Pinned projects on profile | — | Yes |
| Remove "Powered by TrackFlow" from share pages | — | Yes |
| Priority support | — | Yes |

> Pricing is tentative. Validate with early users before locking in.

### 10.2 Stripe & billing implementation
- [ ] Plan Prisma model (User → Plan relation, plan type, billing cycle, status)
- [ ] Stripe integration (Checkout, Customer Portal, webhook handler)
- [ ] Plan gate middleware (check user plan before accessing Pro features)
- [ ] Free tier limits enforcement (project count, notes count, share link count)
- [ ] Upgrade prompt UI — subtle, non-annoying, shown when user hits a limit
- [ ] Settings → Billing page (current plan, usage, upgrade/downgrade, invoices)
- [ ] Stripe webhook handler (subscription created, updated, cancelled, payment failed)
- [ ] Graceful downgrade: when Pro expires, bot connections pause (not deleted), limits re-apply

### 10.3 Pricing page
- [ ] Public pricing page (`/pricing`)
- [ ] Comparison table (Free vs Pro)
- [ ] FAQ section (can I cancel anytime, what happens to my data, etc.)
- [ ] Annual discount option (2 months free)

### 10.4 Client portal + custom domain (Pro)
- [ ] Custom domain Prisma model (domain, verification status, project relation)
- [ ] Domain verification flow (DNS TXT record check)
- [ ] Vercel domain API integration (add/remove custom domains programmatically)
- [ ] Branded share page — replace TrackFlow branding with developer's own logo/colors
- [ ] SSL auto-provisioning via Vercel

### 10.5 Portfolio analytics (Pro)
- [ ] Analytics Prisma models (ProfileView, ProjectClick — timestamp, referrer, country)
- [ ] Lightweight tracking pixel/script on public profile (no third-party tracker)
- [ ] Analytics dashboard page in settings: total views, unique visitors, top referrers, top projects by clicks
- [ ] Time range filter (7d, 30d, 90d)
- [ ] Weekly analytics email digest (optional, toggle in settings)

### 10.6 AI context generator (Pro)
- [ ] "Export as context" button on project brain page
- [ ] LLM-powered summarizer: takes all project notes (ADRs, prompts, architecture) and generates a single structured context block
- [ ] Output formats: plain text (copy-paste), markdown file download, `.cursorrules` file format
- [ ] Token count display (so user knows how much context window it'll consume)
- [ ] Uses Claude Haiku to keep costs low — runs server-side via Anthropic API

### 10.7 Cross-project search (Pro)
- [ ] Global search bar in dashboard header
- [ ] Full-text search across all project brain notes, project names, descriptions
- [ ] Search results grouped by project with highlighted matches
- [ ] Keyboard shortcut: `Cmd+K` / `Ctrl+K` to open search
- [ ] Implementation: PostgreSQL full-text search (tsvector) — no external search service needed for MVP

---

## Phase 11: Bot Assistants — Pro Plan Feature (Telegram, Slack, Discord)
> Goal: Per-project AI-powered bots that auto-capture tasks from client conversations and serve approved status reports.
> **Requires Pro plan.** Free users see the feature in the UI but are prompted to upgrade.

### 11.1 Core bot infrastructure
- [ ] Bot Prisma models (BotConnection, BotMessage, AutoTask)
- [ ] Bot management page in dashboard (create, configure, delete bots per project)
- [ ] Pro plan gate — check subscription status before bot creation
- [ ] LLM message classification layer (intent detection: task, bug, status query, general question)
- [ ] Task auto-capture pipeline (message → classify → create todo with original context)
- [ ] Developer approval workflow (bot drafts updates → developer reviews in dashboard → approved content becomes visible to clients)

### 11.2 Telegram integration
- [ ] Telegram Bot API setup (programmatic bot creation via BotFather API)
- [ ] "Project channel" concept — one Telegram group per project, bot joins and listens for @mentions
- [ ] Message ingestion: when developer is tagged, bot classifies intent and routes accordingly
- [ ] Status response: client asks about project status → bot serves last developer-approved report
- [ ] Task creation: client requests feature/reports bug → bot creates todo item with full message context
- [ ] Weekly digest: auto-generated summary sent to project channel (developer approves first)

### 11.3 Slack integration
- [ ] Slack App setup (OAuth, bot token, event subscriptions)
- [ ] Channel-per-project linking (connect a Slack channel to a TrackFlow project)
- [ ] Same message classification + routing as Telegram
- [ ] Slash commands: `/trackflow status`, `/trackflow tasks`
- [ ] Rich block-based status reports (Slack Block Kit UI)

### 11.4 Discord integration
- [ ] Discord Bot setup (application + bot token)
- [ ] Server channel linking to TrackFlow project
- [ ] Same message classification + routing pipeline
- [ ] Slash commands for status and task management

### 11.5 Shared bot features
- [ ] Unified bot dashboard — manage all platform connections from one place
- [ ] Cross-platform task sync (task created in Telegram shows in Slack and dashboard)
- [ ] Bot activity log (all captured tasks, status queries, and responses)
- [ ] Rate limiting and abuse protection
- [ ] Bot analytics (how often clients ask, most common request types)

### Architecture notes
- LLM layer: Use Claude Haiku for message classification (cheap, fast, sufficient accuracy)
- Message flow: Platform webhook → classify intent → route to action (create task / serve report / flag for developer)
- Data model: Each project has optional bot connections. Bots read from the same project data that powers client share links.
- The bot feature extends Phase 8 (client share links) — bots serve the same approved data, just inside chat platforms instead of a URL
- Start with Telegram (simplest API, most common for freelancer clients), then Slack, then Discord
- WhatsApp Business API is possible later but requires Meta business verification — skip for now
- On downgrade from Pro: bot connections are paused, not deleted. If user re-subscribes, bots reactivate without reconfiguration.

---

*Each phase builds on the previous. No phase starts until the prior one is verified working.*
*Phase 10 (billing) must ship before Phase 11 (bots). Free tier launches with Phase 9.*