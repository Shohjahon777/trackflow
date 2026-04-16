# TrackFlow — Prompt Templates

## PROMPT-01: Create a new component

Create a React component for TrackFlow called [NAME].

Requirements:
- Read BRANDBOOK.md before writing any styles
- Server Component by default unless it needs interactivity
- Use Tailwind classes with brand tokens (cloud, mist, fog, stone, ash, slate, charcoal, ink, indigo-*)
- Lucide React for generic icons, @trackflow/icons for TrackFlow-specific icons
- Sentence case for all text
- 0.5px borders (Stone color), 8px border radius for most elements
- Two font weights only: 400 (regular), 500 (medium)
- Monospace (font-mono) for data values, sans (font-sans) for UI text
- Geist Sans for UI, JetBrains Mono for data from DB/API/git

File location: src/components/[domain]/[name].tsx
Props type: define inline or in src/types/

---

## PROMPT-02: Create a server action

Create a server action for [DESCRIPTION].

Requirements:
- File: src/actions/[domain].ts
- "use server" directive at top
- Zod schema for input validation
- Auth check: const session = await auth(); if (!session) throw...
- Plan check if Pro feature: const plan = await checkPlan(userId); if (!plan.isPro) throw...
- Prisma for database operations
- Return typed response, never throw untyped errors
- Revalidate relevant paths after mutation

---

## PROMPT-03: Create an API route handler

Create an API route handler for [DESCRIPTION].

Requirements:
- File: src/app/api/[path]/route.ts
- Only for: webhooks, public data, OG images, bot webhooks, analytics pixel
- Validate webhook signatures where applicable
- Always return proper status codes
- Log errors to appropriate log table (TelegramBotLog for bot routes)
- For Telegram: always return 200 even on error (prevents retry cascade)

---

## PROMPT-04: Create a Prisma model

Add a Prisma model for [DESCRIPTION].

Requirements:
- Use @id @default(cuid()) for primary keys
- Add @@map("table_name") for snake_case table names
- Add proper relations and indexes
- Add @@index on frequently queried fields
- Update SCHEMA.md after creating the model
- Run: npx prisma format, then npx prisma generate

---

## PROMPT-05: Design a new feature

Design the feature: [DESCRIPTION].

Process:
1. Check ROADMAP.md — is this already specced?
2. Check DECISIONS.md — are there relevant settled decisions?
3. Identify which personas benefit (vibe coder, freelancer, indie hacker, CS student)
4. Define: what it does, where it lives in the UI, data model, Pro/free split
5. Identify dependencies on existing phases
6. Estimate effort (days)
7. Output a spec that matches the format in ROADMAP.md

---

## PROMPT-06: Review code for brand compliance

Review this code for BRANDBOOK.md compliance:
- Are colors from the brand palette? (never #FFFFFF or #000000)
- Are font weights only 400 or 500?
- Is monospace used for data and sans for UI?
- Are borders 0.5px? (1px only for focused inputs)
- Is spacing in 4px multiples?
- Is border radius 4/8/12px?
- Is text sentence case?
- Are icons Lucide React stroke-only?
- Is the 60/30/10 color ratio maintained?