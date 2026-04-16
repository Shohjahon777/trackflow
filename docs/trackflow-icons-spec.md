# @trackflow/icons — Package Architecture Spec

> For: Claude Code CLI implementation
> Version: 1.0 — April 2026
> Author: Shohjahon Razzoqov

---

## 1. What this is

A standalone SVG icon library for TrackFlow-specific concepts that Lucide React doesn't cover. Built as an internal package so it survives app rewrites. Same component API as Lucide React — drop-in consistent.

**This package covers:**
- Product icons (bot status, plan tiers, project brain, streak, ghost, XP, vouch, proof-of-work)
- Badge assets (developer levels, founding member, seasonal, challenge, milestone)
- Brand marks (TF abbreviated mark, wordmark components)

**This package does NOT cover:**
- Generic UI icons (arrows, menus, search, settings) → use Lucide React
- Illustrations, mascots, decorative graphics → TrackFlow doesn't use these
- Emoji → never in product UI

---

## 2. Package structure

```
packages/
└── icons/
    ├── package.json
    ├── tsconfig.json
    ├── README.md
    ├── src/
    │   ├── index.ts                    # Public API — re-exports everything
    │   ├── types.ts                    # Shared types (IconProps, BadgeProps)
    │   ├── utils/
    │   │   ├── create-icon.tsx         # Icon wrapper factory (like Lucide's createLucideIcon)
    │   │   └── create-badge.tsx        # Badge wrapper factory (extended props for badges)
    │   ├── icons/
    │   │   ├── bot-telegram.tsx        # Telegram bot indicator
    │   │   ├── bot-slack.tsx           # Slack bot indicator
    │   │   ├── bot-discord.tsx         # Discord bot indicator
    │   │   ├── bot-status.tsx          # Bot online/offline/paused status
    │   │   ├── brain.tsx               # Project brain icon
    │   │   ├── ghost-project.tsx       # Ghost/dormant project indicator
    │   │   ├── plan-free.tsx           # Free plan indicator
    │   │   ├── plan-pro.tsx            # Pro plan indicator
    │   │   ├── proof-of-work.tsx       # Proof-of-work score gauge
    │   │   ├── shipping-streak.tsx     # Streak flame icon
    │   │   ├── star-project.tsx        # Project star (distinct from Lucide's generic star)
    │   │   ├── vouch-mark.tsx          # Vouch endorsement mark
    │   │   ├── xp-points.tsx           # XP indicator
    │   │   └── ask-me.tsx              # "Ask me" consultation indicator
    │   ├── badges/
    │   │   ├── level-badge.tsx         # Developer level (dynamic — renders any level)
    │   │   ├── founding-badge.tsx      # Founding Builder badge
    │   │   ├── season-badge.tsx        # Seasonal leaderboard badge (dynamic — accepts season name)
    │   │   ├── challenge-badge.tsx     # Weekly challenge completion badge
    │   │   ├── streak-milestone.tsx    # Streak milestone mark (7, 14, 30, 60, 100 days)
    │   │   ├── trusted-dev.tsx         # "Trusted Developer" vouch badge
    │   │   └── co-shipper.tsx          # Referral streak co-shipper badge
    │   └── brand/
    │       ├── tf-mark.tsx             # TF abbreviated mark
    │       └── tf-wordmark.tsx         # Full TRACKFLOW wordmark (split color)
    ├── scripts/
    │   └── generate-exports.ts         # Auto-generates index.ts from icon files
    └── tests/
        ├── render.test.tsx             # All icons render without error
        └── props.test.tsx              # Size, color, className props work correctly
```

---

## 3. Core types

