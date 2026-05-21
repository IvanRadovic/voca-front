// Curated, deterministic imagery for the landing page.
//
// NOTE: every image is a hand-picked Unsplash photo (free to use, no attribution
// required) referenced by a fixed URL — NOT a random source — so the same photo
// always shows. To swap any image, just replace its URL below.
// <ImageWithFallback> degrades to a colored gradient if a photo fails to load.

const u = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;

// Hero — young people collaborating. Swap this URL to change the main image.
export const HERO_IMAGE = u('1523240795612-9a054b0db644', 1600, 1000);

// "How it works" steps.
export const FEATURE_IMAGES = {
  discover: u('1517048676732-d65bc937f952'), // students with laptops
  apply: u('1543269865-cbf427effbad'), // group around a table
  grow: u('1523580494863-6f3031224c94'), // students on campus steps
};

// Category tiles — topic/scene photos (kept object-focused on purpose).
const CATEGORY_IMAGES: Record<string, string> = {
  it: u('1518770660439-4636190af475', 600, 400), // circuit board
  programming: u('1461749280684-dccba630e2f6', 600, 400), // code on screen
  design: u('1561070791-2526d30994b5', 600, 400), // design desk
  marketing: u('1460925895917-afdab827c52f', 600, 400), // analytics
  entrepreneurship: u('1664575602554-2087b04935a5', 600, 400), // startup
  business: u('1497032205916-ac775f0649ae', 600, 400), // office desk
  sport: u('1461896836934-ffe607ba8211', 600, 400), // stadium
  music: u('1511671782779-c97d3d27a1d4', 600, 400), // concert
  film: u('1485846234645-a62644f84728', 600, 400), // cinema
  photography: u('1452587925148-ce544e77e70d', 600, 400), // camera
  writing: u('1455390582262-044cdead277a', 600, 400), // notebook
  volunteering: u('1593113598332-cd288d649433', 600, 400), // volunteers
  travel: u('1488646953014-85cb44e25828', 600, 400), // travel
  languages: u('1481627834876-b7833e8f5570', 600, 400), // books
  psychology: u('1559757148-5c350d0d3c56', 600, 400), // mind
  ecology: u('1441974231531-c6227db76b6e', 600, 400), // forest
  fitness: u('1534438327276-14e5300c3a48', 600, 400), // gym
  art: u('1513364776144-60967b0f800f', 600, 400), // gallery
  'personal-development': u('1507537297725-24a1c029d3ca', 600, 400), // path/growth
  health: u('1505751172876-fa1923c5c528', 600, 400), // health
};

export function categoryImage(slug: string): string {
  return CATEGORY_IMAGES[slug] ?? u('1523240795612-9a054b0db644', 600, 400);
}

// Gradient fallbacks (varied, no purple).
export const FALLBACK_GRADIENTS = [
  'from-sky-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-orange-500 to-amber-400',
  'from-rose-500 to-pink-400',
  'from-blue-600 to-sky-400',
  'from-teal-500 to-emerald-400',
];
