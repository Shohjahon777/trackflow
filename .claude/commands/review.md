Review the specified file for BRANDBOOK.md compliance.

Read docs/BRANDBOOK.md first, then check:

1. Colors — only brand palette? No #FFFFFF or #000000?
2. Font weights — only 400 and 500? No 600, 700, bold?
3. Font usage — monospace for data (DB/API/git), sans for UI text?
4. Spacing — all multiples of 4px (4,8,12,16,20,24,32,48,64)?
5. Borders — 0.5px? (1px only for focused inputs)
6. Border radius — 4px (sm), 8px (md), 12px (lg)?
7. Text — sentence case? No Title Case?
8. Emphasis — color (indigo-500) not font-weight?
9. Icons — Lucide React stroke-only? No emoji? No filled icons?
10. Status colors — using desaturated semantic tokens?
11. 60/30/10 ratio — 60% neutral, 30% text, 10% accent?

Report violations with the exact brand token that should be used instead.

File to review: $ARGUMENTS