```typescript
// src/types.ts

import type { SVGAttributes, ForwardRefExoticComponent, RefAttributes } from 'react';

/**
 * Base icon props — matches Lucide React API exactly.
 * This ensures TrackFlow icons and Lucide icons are interchangeable.
 */
export interface IconProps extends SVGAttributes<SVGElement> {
  /** Icon size in pixels. Default: 24 */
  size?: number | string;
  /** Stroke color. Default: 'currentColor' */
  color?: string;
  /** Stroke width. Default: 2 */
  strokeWidth?: number | string;
  /** Additional CSS class */
  className?: string;
  /** Accessible label */
  'aria-label'?: string;
}

/**
 * Badge props — extends icon props with badge-specific attributes.
 * Badges have more visual complexity than icons.
 */
export interface BadgeProps extends IconProps {
  /** Badge variant affects color scheme */
  variant?: 'default' | 'gold' | 'silver' | 'bronze' | 'seasonal';
  /** Dynamic text rendered inside the badge (e.g., level number, season name) */
  label?: string;
}

/**
 * The component type returned by createIcon and createBadge.
 */
export type IconComponent = ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>;

export type BadgeComponent = ForwardRefExoticComponent<
  BadgeProps & RefAttributes<SVGSVGElement>
>;
```

---

## 4. Icon wrapper factory

```typescript
// src/utils/create-icon.tsx

import { forwardRef } from 'react';
import type { IconProps, IconComponent } from '../types';

/**
 * Creates a TrackFlow icon component with the same API as Lucide React.
 * 
 * Usage:
 *   const Brain = createIcon('Brain', [
 *     ['path', { d: 'M12 2...', fill: 'none' }],
 *     ['circle', { cx: 12, cy: 12, r: 3 }],
 *   ]);
 */
export function createIcon(
  name: string,
  elements: [string, Record<string, string | number>][]
): IconComponent {
  const Icon = forwardRef<SVGSVGElement, IconProps>(
    (
      {
        size = 24,
        color = 'currentColor',
        strokeWidth = 2,
        className = '',
        children,
        ...rest
      },
      ref
    ) => {
      return (
        <svg
          ref={ref}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`trackflow-icon trackflow-icon-${name.toLowerCase()} ${className}`.trim()}
          aria-hidden={rest['aria-label'] ? undefined : true}
          {...rest}
        >
          {elements.map(([tag, attrs], i) => {
            const Element = tag as any;
            return <Element key={i} {...attrs} />;
          })}
          {children}
        </svg>
      );
    }
  );

  Icon.displayName = name;
  return Icon;
}
```

---

## 5. Badge wrapper factory

```typescript
// src/utils/create-badge.tsx

import { forwardRef } from 'react';
import type { BadgeProps, BadgeComponent } from '../types';

/**
 * Badge color schemes — derived from BRANDBOOK.md tokens.
 * All colors are from the brand palette. No invented colors.
 */
const BADGE_COLORS = {
  default: {
    bg: '#EEEEF6',      // Indigo 50
    border: '#C7C7E2',  // Indigo 100
    text: '#4B4E84',    // Indigo 600
    accent: '#6366A0',  // Indigo 500
  },
  gold: {
    bg: '#FBF3EB',      // Warning bg
    border: '#C4956A',  // Warning fg
    text: '#C4956A',    // Warning fg
    accent: '#C4956A',  // Warning fg
  },
  silver: {
    bg: '#EAEAE6',      // Fog
    border: '#D4D4CE',  // Stone
    text: '#6B6B64',    // Slate
    accent: '#9C9C95',  // Ash
  },
  bronze: {
    bg: '#FBEDED',      // Danger bg (repurposed — warm tone)
    border: '#C26A6A',  // Danger fg
    text: '#C26A6A',    // Danger fg
    accent: '#C26A6A',  // Danger fg
  },
  seasonal: {
    bg: '#EBF2F7',      // Info bg
    border: '#5B8CA8',  // Info fg
    text: '#5B8CA8',    // Info fg
    accent: '#5B8CA8',  // Info fg
  },
} as const;

/**
 * Creates a TrackFlow badge component.
 * Badges are more complex than icons — they can include
 * background shapes, text labels, and variant-based color schemes.
 *
 * Usage:
 *   const LevelBadge = createBadge('LevelBadge', (colors, label) => [
 *     ['rect', { x: 0, y: 0, width: 24, height: 24, rx: 4, fill: colors.bg, stroke: colors.border }],
 *     ['text', { x: 12, y: 16, textAnchor: 'middle', fill: colors.text, fontSize: 11, fontFamily: 'var(--font-mono, monospace)' }],
 *   ]);
 */
export function createBadge(
  name: string,
  renderElements: (
    colors: typeof BADGE_COLORS.default,
    label?: string
  ) => [string, Record<string, string | number>][]
): BadgeComponent {
  const Badge = forwardRef<SVGSVGElement, BadgeProps>(
    (
      {
        size = 24,
        variant = 'default',
        label,
        className = '',
        ...rest
      },
      ref
    ) => {
      const colors = BADGE_COLORS[variant];
      const elements = renderElements(colors, label);

      return (
        <svg
          ref={ref}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={`trackflow-badge trackflow-badge-${name.toLowerCase()} ${className}`.trim()}
          aria-hidden={rest['aria-label'] ? undefined : true}
          {...rest}
        >
          {elements.map(([tag, attrs], i) => {
            const Element = tag as any;
            // Special handling for text elements — inject label
            if (tag === 'text' && label && !attrs.children) {
              return <Element key={i} {...attrs}>{label}</Element>;
            }
            return <Element key={i} {...attrs} />;
          })}
        </svg>
      );
    }
  );

  Badge.displayName = name;
  return Badge;
}

export { BADGE_COLORS };
```

