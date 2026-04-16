# TRACKFLOW — Brand & Design System

> The multi-project command center for anyone who ships.
> Version 1.1 — March 2026 — Author: Shohjahon Razzoqov

---

## 0. Product Positioning

### One-liner
TrackFlow is the multi-project command center and developer identity platform for anyone who ships.

### Who it's for
TrackFlow is for **solo builders managing multiple concurrent projects** who want both a private command center AND a public proof of their work. The product serves four core personas:

#### Persona 1: Vibe Coder
- **Who**: Ships fast with AI tools (Cursor, Bolt, Lovable, Claude Code)
- **Pain**: 5+ experiments running, loses track of what's deployed where, context resets every AI session
- **TrackFlow gives them**: Multi-project dashboard, project brain (copy-paste context), prompt library
- **Key feature**: Project brain with saved architecture decisions and working prompts

#### Persona 2: Freelance Developer
- **Who**: Juggles 3-4 client projects alongside personal side projects
- **Pain**: Clients ask "what's the status?" and they scramble, no separation between client work and personal experiments
- **TrackFlow gives them**: Client share links, project categorization (client vs personal), time/cost logging
- **Key feature**: Client share links (read-only public URL per project)

#### Persona 3: Indie Hacker / Solopreneur
- **Who**: Building multiple micro-SaaS products, testing ideas in parallel
- **Pain**: Can't see the big picture across all ventures, no portfolio showing shipping velocity
- **TrackFlow gives them**: Portfolio dashboard, deployment tracking, public profile as proof to investors/users
- **Key feature**: Public developer profile (trackflow.dev/username)

#### Persona 4: CS Student Building Portfolio
- **Who**: Coursework + part-time job + personal projects, wants to stand out in job market
- **Pain**: GitHub shows code but not the story — what they built, why, what stack, what they learned
- **TrackFlow gives them**: A living portfolio that shows projects with context, not just repos
- **Key feature**: Public profile with tech stack showcase and activity heatmap

### Who it's NOT for
- Senior engineers at large companies (they have Jira/Linear at work)
- Single-project founders (no multi-project pain)
- Non-technical PMs (they have Monday/Asana/ClickUp)
- Teams larger than ~4 people (team tools exist)

### Positioning statement
> For solo builders who ship multiple projects, TrackFlow is the command center that replaces scattered tabs, forgotten deploys, and invisible progress with one dashboard and a public profile that proves what you build.

### Marketing language guide
- **Launch channels**: Vibe coding communities, AI-native dev Twitter/X, indie hacker forums, CS student communities
- **On landing page**: "For anyone who ships" — broad and aspirational
- **In developer communities**: Reference specific tools (Cursor, Bolt, Claude Code) they use
- **In freelancer communities**: Lead with client share links and project organization
- **In student communities**: Lead with portfolio/profile and "show recruiters what you actually build"
- **Never say**: "project management tool" (sounds like Jira), "productivity app" (sounds generic), "task manager" (too small)
- **Always say**: "command center", "shipping dashboard", "developer identity", "proof of work"

---

## 1. Brand Identity

### Wordmark
- Font: JetBrains Mono (bold) / fallback: Courier
- "TRACK" = primary text color, "FLOW" = accent color
- Always uppercase. Always monospace.
- Minimum size: 14px. Below that, use abbreviated mark: **TF**
- Clear space: 1× cap height on all sides

### Tagline
- Primary: *"Ship more. Track everything. Show your work."*
- Developer audience: *"The command center for anyone who ships."*
- Vibe coder audience: *"Your AI projects. One dashboard. Zero context loss."*
- Freelancer audience: *"Track client projects. Share progress. Get paid."*
- Student audience: *"Build your portfolio while you build your projects."*

### Voice
- Confident, not arrogant
- Technical, not jargon-heavy
- Concise, not terse
- Warm, not cute
- No emoji in product UI
- Speaks like a senior dev colleague, not a corporate SaaS marketing page

---

## 2. Color System

### 2.1 Neutral Foundation (warm off-white)

