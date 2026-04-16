Create a new icon for the @trackflow/icons package.

Before writing:
1. Read docs/ICONS.md for design constraints and existing inventory
2. Check packages/icons/src/icons/ and packages/icons/src/badges/ for existing icons
3. Decide: is this an icon (stroke-only, 24x24) or a badge (with background, text, variants)?

For icons:
- File: packages/icons/src/icons/$ARGUMENTS.tsx
- Use createIcon() factory from ../utils/create-icon
- ViewBox: 0 0 24 24. Stroke-only, never filled.
- Color: currentColor. Stroke width: 2px default.
- Max 6 path elements. Keep it simple.
- Export from packages/icons/src/index.ts

For badges:
- File: packages/icons/src/badges/$ARGUMENTS.tsx
- Use createBadge() factory from ../utils/create-badge
- Colors from BADGE_COLORS only (indigo, gold, silver, bronze, seasonal)
- Text: var(--font-mono), 11px, weight 500
- Border: 0.5px, radius 4px
- Export from packages/icons/src/index.ts

Design constraints:
- No shadows, no gradients, no emoji, no illustrations
- All colors from docs/BRANDBOOK.md palette only
- Must work at 16px, 20px, and 24px sizes

After creating, run: pnpm install (workspace linking)

$USER_PROMPT