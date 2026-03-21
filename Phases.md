# TrackFlow — Development Phases

> Last updated: 2026-03-22
> Status: Phase 1 complete ---- Phase 2 next

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

- [ ] Install + configure shadcn/ui with TrackFlow theme
- [ ] Build base components: Button (primary/secondary/ghost/danger)
- [ ] Build base components: Input, Badge (status/tech/neutral), Card (default/surface/ghost)
- [ ] Build sidebar component (240px/56px collapse, active states)
- [ ] Build top nav bar (48px fixed)
- [ ] Build dashboard shell layout (sidebar + nav + content area)
- [ ] Build modal component (overlay + animation)
- [ ] Build table component (header style, row hover)
- [ ] Dark mode toggle + persistence
- [ ] Responsive breakpoints verified (mobile/tablet/desktop/wide)

---

## Phase 3: Auth Flow & User Management
> Goal: Users can sign in with GitHub and have a profile.

- [ ] GitHub OAuth sign-in page
- [ ] Auth callback handling
- [ ] Session management (server + client)
- [ ] User profile auto-creation from GitHub data
- [ ] Protected route middleware
- [ ] Sign-out flow
- [ ] Settings page (basic profile edit)

---

## Phase 4: Multi-Project Dashboard (MVP Core)
> Goal: Users can create, view, and manage multiple projects.

- [ ] Project Prisma model (name, slug, status, stack, repo URL, deploy URL, description)
- [ ] Create project server action + form
- [ ] Project list view (table with 40px rows)
- [ ] Project card grid view (auto-fill, minmax 320px)
- [ ] View toggle (list/grid) with nuqs URL state
- [ ] Project status badges (active, deployed, stale, archived)
- [ ] Project detail page (`/projects/[id]`)
- [ ] Edit project server action + form
- [ ] Delete project (with confirmation modal)
- [ ] Kanban board view (Framer Motion drag-and-drop)

---

## Phase 5: Project Brain (Context Store)
> Goal: Per-project markdown notepad for ADRs, prompts, notes.

- [ ] Brain Prisma model (project relation, title, content, type)
- [ ] Markdown editor component
- [ ] Note CRUD server actions
- [ ] Note types: ADR, prompt, general note
- [ ] Note list sidebar within project detail

---

## Phase 6: GitHub Integration
> Goal: Auto-pull repos, commits, activity from GitHub.

- [ ] Octokit setup with user's GitHub token
- [ ] Repo list + link to project
- [ ] Recent commits display per project
- [ ] Activity data for heatmap (contribution graph)
- [ ] GitHub webhook handler for push events
- [ ] Auto-detect stale projects (>3 days no commit → warning badge)

---

## Phase 7: Public Profile & Social
> Goal: trackflow.dev/[username] — the viral feature.

- [ ] Username slug system
- [ ] Public profile page (ISR, revalidate: 300)
- [ ] Profile header (avatar, name, bio, GitHub, tech pills)
- [ ] Activity heatmap (52 weeks × 7 rows)
- [ ] Shipped projects grid
- [ ] Shipping streak counter
- [ ] OG image generation (next/og, 1200×630)
- [ ] Meta tags for social sharing

---

## Phase 8: Client Share Links
> Goal: Read-only public URLs per project for clients.

- [ ] Share token generation (unique, unguessable)
- [ ] Share page (`/share/[token]`) — no auth required
- [ ] Shows: name, status, milestones, updates
- [ ] Hides: other projects, notes, prompts, costs
- [ ] "Powered by TrackFlow" footer

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

*Each phase builds on the previous. No phase starts until the prior one is verified working.*