| Name     | Hex       | CSS Token          | Usage                              |
|----------|-----------|--------------------|------------------------------------|
| Cloud    | `#FAFAF8` | `--background`     | App background (light)             |
| Mist     | `#F4F4F1` | `--surface`        | Card / panel background            |
| Fog      | `#EAEAE6` | `--surface-hover`  | Hover state, secondary surface     |
| Stone    | `#D4D4CE` | `--border`         | Borders, dividers                  |
| Ash      | `#9C9C95` | `--text-tertiary`  | Placeholder, disabled, decorative  |
| Slate    | `#6B6B64` | `--text-secondary` | Descriptions, meta text            |
| Charcoal | `#3D3D38` | `--text-body`      | Body text, paragraphs              |
| Ink      | `#1C1C19` | `--text-primary`   | Headings, primary text             |

> **Rule: Never use pure `#FFFFFF` or `#000000`.** Always Cloud or Ink.

### 2.2 Primary Accent — Indigo

| Name       | Hex       | CSS Token        | Usage                              |
|------------|-----------|------------------|------------------------------------|
| Indigo 50  | `#EEEEF6` | `--accent-light` | Selected row bg, accent tint       |
| Indigo 100 | `#C7C7E2` | `--accent-muted` | Hover ring, secondary accent       |
| Indigo 300 | `#8E8EC5` | —                | Visited link, tertiary accent      |
| Indigo 500 | `#6366A0` | `--accent`       | Links, active states, primary CTA  |
| Indigo 600 | `#4B4E84` | `--accent-hover` | Button hover, pressed state        |
| Indigo 800 | `#353764` | —                | Accent text on light backgrounds   |

### 2.3 Semantic Status Colors

| Status  | Foreground | Background | Usage                              |
|---------|------------|------------|------------------------------------|
| Success | `#3D8B6E`  | `#EBF3EE`  | Deployed, completed, active, live  |
| Warning | `#C4956A`  | `#FBF3EB`  | Stale (>3d no commit), deadline    |
| Danger  | `#C26A6A`  | `#FBEDED`  | Failed deploy, overdue, critical   |
| Info    | `#5B8CA8`  | `#EBF2F7`  | In progress, informational         |

> **Desaturated ~30%** from typical UI kits. They inform, not shout.

### 2.4 Dark Mode

| Name     | Hex       | Light Equivalent | Usage                        |
|----------|-----------|------------------|------------------------------|
| Base     | `#111110` | Cloud            | App background (dark)        |
| Surface  | `#1A1A18` | Mist             | Card background (dark)       |
| Elevated | `#242422` | Fog              | Modal, dropdown bg           |
| Border   | `#2E2E2B` | Stone            | Borders (dark)               |
| Accent   | `#7B7BD0` | Indigo 500       | Primary accent (dark)        |
| Text     | `#E0E0DC` | Ink              | Primary text (dark)          |
| Muted    | `#8A8A84` | Slate            | Secondary text (dark)        |

### Dark Mode Semantic

| Status  | Foreground | Background |
|---------|------------|------------|
| Success | `#5DBF8E`  | `#1A2E24`  |
| Warning | `#D4A87A`  | `#2E2418`  |
| Danger  | `#D48A8A`  | `#2E1A1A`  |
| Info    | `#7BAEC8`  | `#1A2430`  |

### 2.5 Color Rules
1. **60/30/10**: 60% neutral, 30% text, 10% accent. Status colors are additive.
2. **Text on colored bg**: Use darkest shade from same family. Never gray/black on color.
3. **WCAG AA minimum**: 4.5:1 normal text, 3:1 large text. Charcoal on Cloud = 10.2:1.

### 2.6 League Palette

Eight muted league accents drive the gamification layer (league badge + profile ring + PoW stat color). Values are kept desaturated to preserve the quiet-luxury tone. Each league has `accent` (foreground strokes / stat values), `light` (badge fill), and `border` (profile ring / badge outline).