---

## 6. Design constraints (MUST follow)

Every icon and badge must comply with BRANDBOOK.md. These are hard rules:

### Icons
| Rule | Value |
|---|---|
| ViewBox | Always `0 0 24 24` |
| Stroke width | 2px default (matches Lucide) |
| Stroke style | `round` linecap and linejoin |
| Fill | `none` — stroke only, never filled |
| Color | `currentColor` — inherits from parent |
| Sizes | 16px (inline), 20px (nav), 24px (empty state) |
| Complexity | Max 6 path elements per icon — keep it simple |

### Badges
| Rule | Value |
|---|---|
| ViewBox | `0 0 24 24` (small) or `0 0 48 24` (wide) |
| Border radius | 4px (matches `--radius-sm`) |
| Background | From BADGE_COLORS only — never invented colors |
| Text font | `var(--font-mono)` / JetBrains Mono — badges always use mono |
| Text size | 11px (matches badge/tag size in type scale) |
| Text weight | 500 (medium) |
| Border width | 0.5px (matches brand border width) |
| No shadows | Ever. No drop shadows, no glows, no gradients. |
| No emoji | Ever. Not even as decorative elements inside badges. |

### Color palette (only use these)
```
Neutrals: #FAFAF8 #F4F4F1 #EAEAE6 #D4D4CE #9C9C95 #6B6B64 #3D3D38 #1C1C19
Indigo:   #EEEEF6 #C7C7E2 #8E8EC5 #6366A0 #4B4E84 #353764
Status:   #3D8B6E/#EBF3EE  #C4956A/#FBF3EB  #C26A6A/#FBEDED  #5B8CA8/#EBF2F7
```

No other colors. Period.

---

## 7. Example icon implementation

```typescript
// src/icons/shipping-streak.tsx

import { createIcon } from '../utils/create-icon';

/**
 * Shipping streak flame icon.
 * Used on: public profile streak counter, dashboard streak widget.
 * Sizes: 16px (inline), 20px (profile header), 24px (dashboard widget).
 */
export const ShippingStreak = createIcon('ShippingStreak', [
  ['path', {
    d: 'M12 2c0 4-3 6-3 10a5 5 0 0 0 10 0c0-4-3-6-5-8',
    strokeLinejoin: 'round',
  }],
  ['path', {
    d: 'M12 22a3 3 0 0 1-3-3c0-2 1.5-3 3-5 1.5 2 3 3 3 5a3 3 0 0 1-3 3z',
    strokeLinejoin: 'round',
  }],
]);
```

---

## 8. Example badge implementation

