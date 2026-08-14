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
  // --- Road / Pothole ---
  "🕳️": "poatholes.webp",
  "🛣️": "poatholeonroad.jpg",
  "🛤️": "artist-protesting-better-roads-baadal-nanjundaswamy-india-5d6e16ac180c0__700.webp",

  // --- Streetlight / Electrical ---
  "💡": "broken-street-lamp.webp",
  "🚦": "broken-traffic-lights-bunch-wires-around-street-broken-traffic-lights-bunch-wires-around-159353097.webp",

  // --- Water / Drainage ---
  "💧": "good water.webp",
  "🌧️": "dirty-river-flows-residential-area-trash-litters-banks-murky-water-environmental-pollution-affects-natural-habitat-426277161.webp",

  // --- Park / Green / Horticulture ---
  "🌳": "cleaningthegarden.jpg",
  "🌱": "uploadnutochis-kopie-medium.webp",

  // --- Sanitation / Cleaning ---
  "🚻": "people-dumping-loads-of-trash-in-a-city-street-lot-in-varanasi-india.webp",
  "🧹": "beawar-rajasthan-india-a-rag-picker-collects-reusable-waste-from-a-heap-of-garbage-at.webp",

  // --- Bridge / River / Waterfront ---
  "🌉": "Mithi-River-Community-Cleanup-Model-Sustainability-CSR-ESG-NGO-Earth5R-Mumbai-1024x576.webp",
  "🏞️": "the-highly-polluted-bishnumati-river-running-through-kathmandu-in-nepal.webp",

  // --- Accessibility ---
  "♿": "broken-concrete-road-curb-and-traffic-cones.webp",

  // --- Construction / Workers ---
  "🧱": "plasting-clearing-workers.webp",
  "🔨": "plasting-clearing-workers.webp",

  // --- Stages / Status ---
  "📣": "artist-protesting-better-roads-baadal-nanjundaswamy-india-5d6e17789753f__700.webp",
  "🤝": "march-haryana-indian-people-helping-needy-ones-feeding-them-food-lockdown-india-due-to-corona-virus-179697094.webp",
  "📸": "5d6e4f8995fdc-png__700.webp",
  "✅": "a1-road-fixed-after.webp",

  // --- Organization / Government ---
  "🏛️": "1920_20221003-covestroindia-c4c-image1.jpg",
  "🏢": "Earth5R-CSR-ESG-Awareness-Program-Earth5R-Mumbai-1024x576.webp",

  // --- Badge / Award ---
  "🏆": "indian-community-in-juba-leads-clean-up-drive-near-hindu-temple-1024x576.webp",
  "💯": "Cleaning-Indias-Rivers-through-Behaviour-Change-Technology-and-Impact-Partnerships-ESG-CSR-EARTH5R-MUMBAI-2.webp",
  "🤖": "scientist-examining-toxic-water-samples.webp",
  "⏰": "old-fashioned-street-lights-vintage-lamps-close-up-against-blue-sky-broken-glass-sunny-day-256018872.webp",
  "⚡": "indian-community-in-juba-leads-clean-up-drive-near-hindu-temple-1024x576.webp",

  // --- Wallet / Finance ---
  "🏦": "large_KZosruZfdtwHCaYeVNeMOmwWM9e4OoLkDyCFFarh1io.webp",

  // --- National ---
  "🇮🇳": "indian-community-in-juba-leads-clean-up-drive-near-hindu-temple-1024x576.webp",

  // --- Misc / Filters ---
  "🗂️": "people-dumping-loads-of-trash-in-a-city-street-lot-in-varanasi-india.webp",
  "🛠️": "plasting-clearing-workers.webp",
  "⚠️": "hathras-india-the-family-members-of-the-people-who-died-in-the-stampede-during-the-satsang-in.webp",
  "📢": "Copy-of-220322-AS-WorldWaterDay-RiverCleanup-79-1600.webp",

  // --- Rescue / Disaster ---
  "🚨": "in-this-photograph-taken-on-august-8-indian-army-personnel-rescue-people-stranded-in-flood.webp",

  // --- Animal ---
  "🐾": "animal-rescue-and-care-kolkata.webp",

  // --- Environment ---
  "🌊": "ocean-polluted-by-garbage.webp",
  "🌍": "IMG_2030-responsive.webp",

  // --- Before/After (completed work) ---
  "before_road": "sortedimages/a1-roadfixed-before.webp",
  "after_road": "sortedimages/a1-road-fix-after.webp",
  "before_river": "sortedimages/a5-river-before.webp",
  "after_river": "sortedimages/a5-river-after.webp",
};

/** Avatars — real people photos for user profile images. */
export const AVATAR_IMAGE_POOL: string[] = [
  "1507003211169-0a1dd7228f2d",
  "1494790108377-be9c29b29330",
  "1500648767791-00dcc994a43e",
  "1544005313-94ddf0286df2",
  "1534528741775-53994a69daeb",
  "1519085360753-af0119f7cbe7",
  "1506794778202-cad84cf45f1d",
  "1438761681033-6461ffad8d80",
  "1472099645785-5658abf4ff4e",
  "1517841905240-472988babdf9",
  "1527980965255-d3b416303d12",
  "1560250097-0b93528c311a",
  "1573496359142-b8d87734a5a2",
  "1580489944761-15a19d654956",
  "1599566150163-29194dcabd9c",
  "1607746882042-944635dfe10e",
  "1633332755192-727a05c4013d",
  "1583195764036-6dc248ac07d9",
];

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
  const portrait = AVATAR_IMAGE_POOL[hashKey(name) % AVATAR_IMAGE_POOL.length];
  return unsplash(portrait, size, size);
}

export function getCitizenAvatarUrl(seed: string, size = 48): string {
  const portrait = AVATAR_IMAGE_POOL[hashKey(seed) % AVATAR_IMAGE_POOL.length];
  return unsplash(portrait, size, size);
}

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

function hashKey(s: string): number {
  let x = 0;
  for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0;
  return x;
}

function unsplash(id: string, width: number, height?: number): string {
  const dims = height ? `w=${width}&h=${height}&fit=crop` : `w=${width}`;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&${dims}&q=60`;
}