| League    | Light accent | Light bg  | Dark accent | Dark bg   | Usage                                    |
|-----------|--------------|-----------|-------------|-----------|------------------------------------------|
| Bronze    | `#A87A4E`    | `#F5ECE0` | `#C89772`   | `#2E2418` | Entry tier (rank 1–3)                    |
| Silver    | `#8A8A84`    | `#EDEDE9` | `#B0B0A8`   | `#242422` | Rank 4–6                                 |
| Gold      | `#C4956A`    | `#FBF3EB` | `#D4A87A`   | `#2E2418` | Rank 7–9 (shares Warning base)           |
| Crystal   | `#5B8CA8`    | `#EBF2F7` | `#7BAEC8`   | `#1A2430` | Rank 10–12 (shares Info base)            |
| Master    | `#8E8EC5`    | `#EEEEF6` | `#A8A8D8`   | `#22223A` | Rank 13–15 (Indigo 300)                  |
| Champion  | `#6366A0`    | `#EEEEF6` | `#7B7BD0`   | `#22223A` | Rank 16–18 (brand accent)                |
| Titan     | `#4B4E84`    | `#E4E4F0` | `#9494DA`   | `#1E1E38` | Rank 19–21 (Indigo 600)                  |
| Legend    | `#B85A5A`    | `#FBEDED` | `#D48A8A`   | `#2E1A1A` | Rank 22–24 (rarest; ruby, no dark fill)  |

**Usage rules**
- League colors appear ONLY within gamification surfaces: league badge SVG, profile avatar ring, PoW stat card value, XP progress bar. Never on primary UI (buttons, nav, form controls) — those stay Indigo 500.
- Borders are the only league color allowed around avatars. Ring thickness: 1.5px. Use `ring-offset-2 ring-offset-background` to separate from the ring itself.
- Badge emblems fill with `accent` at 0.85–0.95 opacity on the `light` background.
- The sub-tier numeral (III/II/I) is encoded as 1–3 pip dots below the emblem. The top rank (Legend I) drops the numeral entirely.

---

## 3. Typography

### 3.1 Font Stack

```
--font-sans: 'Geist Sans', system-ui, sans-serif
--font-mono: 'JetBrains Mono', Consolas, monospace
```

Load via `next/font`. No external CDN.

### 3.2 Type Scale

| Element          | Font        | Size  | Weight | Line Height |
|------------------|-------------|-------|--------|-------------|
| Page title       | Geist Sans  | 24px  | 500    | 1.25        |
| Section heading  | Geist Sans  | 18px  | 500    | 1.25        |
| Subheading       | Geist Sans  | 15px  | 500    | 1.25        |
| Body             | Geist Sans  | 14px  | 400    | 1.6         |
| Small            | Geist Sans  | 12px  | 400    | 1.4         |
| Caption          | Geist Sans  | 11px  | 400    | 1.4         |
| Data value       | JetBrains   | 14px  | 500    | 1.5         |
| Badge/tag        | JetBrains   | 11px  | 500    | 1.0         |
| Code block       | JetBrains   | 13px  | 400    | 1.5         |

### 3.3 Rules
- **Two weights only**: 400 and 500. Never 600 or 700.
- **Mono for data, sans for UI**: If from database/API/git → mono. If human-written or UI → sans.
- **Color for emphasis**: Instead of bold words, use Indigo 500 color.
- **Uppercase**: Only for small section labels (11px + 0.04em tracking). Never headings/body.
- **Sentence case everywhere**: Headings, buttons, nav, badges.

---

## 4. Spacing & Layout

### 4.1 Base Unit: 4px
Steps: `4, 8, 12, 16, 20, 24, 32, 48, 64`

### 4.2 Component Dimensions

| Element           | Value   | Notes                           |
|-------------------|---------|---------------------------------|
| Card padding      | 16px    | Internal padding                |
| Card gap          | 12px    | Between cards                   |
| Row height (list) | 40px    | Project rows, sidebar items     |
| Row height (table)| 36px    | Data table rows                 |
| Sidebar width     | 240px   | Collapses to 56px               |
| Nav height        | 48px    | Fixed top bar                   |
| Input height      | 36px    | All inputs, selects, buttons    |
| Button padding    | 8px 16px| Small: 6px 12px                 |
| Badge padding     | 2px 8px | Status and tech pills           |
| Icon size         | 16px    | Inline; 20px nav; 24px empty    |
| Border radius sm  | 4px     | Badges, pills                   |
| Border radius md  | 8px     | Cards, inputs, buttons          |
| Border radius lg  | 12px    | Large cards, containers         |
| Border width      | 0.5px   | All borders. 1px for focus only |

