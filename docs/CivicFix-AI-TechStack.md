# CivicFix AI — Tech Stack & Architecture

**Tagline:** Decentralizing urban repair through AI-verified community crowdfunding and micro-gig economies.

This doc breaks down what to build, what tech to use for each piece, and how everything connects — so the whole team is on the same page.

---

## 1. The Core Loop (explain this to the team first)

Before any tech, everyone needs to understand the *flow* the product enables. Every feature maps to one step:

1. **Citizen reports an issue** → snaps a photo of a pothole/streetlight/etc., app auto-tags location.
2. **AI estimates repair cost** → computer vision looks at the photo and estimates severity + $ cost.
3. **Campaign auto-created** → a micro-crowdfunding campaign is generated for that exact repair.
4. **Neighbors fund it** → small donations pool via UPI/cards until the target is hit.
5. **Gig worker claims the job** → local handyman/contractor sees it on a job marketplace and accepts.
6. **Worker completes & submits proof** → uploads an "after" photo.
7. **AI verifies completion** → compares before/after photos to confirm the job matches what was paid for.
8. **Funds released** → escrow releases payment to the worker only after AI (+ optional citizen confirmation) verifies.

Everything below is just "what tech makes each of these 8 steps work."

---

## 2. System Architecture (high level)

```
[Mobile/Web App] --> [API Gateway / Backend] --> [Database]
        |                     |
        |                     +--> [AI Service: Cost Estimation]
        |                     +--> [AI Service: Completion Verification]
        |                     +--> [Payments/Escrow Service]
        |                     +--> [Notifications Service]
        |
[Cloud Image Storage] <---- photos uploaded from app
[Maps/Geo Service] <------- location tagging
```

Three separate "apps" sit on top of one shared backend:
- **Citizen App** — report issues, donate, track progress
- **Worker App/Dashboard** — browse jobs, claim, submit completion proof
- **Admin/Municipal Dashboard** (optional, good for pitch) — oversight view, dispute resolution

---

## 3. Tech Stack by Layer

### Frontend
| Component | Tech | Why |
|---|---|---|
| Mobile app (citizens + workers) | **Flutter** or **React Native** | One codebase for Android/iOS — fastest for a hackathon demo |
| Web dashboard (admin/municipal) | **Next.js (React) + Tailwind CSS** | Fast to build, good for a polished "control panel" demo |

### Backend
| Component | Tech | Why |
|---|---|---|
| API server | **Node.js (Express/NestJS)** or **Python (FastAPI)** | FastAPI is a strong pick since your AI pipeline is also Python — keeps everything in one language |
| API Gateway/Auth | **Firebase Auth** or **Auth0** | Don't build auth from scratch in a hackathon |
| Real-time updates | **WebSockets / Firebase Realtime DB** | For "job claimed", "funds released" live notifications |

### Database
| Component | Tech | Why |
|---|---|---|
| Primary DB | **PostgreSQL** | Relational data: users, campaigns, jobs, transactions |
| Geo queries | **PostGIS extension** | "Show me issues near me" queries |
| Caching | **Redis** | Speed up job-feed and leaderboard queries |
| Image storage | **AWS S3 / Cloudinary / Firebase Storage** | Before/after photos, cheap and simple to wire up |

### AI / Computer Vision (the core differentiator — spend most demo time here)
| Component | Tech | Why |
|---|---|---|
| Damage detection & cost estimation | **Multimodal LLM API (Claude or GPT-4V)** for hackathon speed, OR a fine-tuned **YOLOv8** model if you want a "custom AI" story | Multimodal API = fastest to demo reliably. Custom CV model = more impressive technically but riskier under time pressure |
| Completion verification | Same multimodal API — feed it "before" photo + "after" photo + issue type, ask it to score match confidence | This is your trust/verification engine — the whole pitch hinges on this working convincingly in the demo |
| Cost estimation logic | Rule-based lookup table (issue type × severity × region) blended with the AI's severity score | Keeps estimates sane even if the model output is noisy |

### Payments / Escrow
| Component | Tech | Why |
|---|---|---|
| Payment collection | **Razorpay** (India-first, supports UPI) | Best fit for Indian users, easy sandbox for demo |
| Escrow logic | Custom — hold funds in a "pending" state in your own DB until AI verification passes, then trigger payout via Razorpay Route/Payouts API | You don't need real blockchain escrow for a hackathon — a well-explained software escrow is enough |

### Maps / Location
| Component | Tech | Why |
|---|---|---|
| Geolocation + maps | **Google Maps API** or **Mapbox** | Pin issues, show nearby jobs to workers |

### Notifications
| Component | Tech | Why |
|---|---|---|
| Push/SMS | **Firebase Cloud Messaging** + **Twilio (SMS fallback)** | Keeps citizens looped in — directly solves the "black box" apathy problem in your pitch |

### Infra / Hosting
| Component | Tech | Why |
|---|---|---|
| Hosting | **Vercel** (frontend) + **Railway/Render** (backend) or **AWS/GCP free tier** | Fast to deploy, free tiers cover a hackathon |
| CI/CD | **GitHub Actions** | Auto-deploy on push, looks professional in judging |
| Version control | **GitHub** | Obviously |

---

## 4. Who Should Own What (suggested team split)

- **Frontend (mobile)** — citizen + worker app screens (report flow, job feed, payment)
- **Frontend (web)** — admin dashboard
- **Backend** — API, database schema, auth, escrow logic
- **AI/ML** — cost estimation + completion verification pipeline (this is the "wow" feature — prioritize it)
- **Integrations** — payments, maps, notifications (can be one person gluing pieces together)

---

## 5. What to Connect First (build order for the demo)

1. Backend + DB schema (users, issues, campaigns, jobs, transactions)
2. Citizen app: report an issue with photo → hits backend → stores in DB + S3
3. AI cost estimation: wire the photo to the multimodal API, return a cost estimate
4. Crowdfunding: campaign screen + Razorpay test payment
5. Worker app: job feed, claim a job
6. Completion proof: worker uploads "after" photo → AI verification call
7. Payout: mock/trigger Razorpay payout on verification success
8. Notifications: tie it all together so every step pings the citizen

If time runs out, **steps 1–4 + 6** are the ones that make the demo convincing — the AI cost estimate and AI verification are your differentiators, prioritize those over polish elsewhere.

---

## 6. One-Line Pitch for Each Piece (for slides/README)

- **Computer vision** turns a photo into a trustworthy cost estimate — no more guessing.
- **Micro-crowdfunding** turns neighbors' spare change into real repairs.
- **Gig marketplace** turns idle local labor into paid work.
- **AI verification + escrow** means donors only pay for work that's actually done — trust without a middleman.
