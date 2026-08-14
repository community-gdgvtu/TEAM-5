/**
 * Local civic images from the verified imagesuiused folder, keyed by emoji.
 * Each emoji maps to a stable local image file. These replace the former
 * Unsplash remote URLs. `getImageUrl` returns `/imagesuiused/<filename>`.
 * Unmapped emojis fall back to the picsum placeholder.
 */

/** Emoji/seed → Unsplash photo id (original data, kept for fallback). */
export const CIVIC_IMAGE_SEEDS: Record<string, string> = {
  "🕳️": "pothole-india-road",
  "🛣️": "road-construction-india",
  "💡": "streetlight-india-night",
  "🌃": "city-lights-night",
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

/** Stage names → emojis used for CivicImg in the kanban header. */
export const STAGE_EMOJI: Record<string, string> = {
  Open: "📣",
  Claimed: "🤝",
  InProgress: "🔨",
  Submitted: "📸",
  Verified: "✅",
};

/** Local civic images from the verified imagesuiused folder, keyed by emoji. */
export const LOCAL_IMAGE_MAP: Record<string, string> = {
  "🕳️": "poatholes.webp",
  "🛣️": "poatholeonroad.jpg",
  "💡": "broken-street-lamp.webp",
  "🌃": "1920_20221003-covestroindia-c4c-image1.jpg",
  "💧": "good water.webp",
  "🚻": "people-dumping-loads-of-trash-in-a-city-street-lot-in-varanasi-india.webp",
  "🌳": "cleaningthegarden.jpg",
  "🌉": "Mithi-River-Community-Cleanup-Model-Sustainability-CSR-ESG-NGO-Earth5R-Mumbai-1024x576.webp",
  "♿": "broken-concrete-road-curb-and-traffic-cones.webp",
  "🏞️": "the-highly-polluted-bishnumati-river-running-through-kathmandu-in-nepal.webp",
  "🏦": "large_KZosruZfdtwHCaYeVNeMOmwWM9e4OoLkDyCFFarh1io.webp",
  "🌱": "water-flowing-from-concrete-pipes-into-forest-stream.webp",
  "🤖": "scientist-examining-toxic-water-samples.webp",
  "⏰": "old-fashioned-street-lights-vintage-lamps-close-up-against-blue-sky-broken-glass-sunny-day-256018872.webp",
  "🏆": "indian-community-in-juba-leads-clean-up-drive-near-hindu-temple-1024x576.webp",
  "💯": "Cleaning-Indias-Rivers-through-Behaviour-Change-Technology-and-Impact-Partnerships-ESG-CSR-EARTH5R-MUMBAI-2.webp",
  "⚡": "scientist-examining-toxic-water-samples.webp",
  "🧱": "f8cafb_d0d28f62d02c424d9f577e84d5314fc0~mv2.webp",
  "🔨": "plasting-clearing-workers.webp",
  "📣": "artist-protesting-better-roads-baadal-nanjundaswamy-india-5d6e17789753f__700.webp",
  "🤝": "indian-community-in-juba-leads-clean-up-drive-near-hindu-temple-1024x576.webp",
  "📸": "5d6e4f8995fdc-png__700.webp",
  "🏛️": "1920_20221003-covestroindia-c4c-image1.jpg",
  "🇮🇳": "indian-community-in-juba-leads-clean-up-drive-near-hindu-temple-1024x576.webp",
  "🚦": "broken-traffic-lights-bunch-wires-around-street-broken-traffic-lights-bunch-wires-around-159353097.webp",
  "🗂️": "people-dumping-loads-of-trash-in-a-city-street-lot-in-varanasi-india.webp",
  "🛠️": "plasting-clearing-workers.webp",
  "🌧️": "dirty-river-flows-residential-area-trash-litters-banks-murky-water-environmental-pollution-affects-natural-habitat-426277161.webp",
  "⚠️": "hathras-india-the-family-members-of-the-people-who-died-in-the-stampede-during-the-satsang-in.webp",
  "🧹": "people-dumping-loads-of-trash-in-a-city-street-lot-in-varanasi-india.webp",
};

export const STAGE_IMAGE_SEEDS: Record<string, string> = {
  Open: "📣",
  Claimed: "🤝",
  InProgress: "🔨",
  Submitted: "📸",
  Verified: "✅",
};

export function getImageUrl(
  emojiOrKey: string,
  width = 600,
  height = 400
): string {
  const local = LOCAL_IMAGE_MAP[emojiOrKey];
  if (local) return `/imagesuiused/${local}`;

  const seed = CIVIC_IMAGE_SEEDS[emojiOrKey] ?? STAGE_IMAGE_SEEDS[emojiOrKey] ?? emojiOrKey;
  const photo = PHOTOS[seed];
  if (photo) return unsplash(photo, width, height);
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}.jpg`;
}

export function getAvatarUrl(name: string, size = 64): string {
  const portrait = PORTRAITS[hashKey(name) % PORTRAITS.length];
  return unsplash(portrait, size, size);
}

export function getCitizenAvatarUrl(seed: string, size = 48): string {
  const portrait = PORTRAITS[hashKey(seed) % PORTRAITS.length];
  return unsplash(portrait, size, size);
}

const PATH_BASE = "/imagesuiused";

/** Verified Unsplash photo ids keyed by the seed strings above. */
const PHOTOS: Record<string, string> = {
  "pothole-india-road": "1480714378408-67cf0d13bc1b",
  "road-construction-india": "1470509037663-253afd7f0f51",
  "streetlight-india-night": "1499002238440-d264edd596ec",
  "city-lights-night": "1519389950473-47ba0277781c",
  "drainage-flooded-mumbai": "1506744038136-46273834b3fb",
  "public-toilet-india-sanitation": "1486406146926-c627a92ad1ab",
  "park-india-trees": "1441974231531-c6227db76b6e",
  "bridge-india-river": "1513635269975-59663e0ac1ad",
  "wheelchair-ramp-india-accessibility": "1523821741446-edb2b68bb7a0",
  "riverfront-india-sabarmati": "1493246507139-91e8fad9978e",
  "bank-building-india": "1554224155-6726b3ff858f",
  "sapling-plantation-india": "1470252649378-9c29740c9fa8",
  "ai-robot-technology": "1518770660439-4636190af475",
  "alarm-clock-early": "1494548162494-384bba4ab999",
  "trophy-award-winner": "1522071820081-009f0129c71c",
  "celebration-confetti-100": "1529156069898-49953e39b3ac",
  "lightning-storm-energy": "1519501025264-65ba15a82390",
  "brick-wall-construction-india": "1504307651254-35680f356dfd",
  "construction-workers-india": "1581091226825-a6a2a5aee158",
  "megaphone-announcement": "1449824913935-59a10b8d2000",
  "handshake-agreement": "1519389950473-47ba0277781c",
  "camera-photo-proof": "1581092160562-40aa08e78837",
  "municipal-corporation-building-india": "1444723121867-7a241cacace9",
  "india-flag-tricolor": "1477959858617-67f85cf4f1df",
};

/** Verified Unsplash portrait pool for avatars (real faces, no emoji). */
const PORTRAITS = [
  "1507003211169-0a1dd7228f2d",
  "1494790108377-be9c29b29330",
  "1500648767791-00dcc994a43e",
  "1544005313-94ddf0286df2",
  "1534528741775-53994a69daeb",
  "1519085360753-af0119f7cbe7",
];

function hashKey(s: string): number {
  let x = 0;
  for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0;
  return x;
}

function unsplash(id: string, width: number, height?: number): string {
  const dims = height ? `w=${width}&h=${height}&fit=crop` : `w=${width}`;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&${dims}&q=60`;
}