```typescript
// src/badges/level-badge.tsx

import { createBadge } from '../utils/create-badge';

/**
 * Developer level badge.
 * Renders a rounded rectangle with the level number inside.
 * 
 * Usage:
 *   <LevelBadge label="12" size={20} />
 *   <LevelBadge label="5" variant="gold" size={32} />
 */
export const LevelBadge = createBadge('LevelBadge', (colors, label) => [
  // Background shape
  ['rect', {
    x: 1, y: 4, width: 22, height: 16, rx: 4,
    fill: colors.bg,
    stroke: colors.border,
    strokeWidth: 0.5,
  }],
  // "LV" prefix
  ['text', {
    x: 5, y: 15.5,
    fill: colors.accent,
    fontSize: 6,
    fontFamily: 'var(--font-mono, monospace)',
    fontWeight: 500,
    letterSpacing: '0.04em',
  }],
  // Level number (injected via label prop)
  ['text', {
    x: label && label.length > 1 ? 17 : 18,
    y: 16,
    textAnchor: 'middle',
    fill: colors.text,
    fontSize: 11,
    fontFamily: 'var(--font-mono, monospace)',
    fontWeight: 500,
  }],
]);
```

---

## 9. Public API (index.ts)

```typescript
// src/index.ts

// Types
export type { IconProps, BadgeProps, IconComponent, BadgeComponent } from './types';

// Factories (for extending the library)
export { createIcon } from './utils/create-icon';
export { createBadge, BADGE_COLORS } from './utils/create-badge';

// Product icons
export { BotTelegram } from './icons/bot-telegram';
export { BotSlack } from './icons/bot-slack';
export { BotDiscord } from './icons/bot-discord';
export { BotStatus } from './icons/bot-status';
export { Brain } from './icons/brain';
export { GhostProject } from './icons/ghost-project';
export { PlanFree } from './icons/plan-free';
export { PlanPro } from './icons/plan-pro';
export { ProofOfWork } from './icons/proof-of-work';
export { ShippingStreak } from './icons/shipping-streak';
export { StarProject } from './icons/star-project';
export { VouchMark } from './icons/vouch-mark';
export { XpPoints } from './icons/xp-points';
export { AskMe } from './icons/ask-me';

// Badges
export { LevelBadge } from './badges/level-badge';
export { FoundingBadge } from './badges/founding-badge';
export { SeasonBadge } from './badges/season-badge';
export { ChallengeBadge } from './badges/challenge-badge';
export { StreakMilestone } from './badges/streak-milestone';
export { TrustedDev } from './badges/trusted-dev';
export { CoShipper } from './badges/co-shipper';

// Brand
export { TfMark } from './brand/tf-mark';
export { TfWordmark } from './brand/tf-wordmark';
```

---

## 10. Package configuration

```json
// packages/icons/package.json
{
  "name": "@trackflow/icons",
  "version": "0.1.0",
  "private": true,
  "sideEffects": false,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": ["src"],
  "peerDependencies": {
    "react": ">=18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/react": "^18.0.0"
  },
  "scripts": {
    "lint": "tsc --noEmit",
    "test": "vitest run",
    "generate-exports": "tsx scripts/generate-exports.ts"
  }
}
```

```json
// packages/icons/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

---

## 11. Monorepo integration

Since TrackFlow uses pnpm, set up as a workspace package:

```yaml
# pnpm-workspace.yaml (project root)
packages:
  - 'packages/*'
```

Then in the main app's `package.json`:
```json
{
  "dependencies": {
    "@trackflow/icons": "workspace:*"
  }
}
```

Import in app code:
```tsx
// Anywhere in the Next.js app
import { ShippingStreak, LevelBadge, Brain } from '@trackflow/icons';
import { Settings, Search, Menu } from 'lucide-react';

// Same API — interchangeable
<ShippingStreak size={16} className="text-warning" />
<Settings size={16} className="text-slate" />
<LevelBadge label="12" size={20} variant="gold" />
```

---

## 12. Claude Code implementation prompt

Use this prompt to start building:

```
Read the file packages/icons/SPEC.md (this document).

