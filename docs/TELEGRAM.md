# TrackFlow — Telegram Bot System Design

> Webhook-based multi-bot architecture for Next.js on Vercel. Full design doc: telegram-system-design.docx.

## Architecture
Fan-in pattern: Telegram → HTTPS POST → `/api/telegram/[botId]` → resolve bot from DB → validate secret → process with grammY → return 200.

**Key decisions:**
- Webhooks, not polling (serverless-compatible)
- grammY library (TypeScript-first, webhook-native)
- Dynamic route `/api/telegram/[botId]` (single handler for N bots)
- Database-driven bot registry (add/remove without redeployment)
- Per-bot webhook secret validation (`X-Telegram-Bot-Api-Secret-Token`)
- Stateless handlers + database (no in-memory state)

## Database models
- `TelegramBot` — id, userId, name, botUsername, token (AES-256-GCM encrypted), webhookSecret, handlerType, isEnabled, config (Json), lastPingAt, errorCount
- `TelegramBotLog` — id, botId, event, payload (Json), level, createdAt. @@index([botId, createdAt])
- `TelegramChat` — id, chatId, botId, userId

## File structure
```
src/app/api/telegram/[botId]/route.ts    — Webhook receiver (POST)
src/app/api/telegram/manage/route.ts     — Webhook registration (internal)
src/lib/telegram/bot-factory.ts          — Create + cache bot instances
src/lib/telegram/bot-registry.ts         — DB queries for bot config
src/lib/telegram/webhook.ts              — Webhook setup/teardown
src/lib/telegram/outbound.ts             — Send notifications proactively
src/lib/telegram/handlers/index.ts       — Handler registry
src/lib/telegram/handlers/notification.ts
src/lib/telegram/handlers/project-updates.ts
src/lib/telegram/handlers/client-comms.ts
src/lib/encryption.ts                    — AES-256-GCM encrypt/decrypt
src/actions/telegram-bots.ts             — Server Actions for bot CRUD
```

## Handler types
| Handler | Purpose | Commands |
|---|---|---|
| notification | Deploy/milestone/stale alerts | /start, /status, /mute, /settings |
| project-updates | Daily/weekly digest | /digest, /subscribe, /unsubscribe |
| client-comms | Client ↔ developer relay | /link [token], /update, /milestone |

## Bot factory
Module-level `Map<string, Bot>` caches instances within same serverless invocation. Handler attached based on `handlerType` from DB config.

## Security
1. Webhook secret header validation (per-bot 64-char hex)
2. CUID bot IDs in URL (unpredictable)
3. AES-256-GCM token encryption at rest (Prisma middleware)
4. NextAuth session check for admin operations
5. Rate limiting (application-level)

## Error handling
- Always return 200 to Telegram (prevents retry cascade)
- Circuit breaker: 50 consecutive errors → auto-disable bot
- Health monitoring: Vercel Cron every 15 min checks pending_update_count, last_error_date, lastPingAt

## Webhook management
URL format: `https://trackflow.dev/api/telegram/{botId}`
Re-register when: URL changes, token rotated, secret rotated, Telegram reports failures.
Bulk re-registration via `reregisterAllWebhooks()` server action.

## Outbound messages
`sendNotification(botId, chatId, message)` — triggered from existing server actions when project status changes, milestones completed, etc.

## Scaling
Works for ~50 bots with moderate traffic on Vercel serverless. Beyond that: consider dedicated process or message queue between webhook receiver and handler.

## Constraints (one bot per user currently)
Each user can create one Telegram bot. Cached `botInfo` from `getMe()` call to avoid rate limits on bot creation.