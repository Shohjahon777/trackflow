Prepare TrackFlow for deployment to Vercel.

Checklist:
1. TypeScript: npx tsc --noEmit (zero errors)
2. Lint: npx next lint (zero warnings on changed files)
3. Build: npx next build (must complete without errors)
4. Prisma: npx prisma generate (client up to date)
5. Environment variables: verify all required vars are set in Vercel dashboard
6. Database: migrations applied to production Neon database
7. Webhooks: Stripe, GitHub, Telegram webhook URLs point to production domain
8. Secrets: no hardcoded tokens, keys, or secrets in source code

Required environment variables:
- DATABASE_URL (Neon connection string)
- NEXTAUTH_URL, NEXTAUTH_SECRET
- GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- ANTHROPIC_API_KEY
- TELEGRAM_ENCRYPTION_KEY
- NEXT_PUBLIC_APP_URL

Post-deploy:
- Verify OAuth callback URLs match production domain
- Re-register Telegram bot webhooks (reregisterAllWebhooks server action)
- Test Stripe webhook delivery in Stripe dashboard
- Check public profile renders: trackflow.dev/[username]
- Check OG image generation: trackflow.dev/api/og/[username]

$USER_PROMPT