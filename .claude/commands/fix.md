Debug and fix the described issue in TrackFlow.

Process:
1. Reproduce — understand what's broken and where
2. Locate — find the relevant files (check src/app, src/components, src/actions, src/lib)
3. Diagnose — identify root cause before changing code
4. Fix — minimal change that solves the problem without side effects
5. Verify — check that the fix doesn't break related functionality

Rules:
- Don't refactor while fixing. Fix first, refactor separately.
- If the fix touches UI, verify against docs/BRANDBOOK.md
- If the fix touches data, check docs/SCHEMA.md for model structure
- If the fix touches billing, verify plan gate logic (checkPlan, PlanGate)
- If the fix touches bot code, check docs/TELEGRAM.md for architecture
- Run TypeScript check after: npx tsc --noEmit
- Commit with: fix: [description] or fix(scope): [description]

$USER_PROMPT