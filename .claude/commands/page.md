Create a new page/route for TrackFlow.

Before writing:
1. Read docs/BRANDBOOK.md for design tokens
2. Check docs/ROADMAP.md — is this page already specced?
3. Check src/app/ for existing route structure

Rules:
- File: src/app/$ARGUMENTS/page.tsx
- Server Component by default (async function, fetch data directly)
- Add layout.tsx if page needs shared UI (sidebar, nav)
- Protected pages go in (dashboard) route group
- Public pages go in (marketing) route group
- Public profiles: [username]/ with ISR (revalidate: 300)
- Add metadata export for SEO: title, description, openGraph
- Loading skeleton: create loading.tsx with 1.5s pulse animation
- Error boundary: create error.tsx with fallback UI
- Dashboard pages: compact density (40px rows, 16px card padding)
- Public pages: spacious mode (720px max-width, 32px section gap, 24px card padding)

$USER_PROMPT