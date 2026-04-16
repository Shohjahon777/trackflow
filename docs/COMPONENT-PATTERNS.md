# TrackFlow — Component Creation Patterns

## File naming
- kebab-case: `project-card.tsx`, `level-badge.tsx`
- Component name: PascalCase: `ProjectCard`, `LevelBadge`

## Server vs. Client
```tsx
// Server Component (default) — no directive needed
export default async function ProjectList() {
  const projects = await db.project.findMany(...);
  return <div>...</div>;
}

// Client Component — only when interactivity is needed
"use client";
export function ProjectForm() {
  const [name, setName] = useState('');
  return <form>...</form>;
}
```

## Styling pattern
```tsx
// Always use brand tokens via Tailwind
<div className="bg-cloud border border-stone/50 rounded-md p-4">
  <h3 className="text-ink font-medium text-[15px]">Project name</h3>
  <p className="text-slate text-sm">Description here</p>
  <span className="font-mono text-sm text-charcoal">14 commits</span>
</div>
```

## Plan gating pattern
```tsx
import { PlanGate } from '@/components/billing/plan-gate';

// In page or component:
<PlanGate feature="bots">
  <BotManager projectId={id} />
</PlanGate>
// Renders children for Pro, upgrade CTA for free
```

## Status badge pattern
```tsx
// Use semantic colors, always desaturated
const statusColors = {
  active:   'bg-success-bg text-success',
  deployed: 'bg-success-bg text-success',
  stale:    'bg-warning-bg text-warning',
  failed:   'bg-danger-bg text-danger',
  building: 'bg-info-bg text-info',
};
```

## Empty state pattern
```tsx
// Ghost card: transparent + dashed border
<div className="border border-dashed border-stone rounded-md p-6 flex flex-col items-center gap-3">
  <FolderPlus size={24} className="text-ash" />
  <p className="text-charcoal text-[15px] font-medium">No projects yet</p>
  <p className="text-slate text-[13px]">Create your first project to get started</p>
  <Button variant="ghost">Add project</Button>
</div>
```