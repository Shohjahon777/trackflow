Create a React component for TrackFlow.

Before writing code:
1. Read docs/BRANDBOOK.md for design tokens
2. Check if similar component exists in src/components/

Rules:
- Server Component unless it needs onClick/useState/forms
- Tailwind with brand tokens only (cloud, mist, fog, stone, ash, slate, charcoal, ink, indigo-*)
- Lucide React for generic icons, @trackflow/icons for TrackFlow-specific
- Sentence case for all text. Two weights: 400, 500.
- Monospace (font-mono) for DB/API/git data. Sans (font-sans) for UI text.
- 0.5px borders (border-stone/50), 8px radius (rounded-md), spacing in 4px multiples
- Never #FFFFFF or #000000

File: src/components/$ARGUMENTS.tsx

$USER_PROMPT