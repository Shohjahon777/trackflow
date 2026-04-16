Add a Prisma model to the TrackFlow schema.

Before writing:
1. Read docs/SCHEMA.md — check if model already exists
2. Check prisma/schema.prisma for current schema

Rules:
- @id @default(cuid()) for primary keys
- @@map("snake_case_table_name") on every model
- Add relations with proper onDelete (Cascade for owned data, SetNull for optional refs)
- @@index on fields used in WHERE clauses
- @@unique for natural uniqueness constraints
- DateTime fields: @default(now()) for createdAt, @updatedAt for updatedAt
- Json type for flexible config fields
- After creating: run `npx prisma format` then `npx prisma generate`
- Update docs/SCHEMA.md with the new model

$USER_PROMPT