Build the @trackflow/icons package following the spec exactly:

1. Create the package structure under packages/icons/
2. Implement types.ts, create-icon.tsx, create-badge.tsx
3. Build all 14 product icons listed in the spec (stroke-only, 24x24 viewBox)
4. Build all 7 badges listed in the spec (with BADGE_COLORS from BRANDBOOK.md)
5. Build the 2 brand marks (TF mark, wordmark)
6. Create index.ts with all exports
7. Set up package.json with workspace config
8. Add pnpm-workspace.yaml to project root if not present
9. Run pnpm install to link the workspace package
10. Verify imports work from the main app

Design constraints:
- All colors must come from BRANDBOOK.md — no invented colors
- Icons are stroke-only, never filled (same as Lucide)
- Badges use JetBrains Mono for text, 0.5px borders, 4px radius
- No shadows, no gradients, no emoji, no illustrations
- Every SVG element must be purposeful — max 6 paths per icon
```

---

## 13. Full icon inventory

### Product icons (14)

| Icon | Name | Purpose | Where used |
|---|---|---|---|
| `bot-telegram` | BotTelegram | Telegram bot platform indicator | Bot management, settings |
| `bot-slack` | BotSlack | Slack bot platform indicator | Bot management, settings |
| `bot-discord` | BotDiscord | Discord bot platform indicator | Bot management, settings |
| `bot-status` | BotStatus | Bot online/offline/paused/error state | Bot list, project detail |
| `brain` | Brain | Project brain / context store | Sidebar nav, project detail |
| `ghost-project` | GhostProject | Dormant project indicator (14+ days) | Dashboard project card |
| `plan-free` | PlanFree | Free plan indicator | Settings, billing page |
| `plan-pro` | PlanPro | Pro plan indicator | Settings, billing page, upgrade prompts |
| `proof-of-work` | ProofOfWork | Proof-of-work score gauge | Public profile, explore page |
| `shipping-streak` | ShippingStreak | Streak flame | Profile, dashboard, streak widget |
| `star-project` | StarProject | Project star action | Project cards on explore/profile |
| `vouch-mark` | VouchMark | Vouch endorsement indicator | Project cards, vouch feed |
| `xp-points` | XpPoints | XP earned indicator | Dashboard, XP history, notifications |
| `ask-me` | AskMe | Paid consultation availability | Profile header, explore page |

### Badges (7)

| Badge | Name | Dynamic props | Variants |
|---|---|---|---|
| `level-badge` | LevelBadge | `label` = level number ("1"–"99") | default, gold (top 10) |
| `founding-badge` | FoundingBadge | None — static asset | gold only |
| `season-badge` | SeasonBadge | `label` = season name ("Summer '26") | seasonal |
| `challenge-badge` | ChallengeBadge | `label` = week number | default |
| `streak-milestone` | StreakMilestone | `label` = days ("7", "30", "100") | default, gold (100+) |
| `trusted-dev` | TrustedDev | None — static | default |
| `co-shipper` | CoShipper | None — static | default |

### Brand marks (2)

| Mark | Name | Notes |
|---|---|---|
| `tf-mark` | TfMark | Abbreviated "TF" mark for favicon, small spaces |
| `tf-wordmark` | TfWordmark | Full "TRACKFLOW" with split color (Track=primary, Flow=accent) |

---

## 14. Future expansion

When you add new features, add new icons to this package:

1. Create the icon file in `src/icons/` or `src/badges/`
2. Export from `src/index.ts`
3. Run `pnpm install` (workspace linking handles the rest)

The `scripts/generate-exports.ts` script can auto-scan the icons/ and badges/ directories and regenerate index.ts to avoid manual export management.

When you rewrite the app, this package moves with zero changes. It has no dependency on Next.js, Prisma, or any app-level code — just React and SVG.

---

*Stroke-only. Brand colors only. When in doubt, simpler.*
