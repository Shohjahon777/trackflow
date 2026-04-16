Create and apply a Prisma database migration for TrackFlow.

Before writing:
1. Read docs/SCHEMA.md for current model inventory
2. Read prisma/schema.prisma for actual schema
3. Check if model already exists — modify don't duplicate

Process:
1. Edit prisma/schema.prisma with the changes
2. Run: npx prisma format (fixes formatting)
3. Run: npx prisma migrate dev --name $ARGUMENTS (creates migration)
4. If migrate fails due to DLL lock: stop dev server first, retry
5. Run: npx prisma generate (regenerate client)
6. Update docs/SCHEMA.md with the new/changed models
7. Verify: check that imports in src/lib/db.ts still work

Rules:
- @id @default(cuid()) for primary keys
- @@map("snake_case_table_name") on every model
- Cascading deletes for owned data (onDelete: Cascade)
- SetNull for optional references (onDelete: SetNull)
- Add @@index for frequently queried fields
- Never drop a table without explicit confirmation
- For destructive changes (drop column, change type): warn before proceeding

Known issue: Prisma DLL lock when dev server is running. Kill the dev server before running migrations.

$USER_PROMPT