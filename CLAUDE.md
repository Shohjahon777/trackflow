# CLAUDE.md — TrackFlow Development Instructions

## Project Overview
TrackFlow is a multi-project command center and developer identity platform for anyone who ships. It helps solo builders manage multiple concurrent projects from one dashboard and showcase their work through a public profile.

## Critical: Read Before Any Work
Before writing ANY code, styling, or component, read `BRANDBOOK.md` in the project root. It contains every design token, color, font, spacing value, and component pattern. **Never invent colors, spacing, or font sizes not defined in the brand book.**

## Tech Stack
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

## Architecture Rules
1. **Server Components by default.** Only use `"use client"` when the component needs interactivity (onClick, useState, forms, drag-and-drop).
2. **Server Actions for mutations.** No separate API layer. Use Zod for validation in server actions.
3. **API Route Handlers only for**: public profile data, OG image generation, GitHub webhooks, client share links.
4. **No Zustand, no Redux, no global state library.** Use React Server Components for server data, `nuqs` for URL-synced state, `useState`/`useContext` for local UI state.
5. **No tRPC.** Server Components already provide end-to-end type safety.
6. **No real-time / WebSockets.** Use `useOptimistic` for instant UI feedback on mutations.
7. **Prisma for all database access.** Never write raw SQL unless Prisma can't express the query.

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
│   │   └── settings/        # /settings
│   ├── [username]/          # Public profile (ISR, revalidate: 300)
│   ├── share/[token]/       # Client share links (no auth)
│   └── api/
│       ├── og/              # Dynamic OG image generation
│       ├── webhooks/        # GitHub webhooks
│       └── public/          # Public data endpoints
├── components/
│   ├── ui/                  # shadcn/ui base components
│   ├── dashboard/           # Dashboard-specific
│   ├── project/             # Project detail
│   └── profile/             # Public profile
├── lib/
│   ├── db.ts                # Prisma client singleton
│   ├── auth.ts              # NextAuth config
│   ├── github.ts            # Octokit helpers
│   └── validations.ts       # Zod schemas
├── actions/                 # Server Actions (mutations)
└── types/                   # Shared TypeScript types
```

## Target Users (for UX decisions)
When making UX choices, design for these four personas:
1. **Vibe Coders** — Ship fast with AI, need context persistence across sessions
2. **Freelancers** — Need client share links, project categorization, time tracking
3. **Indie Hackers** — Need portfolio view, deployment status, public proof of shipping
4. **CS Students** — Need living portfolio, tech stack showcase, activity heatmap

## MVP Features (Priority Order)
1. Multi-project dashboard (Kanban + list view)
2. Project detail page (stack, repo, deploy URL, milestones)
3. Project brain / context store (ADRs, prompts, notes as markdown)
4. GitHub integration (OAuth → auto-pull repos, commits, activity)
5. Client share links (public read-only per project)
6. Public developer profile (trackflow.dev/username)
7. Manual time & cost logging

## What NOT to Build
- Real-time collaboration
- Auto AI cost tracking via API
- Claude Task Master integration
- Native mobile app
- Team/org features (roles, permissions)
- Deployment API integrations (Vercel/Netlify)
- Payment/billing (Stripe)

## Naming Conventions
- Files: kebab-case (`project-card.tsx`, `create-project.ts`)
- Components: PascalCase (`ProjectCard`, `DashboardLayout`)
- Functions/variables: camelCase (`getProjectById`, `isDeployed`)
- CSS/Tailwind: Follow shadcn/ui conventions
- Database tables: snake_case (Prisma will handle mapping)
- URL slugs: kebab-case (`/projects/my-saas-app`)

## Commit Message Format
```
feat: add project dashboard kanban view
fix: resolve GitHub OAuth callback redirect
style: update sidebar active state to match brand book
refactor: extract project card into reusable component
docs: update BRANDBOOK with dark mode semantic tokens
```

## Development Phases
See `Phases.md` for the full development roadmap. Update it after completing each task/phase. All backend logic lives inside Next.js (Server Actions + API Route Handlers) — no separate backend folder.

## Important Notes
- The public profile page (trackflow.dev/[username]) is the viral feature. It must be beautiful, fast (ISR), and generate proper OG meta tags for social sharing.
- Client share links require NO authentication. They use unique tokens, not user sessions.
- The "project brain" is a markdown editor per project — not a chat interface, not AI-powered. It's a structured notepad for architecture decisions and saved prompts.
- Dashboard density is compact (40px rows, 16px card padding). Public profile uses spacious mode (see BRANDBOOK.md section 4.3).
