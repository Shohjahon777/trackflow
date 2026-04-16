Create an API route handler for TrackFlow.

Before writing:
1. Confirm this needs an API route (not a Server Action). API routes only for: webhooks, public data, OG images, bot webhooks, analytics pixel.
2. Check docs/SCHEMA.md for relevant models
3. Check docs/TELEGRAM.md if this is a bot webhook

Rules:
- File: src/app/api/$ARGUMENTS/route.ts
- Export named functions: GET, POST, PUT, DELETE (only what's needed)
- Validate webhook signatures where applicable
- Proper status codes (200, 400, 401, 404, 500)
- Telegram webhooks: ALWAYS return 200 even on error (prevents retry cascade)
- Stripe webhooks: verify signature with stripe.webhooks.constructEvent()
- Public endpoints: no auth check, add cache headers
- Internal endpoints: verify auth or API secret
- Log errors to appropriate table (TelegramBotLog for bot routes)
- Never expose internal IDs, tokens, or sensitive data in responses

$USER_PROMPT