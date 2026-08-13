# CivicFix AI — Full Screen Map (All 4 User Roles)

Assumption: 4 distinct roles = **Citizen/Community**, **Organization (municipal admin)**, **Worker (contractor/"tender")**, **Investor**. Flow: citizen reports → org verifies → job goes to workers → workers bid/complete → investors fund based on quality → AI verifies → payout. Adjust if your split is different.

**Stack for this build:** React Native (Android/iOS, single codebase) for all 4 role-apps or a role-switch inside one app → Node.js/Express backend → PostgreSQL database → S3/Cloudinary for images → AI multimodal API for cost estimation + verification.

**UI style direction:** clean, minimal, card-based. Soft rounded corners (12–16px), light shadows instead of borders, generous white space, one accent color per role (e.g. citizen=green, org=blue, worker=orange, investor=purple) so teammates can tell dashboards apart at a glance. Flat modern design, not skeuomorphic, not overly playful — think "civic trust" not "gamified app."

---

## Shared Screens (before role split)

1. **Splash Screen** — logo, tagline
2. **Onboarding Carousel** (3 slides) — explains the loop: report → fund → fix → verify
3. **Role Selection Screen** — "I'm a Citizen / Organization / Worker / Investor"
4. **Login/Signup** — phone OTP or email, role-specific fields (org = registration ID, worker = skill category + ID proof, investor = optional KYC)
5. **Forgot Password / OTP Verification**

---

## Role 1: Citizen / Community

| # | Screen | Purpose |
|---|--------|---------|
| 1 | Home Feed | Map + list of nearby issues/campaigns |
| 2 | Report New Issue | Camera capture, auto geo-tag, category picker (pothole, streetlight, tree, cleaning, etc.) |
| 3 | AI Cost Estimate Preview | Shows AI's estimated repair cost before submitting |
| 4 | Campaign Created / Confirmation | "Your report is live" + share option |
| 5 | My Reports | List + status tracker (Reported → Verified → Funding → In Progress → Done) |
| 6 | Issue Detail Page | Photos, funding progress bar, comments, timeline |
| 7 | Donate to a Campaign | Contribute to someone else's reported issue |
| 8 | Community Feed | Browse all local campaigns, filter by category/status |
| 9 | Comments/Discussion | Thread under each issue (this is where "how the teacher handled it" type community notes live) |
| 10 | Notifications | Funding milestones, job claimed, work completed |
| 11 | Impact/Leaderboard | Civic points, badges, top contributors in area |
| 12 | Profile & Settings | Edit profile, payment methods, saved locations |

---

## Role 2: Organization (Municipal Admin)

| # | Screen | Purpose |
|---|--------|---------|
| 1 | Org Dashboard | Overview: pending reports, active jobs, total funded, completion rate |
| 2 | Incoming Reports Queue | List of new citizen reports awaiting review |
| 3 | Report Verification Screen | View photo + AI estimate, approve/reject, add municipal notes |
| 4 | Push to Marketplace | Approved issue becomes an open job for workers |
| 5 | Active Jobs Tracker | Kanban-style view: Open → Claimed → In Progress → Submitted → Verified |
| 6 | Dispute Resolution | Handle flagged jobs (bad work, wrong worker, funding issues) |
| 7 | Worker Directory | List of registered workers, ratings, verification status |
| 8 | Area Analytics | Heatmap of issue density, response time stats, category breakdown |
| 9 | Team/Access Management | Add other org staff, set permission levels |
| 10 | Settings | Org profile, notification preferences |

---

## Role 3: Worker ("Tender"/Contractor)

| # | Screen | Purpose |
|---|--------|---------|
| 1 | Verification/Onboarding | Upload ID, select skill category (electrician, mason, gardener, etc.) |
| 2 | Job Marketplace Feed | Nearby open jobs, sorted by distance/payout |
| 3 | Job Detail Screen | Full issue photos, location, AI cost estimate, funding status |
| 4 | Submit Bid/Tender Comment | Worker quotes their price + timeline (the "tender comment") |
| 5 | Bid Status Screen | Pending / Awarded / Rejected |
| 6 | Active Job Screen | Navigation to site, job checklist, instructions |
| 7 | Upload Completion Proof | "After" photo capture, mandatory before payout request |
| 8 | AI Verification Status | Shows pass/fail/pending on before-after match |
| 9 | Earnings & Wallet | Balance, withdrawal, payment history |
| 10 | Ratings & Reviews | Citizen/org feedback on completed jobs |
| 11 | Worker Profile/Portfolio | Past jobs, before/after gallery, badges |

---

## Role 4: Investor / Funder

| # | Screen | Purpose |
|---|--------|---------|
| 1 | Investor Dashboard | Browse active campaigns needing funding, sorted by area/impact score |
| 2 | Campaign Detail (Investor View) | Full breakdown: cost estimate, worker bids, community engagement, org verification status |
| 3 | Quality/Trust Score Screen | AI confidence score + org track record + worker rating, to help investor decide |
| 4 | Funding Decision Screen | Investor sets contribution amount / accepts a worker's quoted price |
| 5 | Portfolio Screen | All funded projects with live status tracking |
| 6 | Completion & Verification Report | Before/after AI comparison, impact summary once job is done |
| 7 | Payout Confirmation | Confirms funds released to worker after verification |
| 8 | Regional Impact Analytics | Aggregate stats across all investor's funded projects (jobs completed, $ deployed, areas improved) |
| 9 | Settings | Payment methods, KYC, notification preferences |

---

## End-to-End Flow (how the 4 roles connect)

```
CITIZEN reports issue (photo + location)
        ↓
AI generates cost estimate
        ↓
ORG reviews & verifies → pushes to marketplace
        ↓
WORKERS see it in job feed → submit bids/tenders
        ↓
INVESTOR sees verified campaign + worker bids → decides to fund at a set price
        ↓
WORKER completes job → uploads "after" photo
        ↓
AI verifies completion (before/after match)
        ↓
Funds released to WORKER → CITIZEN + INVESTOR see closed-loop confirmation
```

This closed loop is the whole pitch — every role sees the *same* issue move through the *same* pipeline, just from a different seat. Good to put this diagram on one slide.

---

## Suggested Team Split for Screens

- **Teammate A** — Citizen app (12 screens)
- **Teammate B** — Organization dashboard (10 screens)
- **Teammate C** — Worker app (11 screens)
- **Teammate D** — Investor dashboard (9 screens) + shared onboarding/login screens

Backend + AI pipeline can be split separately since all 4 apps hit the same API.