### 4.3 Public Profile (Spacious Override)

| Element       | Value | Notes                    |
|---------------|-------|--------------------------|
| Max width     | 720px | Centered, narrow         |
| Section gap   | 32px  | Between sections         |
| Card padding  | 24px  | Larger for breathing     |
| Body line-ht  | 1.7   | More open                |
| Avatar size   | 96px  | Rounded full             |

### 4.4 Breakpoints

| Name    | Width        | Behavior                          |
|---------|--------------|-----------------------------------|
| Mobile  | <640px       | Single column, bottom nav         |
| Tablet  | 640–1024px   | Collapsed sidebar (56px)          |
| Desktop | 1024–1440px  | Full sidebar, 2-3 column grid     |
| Wide    | >1440px      | Max content 1280px, centered      |

### 4.5 Grid
```css
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
}
```

---

## 5. Component Patterns

### 5.1 Cards

| Variant      | Style                                        | Use                    |
|--------------|----------------------------------------------|------------------------|
| Default      | bg-primary + 0.5px border-tertiary + r-md    | Project cards, forms   |
| Surface      | bg-secondary + no border + r-md              | Metric cards, stats    |
| Ghost        | transparent + dashed 0.5px border + r-md     | Empty state, add CTA   |

### 5.2 Badges

| Type       | Style                                  | Examples               |
|------------|----------------------------------------|------------------------|
| Status     | Semantic bg + semantic fg + r-sm       | Deployed, Stale        |
| Tech stack | Indigo 50 bg + Indigo 600 text + r-sm  | Next.js, TypeScript    |
| Neutral    | Fog bg + Slate text + r-sm             | Branch, commit hash    |

### 5.3 Buttons

| Variant   | Style                                        | Usage              |
|-----------|----------------------------------------------|--------------------|
| Primary   | Indigo 500 bg + white text + r-md            | Main CTA (1/page)  |
| Secondary | Transparent + 0.5px Stone + Charcoal text    | Cancel, back       |
| Ghost     | Transparent + no border + Indigo 500 text    | Links, "show more" |
| Danger    | Transparent + 0.5px Danger + Danger text     | Delete, remove     |

Hover: Primary→Indigo 600, Secondary→Fog bg, Ghost→underline. All 150ms ease.

