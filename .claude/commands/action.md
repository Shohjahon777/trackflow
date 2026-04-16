Create a server action for TrackFlow.

Rules:
- File: src/actions/$ARGUMENTS.ts
- "use server" directive at top
- Zod schema for input validation
- Auth check: const session = await auth(); if (!session?.user?.id) throw new Error("Unauthorized");
- Plan check if Pro feature: const plan = await checkPlan(session.user.id); if (!plan.isPro) throw new Error("Pro plan required");
- Prisma for database operations (import { db } from "@/lib/db")
- Return typed response, not void
- revalidatePath() after mutations
- Check docs/SCHEMA.md for existing models before creating new ones

$USER_PROMPT