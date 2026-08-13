export const CIVIC_IMAGE_SEEDS: Record<string, string> = {
  "🕳️": "pothole-india-road",
  "🛣️": "road-construction-india",
  "💡": "streetlight-india-night",
  "💧": "drainage-flooded-mumbai",
  "🚻": "public-toilet-india-sanitation",
  "🌳": "park-india-trees",
  "🌉": "bridge-india-river",
  "♿": "wheelchair-ramp-india-accessibility",
  "🏞️": "riverfront-india-sabarmati",
  "🏦": "bank-building-india",
  "🌱": "sapling-plantation-india",
  "🤖": "ai-robot-technology",
  "⏰": "alarm-clock-early",
  "🏆": "trophy-award-winner",
  "💯": "celebration-confetti-100",
  "⚡": "lightning-storm-energy",
  "🧱": "brick-wall-construction-india",
  "🔨": "construction-workers-india",
  "📣": "megaphone-announcement",
  "🤝": "handshake-agreement",
  "📸": "camera-photo-proof",
  "🏛️": "municipal-corporation-building-india",
  "🇮🇳": "india-flag-tricolor",
};

export const STAGE_IMAGE_SEEDS: Record<string, string> = {
  Open: "megaphone-announcement",
  Claimed: "handshake-agreement",
  InProgress: "construction-workers-india",
  Submitted: "camera-photo-proof",
  Verified: "trophy-award-winner",
};

export function getImageUrl(emojiOrKey: string, width = 600, height = 400): string {
  const seed = CIVIC_IMAGE_SEEDS[emojiOrKey] ?? STAGE_IMAGE_SEEDS[emojiOrKey] ?? emojiOrKey;
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}.jpg`;
}

export function getAvatarUrl(name: string, size = 64): string {
  return `https://picsum.photos/seed/avatar-${encodeURIComponent(name)}/${size}/${size}.jpg`;
}

export function getCitizenAvatarUrl(seed: string, size = 48): string {
  return `https://picsum.photos/seed/citizen-${encodeURIComponent(seed)}/${size}/${size}.jpg`;
}