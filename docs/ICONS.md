# TrackFlow — @trackflow/icons Package Spec

> Standalone SVG icon library at `packages/icons/`. Same API as Lucide React. Full spec: `packages/icons/SPEC.md`.

## What this covers
- **Product icons** (14): TrackFlow-specific concepts Lucide doesn't have
- **Badges** (7): gamification visual assets (levels, founding, seasonal, etc.)
- **Brand marks** (2): TF abbreviated mark, full wordmark

Lucide React still handles all generic UI icons (arrows, menus, settings).

## Architecture
pnpm workspace package. `createIcon` and `createBadge` factory functions. Matching Lucide's API: `size`, `color`, `strokeWidth`, `className` props.

```tsx
import { ShippingStreak, LevelBadge } from '@trackflow/icons';
import { Settings } from 'lucide-react';

<ShippingStreak size={16} />       // Same API
<Settings size={16} />             // Interchangeable
<LevelBadge label="12" size={20} /> // Badges have extra props
```

## Design constraints
- ViewBox: `0 0 24 24`. Stroke-only, never filled. `currentColor` default.
- Max 6 path elements per icon.
- Badges: `var(--font-mono)`, 0.5px borders, 4px radius.
- Colors from BRANDBOOK.md only. No shadows, gradients, emoji.
- Badge variants: default (indigo), gold (warning), silver (fog/stone), bronze (danger), seasonal (info).

## Icon inventory
bot-telegram, bot-slack, bot-discord, bot-status, brain, ghost-project, plan-free, plan-pro, proof-of-work, shipping-streak, star-project, vouch-mark, xp-points, ask-me

## Badge inventory
level-badge (dynamic label), founding-badge, season-badge (dynamic label), challenge-badge, streak-milestone (dynamic label), trusted-dev, co-shipper

## Package setup
```json
{ "name": "@trackflow/icons", "private": true, "sideEffects": false, "main": "./src/index.ts" }
```
Workspace: `packages/icons/` linked via `pnpm-workspace.yaml`.