# CivicFix AI

**Decentralizing urban repair through AI-verified community crowdfunding and micro-gig economies.**

## Problem
Urban communities suffer from deteriorating micro-infrastructure (potholes, broken streetlights, damaged sidewalks). Current civic tech systems digitize complaints but fail to digitize solutions — the "Civic Execution Gap." Repairs take months due to bureaucratic bottlenecks, citizens receive no feedback (breeding apathy), and there's no trustworthy marketplace connecting local gig workers with needed jobs.

## Solution
CivicFix AI closes the loop using accessible multimodal AI to:
- **Estimate repair costs** via computer vision from citizen-photos
- **Pool micro-donations** securely via Razorpay/UPI
- **Verify completed work** via AI before/after photo comparison
- **Release funds** only after verification — trust without a middleman

## Core Loop (8 steps)
1. Citizen reports issue (photo + location)
2. AI estimates repair cost
3. Campaign auto-created for micro-crowdfunding
4. Neighbors fund via UPI/cards
5. Gig worker claims job from marketplace
6. Worker completes & submits "after" photo
7. AI verifies completion (before/after match)
8. Funds released from escrow

## Tech Stack
- **Frontend:** Flutter (mobile), Next.js + Tailwind (admin web)
- **Backend:** Node.js (Express/NestJS) or Python FastAPI
- **Database:** PostgreSQL with PostGIS extension, Redis caching
- **AI/ML:** Multimodal LLM API (Claude/GPT-4V) or fine-tuned YOLOv8
- **Payments:** Razorpay (India-first, UPI support)
- **Storage:** AWS S3 / Cloudinary / Firebase Storage
- **Maps:** Google Maps API or Mapbox
- **Notifications:** Firebase Cloud Messaging + Twilio SMS
- **Hosting:** Vercel (frontend) + Railway/Render (backend) or free tier clouds

## Demo Priority (build order)
1. Backend + DB schema
2. Citizen: report issue with photo → backend → S3
3. AI cost estimation: photo → multimodal API → cost estimate
4. Crowdfunding: campaign screen + Razorpay test payment
5. Worker: job feed + claim job
6. Completion proof: worker uploads "after" photo → AI verification
7. Payout: trigger Razorpay payout on verification success
8. Notifications: tie steps together

## Screens (key demo screens)
- Report Issue (camera, categories, auto-location)
- AI Cost Estimate Result (severity bar + $ estimate)
- Campaign Creation Confirmation (progress bar + share)
- Donate (payment chips, transaction confirmation)
- Job Marketplace Feed (job cards, filter tabs)
- Worker Bid Submission (quote + timeline)
- Completion Proof Upload (before/after toggle)
- AI Verification Result (match confidence score + pass/fail)
- Payout Confirmation (funds released summary)

## Roles
- **Citizen/Community** — report, donate, track progress
- **Organization (Municipal Admin)** — verify reports, manage jobs, analytics
- **Worker (Contractor)** — browse jobs, submit bids, upload proof, earn ratings
- **Investor / Funder** — browse campaigns, fund projects, view impact analytics

## Quick Start
1. Clone the repo
2. Set up `.env` with Firebase, Razorpay, and AI API keys
3. `npm install` (root) + `npm run dev` (per platform)
4. Deploy to Vercel + Railway using the provided CI/CD configs

---
*Hackathon project — prioritize steps 1–4 + 6 for a convincing demo.*