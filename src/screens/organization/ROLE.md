# 🔵 Organization — owned by Teammate B

You own this folder plus:
- `src/api/organizationApi.ts`
- `backend/src/controllers/organization.controller.ts`
- `backend/src/routes/organization.routes.ts`
- `src/navigation/OrgNavigator.tsx`

## Shared shell pattern (every role uses this)

```
┌─────────────────────────────┐
│  Top bar: logo · search · 🔔 │
├─────────────────────────────┤
│  Stories/highlights strip     │  ← "New reports in your area"
├─────────────────────────────┤
│  MAIN FEED                  │  ← Reddit-style vertical cards
├─────────────────────────────┤
│  Bottom tabs (5):            │
│  Reports · Jobs · Analytics · 💬 Messages · Team │
└─────────────────────────────┘
```

- Feed card = one citizen report / job. Tap → **Detail/thread screen** (photo, AI detection, comment thread).
- **[+] center tab** is NOT used for Org — Reports tab is the feed (mod-queue style).
- **Messages tab** = IG-DM inbox; threads are per-issue/per-job (e.g. "Citizen ↔ You, re: Pothole on MG Road", dispute chats with workers). On web it renders as a side panel next to the feed.
- **Profile** lives inside the Team tab (org profile + notification & escrow preferences).

## Tab bar

`Reports(feed) · Jobs · Analytics · Messages · Team`
Stack routes off those tabs: `verify`, `push`, `disputes`, `directory`, `settings`.

## Screens

| # | Screen | Tab/Route | Purpose (feed/IG mapping) |
|---|--------|-----------|---------------------------|
| 1 | OrgDashboardScreen | opens on login | Overview strip: pending reports, active jobs, funded, completion rate |
| 2 | ReportsQueueScreen | Reports tab (feed) | Reddit-mod-queue style feed of new citizen reports, live arrivals |
| 3 | VerifyReportScreen | `verify` (tap a card) | Detail/thread view — photo + AI feature detection, approve/reject |
| 4 | MarketplacePushScreen | `push` | Confirmation step — approved issue becomes an open job |
| 5 | ActiveJobsScreen | Jobs tab | Kanban: Open → Claimed → In Progress → Submitted → Verified |
| 6 | DisputeScreen | `disputes` | Flagged-job threads — same comment-thread UI as citizen Detail screen |
| 7 | WorkerDirectoryScreen | `directory` | IG-grid of registered workers with ratings |
| 8 | AnalyticsScreen | Analytics tab | Heatmap of issue density, response time, category breakdown |
| 9 | MessagesScreen | Messages tab | DM threads with citizens (report clarifications) and workers (dispute chats) |
| 10 | TeamSettingsScreen | Team tab | Add org staff, set permission levels |
| 11 | SettingsScreen | inside Team tab | Org profile + notification & escrow preferences |

**Demo entry:** "One-Click Demo Login — Organization" on the auth page (role `organization`, reg id `MC-MUM-2026-99`).

**Already built:** all screens above (incl `MessagesScreen`), wired into `OrgNavigator.tsx` with the v2 5-tab bar `Reports / Jobs / Analytics / Messages / Team` (Feed + Dashboard tabs removed per v2 — Reports is the feed), and publishing a job auto-posts to `/api/feed`. Remaining per spec: —

Do not touch `src/screens/citizen/`, `worker/`, `investor/`.
