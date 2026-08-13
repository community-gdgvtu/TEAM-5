# 🟢 Citizen — owned by Teammate A

You own this folder plus:
- `src/api/citizenApi.ts`
- `backend/src/controllers/citizen.controller.ts`
- `backend/src/routes/citizen.routes.ts`

Screens to build (from the screens doc) — stubs are ready for you:

| # | Screen | Purpose |
|---|--------|---------|
| 1 | HomeFeedScreen | Map + list of nearby issues/campaigns |
| 2 | ReportIssueScreen | Camera capture, auto geo-tag, category picker |
| 3 | CostEstimateScreen | AI's estimated repair cost before submitting |
| 4 | MyReportsScreen | List + status tracker (Reported → Funding → Done) |
| 5 | IssueDetailScreen | Photos, funding progress bar, comments, timeline |
| 6 | DonateScreen | Contribute to someone else's reported issue |
| 7 | CommunityFeedScreen | Browse all local campaigns, filter |
| 8 | NotificationsScreen | Funding milestones, job claimed, work completed |
| 9 | LeaderboardScreen | Civic points, badges, top contributors |
| 10 | ProfileScreen | Edit profile, payment methods, saved locations |

**Demo-critical (build these first):** ReportIssueScreen → CostEstimateScreen → DonateScreen.

Do not touch `src/screens/organization/`, `worker/`, `investor/`.