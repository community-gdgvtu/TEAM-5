# 🟢 Citizen — owned by Teammate A

You own this folder plus:
- `src/api/citizenApi.ts`
- `backend/src/controllers/citizen.controller.ts`
- `backend/src/routes/citizen.routes.ts`
- `src/navigation/CitizenNavigator.tsx` (already wired in `src/navigation/RootNavigator.tsx`)

## Shared shell pattern (every role uses this)

```
┌─────────────────────────────┐
│  Top bar: logo · search · 🔔 │
├─────────────────────────────┤
│  Stories/highlights strip     │  ← "Trending near you", "Funding deadline today"
├─────────────────────────────┤
│  MAIN FEED                  │  ← Reddit-style vertical cards (photo, title,
│  (scrollable)               │     status pill, progress bar, comment count)
├─────────────────────────────┤
│  Bottom tabs (5):            │
│  Feed · Search · [+] · 💬 Messages · Profile │
└─────────────────────────────┘
```

- Feed card = one issue/campaign. Tap → **Detail screen** (thread style: photo, description, status timeline, comment thread).
- **[+] center tab** = Citizen's primary action → report issue (IG "new post" flow).
- **Messages tab** = IG-DM inbox; threads are per-issue (e.g. "Org ↔ You, re: Pothole on MG Road"). On web it renders as a side panel next to the feed.
- **Profile tab** = IG-grid of your own reported issues (before/after thumbnails), leaderboard strip on top.

## Tab bar

`Feed · Search · Report(+) · Messages · Profile`

## Screens

| # | Screen | Tab/Route | Purpose (feed/IG mapping) |
|---|--------|-----------|---------------------------|
| 1 | HomeFeedScreen | Feed tab | Reddit-style card feed of nearby issues/campaigns — photo, funding progress bar, comment count |
| 2 | CommunityFeedScreen | Search/Discover tab | Explore-style grid, filterable by category (like subreddits: "Potholes," "Streetlights," "Trees") |
| 3 | ReportIssueScreen | `+` center tab | Camera capture + geo-tag + category — IG "new post" flow |
| 4 | CostEstimateScreen | after Report | AI cost estimate preview before posting |
| 5 | IssueDetailScreen | tap any feed card | Reddit-thread view: photo, funding bar, status timeline, comment thread |
| 6 | DonateScreen | inline on Detail | "Fund this" action — sits where a like button would be |
| 7 | MessagesScreen | Messages tab | DM-style threads with Org/Workers about your own reports |
| 8 | NotificationsScreen | 🔔 top bar | Funding milestones, job claimed, work completed |
| 9 | ProfileScreen | Profile tab | IG-grid of your own reported issues (before/after thumbnails) |
| 10 | LeaderboardScreen | inside Profile | Civic points, badges — strip above the grid |

**Demo-critical (build first):** ReportIssueScreen → CostEstimateScreen → DonateScreen.

**Already built:** citizen navigator + shell (`CitizenShell`, v2 5-tab bar Feed/Search/Report+/Messages/Profile with elevated Report center action), `ReportIssueScreen`, `IssueDetailScreen`, `MyReportsScreen`, `CitizenProfileScreen` (IG-grid + leaderboard + My Reports link), `CommunityFeedScreen` (Search tab), shared Messages inbox (`MessagesScreen`, threads from `/api/messages`), and the shared feed (issue posts auto-post to `/api/feed` on report). Remaining per spec: CostEstimate step, Donate action, Notifications.

Do not touch `src/screens/organization/`, `worker/`, `investor/`.
