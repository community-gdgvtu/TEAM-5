# 🚀 TEAM-5 // CivicFix AI — Product Devlog & Feed

Welcome to the official build log for **CivicFix AI** (fka PatchRoots). We’re documenting our journey from "annoyed citizens screaming into the municipal void" to building a decentralized, AI-verified micro-gig marketplace that actually gets street repairs done. [cite: 1]

No endless bureaucratic black holes. No 6-month wait times for a $50 patch. Just snap, pool funds, fix, and verify. [cite: 1]

---

## 📌 UPDATE #001: The "Why Are We Doing This?" Kickoff

**Posted by:** `@team5_devs` | **Date:** August 13, 2026 | **Tags:** `#BuildInPublic` `#CivicTech` `#GenZBuilds` `#Solana` `#ComputerVision`

### 💀 The Vibe Check on Urban Maintenance
Let’s be real for a sec: traditional 311 reporting apps are lowkey ghost towns [cite: 1]. You take a photo of a dangerous pothole or a busted street lamp, submit a ticket, and... crickets [cite: 1]. Six months later, the pothole is now a swimming pool and your ticket is still "Pending Review" [cite: 1]. 

The municipal bottleneck is real, but municipal dependency is optional [cite: 1]. 

We’re flipping the script: **Your street's broken streetlight isn't the government's problem — it's your neighbourhood's project.** [cite: 1]

---

### 💡 What We’re Cooking
Instead of waiting on slow-moving budgets, **CivicFix AI** connects three key dots:
1. **Hyper-Local Crowdfunding:** Micro-donations pooled directly by people who walk that street every single day [cite: 1].
2. **Local Micro-Gig Workforce:** Neighborhood handymen and independent contractors taking on quick, small fixes instead of waiting for enterprise contracts [cite: 1].
3. **AI Proof-of-Work:** Computer vision that acts as an unbiased middleman to verify damage severity *and* confirm the job was done right before releasing payouts [cite: 1].

---

### 💻 Code Snippet: Minimal Vision Verification Pipeline

Here’s a sneak peek at the core verification logic we’re spinning up for the engine. We keep the AI lean, mean, and functional:

```python
import cv2
import numpy as np

def verify_repair_completion(before_img_path: str, after_img_path: str) -> dict:
    """
    Quick-pass vision evaluation comparing initial damage state 
    against post-fix submission before triggering payout approval.
    """
    before = cv2.imread(before_img_path, cv2.IMREAD_GRAYSCALE)
    after = cv2.imread(after_img_path, cv2.IMREAD_GRAYSCALE)
    
    # Calculate visual structural difference score
    diff = cv2.absdiff(before, after)
    non_zero_ratio = np.count_nonzero(diff) / diff.size
    
    # Threshold check for physical state change verification
    is_verified = non_zero_ratio > 0.18  # Substantial surface modification detected
    
    return {
        "verified": is_verified,
        "delta_score": round(non_zero_ratio, 4),
        "status": "APPROVED_FOR_PAYOUT" if is_verified else "FLAGGED_FOR_REVIEW"
    }

# Example runtime execution
result = verify_repair_completion("pothole_before.jpeg", "pothole_after.jpeg")
print(f"[CivicFix Engine] State: {result['status']} (Delta: {result['delta_score']})")
```

---

### 🛠️ What's Next on the Roadmap?
- [ ] **UI/UX Prototype Drop:** Figma wireframes coming to the feed next week.
- [ ] **Smart Contract Escrow:** Locking micro-donations securely until verification passes.
- [ ] **Beta Tester Onboarding:** Looking for our first 50 neighborhood pilot leads.

Drop your thoughts, hot takes, or street issues in the comments below! 👇

---
*Follow `@team5_civicfix` to track every commit, deploy, and neighborhood fix.*
