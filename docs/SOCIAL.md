# TrackFlow — Social & Discovery Layer Spec

> Designed April 2026. Philosophy: professional directory with earned credibility, not social media with engagement features.

## Core thesis
Everything on TrackFlow is backed by verifiable activity. Proof-of-work score, shipping streak, vouch count, client feedback — none can be faked. Discovery is search-based, not feed-based.

## Explore page (`trackflow.dev/explore`)
Public, filterable developer directory. Not a feed, not a timeline.

**Filters:** tech stack, proof-of-work score range, streak length, availability status (open to freelance / open to collab / hiring / just building), developer level, location.

**Ranking:** proof-of-work score × recent activity weight. Not followers, not vanity metrics.

**Result card:** avatar, name, level badge, top 3 tech pills, proof-of-work score, streak count, one-line bio, client feedback rating (if exists).

**SEO:** each filter combination gets crawlable URL (`/explore?stack=nextjs&min_score=60`). ISR.

## Project stars
- Like GitHub stars — lightweight engagement, not endorsement (vouches = endorsement)
- Star count visible on project card
- Free to give (no XP cost)
- "Most starred this week" section on explore page
- Receiving stars: +2 XP per star, capped 20 XP/day
- Stars page in dashboard (bookmarks)

## Vouch feed (`trackflow.dev/vouches`)
- Chronological feed of recent vouches across all users
- Entry: voucher card → vouched project → context line
- Filterable by tech stack
- Discovery loop: browse → find projects → visit profiles

## Recently shipped
- Section on explore page: projects marked "deployed" in last 7 days
- Ranked by builder's proof-of-work score
- Max 20 entries, refreshed daily
- Like Product Hunt's daily list, not Twitter's timeline

## Developer worklog (3 profile sections)

### The Shelf — what they're consuming
- Types: book, video, course, podcast, article, newsletter
- Max 3 "currently" items visible on profile (forces curation)
- Finished items move to scrollable archive timeline
- Section only renders if ≥ 1 item exists

### The Worklog — how they spend their time
- Template-based input (not free text):
  - Deep work schedule (time range)
  - Work method (dropdown + custom: Pomodoro, Deep Work, Shape Up, etc.)
  - Daily tools (multi-select + custom)
  - Current focus (one line)
- Structured format ensures cross-profile consistency
- Updated manually — not auto-tracked

### The Method Wall — techniques they use
- Developer pins named methods with one-line adaptation note + optional source link
- Examples: "Pomodoro (50/10)," "ADR-driven development," "Daily standup with myself"
- Other users **bookmark** methods ("I want to try this")
- Bookmarked methods show in user's dashboard as "methods to try" list
- Explore filter: "developers who use [method]"
- "Most bookmarked methods" on explore page

## "Ask Me" micro-consultations

### Qualification (metric-gated, automated — see DECISIONS.md PROD-007)
Unlocks when: proof-of-work ≥ 60, 5+ shipped projects, Level 10+, account ≥ 90 days.

### Flow
1. Visitor sees "Ask me" button on qualified profile
2. Writes one specific question
3. Pays one-time fee ($10 / $25 / $50 — set by responder)
4. Stripe processes payment
5. Responder notified in dashboard → answers async within 48h
6. Response private (only asker sees it)
7. No response in 48h → auto-refund
8. Asker rates response (1–5 stars)

### Revenue
85% to developer, 15% to TrackFlow via Stripe Connect.

### Pro integration
- Free users: 1 question/month
- Pro users: unlimited questions + can enable "Ask me" + question analytics

### What this is NOT
Not mentorship. Not courses. Not a marketplace. Not a content paywall. One question, one answer, done.

## "Developers like you" recommendations
- Based on: overlapping tech stacks, mutual vouches, similar proof-of-work range
- Dashboard sidebar widget
- No follow button — discovery through work similarity

## What is explicitly NOT built (see DECISIONS.md PROD-009)
- No DMs or messaging
- No follower counts
- No algorithmic feed
- No comments on profiles (client feedback is structured)
- No groups or communities
- No reposting/sharing (vouch is the only endorsement mechanic)