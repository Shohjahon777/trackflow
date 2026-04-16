# TrackFlow — Development Roadmap

> Last updated: 2026-04-07
> Status: Phases 1–11 mostly complete. Pending: Vercel deploy, LLM classification, Slack/Discord bots.
> Phase 2 roadmap (12–18) is brainstorm — not committed.

---

## Phases 1–9: Foundation → Polish ✅
All complete. Dashboard, projects, brain, GitHub, public profiles, share links, landing page, SEO, skeletons, error boundaries.

## Phase 10: Pricing & Billing (mostly complete)
- [x] Plan model, Stripe integration, plan gates, pricing page, billing settings
- [x] Analytics models + dashboard (basic — moved to free tier)
- [x] AI context generator (export brain → Cursor/Claude Code format)
- [x] Global search UI (Cmd+K)
- [ ] Graceful Pro downgrade (pause bots, re-apply limits)
- [ ] Custom domain + client portal (Vercel domain API, DNS verification)
- [ ] Time range filter on analytics (7d/30d/90d)
- [ ] PostgreSQL full-text search backend (tsvector for Cmd+K)

## Phase 11: Telegram Bots (partially complete)
- [x] Bot models, CRUD, admin UI, webhook handler, bot factory, handlers
- [x] Outbound notifications, circuit breaker, security (encryption, secrets)
- [x] Cached botInfo, 1-bot-per-user limit
- [ ] LLM classification layer (Claude Haiku intent detection)
- [ ] Task auto-capture pipeline (message → classify → AutoTask → approve)
- [ ] Weekly digest (auto-summary, developer approves before send)
- [ ] Slack integration
- [ ] Discord integration

---

## Phase 2 Roadmap (brainstorm — not committed)

### Phase 12: Gamification Engine (3–4 weeks)
XP system, developer levels, proof-of-work score (0–100), shipping streaks with milestones, ghost project nudges, weekly challenges, quarterly shipping seasons, unlockable profile themes, founding member badge, referral streaks.
→ Full spec: `docs/GAMIFICATION.md`

### Phase 13: Vouch & Credibility (2–3 weeks)
Vouch system (50 XP cost, decay, accountability), client feedback on share links (magic link verification, 24h moderation), XP-gated review hiding (100 XP, doubles, 90-day expiry), developer replies.
→ Full spec: `docs/GAMIFICATION.md`

### Phase 14: Social Discovery (2–3 weeks)
Explore page (`/explore`) — filterable developer directory. Project stars. Vouch feed (`/vouches`). Recently shipped section. "Developers like you" recommendations.
→ Full spec: `docs/SOCIAL.md`

### Phase 15: Developer Worklog (1–2 weeks)
The Shelf (currently reading/watching, max 3 visible). The Worklog (template-based daily patterns). The Method Wall (pinned techniques, bookmarkable by others).
→ Full spec: `docs/SOCIAL.md`

### Phase 16: Ask Me Monetization (2–3 weeks)
Metric-gated micro-consultations. $10/$25/$50 async Q&A. 48h response window, auto-refund. 85/15 split via Stripe Connect. Free: 1 question/month. Pro: unlimited + can enable "Ask me."
→ Full spec: `docs/SOCIAL.md`

### Phase 17: Bot Platform Expansion (3–4 weeks)
LLM classification (deferred from 11). Slack App + Discord Bot. Unified dashboard. Cross-platform task sync. Weekly digest. Bot analytics.

### Phase 18: Remaining Pro Features (2–3 weeks)
Custom domains + branded portals. Advanced analytics (time ranges, geography, email digest). Full-text search backend. Advanced time reports + PDF export.

---

## Priority
Phase 12 first (everything else depends on XP/levels/scores). Then 13 → 14 → 15/16 (parallel). Phase 17 independent, can parallelize.

## Open Questions
See `docs/GAMIFICATION.md` and `docs/SOCIAL.md` for unresolved design questions.