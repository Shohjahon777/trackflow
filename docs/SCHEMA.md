# TrackFlow — Database Schema Reference

> All Prisma models. Grouped by domain. Update when adding/modifying any model.

## Auth & User (Phases 1–3)
- `User` — id, name, email, image, username (unique slug), bio, githubUsername, techStack[], xp, level, proofOfWorkScore, currentStreak, longestStreak, lastActivityDate, createdAt
- `Account` — NextAuth managed (provider, providerAccountId, tokens)
- `Session` — NextAuth managed (sessionToken, expires)

## Projects (Phases 4–5)
- `Project` — id, userId, name, slug, status (active/deployed/stale/archived), stack[], repoUrl, deployUrl, description, lastActivityAt, createdAt, updatedAt
- `BrainNote` — id, projectId, title, content, type (adr/prompt/note), createdAt, updatedAt
- `Milestone` — id, projectId, title, completed, completedAt, createdAt
- `TimeLog` — id, projectId, duration, description, date, cost, createdAt

## Sharing (Phase 8)
- `ShareLink` — id, projectId, token (unique), active, createdAt

## Billing (Phase 10)
- `Plan` — id, userId (unique), type (free/pro), stripeCustomerId, stripeSubscriptionId, status (active/canceled/past_due), billingCycle (monthly/annual), currentPeriodEnd, createdAt, updatedAt

## Analytics (Phase 10)
- `ProfileView` — id, userId, timestamp, referrer, country, path
- `ProjectClick` — id, projectId, timestamp, referrer

## Telegram Bots (Phase 11)
- `TelegramBot` — id, userId, name, botUsername (unique), token (AES-256-GCM encrypted), webhookSecret, handlerType, isEnabled, config (Json), lastPingAt, errorCount, createdAt, updatedAt
- `TelegramBotLog` — id, botId, event, payload (Json), level (info/warn/error), createdAt. @@index([botId, createdAt])
- `TelegramChat` — id, chatId (unique), botId, userId, createdAt

## Gamification (Phase 12) — partial
- `XpEvent` ✅ — id, userId, actionType (enum `XpAction`: DEPLOY/MILESTONE/BRAIN_NOTE/PROJECT_SHIPPED/STREAK_DAY/STAR_RECEIVED/CHALLENGE_COMPLETED/VOUCH_SPENT/VOUCH_REFUND/HIDE_SPENT), points, projectId?, metadata (Json), createdAt. @@index([userId, createdAt])
- `Badge` ✅ — id, userId, type (enum `BadgeType`: FOUNDING/SEASONAL/MILESTONE/CHALLENGE/CO_SHIPPER/TRUSTED_DEV/STREAK), name, metadata (Json), earnedAt. @@index([userId])
- `Season` — not yet built — id, name, startDate, endDate, status (upcoming/active/completed)
- `Challenge` — not yet built — id, title, description, criteria, startDate, endDate, badgeType
- `ChallengeCompletion` — not yet built — id, userId, challengeId, completedAt, verified

## Credibility (Phase 13) — not yet built
- `Vouch` — id, voucherId (user), projectId, contextLine, xpSpent, timestamp, weight, status (active/revoked/dormant)
- `ClientComment` — id, shareLinkId, clientName, clientEmail, rating (1–5), text, status (pending/live/flagged), createdAt
- `CommentHide` — id, commentId, xpSpent, hiddenAt, expiresAt, renewalCount
- `CommentReply` — id, commentId, text, timestamp

## Social (Phase 14) — not yet built
- `Star` — id, userId, projectId, timestamp. @@unique([userId, projectId])
- `AvailabilityStatus` — id, userId (unique), statusType (building/open_to_freelance/open_to_collab/hiring), updatedAt

## Worklog (Phase 15) — not yet built
- `ShelfItem` — id, userId, title, type (book/video/course/podcast/article), author, url, status (current/finished), position, addedAt, finishedAt
- `Worklog` — id, userId (unique), deepWorkSchedule (Json), workMethod, tools (Json), currentFocus, updatedAt
- `Method` — id, userId, name, description, sourceUrl, bookmarksCount (default 0), createdAt
- `MethodBookmark` — id, userId, methodId, timestamp. @@unique([userId, methodId])

## Monetization (Phase 16) — not yet built
- `AskMeQuestion` — id, askerId (user), responderId (user), questionText, responseText?, price (Int, cents), status (pending_payment/paid/answered/refunded/expired), stripePaymentIntent, paidAt, respondedAt, rating?, ratingText?, createdAt

## Custom Domains (Phase 18) — not yet built
- `CustomDomain` — id, projectId, domain, verificationStatus (pending/verified/failed), verifiedAt, createdAt