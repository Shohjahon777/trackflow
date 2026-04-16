# TrackFlow — Gamification System Spec

> Designed across sessions March–April 2026. Full design doc exists as a .docx artifact.

## Core loop
Every meaningful shipping action earns XP → XP accumulates into levels → levels display on public profile → proof-of-work score calculated from multiple factors → score drives discoverability on explore page.

## XP actions
| Action | XP | Notes |
|---|---|---|
| Deploy a project | +50 | Requires deploy URL change detected |
| Complete a milestone | +30 | |
| Add a brain note | +10 | |
| Ship a project (mark deployed) | +100 | One-time per project |
| Streak day | +5 | Daily, only while streak is active |
| Receive a project star | +2 | Capped at 20 XP/day from stars |
| Complete weekly challenge | +25 | |

## Developer leagues
Eight leagues × three tiers = 24 ranks, driven by XP (up-only — no trophy loss, per PROD-006).

`Bronze III → Bronze II → Bronze I → Silver III → … → Legend II → Legend I`

XP thresholds (see `src/lib/xp.ts` → `RANK_THRESHOLDS`):
`0, 100, 250, 500, 900, 1_500, 2_400, 3_600, 5_200, 7_200, 9_800, 13_000, 17_000, 21_500, 27_000, 34_000, 42_500, 52_000, 63_000, 76_000, 90_000, 107_000, 126_000, 150_000`.

Each league has a distinct SVG emblem whose shape evolves with progression (shield → gem → star → gem-inlaid star). Sub-tier shown as 1–3 pip dots below the emblem (Legend I drops the numeral).

Visual theme per league: accent color for the PoW score, XP progress bar, and the avatar ring on the public profile. See BRANDBOOK.md §2.6 for the full palette.

## Proof-of-work score (0–100)
Weighted composite, recalculated daily via Vercel Cron:
- Projects shipped (weight TBD)
- Streak length (weight TBD)
- Tech stack diversity (weight TBD)
- Brain notes written (weight TBD)
- Deploy frequency (weight TBD)
- Account age factor

Anti-gaming: weighted to prevent single-dimension inflation.

## Vouch system (revised — see DECISIONS.md PROD-011)
- Vouching costs **50 XP** (not free credits)
- One-line context required ("Used this API in my project")
- Cannot vouch own projects or same project twice
- 30-day cooldown between same voucher-developer pair
- **Vouch decay**: if vouched project goes dormant (60+ days), vouch gets indicator. Voucher can revoke for 25 XP back.
- **Voucher accountability**: internal reputation score tracks accuracy of vouches. Good vouchers get weight boost.
- Display: voucher's avatar, level, proof-of-work score, context line on project card.

## Client feedback (idea #11)
- Clients leave feedback on share link pages (no TrackFlow account — magic link email verification)
- Gate: must have accessed share link 3+ times to comment
- 24-hour moderation hold before going live
- Appears on developer's public profile: "4.7 avg from 12 client reviews"
- **XP-gated hiding**: developer cannot delete reviews. Can only hide by spending XP.
  - Cost: 100 XP first hide, doubles each time (200 → 400 → 800 → 1,600)
  - Duration: 90 days. Reappears unless XP spent again at double cost.
  - Profile shows "1 review hidden" counter
- Developer CAN reply to any review (public, permanent)

## Shipping streak
- Consecutive days with qualifying activity (commit, deploy, milestone, brain note)
- Milestones at 7, 14, 30, 60, 100 days — XP bonus + badge
- Pro: 2 streak freeze days per month
- "Longest streak" as permanent profile stat

## Ghost project nudge
- Trigger: 14 days no activity on a project
- Visual: ghost icon overlay, muted colors, days-dormant counter (mono)
- Revival: any activity resets + toast
- Dashboard widget: "You have N ghost projects"
- Private only — never on public profile

## Weekly challenges
- Monday release, 7-day window
- Templates: "Ship a landing page," "Write 3 ADRs," "Add tests to one project"
- Completion: limited-edition badge on profile for that week
- Feed: "42 builders completed this week's challenge" with avatar grid
- Pro: propose custom challenges

## Shipping seasons (quarterly)
- 3-month seasons with public leaderboard at `trackflow.dev/leaderboard/2026-q3`
- Ranked by XP earned during season
- Top 10 get seasonal profile badge ("Summer '26 Top Shipper")
- Shareable URL for viral moments

## Profile themes (unlockable)
- Milestone-based: first deploy, 10 commits, 100 days active, first share link opened
- Variations: heatmap color accent, card border style, background tint
- 3 base themes free, all + custom for Pro

## Founding member badge
- First 100 users who sign up AND ship ≥ 1 project
- Gold-tinted, permanent, never available again
- Cohort badges: "Early 1K," "First 5K"
- Launch countdown: "X of 100 founding spots remaining"

## Referral streaks
- Invite someone → if they ship first project within 7 days → both get "Co-Shipper" badge + 1 free month Pro
- Filters for quality referrals (invitee must actually use the product)

## Free vs Pro split
Core loop (XP, levels, badges, streaks, score) = **free**. Advanced analytics (XP history chart, score breakdown, trends, season stats export, custom themes, propose challenges) = **Pro**.