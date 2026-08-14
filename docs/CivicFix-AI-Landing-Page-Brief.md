# CivicFix — Landing Page Design Brief

## Design direction (the "prompt")

Build a dark, animated, community-energy landing page for **CivicFix**, an app where citizens report broken street infrastructure, AI prices the repair, neighbours crowdfund it, a local worker fixes it, and AI verifies the completed work before releasing payment. Audience: Indian residents, municipal bodies, local contractors, and civic-minded funders.

**Visual direction:** Discord-style energy — dark background, floating animated shapes, bold rounded display type, scroll-triggered reveals, a lively bottom marquee/ticker — but with its own identity, not Discord's blurple.

- **Palette:** Asphalt Night `#0E1319` (background), Safety Orange `#FF6A3D` (primary CTA / energy), Verified Teal `#00D9A3` (AI-trust accent), Warm Sand `#F4C77B` (Indian warmth accent), off-white text `#F3F0E9`.
- **Type:** Space Grotesk for display/headlines (bold, geometric, confident), Inter for body copy, JetBrains Mono for stats/data (reinforces "this is a data-verified system").
- **Signature element:** An interactive **before/after drag slider** in the hero showing a pothole becoming a fixed, lit street — this is the product's core trust mechanic (AI verification), so it's the first thing a visitor touches, not just reads about.
- **Motion:** floating geometric blobs around the hero (parallax float), scroll-reveal fade-ups on every section, an infinite marquee ticker of "just fixed" issues, a testimonial carousel that pauses on hover, animated rings behind the AI-verification icon. All animation respects `prefers-reduced-motion` and is disabled/simplified on mobile where it would hurt performance.

## What's inside each section

1. **Nav bar** — logo, in-page links (How it works / For everyone / AI verification / Stories), Log in + primary "Report an issue" CTA. Sticky with a blur backdrop.
2. **Hero** — headline reframing the core idea ("your street's pothole isn't the government's problem — it's your neighbourhood's project"), subhead explaining the loop in one sentence, two CTAs, and the signature before/after AI-verification slider with live-looking stats (cost estimate, funders, match confidence).
3. **Ticker strip** — infinite horizontal scroll of "just fixed" issues across Indian cities (Mumbai, Bengaluru, Kolkata, Hyderabad, Pune) — makes the platform feel alive and already in use.
4. **Problem section** — 3 stat cards naming the "civic execution gap": average time for municipal fixes, typical repair cost, and the transparency gap in existing apps.
5. **How it works** — the 4-step loop (Report → AI prices it → Neighbours fund it → Worker fixes it, AI checks it) as a horizontal numbered sequence with connecting lines — this is a real process, so numbering is justified here.
6. **Roles grid** — 4 bento cards (Citizen / Organization / Worker / Investor), each with its own accent glow color matching your app's per-role color coding, icon, one-line pitch, and 3 bullet capabilities.
7. **AI verification feature split** — text + animated icon explaining the trust layer (image match, escrow, dispute path) — this is the section that answers "why would a stranger fund a stranger's pothole."
8. **Stories marquee** — auto-scrolling testimonial cards, one voice per role (citizen, org, worker, investor), so visitors see all 4 sides of the loop speaking.
9. **Final CTA band** — glowing gradient panel, restates the pitch, two CTAs (report an issue / I'm a contractor).
10. **Footer** — logo + tagline, link columns (Product / Roles / Company), and an honest note that demo imagery should be swapped for licensed photography before a real launch.

## Notes on images

The shipped file uses **original SVG illustrations** (pothole crack, streetlight, tree icons, avatar illustrations) instead of pulled stock photography, to avoid using photos your team doesn't hold rights to. For your actual submission, swap in your own or properly licensed photos of Indian streets/neighbourhoods in these spots: the hero before/after slider backgrounds, and the testimonial avatars. Unsplash/Pexels have free, usable Indian street and community photography if you want a quick swap.

## File

`civicfix-landing-page.html` — single file, no build step, works in any browser. Open it directly or drop it into your `frontend/public/` folder as a static reference while you build the real React version.
