# TrackFlow — API Route Patterns

## When to use API routes (vs. Server Actions)
- Webhooks (GitHub, Stripe, Telegram, Slack, Discord)
- Public data endpoints (profile data, share link data)
- OG image generation
- Analytics tracking pixel
- LLM classification endpoint

Everything else → Server Actions.

## Webhook handler pattern
```tsx
// app/api/webhooks/[platform]/route.ts
export async function POST(request: NextRequest) {
  // 1. Validate signature/secret
  // 2. Parse payload
  // 3. Process (database writes, notifications)
  // 4. Return 200 (always, even on error — prevents retry cascades)
  // 5. Log to appropriate table
}
```

## LLM classification pattern
```tsx
// app/api/ai/classify/route.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Always Haiku. Never Sonnet/Opus.
const response = await client.messages.create({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 10,
  system: CLASSIFICATION_PROMPT, // Short, cached
  messages: [{ role: 'user', content: messageText }],
});
```

## Public data endpoint pattern
```tsx
// app/api/public/profile/[username]/route.ts
export async function GET(request: NextRequest, { params }) {
  // No auth check — public endpoint
  // Cache with ISR headers
  // Return clean JSON (never expose internal IDs or sensitive data)
}