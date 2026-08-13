# 🟠 Worker — owned by Teammate C

You own this folder plus:
- `src/navigation/WorkerNavigator.tsx`
- `src/components/worker/WorkerShell.tsx`
- `src/data/workerMock.ts`
- `src/api/workerApi.ts`

## Shared shell pattern (every role uses this)

```
┌─────────────────────────────┐
│  Top bar: logo · search · 🔔 │
├─────────────────────────────┤
│  Stories/highlights strip     │  ← "High-payout jobs", "Bidding closes soon"
├─────────────────────────────┤
│  MAIN FEED                  │  ← Reddit-style vertical cards
├─────────────────────────────┤
│  Bottom tabs (5):            │
│  Marketplace · My Jobs · Wallet · 💬 Messages · Profile │
└─────────────────────────────┘
```

- Feed card = one open job. Tap → **JobDetailScreen** (thread view: issue photos, location, AI estimate, funding status).
- **[+] center tab** is NOT used for Worker — Marketplace is the feed.
- **Messages tab** = IG-DM inbox; threads are per-job (e.g. "Org ↔ You, re: Pothole on MG Road"). On web it renders as a side panel next to the feed.
- **Profile tab** = IG-grid of before/after job photos, badges, portfolio.

## Tab bar

`Marketplace(feed) · My Jobs · Wallet · Messages · Profile`
Tab roots: `marketplace → feed` · `jobs → active` · `wallet → earnings` · `profile → profile`.

## Screens

| # | Screen | Route | Purpose (feed/IG mapping) |
|---|--------|-------|---------------------------|
| 1 | WorkerOnboardingScreen | `onboarding` | Upload ID, select skill category + license |
| 2 | JobFeedScreen | Marketplace tab (`feed`) | Reddit-style feed of open jobs, sortable by distance/payout/urgency |
| 3 | JobDetailScreen | `detail` | Thread view: issue photos, location, AI cost estimate, funding status |
| 4 | SubmitBidScreen | `submit` (reply box on Detail) | Quote price + timeline — styled like a top-level comment reply |
| 5 | BidStatusScreen | `bidStatus` | Pending / Awarded / Rejected |
| 6 | ActiveJobScreen | My Jobs tab (`active`) | Navigation to site, checklist, instructions |
| 7 | UploadProofScreen | `upload` | Mandatory "after" photo capture — IG-style photo picker |
| 8 | VerificationStatusScreen | `verification` | AI pass/fail/pending before-after match |
| 9 | MessagesScreen | Messages tab | DM threads with org/citizen about specific jobs |
| 10 | EarningsScreen | Wallet tab (`earnings`) | Balance, withdrawal, payment history |
| 11 | ReviewsScreen | `reviews` | Citizen/org feedback on completed jobs |
| 12 | WorkerProfileScreen | Profile tab (`profile`) | IG-grid of before/after job photos, badges, portfolio |

**Demo entry:** "One-Click Demo Login — Worker" creates a demo contractor who lands on onboarding, then flows through marketplace → bid → active job → proof upload → AI verification → wallet → profile.

**Already built:** all 12 screens (incl `MessagesScreen`), v2 5-tab bar `Marketplace / My Jobs / Wallet / Messages / Profile` (Feed tab removed per v2 — Marketplace is the feed), and uploading proof auto-posts a "Work Done" post to `/api/feed`. Remaining per spec: IG-grid profile.

Do not touch `src/screens/citizen/`, `organization/`, `investor/`.