### 5.4 Inputs
- Height: 36px, Border: 0.5px Stone, Radius: 8px
- Focus: 1px Indigo 500 border + 0 0 0 3px Indigo 50 ring
- Error: 1px Danger border + Danger bg ring + error text below
- Placeholder: Ash (#9C9C95), 14px regular

### 5.5 Sidebar
- Width: 240px / 56px collapsed. Bg: Mist (light) / Surface (dark)
- Nav item: 36px height, 14px text, Slate color
- Active: Indigo 50 bg + Indigo 500 text + 2px left border
- Section headers: 11px uppercase, Ash, 0.04em tracking

### 5.6 Tables
- Header: 11px uppercase, Ash, 0.04em tracking, 0.5px Stone bottom
- Row: 36px, 0.5px Stone bottom. Hover: Fog bg
- No alternating row colors

### 5.7 Modals
- Overlay: #1C1C19 at 40% + backdrop-blur 4px
- Modal: bg-primary, r-lg, 24px padding, max 480px
- Enter: 200ms ease-out, scale 0.98→1 + fade
- Exit: 150ms ease-in, fade only

---

## 6. Icons & Motion

### Icons: Lucide React only
- Sizes: 16px (inline), 20px (nav), 24px (empty states)
- Color: currentColor (inherits from container)
- Stroke only. No filled icons. No emoji in UI.

### Motion
| Animation      | Duration/Easing        | Where                |
|----------------|------------------------|----------------------|
| Hover          | 120ms ease             | All interactive      |
| Focus ring     | 150ms ease             | Inputs, buttons      |
| Page transition| 200ms ease-out         | Route changes        |
| Modal enter    | 200ms ease-out         | Scale + fade         |
| Modal exit     | 150ms ease-in          | Fade only            |
| Kanban drag    | spring(300, 30)        | Framer Motion        |
| Skeleton pulse | 1.5s ease-in-out ∞     | Loading shimmer      |

Respect `prefers-reduced-motion`. Never animate color on non-interactive elements.

---

## 7. Public Profile & Social

### OG Image (1200×630)
- Bg: Cloud (#FAFAF8). No gradients.
- Left: Avatar (80px) + name + @username
- Right: Project count + tech pills + streak
- Bottom: TRACKFLOW wordmark + URL
- Dark variant: Base (#111110) bg

### Profile Page (trackflow.dev/username)
1. Header: avatar + name + bio + GitHub + tech pills
2. Activity heatmap: 52 weeks × 7 rows. Cloud→Indigo 50→100→500
3. Shipped projects: card grid with status, stack, deploy URL
4. Shipping streak: large mono number + label

### Client Share (trackflow.dev/share/[token])
- Read-only project view. No login.
- Shows: name, status, milestones, updates
- Hides: other projects, notes, prompts, costs
- Footer: "Powered by TrackFlow" (Ash, 11px)

---

## 8. CSS Tokens

### Light Mode
```css
:root {
  --background:        #FAFAF8;
  --surface:           #F4F4F1;
  --surface-hover:     #EAEAE6;
  --border:            #D4D4CE;
  --text-primary:      #1C1C19;
  --text-secondary:    #6B6B64;
  --text-tertiary:     #9C9C95;
  --text-body:         #3D3D38;

  --accent:            #6366A0;
  --accent-hover:      #4B4E84;
  --accent-light:      #EEEEF6;
  --accent-muted:      #C7C7E2;

  --success:           #3D8B6E;
  --success-bg:        #EBF3EE;
  --warning:           #C4956A;
  --warning-bg:        #FBF3EB;
  --danger:            #C26A6A;
  --danger-bg:         #FBEDED;
  --info:              #5B8CA8;
  --info-bg:           #EBF2F7;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --sidebar-width: 240px;
  --sidebar-collapsed: 56px;
  --nav-height: 48px;
  --input-height: 36px;
  --row-height: 40px;
}
```

### Dark Mode
```css
.dark {
  --background:        #111110;
  --surface:           #1A1A18;
  --surface-hover:     #242422;
  --border:            #2E2E2B;
  --text-primary:      #E0E0DC;
  --text-secondary:    #8A8A84;
  --text-tertiary:     #5A5A55;
  --text-body:         #C0C0BA;

  --accent:            #7B7BD0;
  --accent-hover:      #9494DA;
  --accent-light:      #22223A;
  --accent-muted:      #3A3A5A;

  --success:           #5DBF8E;
  --success-bg:        #1A2E24;
  --warning:           #D4A87A;
  --warning-bg:        #2E2418;
  --danger:            #D48A8A;
  --danger-bg:         #2E1A1A;
  --info:              #7BAEC8;
  --info-bg:           #1A2430;
}
```

### Tailwind Extend
```ts
// tailwind.config.ts → theme.extend
fontFamily: {
  sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-jetbrains)', 'Consolas', 'monospace'],
},
colors: {
  cloud:    '#FAFAF8',
  mist:     '#F4F4F1',
  fog:      '#EAEAE6',
  stone:    '#D4D4CE',
  ash:      '#9C9C95',
  slate:    '#6B6B64',
  charcoal: '#3D3D38',
  ink:      '#1C1C19',
  indigo: {
    50:  '#EEEEF6',
    100: '#C7C7E2',
    300: '#8E8EC5',
    500: '#6366A0',
    600: '#4B4E84',
    800: '#353764',
  },
},
borderRadius: {
  sm: '4px',
  md: '8px',
  lg: '12px',
},
```

---

*When in doubt, choose the quieter option.*
*When something feels off, it probably has too much color.*
*When the UI disappears and only the content remains — you got it right.*